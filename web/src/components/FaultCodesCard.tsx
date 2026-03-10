import type { EnrichedDtc } from '@/knowledge'
import { DtcCard } from './DtcCard'

export function FaultCodesCard({ dtcs }: { dtcs: EnrichedDtc[] }) {
  return (
    <DtcCard
      title="Fault Codes"
      dtcs={dtcs}
      activeStatus="fail"
      activeLabel={(n) => `${n} found`}
      emptyMessage="No fault codes stored. The engine management system has not detected any problems."
    />
  )
}
