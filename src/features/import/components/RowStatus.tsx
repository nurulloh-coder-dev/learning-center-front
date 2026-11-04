import { useT } from '@/shared/i18n'
import { Badge } from '@/shared/ui'
import type { PreparedRow } from '../lib/prepareRows'

/** Qator holati: xato bo'lsa qizil (yuborilmaydi), ogohlantirish — sariq, aks holda yashil. */
export function RowStatus({ row }: { row: PreparedRow }) {
    const { t } = useT()
    if (row.errors.length > 0) {
        return <Badge tone="danger">{row.errors.map((problem) => t(`import.problem.${problem}`)).join(', ')}</Badge>
    }
    if (row.warnings.length > 0) {
        return <Badge tone="warning">{row.warnings.map((problem) => t(`import.problem.${problem}`)).join(', ')}</Badge>
    }
    return <Badge tone="success">{t('import.ok')}</Badge>
}
