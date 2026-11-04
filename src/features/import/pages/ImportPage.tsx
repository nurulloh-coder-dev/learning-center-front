import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { AppShell, BackIcon, ErrorBox, Eyebrow, IconButton } from '@/shared/ui'
import { FileStep } from '../components/FileStep'
import { ImportResultPanel } from '../components/ImportResultPanel'
import { MappingStep } from '../components/MappingStep'
import { PreviewStep } from '../components/PreviewStep'
import { useImportFlow } from '../hooks/useImportFlow'
import type { ImportKind } from '../lib/importFields'

/**
 * O'quvchi yoki o'qituvchilarni Excel/CSV dan qo'shish.
 *
 * Modal emas, alohida sahifa: ustunlarni moslash va oldindan ko'rish
 * jadvali kichik oynaga sig'maydi (rahbar talabi).
 */
export function ImportPage({ kind }: { kind: ImportKind }) {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const flow = useImportFlow(session.token, kind)
    const { file } = flow

    return (
        <AppShell
            subtitle={t(`import.title.${kind}`)}
            onSignOut={signOut}
            token={session.token}
            theme={theme}
            toggleTheme={toggleTheme}
            actions={
                <IconButton label={t('common.back')} onClick={() => navigate('/')}>
                    <BackIcon />
                </IconButton>
            }
        >
            <div className="mx-auto max-w-4xl">
                <header className="mb-5">
                    <Eyebrow>{t('import.eyebrow')}</Eyebrow>
                    <h1 className="mt-1 font-display text-2xl font-semibold text-fg">{t(`import.title.${kind}`)}</h1>
                </header>

                {flow.outcome ? (
                    <ImportResultPanel
                        logins={flow.outcome.logins}
                        failed={flow.outcome.failed}
                        onAgain={flow.again}
                        onBack={() => navigate('/')}
                    />
                ) : (
                    <>
                        <FileStep
                            branchOptions={flow.branches.options}
                            branchId={flow.branchId}
                            onBranchChange={flow.setBranchId}
                            fileName={file.file?.name ?? null}
                            rowCount={file.file?.table.rows.length ?? 0}
                            isReading={file.isReading}
                            error={file.error}
                            onFile={(selected) => void file.loadFile(selected)}
                            onReset={file.reset}
                        />
                        {file.file && (
                            <MappingStep
                                fields={file.fields}
                                headers={file.file.table.headers}
                                rows={file.file.table.rows}
                                mapping={file.mapping}
                                missingRequired={file.missingRequired}
                                onChange={file.setColumn}
                            />
                        )}
                        {file.file && file.missingRequired.length === 0 && (
                            <PreviewStep
                                kind={kind}
                                fields={file.fields}
                                rows={file.rows}
                                readyCount={file.readyRows.length}
                                tooMany={file.tooMany}
                                needsBranch={!flow.branchId}
                                canSubmit={flow.canSubmit}
                                isSubmitting={flow.isSubmitting}
                                onSubmit={flow.start}
                            />
                        )}
                        {flow.submitError != null && (
                            <div className="flex flex-col gap-2">
                                <ErrorBox>{errorMessage(flow.submitError)}</ErrorBox>
                                <ErrorBox>{t('import.error.partial')}</ErrorBox>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppShell>
    )
}
