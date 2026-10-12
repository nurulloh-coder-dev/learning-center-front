import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { errorMessage } from '@/shared/api'
import type { LeadCreateDto, LeadDto, LeadStatus, LeadUpdateDto } from '@/shared/types'
import { LEAD_STATUSES } from '@/shared/types'
import { useT } from '@/shared/i18n'
import { AppShell, Button, EmptyState, ErrorBox } from '@/shared/ui'
import { EditLeadModal } from '../components/EditLeadModal'
import { LeadActionModal } from '../components/LeadActionModal'
import { LeadColumn } from '../components/LeadColumn'
import { LeadFormSettingsModal } from '../components/LeadFormSettingsModal'
import { LeadsHeader } from '../components/LeadsHeader'
import { NewLeadModal } from '../components/NewLeadModal'
import { useLeadGroupOptions, useLeadMutations, useLeads } from '../hooks/useLeads'

const PAGE_SIZE = 50
const EMPTY_LEADS: LeadDto[] = []

function asStatus(value?: LeadStatus): LeadStatus {
    return LEAD_STATUSES.includes(value as LeadStatus) ? (value as LeadStatus) : 'NEW'
}

export function LeadsPage() {
    const { token } = useSession()
    const { signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const { t } = useT()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<LeadStatus | ''>('')
    const [editing, setEditing] = useState<LeadDto | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isFormLinkOpen, setIsFormLinkOpen] = useState(false)
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [action, setAction] = useState<{ lead: LeadDto; status: LeadStatus } | null>(null)

    const newLeads = useLeads(token, { size: PAGE_SIZE, search: search || undefined, status: 'NEW' })
    const enrolledLeads = useLeads(token, { size: PAGE_SIZE, search: search || undefined, status: 'ENROLLED' })
    const callLaterLeads = useLeads(token, { size: PAGE_SIZE, search: search || undefined, status: 'CALL_LATER' })
    const rejectedLeads = useLeads(token, { size: PAGE_SIZE, search: search || undefined, status: 'REJECTED' })

    const lists = useMemo(
        () => ({ NEW: newLeads, ENROLLED: enrolledLeads, CALL_LATER: callLaterLeads, REJECTED: rejectedLeads }),
        [newLeads, enrolledLeads, callLaterLeads, rejectedLeads]
    )

    const loadMoreRefs = useRef<Partial<Record<LeadStatus, HTMLDivElement>>>({})
    const listsRef = useRef(lists)

    useEffect(() => {
        listsRef.current = lists
    }, [lists])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const status = entry.target.getAttribute('data-status') as LeadStatus
                    const list = listsRef.current[status]
                    if (entry.isIntersecting && list.hasNextPage && !list.isFetchingNextPage) {
                        void list.fetchNextPage()
                    }
                })
            },
            { rootMargin: '160px' }
        )

        Object.values(loadMoreRefs.current).forEach((element) => observer.observe(element))
        return () => observer.disconnect()
    }, [lists.CALL_LATER.hasNextPage, lists.ENROLLED.hasNextPage, lists.NEW.hasNextPage, lists.REJECTED.hasNextPage])

    const leadsByStatus = Object.fromEntries(
        LEAD_STATUSES.map((status) => [
            status,
            lists[status].data?.pages.flatMap((page) => page?.content ?? []) ?? EMPTY_LEADS,
        ])
    ) as Record<LeadStatus, LeadDto[]>

    const visibleStatuses: LeadStatus[] = filter ? [filter] : [...LEAD_STATUSES]
    const leads = visibleStatuses.flatMap((status) => leadsByStatus[status])
    const mutations = useLeadMutations(token)
    const groups = useLeadGroupOptions(token)
    const total = leads.length

    // Faqat ro'yxat yuklash xatosi. Saqlash xatolari endi qizil xabarda
    // (`queryClient.ts` → `MutationCache`) — ilgari ular shu yerda, ochiq oyna
    // ORQASIDA va "yuklab bo'lmadi" matni bilan chiqardi.
    const apiError = LEAD_STATUSES.map((status) => lists[status].error).find(Boolean)

    function openCreate() {
        setEditing(null)
        setIsCreateOpen(true)
    }

    function openEdit(lead: LeadDto) {
        setEditing(lead)
        setIsCreateOpen(false)
    }

    function closeCreate() {
        setIsCreateOpen(false)
    }

    function closeEdit() {
        setEditing(null)
    }

    function handleCreate(body: LeadCreateDto) {
        mutations.create.mutate(body, { onSuccess: closeCreate })
    }

    function handleUpdate(body: LeadUpdateDto) {
        if (!editing) return
        mutations.update.mutate({ id: editing.id, body }, { onSuccess: closeEdit })
    }

    function deleteLead(lead: LeadDto) {
        if (confirm(t('lead.deleteConfirm', { name: lead.fullName || t('lead.unnamed') }))) {
            mutations.remove.mutate(lead.id)
        }
    }

    function changeStatus(lead: LeadDto, status: LeadStatus) {
        if (asStatus(lead.status) === status || status === 'NEW') return
        setAction({ lead, status })
    }

    function drop(status: LeadStatus) {
        const lead = leads.find((item) => item.id === draggedId)
        setDraggedId(null)
        if (lead) changeStatus(lead, status)
    }

    return (
        <AppShell
            subtitle={t('lead.title')}
            onSignOut={signOut}
            token={token}
            theme={theme}
            toggleTheme={toggleTheme}
            actions={
                <>
                    <Button size="sm" onClick={() => navigate('/')}>
                        {t('common.back')}
                    </Button>
                    <Button size="sm" onClick={() => setIsFormLinkOpen(true)}>
                        {t('leadForm.open')}
                    </Button>
                    <Button variant="primary" size="sm" onClick={openCreate}>
                        {t('lead.new')}
                    </Button>
                </>
            }
        >
            <div className="mx-auto max-w-[1600px] space-y-5">
                <LeadsHeader
                    total={total}
                    search={search}
                    onSearchChange={setSearch}
                    filter={filter}
                    onFilterChange={setFilter}
                />
                {apiError && (
                    <ErrorBox>
                        {t('lead.loadFailed', { message: errorMessage(apiError, t('common.somethingWrong')) })}
                    </ErrorBox>
                )}
                <div className="overflow-x-auto pb-2">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:min-w-[1040px]">
                        {visibleStatuses.map((status) => {
                            const list = lists[status]
                            const grouped = leadsByStatus[status]
                            return (
                                <LeadColumn
                                    key={status}
                                    status={status}
                                    leads={grouped}
                                    isLoading={list.isLoading}
                                    hasNextPage={Boolean(list.hasNextPage)}
                                    isFetchingNextPage={Boolean(list.isFetchingNextPage)}
                                    loadMoreRef={(element) => {
                                        if (element) {
                                            loadMoreRefs.current[status] = element
                                        } else {
                                            delete loadMoreRefs.current[status]
                                        }
                                    }}
                                    onEdit={openEdit}
                                    onStatusChange={changeStatus}
                                    onDelete={deleteLead}
                                    onDragStart={(id) => setDraggedId(id)}
                                    onDragEnd={() => setDraggedId(null)}
                                    onDrop={drop}
                                />
                            )
                        })}
                    </div>
                </div>
                {visibleStatuses.every((status) => !lists[status].isLoading) && leads.length === 0 && !apiError && (
                    <EmptyState title={t('lead.empty')} description={t('lead.emptyHint')} />
                )}
            </div>
            {isFormLinkOpen && <LeadFormSettingsModal token={token} onClose={() => setIsFormLinkOpen(false)} />}
            {isCreateOpen && (
                <NewLeadModal
                    token={token}
                    isPending={mutations.create.isPending}
                    onClose={closeCreate}
                    onSubmit={handleCreate}
                />
            )}
            {editing && (
                <EditLeadModal
                    token={token}
                    lead={editing}
                    isPending={mutations.update.isPending}
                    onClose={closeEdit}
                    onSubmit={handleUpdate}
                />
            )}
            {action && (
                <LeadActionModal
                    lead={action.lead}
                    status={action.status as 'ENROLLED' | 'REJECTED' | 'CALL_LATER'}
                    groupOptions={groups.data ?? []}
                    isPending={
                        mutations.enroll.isPending || mutations.reject.isPending || mutations.callLater.isPending
                    }
                    onClose={() => setAction(null)}
                    onEnroll={(groupId) =>
                        mutations.enroll.mutate(
                            { id: action.lead.id, groupId },
                            { onSuccess: () => setAction(null) }
                        )
                    }
                    onReject={(body) =>
                        mutations.reject.mutate(
                            { id: action.lead.id, body },
                            { onSuccess: () => setAction(null) }
                        )
                    }
                    onCallLater={(callAt) =>
                        mutations.callLater.mutate(
                            { id: action.lead.id, callAt },
                            { onSuccess: () => setAction(null) }
                        )
                    }
                />
            )}
        </AppShell>
    )
}
