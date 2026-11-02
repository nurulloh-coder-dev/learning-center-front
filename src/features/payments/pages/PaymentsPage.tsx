import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { downloadCsv, generateCsv, formatAmount, formatDate, type CsvColumn } from '@/shared/lib'
import { INVOICE_STATUSES } from '@/shared/types'
import { AppShell, BackIcon, Button, ErrorBox, Eyebrow, IconButton, Pagination, Panel } from '@/shared/ui'
import { GroupInvoicePanel } from '../components/GroupInvoicePanel'
import { InvoiceFilters } from '../components/InvoiceFilters'
import { InvoiceTable } from '../components/InvoiceTable'
import { PaymentFormModal } from '../components/PaymentFormModal'
import { PaymentReceiptModal } from '../components/PaymentReceiptModal'
import { TransactionTable } from '../components/TransactionTable'
import { useInvoiceMutations } from '../hooks/useInvoiceMutations'
import { useGroupOptions } from '../hooks/useGroupOptions'
import { useInvoices } from '../hooks/useInvoices'
import { useTransactionMutations, useTransactions } from '../hooks/useTransactions'
import type { InvoiceDto, InvoiceStatus, TransactionDto, TransactionType } from '@/shared/types'

/**
 * To'lovlar bo'limi.
 *
 * Model ikki qavatli: HISOB (`invoice`) 12-darsdan keyin avtomatik
 * yaratiladi va summasi qotib turadi; unga esa bir nechta TO'LOV
 * (`transaction`) bog'lanadi — o'quvchi bo'lib-bo'lib to'lashi mumkin.
 * Shuning uchun ekranda ikkita ro'yxat bor.
 *
 * Hisob qo'lda yaratilmaydi: `POST /invoice` hozir `Enrollment` obyektini
 * kutadi, ya'ni mijoz tomondan yuborib bo'lmaydi. Administratorga kerak
 * bo'ladigan kundalik amal — to'lovni yozib qo'yish, u shu yerda.
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
    const [txPage, setTxPage] = useState(0)
    const [formType, setFormType] = useState<TransactionType | null>(null)
    const [receiptTransaction, setReceiptTransaction] = useState<TransactionDto | null>(null)
    const [receiptInvoice, setReceiptInvoice] = useState<InvoiceDto | null>(null)

    const list = useInvoices(session.token, { page, search, status, from, to })
    const transactions = useTransactions(session.token, txPage, search)
    const groupOptions = useGroupOptions(session.token)
    const invoices = useInvoiceMutations(session.token)
    const payments = useTransactionMutations(session.token)

    /** Har qanday filtr o'zgarsa ikkala ro'yxat ham birinchi sahifaga qaytadi. */
    function applyFilter(apply: () => void) {
        apply()
        setPage(0)
        setTxPage(0)
    }

    function handleDeleteInvoice(invoice: InvoiceDto) {
        if (!confirm(t('invoice.deleteConfirm', { number: invoice.invoiceNumber ?? '' }))) return
        invoices.remove.mutate(invoice.id)
    }

    function handleDeleteTransaction(transaction: TransactionDto) {
        if (!confirm(t('transaction.deleteConfirm', { amount: formatAmount(transaction.amount) }))) return
        payments.remove.mutate(transaction.id)
    }

    function handleExportCsv() {
        if (list.invoices.length === 0) return

        const exportColumns: CsvColumn<InvoiceDto>[] = [
            { header: t('invoice.number'), accessor: (inv) => inv.invoiceNumber ?? '' },
            { header: t('invoice.student'), accessor: (inv) => inv.enrollmentDto?.fullName ?? '' },
            { header: t('invoice.amount'), accessor: (inv) => (inv.amount != null ? formatAmount(inv.amount) : '') },
            {
                header: t('field.status'),
                accessor: (inv) => (inv.paymentStatus ? t(`invoice.status.${inv.paymentStatus}`) : ''),
            },
            { header: t('invoice.issuedAt'), accessor: (inv) => formatDate(inv.issuedAt) },
        ]

        const filename = `payments-${formatDate(new Date().toISOString())}.csv`
        downloadCsv(generateCsv(list.invoices, exportColumns), filename)
    }

    const mutationError = invoices.remove.error ?? payments.remove.error

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
                    {/* Telefonda tugmalar qatori sig'maydi va o'ngga suriladi: kam
                        ishlatiladigan CSV oxirga o'tadi, "+ To'lov qo'shish" esa
                        ekranda qoladi (ilgari aynan u qirqilib ko'rinardi). */}
                    <Button
                        size="sm"
                        className="order-last lg:order-none"
                        onClick={handleExportCsv}
                        disabled={list.isLoading || list.invoices.length === 0}
                    >
                        {t('common.exportCsv')}
                    </Button>
                    <Button size="sm" onClick={() => setFormType('REFUND')}>
                        {t('transaction.refund')}
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setFormType('PAID')}>
                        {t('transaction.new')}
                    </Button>
                </>
            }
        >
            <Panel className="mb-5">
                <header className="mb-5 min-w-0">
                    <Eyebrow>{t('invoice.eyebrow')}</Eyebrow>
                    <h1 className="mt-1 font-display text-2xl font-semibold text-fg">{t('invoice.title')}</h1>
                </header>

                <InvoiceFilters
                    search={search}
                    status={status}
                    from={from}
                    to={to}
                    statuses={INVOICE_STATUSES}
                    onSearchChange={(value) => applyFilter(() => setSearch(value))}
                    onStatusChange={(value) => applyFilter(() => setStatus(value))}
                    onFromChange={(value) => applyFilter(() => setFrom(value))}
                    onToChange={(value) => applyFilter(() => setTo(value))}
                    onClearDates={() =>
                        applyFilter(() => {
                            setFrom('')
                            setTo('')
                        })
                    }
                />

                {list.error && (
                    <div className="mb-4">
                        <ErrorBox>{t('invoice.loadFailed', { message: errorMessage(list.error) })}</ErrorBox>
                    </div>
                )}

                {mutationError != null && (
                    <div className="mb-4">
                        <ErrorBox>{errorMessage(mutationError)}</ErrorBox>
                    </div>
                )}

                {!list.error && (
                    <InvoiceTable
                        invoices={list.invoices}
                        isLoading={list.isLoading}
                        onDelete={handleDeleteInvoice}
                        onPrint={(invoice) => setReceiptInvoice(invoice)}
                    />
                )}

                <Pagination
                    page={page}
                    totalPages={list.totalPages}
                    totalElements={list.totalElements}
                    onPageChange={setPage}
                />

                <GroupInvoicePanel
                    groupOptions={groupOptions}
                    isPending={invoices.createForGroup.isPending}
                    isSuccess={invoices.createForGroup.isSuccess}
                    error={invoices.createForGroup.error}
                    onCreate={(groupId) => invoices.createForGroup.mutate(groupId)}
                />
            </Panel>

            <Panel>
                <header className="mb-5 min-w-0">
                    <Eyebrow>{t('transaction.eyebrow')}</Eyebrow>
                    <h2 className="mt-1 font-display text-xl font-semibold text-fg">{t('transaction.title')}</h2>
                </header>

                {transactions.error && (
                    <div className="mb-4">
                        <ErrorBox>{errorMessage(transactions.error)}</ErrorBox>
                    </div>
                )}

                {!transactions.error && (
                    <TransactionTable
                        transactions={transactions.transactions}
                        isLoading={transactions.isLoading}
                        onDelete={handleDeleteTransaction}
                        onPrint={(transaction) => setReceiptTransaction(transaction)}
                    />
                )}

                <Pagination
                    page={txPage}
                    totalPages={transactions.totalPages}
                    totalElements={transactions.totalElements}
                    onPageChange={setTxPage}
                />
            </Panel>

            {formType != null && (
                <PaymentFormModal
                    key={formType}
                    token={session.token}
                    type={formType}
                    isSaving={payments.create.isPending}
                    onSubmit={(payload) => payments.create.mutate(payload, { onSuccess: () => setFormType(null) })}
                    onClose={() => setFormType(null)}
                />
            )}

            {(receiptTransaction != null || receiptInvoice != null) && (
                <PaymentReceiptModal
                    transaction={receiptTransaction}
                    invoice={receiptInvoice}
                    groupOptions={groupOptions}
                    onClose={() => {
                        setReceiptTransaction(null)
                        setReceiptInvoice(null)
                    }}
                />
            )}
        </AppShell>
    )
}
