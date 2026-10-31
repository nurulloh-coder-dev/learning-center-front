import { useState } from 'react'
import { errorMessage } from '@/shared/api'
import { useMe } from '@/shared/hooks'
import { useT } from '@/shared/i18n'
import { Avatar, Button, ErrorBox, Pagination, Panel, SearchInput } from '@/shared/ui'
import type { UserCreatedResponseDto, UserDto } from '@/shared/types'
import { AdminCreateModal } from './AdminCreateModal'
import { AdminCredentialsModal } from './AdminCredentialsModal'
import { AdminEditModal } from './AdminEditModal'
import { SimpleTable } from './SimpleTable'
import { usePeople } from '../hooks/usePeople'
import { useBranches, useCreateAdmin, useRegeneratePassword, useUpdateAdmin } from '../hooks/useSuperAdminData'
import type { PeopleKind, PersonRow } from '../api/superAdminApi'

interface PeoplePanelProps {
    token: string
    kind: PeopleKind
    page: number
    search: string
    onPageChange: (page: number) => void
    onSearchChange: (search: string) => void
}

/**
 * O'quvchi, o'qituvchi va administrator — bitta jadval.
 *
 * Uchalasida ham ko'rsatiladigan narsa bir xil (ism, telefon, tug'ilgan
 * sana), faqat manba boshqa. Uchta alohida komponent yozilsa uchta joyda
 * bir xil tuzatish qilishga to'g'ri kelardi.
 *
 * QO'SHISH faqat administratorlar uchun shu yerda ("+ Administrator"):
 * o'quvchi va o'qituvchini administrator panelida qo'shish mantiqiy —
 * kundalik ish shu yerda; administratorni esa faqat super-admin qo'sha
 * oladi, ya'ni shu panel — yagona o'rin.
 */
export function PeoplePanel({
    token,
    kind,
    page,
    search,
    onPageChange,
    onSearchChange,
}: PeoplePanelProps) {
    const { t } = useT()
    const people = usePeople(
        token,
        kind,
        page,
        search
    )
    const { totalPages, totalElements, isLoading, error } = people

    // Super-admin o'zini ro'yxatda ko'rmaydi: o'z parolini shu yerdan
    // yangilab, akkauntidan qulflanib qolmasin (o'zi uchun Sozlamalar bor).
    const { data: me } = useMe(token)
    const rows = people.rows.filter((row) => !me?.id || row.userDto?.id !== me.id)

    const regenerate = useRegeneratePassword(token)
    const resetPassword = (row: PersonRow) => {
        const userId = row.userDto?.id
        if (!userId) return
        if (!confirm(t('superAdmin.password.confirm', { name: row.userDto?.fullName ?? '' }))) return
        regenerate.mutate(userId, { onSuccess: (created) => setCredentials(created) })
    }

    const [showCreate, setShowCreate] = useState(false)
    const [credentials, setCredentials] = useState<UserCreatedResponseDto | null>(null)
    const [editing, setEditing] = useState<UserDto | null>(null)
    const updateAdmin = useUpdateAdmin(token)

    // Filiallar ro'yxati faqat administrator qo'shishda kerak, lekin
    // `SuperAdminDashboardPage` allaqachon shu so'rovni (`token, 0, ''`)
    // yuborgan — kesh bo'lgani uchun bu yerda qayta so'rov ketmaydi.
    const branches = useBranches(token, 0, '')
    const branchOptions = branches.rows.map((branch) => ({
        value: branch.id,
        label: branch.name || branch.id,
    }))
    const createAdmin = useCreateAdmin(token)

    const columns = [
        {
            key: 'fullName',
            label: t('field.fullName'),
            render: (row: PersonRow) => (
                <div className="flex items-center gap-2.5">
                    <Avatar
                        name={row.userDto?.fullName}
                        src={row.userDto?.imageUrl}
                        size="sm"
                        colorful
                    />
                    <span className="font-medium text-fg">{row.userDto?.fullName || '—'}</span>
                </div>
            ),
        },
        {
            key: 'phone',
            label: t('field.phone'),
            render: (row: PersonRow) => (
                <span className="font-mono text-sm">{row.userDto?.phone || '—'}</span>
            ),
        },
        {
            key: 'birthDate',
            label: t('field.birthDate'),
            render: (row: PersonRow) => row.userDto?.birthDate || '—',
        },
    ]

    return (
        <Panel>
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <SearchInput
                    className="max-w-xs flex-1"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={t('superAdmin.search')}
                />
                {kind === 'administrators' && (
                    <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
                        {t('superAdmin.admin.new')}
                    </Button>
                )}
            </div>

            {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}
            {regenerate.error != null && <ErrorBox>{errorMessage(regenerate.error)}</ErrorBox>}

            <SimpleTable
                rows={rows}
                columns={columns}
                isLoading={isLoading}
                emptyText={t('superAdmin.peopleEmpty')}
                onResetPassword={resetPassword}
                onEdit={kind === 'administrators' ? (row) => row.userDto && setEditing(row.userDto) : undefined}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={onPageChange}
            />

            {showCreate && (
                <AdminCreateModal
                    branchOptions={branchOptions}
                    isSaving={createAdmin.isPending}
                    error={createAdmin.error}
                    onClose={() => setShowCreate(false)}
                    onSubmit={(payload) =>
                        createAdmin.mutate(payload, {
                            onSuccess: (created) => {
                                setShowCreate(false)
                                setCredentials(created)
                            },
                        })
                    }
                />
            )}

            {editing && (
                <AdminEditModal
                    admin={editing}
                    isSaving={updateAdmin.isPending}
                    error={updateAdmin.error}
                    onClose={() => setEditing(null)}
                    onSubmit={(body) =>
                        updateAdmin.mutate({ userId: editing.id ?? '', body }, { onSuccess: () => setEditing(null) })
                    }
                />
            )}

            {credentials && (
                <AdminCredentialsModal credentials={credentials} onClose={() => setCredentials(null)} />
            )}
        </Panel>
    )
}
