import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { errorMessage } from '@/shared/api'
import type { LeadCreateDto, LeadDto, LeadStatus, LeadUpdateDto } from '@/shared/types'
import { LEAD_STATUSES } from '@/shared/types'
import { useT } from '@/shared/i18n'
import { AppShell, Badge, Button, EmptyState, ErrorBox, Panel, SearchInput, Select } from '@/shared/ui'
import { EditLeadModal } from '../components/EditLeadModal'
import { LeadActionModal } from '../components/LeadActionModal'
import { LeadCard } from '../components/LeadCard'
import { LeadFormSettingsModal } from '../components/LeadFormSettingsModal'
import { NewLeadModal } from '../components/NewLeadModal'
import { useLeadGroupOptions, useLeadMutations, useLeads } from '../hooks/useLeads'

const PAGE_SIZE = 50
const EMPTY_LEADS: LeadDto[] = []
const STATUS_TONE: Record<LeadStatus, 'accent' | 'success' | 'warning' | 'danger'> = { NEW: 'accent', ENROLLED: 'success', CALL_LATER: 'warning', REJECTED: 'danger' }
const COLUMN_TONE: Record<LeadStatus, string> = { NEW: 'border-accent/30 bg-accent-soft', ENROLLED: 'border-success/30 bg-success-soft', CALL_LATER: 'border-warning/30 bg-warning-soft', REJECTED: 'border-danger/30 bg-danger-soft' }

