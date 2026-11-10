export const dataTableClasses = {
    // Soya `wrapper` ga bog'lanadi, aylanadigan `container` ga EMAS: aylanuvchi
    // element ichidagi `absolute` kontent bilan birga suriladi va jadval
    // o'rtasiga borib matnni xiralashtiradi (2026-10-01, 375px da o'lchangan).
    wrapper: 'relative mb-4',
    container: 'overflow-x-auto rounded-lg border border-border-base',
    scrollFade:
        'pointer-events-none absolute inset-y-px right-px w-6 rounded-r-lg bg-gradient-to-l from-surface-card/80 to-transparent sm:hidden',
    table: 'w-full border-collapse text-sm',
    headerCell:
        'border-b border-border-base bg-surface-muted/60 px-4 py-2.5 text-left text-xs font-medium whitespace-nowrap text-fg-muted',
    row: 'transition-colors duration-150 hover:bg-surface-hover',
    // Qatorlar orasidagi chiziq deyarli ko'rinmas — ma'lumot ajralib tursin.
    cell: 'border-b border-border-base/60 px-4 py-3 whitespace-nowrap text-fg',
    stateCell: 'px-4 py-8 text-center text-fg-faint',
    actions: 'flex justify-end gap-2',
} as const
