import React from 'react'
import { Check, CheckCircle2, Minus } from 'lucide-react'
import type { TourMock } from '@/data/translations'

// Namuna ekranlar ilovadagi haqiqiy bo'limlarni takrorlaydi: lid holatlari,
// davomat belgilari, hisob holatlari va o'quvchi paneli. Ilovada yo'q narsa
// (SMS, onlayn to'lov, QR) bu yerga qo'shilmaydi.

const card = 'bg-neutral-950 p-3 rounded-lg border border-neutral-800 hover:border-blue-800 transition-colors'
const item = 'bg-neutral-900 p-2.5 rounded-md text-xs border border-neutral-800 space-y-1'
const tag = 'inline-block text-[9px] font-bold bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded border border-blue-900'

function LeadsMock({ m }: { m: TourMock }) {
  const columns = [
    { title: m.leadColumns[0], count: 12, leads: [['Anvar K.', 'General English', 'Instagram'], ['Malika S.', 'IELTS', 'Telegram']] },
    { title: m.leadColumns[1], count: 4, leads: [['Rustam T.', m.callToday, '']] },
    { title: m.leadColumns[2], count: 5, leads: [['Shahzod B.', `${m.groupLabel}: IELTS 4`, '']] },
    { title: m.leadColumns[3], count: 3, leads: [['Dilshod A.', m.rejectedReason, '']] },
  ]
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 animate-in fade-in duration-300'>
      {columns.map((col) => (
        <div key={col.title} className={`${card} space-y-2`}>
          <div className='text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between'>
            <span>{col.title}</span>
            <span className='bg-blue-950 border border-blue-900 px-1.5 rounded text-[10px]'>{col.count}</span>
          </div>
          {col.leads.map(([name, detail, source]) => (
            <div key={name} className={item}>
              <div className='font-bold text-white'>{name}</div>
              <div className='text-[10px] text-neutral-400'>{detail}</div>
              {source && <span className={tag}>{source}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

type Mark = 'p' | 'a' | 'e'

const markStyle: Record<Mark, string> = {
  p: 'bg-blue-950 text-blue-400 border-blue-900',
  a: 'bg-red-950/60 text-red-400 border-red-900',
  e: 'bg-neutral-800 text-neutral-300 border-neutral-700',
}
const markSymbol: Record<Mark, string> = { p: '✓', a: '✕', e: '•' }

function AttendanceMock({ m }: { m: TourMock }) {
  const days = [1, 3, 5, 8, 10, 12, 15, 17]
  const rows: [string, Mark[]][] = [
    ['Kamila Y.', ['p', 'p', 'p', 'p', 'p', 'a', 'p', 'p']],
    ['Sardor M.', ['p', 'p', 'e', 'p', 'p', 'p', 'p', 'p']],
    ['Jasur T.', ['p', 'a', 'p', 'e', 'p', 'p', 'a', 'p']],
    ['Dilnoza R.', ['p', 'p', 'p', 'p', 'a', 'p', 'p', 'p']],
  ]
  const legend: [Mark, string][] = [['p', m.present], ['a', m.absent], ['e', m.excused]]
  return (
    <div className='space-y-3 pt-2 animate-in fade-in duration-300'>
      <div className={`${card} space-y-2 overflow-x-auto`}>
        <div className='flex items-center justify-between text-xs font-bold text-neutral-200'>
          <span>{m.lessonTitle}</span>
          <span className='text-[10px] font-medium text-neutral-400'>{m.monthLabel}</span>
        </div>
        <table className='w-full text-[10px] border-separate border-spacing-1'>
          <thead>
            <tr className='text-neutral-500'>
              <th className='text-left font-medium'> </th>
              {days.map((day, index) => (
                <th key={day} className={`font-medium w-6 ${index >= 5 ? 'hidden sm:table-cell' : ''}`}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, marks]) => (
              <tr key={name}>
                <td className='whitespace-nowrap pr-2 text-xs font-semibold text-white'>{name}</td>
                {marks.map((mark, index) => (
                  <td key={days[index]} className={`text-center ${index >= 5 ? 'hidden sm:table-cell' : ''}`}>
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded border text-[11px] font-bold ${markStyle[mark]}`}>
                      {markSymbol[mark]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[10px] text-neutral-400'>
          {legend.map(([mark, label]) => (
            <span key={mark} className='inline-flex items-center gap-1.5'>
              <span className={`inline-flex h-4 w-4 items-center justify-center rounded border text-[9px] font-bold ${markStyle[mark]}`}>
                {markSymbol[mark]}
              </span>
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className='flex items-center gap-2 text-[11px] text-blue-400'>
        <CheckCircle2 className='h-3.5 w-3.5' />
        <span>{m.markedNote}</span>
      </div>
    </div>
  )
}

function PaymentsMock({ m }: { m: TourMock }) {
  return (
    <div className='space-y-3 pt-2 animate-in fade-in duration-300'>
      <div className='text-xs font-bold text-neutral-200'>{m.invoicesTitle}</div>
      <div className='grid grid-cols-3 gap-3'>
        {[
          [m.paid, '86'],
          [m.pending, '23'],
          [m.overdue, '7'],
        ].map(([label, value]) => (
          <div key={label} className={card}>
            <div className='text-[10px] text-neutral-400 font-medium'>{label}</div>
            <div className='text-xl font-black text-white mt-1'>{value}</div>
          </div>
        ))}
      </div>
      <div className={`${card} text-xs space-y-2`}>
        <div className='font-bold text-neutral-200'>{m.paymentsTitle}</div>
        {[
          ['Sardor M.', m.paidAction, '+450 000'],
          ['Kamila Y.', m.monthlyFee, '−450 000'],
        ].map(([name, type, amount]) => (
          <div key={name + type} className='flex justify-between text-[11px] text-neutral-300 border-t border-neutral-800 pt-2'>
            <span>{name} · {type}</span>
            <span className='text-blue-400 font-bold'>{amount} so&apos;m</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StudentMock({ m }: { m: TourMock }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-in fade-in duration-300'>
      <div className={`${card} space-y-2`}>
        <div className='text-xs font-bold text-neutral-200'>{m.myAttendance}</div>
        <div className='bg-neutral-900 p-3 rounded-md text-[11px] text-neutral-300 border border-neutral-800'>
          {m.attendanceSummary}
        </div>
      </div>
      <div className={`${card} space-y-2`}>
        <div className='text-xs font-bold text-neutral-200'>{m.myBalance}</div>
        <div className='bg-neutral-900 p-3 rounded-md border border-neutral-800'>
          <div className='text-lg font-black text-white'>0 so&apos;m</div>
          <div className='text-[10px] text-blue-400'>{m.balanceHint}</div>
        </div>
      </div>
      <div className={`${card} space-y-1 sm:col-span-2 text-[11px]`}>
        <div className='text-xs font-bold text-neutral-200'>{m.myGroup}</div>
        <div className='text-neutral-300'>IELTS 4 · {m.teacherLabel}: Aziza N. · 14:00</div>
      </div>
    </div>
  )
}

function PermissionsMock({ m }: { m: TourMock }) {
  // Ilovadagi 6 ta ruxsat; ikkinchi administratorga faqat "O'quvchilar" berilgan.
  const admins: [string, boolean[]][] = [
    [m.permFullAdmin, [true, true, true, true, true, true]],
    [m.permLimitedAdmin, [false, false, false, true, false, false]],
  ]
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-in fade-in duration-300'>
      {admins.map(([title, allowed]) => (
        <div key={title} className={`${card} space-y-3`}>
          <div className='text-xs font-bold text-neutral-200'>{title}</div>
          <ul className='space-y-1.5'>
            {m.permNames.map((name, index) => (
              <li key={name} className={`flex items-center gap-2 text-[11px] ${allowed[index] ? 'text-white' : 'text-neutral-500'}`}>
                <span className={`inline-flex h-4 w-4 items-center justify-center rounded border ${allowed[index] ? 'bg-blue-950 border-blue-900 text-blue-400' : 'border-neutral-800 text-neutral-600'}`}>
                  {allowed[index] ? <Check className='h-3 w-3' /> : <Minus className='h-3 w-3' />}
                </span>
                {name}
              </li>
            ))}
          </ul>
          <div className='border-t border-neutral-800 pt-2 space-y-1.5'>
            <div className='text-[10px] text-neutral-400'>{m.permSees}</div>
            <div className='flex flex-wrap gap-1'>
              {m.permNames.filter((_, index) => allowed[index]).map((name) => (
                <span key={name} className={tag}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TourMockup({ tab, mock }: { tab: string; mock: TourMock }) {
  if (tab === 'attendance') return <AttendanceMock m={mock} />
  if (tab === 'payments') return <PaymentsMock m={mock} />
  if (tab === 'permissions') return <PermissionsMock m={mock} />
  if (tab === 'student') return <StudentMock m={mock} />
  return <LeadsMock m={mock} />
}
