import type { MotTest } from '@/dvla'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'

interface MotHistoryCardProps {
  motHistory: MotTest[]
}

function formatMileage(miles: number): string {
  return `${miles.toLocaleString('en-GB')} miles`
}

export function MotHistoryCard({ motHistory }: MotHistoryCardProps) {
  const testCount = motHistory.length
  const failCount = motHistory.filter((t) => t.result === 'fail').length
  const badgeStatus = failCount > 0 ? 'warn' : 'pass'
  const badgeLabel = `${testCount} tests`

  return (
    <Card title="MOT History" badge={<StatusBadge status={badgeStatus} label={badgeLabel} />}>
      {motHistory.map((test, i) => (
        <div key={i} className="px-[18px] py-3 border-b border-border last:border-b-0">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[13px] font-semibold">{test.date}</span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-[3px] ${
                test.result === 'pass' ? 'bg-pass-bg text-pass' : 'bg-fail-bg text-fail'
              }`}
            >
              {test.result === 'pass' ? 'Pass' : 'Fail'}
            </span>
          </div>
          <div className="text-[12px] text-text-light">{formatMileage(test.mileage)}</div>
          {test.failures.length > 0 && (
            <ul className="mt-1.5 text-[12px] text-fail leading-normal">
              {test.failures.map((f, j) => (
                <li key={j} className="ml-4">
                  {f}
                </li>
              ))}
            </ul>
          )}
          {test.advisories.length > 0 && (
            <ul className="mt-1.5 text-[12px] text-text-mid leading-normal">
              {test.advisories.map((a, j) => (
                <li key={j} className="ml-4">
                  {a}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </Card>
  )
}
