import type { EnrichedReadiness } from '@/knowledge'
import { Card, CardBody, ContextBlock } from './Card'
import { StatusBadge } from './StatusBadge'

interface ReadinessCardProps {
  readiness: EnrichedReadiness
}

export function ReadinessCard({ readiness }: ReadinessCardProps) {
  const complete = readiness.monitors.filter((m) => m.complete).length
  const total = readiness.monitors.length

  const badge = readiness.allComplete ? (
    <StatusBadge status="pass" label="Complete" />
  ) : (
    <StatusBadge status="warn" label="Incomplete" />
  )

  return (
    <Card title="Readiness Monitors" badge={badge}>
      <CardBody>
        <p className="mb-3">
          {complete} of {total} emissions monitors have completed.
          {readiness.incompleteCount > 0 && ` ${readiness.incompleteCount} outstanding.`}
        </p>

        {!readiness.allComplete && (
          <ContextBlock label="What this means">
            The car's self-tests haven't all run. This happens when the battery has been
            disconnected or someone has recently cleared fault codes. Ask the seller why.
          </ContextBlock>
        )}

        <div className="mt-3 border-t border-gray-200">
          {readiness.monitors.map((monitor) => (
            <div
              key={monitor.name}
              className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0 text-[13px]"
            >
              <span className="text-gray-500">{monitor.name}</span>
              <span
                className={`font-semibold ${monitor.complete ? 'text-green-600' : 'text-amber-600'}`}
              >
                {monitor.complete ? 'Complete' : 'Incomplete'}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
