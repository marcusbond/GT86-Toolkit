import type { EnrichedDtc } from '@/knowledge'
import { Card, CardBody, ContextBlock } from './Card'
import { StatusBadge } from './StatusBadge'

interface PendingCodesCardProps {
  dtcs: EnrichedDtc[]
}

export function PendingCodesCard({ dtcs }: PendingCodesCardProps) {
  const badge =
    dtcs.length === 0 ? (
      <StatusBadge status="pass" label="Clear" />
    ) : (
      <StatusBadge status="warn" label={`${dtcs.length} pending`} />
    )

  return (
    <Card title="Pending Codes" badge={badge}>
      <CardBody>
        {dtcs.length === 0 ? (
          <p>No faults developing. Nothing about to trigger a warning light.</p>
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