function asStatus(value?: LeadStatus): LeadStatus { return LEAD_STATUSES.includes(value as LeadStatus) ? value as LeadStatus : 'NEW' }

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
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const status = entry.target.getAttribute('data-status') as LeadStatus
                const list = listsRef.current[status]
                if (entry.isIntersecting && list.hasNextPage && !list.isFetchingNextPage) void list.fetchNextPage()
            })
        }, { rootMargin: '160px' })

        Object.values(loadMoreRefs.current).forEach((element) => observer.observe(element))
        return () => observer.disconnect()
    }, [lists.CALL_LATER.hasNextPage, lists.ENROLLED.hasNextPage, lists.NEW.hasNextPage, lists.REJECTED.hasNextPage])
    const leadsByStatus = Object.fromEntries(LEAD_STATUSES.map((status) => [status, lists[status].data?.pages.flatMap((page) => page?.content ?? []) ?? EMPTY_LEADS])) as Record<LeadStatus, LeadDto[]>
    const visibleStatuses: LeadStatus[] = filter ? [filter] : [...LEAD_STATUSES]
    const leads = visibleStatuses.flatMap((status) => leadsByStatus[status])
    const mutations = useLeadMutations(token)
    const groups = useLeadGroupOptions(token)
    const total = leads.length
    // Faqat ro'yxat yuklash xatosi. Saqlash xatolari endi qizil xabarda
    // (`queryClient.ts` → `MutationCache`) — ilgari ular shu yerda, ochiq oyna
    // ORQASIDA va "yuklab bo'lmadi" matni bilan chiqardi.
    const apiError = LEAD_STATUSES.map((status) => lists[status].error).find(Boolean)

    function openCreate() { setEditing(null); setIsCreateOpen(true) }
    function openEdit(lead: LeadDto) { setEditing(lead); setIsCreateOpen(false) }
    function closeCreate() { setIsCreateOpen(false) }
    function closeEdit() { setEditing(null) }
    function handleCreate(body: LeadCreateDto) {
        mutations.create.mutate(body, { onSuccess: closeCreate })
    }
    function handleUpdate(body: LeadUpdateDto) {
        if (!editing) return
        mutations.update.mutate({ id: editing.id, body }, { onSuccess: closeEdit })
    }
    function deleteLead(lead: LeadDto) {
        if (confirm(t('lead.deleteConfirm', { name: lead.fullName || t('lead.unnamed') })))
            mutations.remove.mutate(lead.id)
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
        <AppShell subtitle={t('lead.title')} onSignOut={signOut} token={token} theme={theme} toggleTheme={toggleTheme} actions={<><Button size="sm" onClick={() => navigate('/')}>{t('common.back')}</Button><Button size="sm" onClick={() => setIsFormLinkOpen(true)}>{t('leadForm.open')}</Button><Button size="sm" onClick={() => setIsFormLinkOpen(true)}>{t('leadForm.open')}</Button><Button variant="primary" size="sm" onClick={openCreate}>{t('lead.new')}</Button></>}>
            <div className="mx-auto max-w-[1600px] space-y-5">
                <Panel className="border-0 bg-linear-to-br from-accent-soft/60 via-surface-card to-surface-card p-5 sm:p-7">
                    <div className="flex flex-wrap items-end justify-between gap-4"><div><Badge tone="accent">{t('lead.eyebrow')}</Badge><h1 className="mt-3 font-display text-3xl font-semibold text-fg">{t('lead.title')}</h1><p className="mt-1 text-sm text-fg-muted">{t('lead.description')}</p></div><div className="rounded-xl border border-border-base bg-surface-card px-4 py-3 text-right"><p className="text-xs text-fg-muted">{t('lead.total')}</p><p className="font-display text-2xl font-semibold text-fg">{total}</p></div></div>
                    <div className="mt-6 flex flex-col gap-2 md:flex-row"><SearchInput aria-label={t('lead.search')} placeholder={t('lead.search')} value={search} onChange={(event) => setSearch(event.target.value)} /><Select aria-label={t('lead.allStatuses')} className="md:w-52" placeholder={t('lead.allStatuses')} value={filter} options={LEAD_STATUSES.map((status) => ({ value: status, label: t(`lead.status.${status}`) }))} onChange={(event) => setFilter(event.target.value as LeadStatus | '')} /></div>
                </Panel>
                {apiError && <ErrorBox>{t('lead.loadFailed', { message: errorMessage(apiError, t('common.somethingWrong')) })}</ErrorBox>}
                <div className="overflow-x-auto pb-2"><div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:min-w-[1040px]">
                    {visibleStatuses.map((status) => { const list = lists[status]; const grouped = leadsByStatus[status]; return <section key={status} className={`flex min-h-110 flex-col rounded-2xl border p-3.5 ${COLUMN_TONE[status]}`} onDragOver={(event) => event.preventDefault()} onDrop={() => drop(status)}>
                        <header className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1"><div><h2 className="font-display text-base font-semibold text-fg">{t(`lead.status.${status}`)}</h2><p className="text-xs text-fg-muted">{t('lead.count', { count: grouped.length })}</p></div><Badge tone={STATUS_TONE[status]}>{grouped.length}</Badge></header>
                        <div className="flex flex-1 flex-col gap-3">{list.isLoading ? <div className="rounded-xl border border-dashed border-border-base bg-surface-card p-5 text-center text-sm text-fg-muted">{t('common.loading')}</div> : grouped.length === 0 ? <div className="flex min-h-32 flex-1 items-center justify-center rounded-xl border border-dashed border-border-base bg-surface-card/60 px-4 text-center text-xs text-fg-muted">{t('lead.dropHere')}</div> : grouped.map((lead) => <LeadCard key={lead.id} lead={lead} status={status} onEdit={openEdit} onStatusChange={changeStatus} onDelete={deleteLead} onDragStart={(id) => setDraggedId(id)} onDragEnd={() => setDraggedId(null)} />)}{list.hasNextPage && <div ref={(element) => { if (element) loadMoreRefs.current[status] = element; else delete loadMoreRefs.current[status] }} data-status={status} className="h-8 text-center text-xs text-fg-muted">{list.isFetchingNextPage ? t('common.loading') : ''}</div>}</div>
                    </section> })}
                </div></div>
                {visibleStatuses.every((status) => !lists[status].isLoading) && leads.length === 0 && !apiError && <EmptyState title="No leads found" description="Try a different search, or add your first lead." />}
            </div>
            {isFormLinkOpen && <LeadFormSettingsModal token={token} onClose={() => setIsFormLinkOpen(false)} />}
            {isCreateOpen && <NewLeadModal token={token} isPending={mutations.create.isPending} onClose={closeCreate} onSubmit={handleCreate} />}
            {editing && <EditLeadModal token={token} lead={editing} isPending={mutations.update.isPending} onClose={closeEdit} onSubmit={handleUpdate} />}
            {action && (
                <LeadActionModal
                    lead={action.lead}
                    status={action.status as 'ENROLLED' | 'REJECTED' | 'CALL_LATER'}
                    groupOptions={groups.data ?? []}
                    isPending={mutations.enroll.isPending || mutations.reject.isPending || mutations.callLater.isPending}
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
