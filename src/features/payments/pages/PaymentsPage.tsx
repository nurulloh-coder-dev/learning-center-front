import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { downloadCsv, formatAmount, formatDate, generateCsvContent, sanitizeFilename } from '@/shared/lib'
import { INVOICE_STATUSES } from '@/shared/types'
import {
    AppShell,
    BackIcon,
    Button,
    ErrorBox,
    Eyebrow,
    Field,
    IconButton,
    Input,
    Pagination,
    Panel,
    Select,
} from '@/shared/ui'
import { InvoiceTable } from '../components/InvoiceTable'
import { NewInvoiceModal } from '../components/NewInvoiceModal'
import { useInvoiceMutations } from '../hooks/useInvoiceMutations'
import { useInvoices } from '../hooks/useInvoices'
import { useStudentOptions } from '../hooks/useStudentOptions'
import type { InvoiceDto, InvoiceStatus } from '@/shared/types'

/**
 * To'lovlar bo'limi.
 *
 * To'lov onlayn qabul qilinmaydi: o'quvchi kartaga o'tkazadi, pulni ko'rgan
 * administrator hisobni shu yerda "to'landi" qilib belgilaydi. Shuning uchun
 * ekranning markazida — status va uni o'zgartirish tugmasi.
 */
export function PaymentsPage() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<InvoiceStatus | ''>('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [refundStudentId, setRefundStudentId] = useState('')

    const list = useInvoices(session.token, { page, search, status, from, to })

    /** Har qanday filtr o'zgarsa birinchi sahifaga qaytamiz. */
    function applyFilter(apply: () => void) {
        apply()
        setPage(0)
    }
    const studentOptions = useStudentOptions(session.token)
    const { create, changeStatus, remove, refund } = useInvoiceMutations(session.token)

    function handleMarkPaid(invoice: InvoiceDto) {
        changeStatus.mutate({ id: invoice.id, status: 'PAID' })
    }

    function handleDelete(invoice: InvoiceDto) {
        if (!confirm(t('invoice.deleteConfirm', { number: invoice.invoiceNumber ?? '' }))) return
        remove.mutate(invoice.id)
    }

    /**
     * Pul qaytarish.
     *
     * Jadval qatorida EMAS, alohida blokda: `POST /invoice/return` o'quvchi
     * bo'yicha ishlaydi, hisob bo'yicha emas. Qatorga qo'ysak, bitta
     * o'quvchining har hisobida bir xil tugma takrorlanardi va qaytarim
     * yozuvining o'zida ham chiqib qolardi.
     *
     * Summani backend hisoblagani uchun oldindan ko'rsata olmaymiz —
     * tasdiqlash matni shuni ochiq aytadi, natija esa javobdan olinadi.
     */
    function handleRefund() {
        if (refundStudentId === '') return
        const name = studentOptions.find((option) => option.value === refundStudentId)?.label ?? ''
        if (!confirm(t('invoice.refundConfirm', { name }))) return
        refund.mutate(refundStudentId, { onSuccess: () => setRefundStudentId('') })
    }

    function handleDownloadCsv() {
        if (list.invoices.length === 0) return

        const headers = [
            t('invoice.number'),
            t('invoice.student'),
            t('invoice.amount'),
            t('invoice.issuedAt'),
            t('invoice.type'),
            t('field.status'),
        ]

        const rows = list.invoices.map((invoice) => [
            invoice.invoiceNumber ?? '—',
            invoice.student?.userDto?.fullName ?? '—',
            formatAmount(invoice.amount),
            formatDate(invoice.issuedAt) || '—',
            invoice.type || '—',
            invoice.status ? t(`invoice.status.${invoice.status}`) : '—',
        ])

        const csvString = generateCsvContent([headers, ...rows])
        const today = new Date().toISOString().slice(0, 10)
        const filename = sanitizeFilename(`payments_${today}.csv`)
        downloadCsv(filename, csvString)
    }

    const mutationError = changeStatus.error ?? remove.error ?? refund.error

    return (
        <AppShell
            subtitle={t('invoice.title')}
            onSignOut={signOut}
            token={session.token}
            theme={theme}
            toggleTheme={toggleTheme}
            actions={
                <>
                    <IconButton label={t('common.back')} onClick={() => navigate('/')}>
                        <BackIcon />
                    </IconButton>
                    <Button
                        size="sm"
                        onClick={handleDownloadCsv}
                        disabled={list.isLoading || list.invoices.length === 0}
                    >
                        {t('common.downloadCsv')}
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                        {t('invoice.new')}
                    </Button>
                </>
            }
        >
            <Panel>
                <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div className="min-w-0">
                        <Eyebrow>{t('invoice.eyebrow')}</Eyebrow>
                        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
                            {t('invoice.title')}
                        </h1>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                        <Select
                            aria-label={t('admin.filterStatus')}
                            // `w-auto` EMAS: `inputClasses` ichida `w-full` bor va
                            // ikkalasi bir xil breakpoint'da bo'lgani uchun qaysi
                            // biri yutishi CSS tartibiga qolib ketadi. `sm:` esa
                            // aniq keyin keladi.
                            className="sm:w-44"
                            options={[
                                { value: '', label: t('invoice.allStatuses') },
                                ...INVOICE_STATUSES.map((value) => ({
                                    value,
                                    label: t(`invoice.status.${value}`),
                                })),
                            ]}
                            value={status}
                            onChange={(event) =>
                                applyFilter(() => setStatus(event.target.value as InvoiceStatus | ''))
                            }
                        />
                        <Input
                            className="min-w-40 flex-1 sm:w-56 sm:flex-none"
                            placeholder={t('invoice.search')}
                            value={search}
                            onChange={(event) => applyFilter(() => setSearch(event.target.value))}
                        />
                    </div>
                </header>

                <div className="mb-4 flex flex-wrap items-end gap-2">
                    <Field label={t('invoice.from')}>
                        <Input
                            type="date"
                            className="sm:w-44"
                            value={from}
                            onChange={(event) => applyFilter(() => setFrom(event.target.value))}
                        />
                    </Field>
                    <Field label={t('invoice.to')}>
                        <Input
                            type="date"
                            className="sm:w-44"
                            value={to}
                            onChange={(event) => applyFilter(() => setTo(event.target.value))}
                        />
                    </Field>
                    {(from || to) && (
                        <Button
                            size="sm"
                            onClick={() =>
                                applyFilter(() => {
                                    setFrom('')
                                    setTo('')
                                })
                            }
                        >
                            {t('invoice.clearDates')}
                        </Button>
                    )}
                </div>

                <div className="mb-4 flex flex-wrap items-end gap-2 rounded-lg border border-border-base p-3">
                    <Field label={t('invoice.refundFor')}>
                        <Select
                            className="sm:w-56"
                            placeholder={t('field.select')}
                            options={studentOptions}
                            value={refundStudentId}
                            onChange={(event) => setRefundStudentId(event.target.value)}
                        />
                    </Field>
                    <Button
                        size="sm"
                        disabled={refundStudentId === '' || refund.isPending}
                        onClick={handleRefund}
                    >
                        {refund.isPending ? t('common.saving') : t('invoice.refund')}
                    </Button>
                    <p className="w-full text-[0.72rem] leading-snug text-fg-faint">
                        {t('invoice.refundHint')}
                    </p>
                </div>

                {list.error && (
                    <div className="mb-4">
                        <ErrorBox>
                            {t('invoice.loadFailed', { message: errorMessage(list.error) })}
                        </ErrorBox>
                    </div>
                )}

                {mutationError != null && (
                    <div className="mb-4">
                        <ErrorBox>{errorMessage(mutationError)}</ErrorBox>
                    </div>
                )}

                {refund.isSuccess && refund.data && (
                    <p className="mb-4 text-sm text-success-fg">
                        {t('invoice.refundDone', {
                            amount: formatAmount(refund.data.amount),
                            number: refund.data.invoiceNumber ?? '',
                        })}
                    </p>
                )}

                {!list.error && (
                    <InvoiceTable
                        invoices={list.invoices}
                        isLoading={list.isLoading}
                        pendingId={changeStatus.isPending ? changeStatus.variables?.id : undefined}
                        onMarkPaid={handleMarkPaid}
                        onDelete={handleDelete}
                    />
                )}

                <Pagination
                    page={page}
                    totalPages={list.totalPages}
                    totalElements={list.totalElements}
                    onPageChange={setPage}
                />
            </Panel>

            {isModalOpen && (
                <NewInvoiceModal
                    studentOptions={studentOptions}
                    isSaving={create.isPending}
                    error={create.error}
                    onSubmit={(payload) =>
                        create.mutate(payload, { onSuccess: () => setIsModalOpen(false) })
                    }
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </AppShell>
    )
}
