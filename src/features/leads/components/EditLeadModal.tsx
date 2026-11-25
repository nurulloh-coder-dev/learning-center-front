import type { LeadDto, LeadUpdateDto } from '@/shared/types'
import { LeadFormModal } from './LeadFormModal'

export interface EditLeadModalProps {
    token: string
    lead: LeadDto
    isPending?: boolean
    onClose: () => void
    onSubmit: (body: LeadUpdateDto) => void
}

export function EditLeadModal({ token, lead, isPending, onClose, onSubmit }: EditLeadModalProps) {
    return (
        <LeadFormModal
            token={token}
            lead={lead}
            isPending={isPending}
            onClose={onClose}
            onSubmit={(data) => onSubmit({ ...(data as Omit<LeadUpdateDto, 'version'>), version: lead.version })}
        />
    )
}
