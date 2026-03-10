import type { EnrichedDtc } from '@/knowledge'
import { Card, CardBody, ContextBlock } from './Card'
import { StatusBadge } from './StatusBadge'

interface FaultCodesCardProps {
  dtcs: EnrichedDtc[]
}

export function FaultCodesCard({ dtcs }: FaultCodesCardProps) {
  const badge =
    dtcs.length === 0 ? (
      <StatusBadge status="pass" label="Clear" />
    ) : (
      <StatusBadge status="fail" label={`${dtcs.length} found`} />
    )

  return (
    <Card title="Fault Codes" badge={badge}>
      <CardBody>
        {dtcs.length === 0 ? (
          <p>No fault codes stored. The engine management system has not detected any problems.</p>
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
