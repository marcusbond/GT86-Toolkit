import type { EnrichedReading } from '@/knowledge'
import type { RangeStatus } from '@/knowledge'
import { Card, CardBody, ContextBlock } from './Card'
import { StatusBadge } from './StatusBadge'

interface VitalsCardProps {
  readings: EnrichedReading[]
}

function statusColor(status: RangeStatus): string {
  const colors = {
    normal: 'text-green-600',
    warning: 'text-amber-600',
    critical: 'text-red-600',
  }
  return colors[status]
}

function formatValue(reading: EnrichedReading): string {
  if (reading.unit === '%') {
    return `${reading.value > 0 ? '+' : ''}${reading.value}%`
  }
  if (reading.unit === 'V') {
    return `${reading.value.toFixed(1)}V`
  }
  return `${reading.value}${reading.unit}`
}

function overallStatus(readings: EnrichedReading[]): 'pass' | 'warn' | 'fail' {
  if (readings.some((r) => r.range.status === 'critical')) return 'fail'
  if (readings.some((r) => r.range.status === 'warning')) return 'warn'
  return 'pass'
}

function overallLabel(status: 'pass' | 'warn' | 'fail'): string {
  if (status === 'pass') return 'Normal'
  if (status === 'warn') return 'Warning'
  return 'Problem'
}

// Group fuel trims into short labels for the 2x2 grid
function shortName(reading: EnrichedReading): string {
  if (reading.pid === '05') return 'Coolant'
  if (reading.pid === '42') return 'Battery'
  if (reading.pid === '06') return 'Fuel Trim B1'
  if (reading.pid === '07') return 'LTFT B1'
  if (reading.pid === '08') return 'Fuel Trim B2'
  if (reading.pid === '09') return 'LTFT B2'
  return reading.name
}

export function VitalsCard({ readings }: VitalsCardProps) {
  const status = overallStatus(readings)

  // Split into primary readings (grid) and any with warnings (detail below)
  const warnings = readings.filter((r) => r.range.status !== 'normal')

  return (
    <Card title="Engine Vitals" badge={<StatusBadge status={status} label={overallLabel(status)} />}>
      <div className="grid grid-cols-2 gap-px bg-gray-200 mb-3">
        {readings.map((reading) => (
          <div key={reading.pid} className="bg-white p-3.5">
            <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
              {shortName(reading)}
            </div>
            <div className={`text-[22px] font-bold tracking-tight ${statusColor(reading.range.status)}`}>
              {formatValue(reading)}
            </div>
          </div>
        ))}
      </div>

      <CardBody>
        {warnings.length === 0 ? (
          <ContextBlock label="Summary">
            All readings within normal range for the FA20 engine.
          </ContextBlock>
        ) : (
          warnings.map((r) => (
            <ContextBlock key={r.pid} label={r.name}>
              {r.range.message}
            </ContextBlock>
          ))
        )}
      </CardBody>
    </Card>
  )
}
