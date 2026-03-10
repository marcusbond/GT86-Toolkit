import type { EnrichedDtc, EnrichedReadiness } from '@/knowledge'

interface ScoreCardProps {
  storedDtcs: EnrichedDtc[]
  pendingDtcs: EnrichedDtc[]
  readiness: EnrichedReadiness | null
}

function scoreClass(status: 'pass' | 'warn' | 'fail'): string {
  const colors = {
    pass: 'text-green-600',
    warn: 'text-amber-600',
    fail: 'text-red-600',
  }
  return colors[status]
}

export function Scorecard({ storedDtcs, pendingDtcs, readiness }: ScoreCardProps) {
  const faultStatus = storedDtcs.length === 0 ? 'pass' : 'fail'
  const pendingStatus = pendingDtcs.length === 0 ? 'pass' : 'warn'

  let readinessStatus: 'pass' | 'warn' = 'pass'
  let readinessLabel = '--'
  if (readiness) {
    const complete = readiness.monitors.filter((m) => m.complete).length
    const total = readiness.monitors.length
    readinessLabel = `${complete}/${total}`
    readinessStatus = readiness.allComplete ? 'pass' : 'warn'
  }

  return (
    <div className="flex bg-white border border-gray-200 rounded mb-6 overflow-hidden">
      <ScoreCell label="Faults" value={String(storedDtcs.length)} status={faultStatus} />
      <ScoreCell label="Pending" value={String(pendingDtcs.length)} status={pendingStatus} />
      <ScoreCell label="Readiness" value={readinessLabel} status={readinessStatus} />
    </div>
  )
}

function ScoreCell({
  label,
  value,
  status,
}: {
  label: string
  value: string
  status: 'pass' | 'warn' | 'fail'
}) {
  return (
    <div className="flex-1 py-3.5 text-center border-r border-gray-200 last:border-r-0">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
        {label}
      </div>
      <div className={`text-sm font-bold ${scoreClass(status)}`}>{value}</div>
    </div>
  )
}
