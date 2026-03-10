import type { EnrichedDtc } from '@/knowledge'
import { Card, CardBody, ContextBlock } from './Card'
import { StatusBadge } from './StatusBadge'

interface DtcCardProps {
  title: string
  dtcs: EnrichedDtc[]
  activeStatus: 'fail' | 'warn'
  activeLabel: (count: number) => string
  emptyMessage: string
}

export function DtcCard({ title, dtcs, activeStatus, activeLabel, emptyMessage }: DtcCardProps) {
  const badge =
    dtcs.length === 0 ? (
      <StatusBadge status="pass" label="Clear" />
    ) : (
      <StatusBadge status={activeStatus} label={activeLabel(dtcs.length)} />
    )

  return (
    <Card title={title} badge={badge}>
      <CardBody>
        {dtcs.length === 0 ? (
          <p>{emptyMessage}</p>
        ) : (
          dtcs.map((dtc) => (
            <div key={dtc.code} className="mb-4 last:mb-0">
              <p>
                <span className="font-bold text-text tracking-[0.02em]">{dtc.code}</span>
                <span className="text-text-mid"> — {dtc.info.description}</span>
              </p>
              {dtc.info.gt86Context && (
                <ContextBlock label="GT86 Context">{dtc.info.gt86Context}</ContextBlock>
              )}
            </div>
          ))
        )}
      </CardBody>
    </Card>
  )
}
