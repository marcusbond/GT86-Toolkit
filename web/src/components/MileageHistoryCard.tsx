import type { MotTest, MileageAnalysis } from '@/dvla'
import { Card } from './Card'
import { StatusBadge } from './StatusBadge'
import { ContextBlock } from './Card'

interface MileageHistoryCardProps {
  motHistory: MotTest[]
  analysis: MileageAnalysis
}

export function MileageHistoryCard({ motHistory, analysis }: MileageHistoryCardProps) {
  const status = analysis.status === 'consistent' ? 'pass' : 'warn'
  const label = analysis.status === 'consistent' ? 'Consistent' : 'Anomaly found'

  // Build bar data from MOT history (newest first, reverse for chart left-to-right)
  const entries = [...motHistory].reverse()
  const maxMileage = Math.max(...entries.map((e) => e.mileage))

  // Extract years for the label bar
  const years = entries.map((e) => {
    const parts = e.date.split(' ')
    return parts[parts.length - 1]
  })
  const firstYear = years[0]
  const midYear = years[Math.floor(years.length / 2)]
  const lastYear = years[years.length - 1]

  // Find anomaly date ranges to highlight columns
  const anomalyDates = new Set<number>()
  for (const anomaly of analysis.anomalies) {
    // Mark the newer test in each anomaly pair
    const idx = entries.findIndex((e) => e.date === anomaly.toDate)
    if (idx >= 0) anomalyDates.add(idx)
  }

  return (
    <Card title="Mileage History" badge={<StatusBadge status={status} label={label} />}>
      <div className="px-[18px] pt-3.5 pb-[18px]">
        <div className="flex items-end gap-[3px] h-[60px] mb-2">
          {entries.map((entry, i) => {
            const height = maxMileage > 0 ? Math.max((entry.mileage / maxMileage) * 100, 4) : 4
            const isAnomaly = anomalyDates.has(i)
            return (
              <div
                key={entry.date}
                className={`flex-1 rounded-t-sm min-h-1 ${isAnomaly ? 'bg-warn' : 'bg-pass'}`}
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-[10px] text-text-light">
          <span>{firstYear}</span>
          <span>{midYear}</span>
          <span>{lastYear}</span>
        </div>
        <p className="text-[12px] text-text-mid mt-2.5 leading-normal">{analysis.summary}</p>

        {analysis.anomalies.map((anomaly, i) => (
          <ContextBlock key={i} label={anomaly.type === 'rollback' ? 'Mileage rollback' : 'Mileage anomaly'}>
            {anomaly.description}
          </ContextBlock>
        ))}
      </div>
    </Card>
  )
}
