import type { EnrichedDtc } from '@/knowledge'
import { DtcCard } from './DtcCard'

export function PendingCodesCard({ dtcs }: { dtcs: EnrichedDtc[] }) {
  return (
    <DtcCard
      title="Pending Codes"
      dtcs={dtcs}
      activeStatus="warn"
      activeLabel={(n) => `${n} pending`}
      emptyMessage="No faults developing. Nothing about to trigger a warning light."
    />
  )
}
