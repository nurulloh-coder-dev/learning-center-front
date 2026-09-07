import { useState } from 'react'
import { cn } from '@/shared/lib'
import type { DemoRole } from './roles'
import { DEMO_ROLES } from './roles'

interface DemoBarProps {
    role: DemoRole
    onRoleChange: (role: DemoRole) => void
}

/**
 * Demo uchun rol almashtirgich.
 *
 * Ikki nuqta muhim edi:
 *  - MARKAZDA emas, o'ng pastda turadi — markazda turganda telefonda jadval
 *    qatorlarini to'sib qo'yardi;
 *  - sukut bo'yicha YIG'ILGAN holatda, ya'ni kichkina yorliq. Ochish uchun
 *    bosiladi. Shunda ekranning katta qismi bo'shab qoladi.
 *
 * `env(safe-area-inset-bottom)` — iPhone'dagi pastki chiziq ustiga tushmasin.
 */
export function DemoBar({ role, onRoleChange }: DemoBarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const current = DEMO_ROLES.find((item) => item.value === role)

    return (
        <div
            className="fixed right-3 bottom-3 z-100 flex flex-col items-end gap-2"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {isOpen && (
                <div className="flex flex-col items-stretch gap-1 rounded-2xl border border-border-base bg-surface-card/95 p-1.5 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] backdrop-blur">
                    <span className="px-2.5 pt-1 pb-0.5 font-mono text-[0.58rem] tracking-[0.08em] text-fg-faint uppercase">
                        Demo · mock data
                    </span>
                    {DEMO_ROLES.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                                onRoleChange(item.value)
                                setIsOpen(false)
                            }}
                            className={cn(
                                'cursor-pointer rounded-xl px-3 py-2 text-left text-xs whitespace-nowrap transition-colors',
                                item.value === role
                                    ? 'bg-fg font-semibold text-fg-inverted'
                                    : 'text-fg-muted hover:bg-surface-hover'
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}

            <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-base bg-surface-card/95 px-3.5 py-2.5 min-h-[38px] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)] backdrop-blur"
            >
                <span className="rounded-full bg-brand px-1.5 py-0.5 font-mono text-[0.55rem] tracking-[0.08em] text-brand-fg uppercase">
                    Demo
                </span>
                <span className="text-xs font-medium text-fg">{current?.label}</span>
                <span className="text-[0.6rem] text-fg-faint">{isOpen ? '▾' : '▴'}</span>
            </button>
        </div>
    )
}
