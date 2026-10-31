// Lid kartochkasi komponenti — har bir lid ma'lumotlarini va u bilan bog'liq harakatlarni aks ettiradi
import type { LeadDto, LeadStatus } from '@/shared/types'
import { LEAD_STATUSES } from '@/shared/types'
import { useT } from '@/shared/i18n'
import { formatCallAt } from '../lib/schedule'
import { Badge, EditIcon, IconButton, Select, TrashIcon } from '@/shared/ui'

export interface LeadCardProps {
    lead: LeadDto
    status: LeadStatus
    onEdit: (lead: LeadDto) => void
    onStatusChange: (lead: LeadDto, status: LeadStatus) => void
    onDelete: (lead: LeadDto) => void
    onDragStart: (id: string) => void
    onDragEnd: () => void
}

// Lid kartochkasining alohida komponent shaklida chiqarilishi — kodni o'qilishi va qo'llab-quvvatlanishini osonlashtiradi
export function LeadCard({
    lead,
    status,
    onEdit,
    onStatusChange,
    onDelete,
    onDragStart,
    onDragEnd,
}: LeadCardProps) {
    const { t, locale } = useT()

    return (
        <article
            draggable
            onDragStart={() => onDragStart(lead.id)}
            onDragEnd={onDragEnd}
            className="cursor-grab rounded-xl border border-border-base bg-surface-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="min-w-0 font-semibold break-words text-fg">
                    {lead.fullName || t('lead.unnamed')}
                </h3>
                <div className="flex shrink-0 items-center gap-1">
                    <IconButton label={t('common.edit')} onClick={() => onEdit(lead)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton label={t('common.delete')} tone="danger" onClick={() => onDelete(lead)}>
                        <TrashIcon />
                    </IconButton>
                </div>
            </div>
            {/* Telefon tugmalar ostida emas, to'liq enida: tor ustunda raqam
                ikki qatorga bo'linib qolardi. */}
            <a
                className="mt-1 block text-sm whitespace-nowrap text-accent-fg hover:underline"
                href={`tel:${lead.phone ?? ''}`}
            >
                {lead.phone || t('lead.noPhone')}
            </a>
            {(lead.source || lead.preferredCourse?.name) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {lead.source && <Badge tone="slate">{t(`lead.source.${lead.source}`)}</Badge>}
                    {lead.preferredCourse?.name && <Badge tone="purple">{lead.preferredCourse.name}</Badge>}
                </div>
            )}
            {/* Holat alohida qatorda, to'liq enida: tor ustunda (telefon, 4 ustunli
                kanban) yonma-yon qo'yilganda "Keyinroq qo'ng…" kesilib, ism ham
                qisqarib qolardi. */}
            <Select
                aria-label={t('lead.changeStatus')}
                className="mt-3 text-xs"
                value={status}
                options={LEAD_STATUSES.map((value) => ({
                    value,
                    label: t(`lead.status.${value}`),
                }))}
                onChange={(event) => onStatusChange(lead, event.target.value as LeadStatus)}
            />
            {lead.callAt && (
                <p className="mt-3 rounded-lg bg-warning-soft px-2.5 py-2 text-xs font-medium text-warning-fg">
                    {t('lead.callAt')}: {formatCallAt(lead.callAt, new Date(), locale, { today: t('lead.today'), tomorrow: t('lead.tomorrow') })}
                </p>
            )}
        </article>
    )
}
