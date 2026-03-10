import type { EnrichedDtc, EnrichedReadiness } from '@/knowledge'
import type { DvlaData, MileageAnalysis } from '@/dvla'

interface ScoreCardProps {
  storedDtcs: EnrichedDtc[]
  pendingDtcs: EnrichedDtc[]
  readiness: EnrichedReadiness | null
  dvla: DvlaData | null
  mileage: MileageAnalysis | null
}

function scoreClass(status: 'pass' | 'warn' | 'fail'): string {
  const colors = {
    pass: 'text-pass',
    warn: 'text-warn',
    fail: 'text-fail',
  }
  return colors[status]
}

export function Scorecard({ storedDtcs, pendingDtcs, readiness, dvla, mileage }: ScoreCardProps) {
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

  // MOT expiry from DVLA data
  let motStatus: 'pass' | 'warn' | 'fail' = 'pass'
  let motLabel = '--'
  if (dvla?.vehicle.motExpiry) {
    // Show abbreviated date (e.g. "Oct 26")
    const parts = dvla.vehicle.motExpiry.split(' ')
    motLabel = `${parts[1].slice(0, 3)} ${parts[2].slice(-2)}`
  }
  if (dvla?.vehicle.taxStatus === 'SORN') {
    motStatus = 'warn'
  }

  // Mileage consistency
  let mileageStatus: 'pass' | 'warn' = 'pass'
  let mileageLabel = '--'
  if (mileage) {
    mileageStatus = mileage.status === 'consistent' ? 'pass' : 'warn'
    mileageLabel = mileage.status === 'consistent' ? '\u2713' : '!'
  }

  return (
    <div className="flex bg-surface border border-border rounded mb-6 overflow-hidden">
      <ScoreCell label="Faults" value={String(storedDtcs.length)} status={faultStatus} />
      <ScoreCell label="Pending" value={String(pendingDtcs.length)} status={pendingStatus} />
      <ScoreCell label="Readiness" value={readinessLabel} status={readinessStatus} />
      <ScoreCell label="MOT" value={motLabel} status={motStatus} />
      <ScoreCell label="Mileage" value={mileageLabel} status={mileageStatus} />
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
    <div className="flex-1 py-3.5 text-center border-r border-border last:border-r-0">
      <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-light mb-1">
        {label}
      </div>
      <div className={`text-[13px] font-bold ${scoreClass(status)}`}>{value}</div>
    </div>
  )
}
