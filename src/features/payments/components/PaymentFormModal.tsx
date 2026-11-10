import type { FormEvent } from 'react'
import { useDraft } from '@/shared/hooks'
import { useT } from '@/shared/i18n'
import { Button, Field, Input, Modal } from '@/shared/ui'
import type { StudentDto, TransactionType } from '@/shared/types'
import type { CreateTransactionPayload } from '../api/transactionApi'
import { useStudentInvoices } from '../hooks/usePaymentLookup'
import { parseAmountInput } from '../lib/amountInput'
import { defaultInvoiceId } from '../lib/pickInvoice'
import { AmountInput } from './AmountInput'
import { InvoiceChoice } from './InvoiceChoice'
import { StudentPicker } from './StudentPicker'

/** `Field` sarlavhasi bilan bir xil ko'rinish — label bo'lolmaydigan bo'limlar uchun. */
const SECTION_LABEL = 'text-xs font-semibold text-fg-muted'

interface PaymentFormModalProps {
    token: string
    /** `PAID` — kundalik to'lov qabul qilish; `REFUND` — kamdan-kam pul qaytarish. */
    type: TransactionType
    isSaving: boolean
    onSubmit: (payload: CreateTransactionPayload) => void
    onClose: () => void
}

/**
 * To'lov qabul qilish / pul qaytarish oynasi.
 *
 * Tartib: o'quvchini qidirib topish → uning hisoblari chiqadi va eng
 * so'nggi mosi o'zi tanlanadi → summa. Tur tanlanmaydi: to'lov va qaytarish
 * alohida tugmalardan ochiladi — to'lov har kuni, qaytarish oyda bir-ikki
 * marta, ularni bitta ro'yxatda aralashtirish xatoga olib kelardi.
 *
 * Saqlash xatosi formada emas, umumiy qizil xabarda chiqadi
 * (`queryClient.ts`) — oyna ochiq turganda ham ko'rinadi.
 */
export function PaymentFormModal({ token, type, isSaving, onSubmit, onClose }: PaymentFormModalProps) {
    const { t } = useT()
    // Qoralama to'lov turi bo'yicha alohida: to'lov va qaytarish aralashmasin.
    const draft = useDraft(`payment:${type}`, {
        student: null as StudentDto | null,
        pickedInvoiceId: '',
        amount: '',
        note: '',
    })
    const { student, pickedInvoiceId, amount, note } = draft.value
    const update = (patch: Partial<typeof draft.value>) => draft.setValue((current) => ({ ...current, ...patch }))
    const { invoices, isLoading } = useStudentInvoices(token, student, type)

    // Foydalanuvchi o'zi tanlamaguncha — avtomatik tanlov. Holatga yozib
    // qo'yilmaydi: hisoblar kelgach effekt bilan sinxronlash shart bo'lmasin.
    const invoiceId = invoices.some((invoice) => invoice.id === pickedInvoiceId)
        ? pickedInvoiceId
        : defaultInvoiceId(invoices, type)

    const parsedAmount = parseAmountInput(amount)
    const isRefund = type === 'REFUND'
    const isValid =
        student != null &&
        invoiceId !== '' &&
        parsedAmount > 0 &&
        (!isRefund || note.trim() !== '')

    function selectStudent(next: StudentDto | null) {
        update({ student: next, pickedInvoiceId: '' })
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isValid || student == null) return
        draft.discard()
        onSubmit({ type, amount: parsedAmount, studentId: student.id, invoiceId, note })
    }

    return (
        <Modal
            eyebrow={t('transaction.eyebrow')}
            title={isRefund ? t('transaction.refundTitle') : t('transaction.newTitle')}
            onClose={onClose}
            maxWidth="max-w-2xl"
            draft={draft}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* `Field` (ya'ni `<label>`) EMAS: label ichidagi tugma bosilib, o'rniga
                    yangi tugma chizilsa, brauzer bosishni o'sha yangi tugmaga uzatadi —
                    tanlangan o'quvchi darhol "Boshqa o'quvchi" bilan bekor bo'lib qolardi. */}
                <div className="flex flex-col gap-2">
                    <span className={SECTION_LABEL}>{t('invoice.student')}</span>
                    <StudentPicker token={token} selected={student} onSelect={selectStudent} />
                </div>

                {student == null ? (
                    <p className="text-[0.72rem] leading-snug text-fg-faint">{t('transaction.hint')}</p>
                ) : (
                    <>
                        <div className="flex flex-col gap-2">
                            <span className={SECTION_LABEL}>{t('transaction.invoice')}</span>
                            <InvoiceChoice
                                invoices={invoices}
                                isLoading={isLoading}
                                emptyText={isRefund ? t('transaction.noInvoices') : t('transaction.allPaid')}
                                value={invoiceId}
                                onChange={(id) => update({ pickedInvoiceId: id })}
                            />
                        </div>

                        <Field label={t('invoice.amount')}>
                            <AmountInput value={amount} suffix={t('transaction.currency')} onChange={(next) => update({ amount: next })} />
                        </Field>

                        <Field label={isRefund ? t('transaction.reason') : t('transaction.note')}>
                            <Input
                                value={note}
                                placeholder={isRefund ? t('transaction.reasonPlaceholder') : undefined}
                                onChange={(event) => update({ note: event.target.value })}
                            />
                        </Field>
                    </>
                )}

                <div className="flex justify-end gap-2.5">
                    <Button
                        onClick={() => {
                            draft.discard()
                            onClose()
                        }}
                    >{t('common.cancel')}</Button>
                    <Button
                        type="submit"
                        variant={isRefund ? 'danger' : 'primary'}
                        disabled={!isValid || isSaving}
                    >
                        {isSaving ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
