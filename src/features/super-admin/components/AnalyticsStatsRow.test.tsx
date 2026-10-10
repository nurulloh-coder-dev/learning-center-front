import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AnalyticsStatsRow } from './AnalyticsStatsRow'
import type { AnalyticsCategory } from '@/shared/types'
import type { AnalyticsItemResult } from '../hooks/useAnalytics'

function mockItems(
    overrides?: Partial<Record<AnalyticsCategory, Partial<AnalyticsItemResult>>>
): Record<AnalyticsCategory, AnalyticsItemResult> {
    const categories: AnalyticsCategory[] = ['student', 'teacher', 'lead', 'invoice', 'enrollment', 'branch']
    const base: Record<AnalyticsCategory, AnalyticsItemResult> = {} as Record<
        AnalyticsCategory,
        AnalyticsItemResult
    >

    categories.forEach((cat) => {
        base[cat] = {
            category: cat,
            total: 100,
            thisMonth: cat === 'branch' ? null : 12,
            isLoading: false,
            error: null,
            ...overrides?.[cat],
        }
    })

    return base
}

const ALL: AnalyticsCategory[] = ['student', 'teacher', 'lead', 'invoice', 'enrollment', 'branch']

describe('AnalyticsStatsRow', () => {
    it('shows the four main cards by default', () => {
        renderWithProviders(<AnalyticsStatsRow items={mockItems()} />)
        expect(screen.getAllByText('100')).toHaveLength(4)
    })

    it('renders total counts and "+12 bu oyda" correctly (except branch which has no monthly count)', () => {
        const items = mockItems()
        renderWithProviders(<AnalyticsStatsRow items={items} categories={ALL} />)

        // 6 cards rendered with total 100
        const totalElements = screen.getAllByText('100')
        expect(totalElements.length).toBe(6)

        // "+12 bu oyda" visible on 5 cards (excluding branch)
        const thisMonthElements = screen.getAllByText('+12 bu oyda')
        expect(thisMonthElements.length).toBe(5)
    })

    it('renders loading indicators when values are loading', () => {
        const items = mockItems({
            student: { total: undefined, thisMonth: undefined, isLoading: true },
        })

        renderWithProviders(<AnalyticsStatsRow items={items} categories={ALL} />)

        // Student total should be '···' and thisMonth should be '···'
        const loadingDots = screen.getAllByText('···')
        expect(loadingDots.length).toBeGreaterThanOrEqual(2)
    })

    it('renders dash when count is null', () => {
        const items = mockItems({
            lead: { total: null, thisMonth: null, isLoading: false },
        })

        renderWithProviders(<AnalyticsStatsRow items={items} categories={ALL} />)

        expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('renders error message when request fails', () => {
        const items = mockItems({
            student: { error: new Error('Failed to fetch') },
        })

        renderWithProviders(<AnalyticsStatsRow items={items} categories={ALL} />)

        expect(screen.getByText('Ma’lumotlarni yuklashda xatolik yuz berdi')).toBeInTheDocument()
    })
})
