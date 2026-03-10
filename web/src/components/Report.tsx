import type { Report as ReportData } from '@/knowledge'
import { Scorecard } from './Scorecard'
import { VehicleDetailsCard } from './VehicleDetailsCard'
import { MileageHistoryCard } from './MileageHistoryCard'
import { MotHistoryCard } from './MotHistoryCard'
import { FaultCodesCard } from './FaultCodesCard'
import { PendingCodesCard } from './PendingCodesCard'
import { ReadinessCard } from './ReadinessCard'
import { VitalsCard } from './VitalsCard'

interface ReportProps {
  report: ReportData
}

export function Report({ report }: ReportProps) {
  return (
    <div>
      <div className="flex justify-between items-start mb-5">
        <h1 className="text-[20px] font-bold tracking-tight">Health Report</h1>
        {report.vin && (
          <span className="text-[11px] text-text-light tracking-[0.02em] pt-1">{report.vin}</span>
        )}
      </div>

      <Scorecard
        storedDtcs={report.storedDtcs}
        pendingDtcs={report.pendingDtcs}
        readiness={report.readiness}
        dvla={report.dvla}
        mileage={report.mileage}
      />

      {report.dvla && <VehicleDetailsCard vehicle={report.dvla.vehicle} />}
      {report.dvla && report.mileage && (
        <MileageHistoryCard motHistory={report.dvla.motHistory} analysis={report.mileage} />
      )}
      {report.dvla && <MotHistoryCard motHistory={report.dvla.motHistory} />}

      <FaultCodesCard dtcs={report.storedDtcs} />
      <PendingCodesCard dtcs={report.pendingDtcs} />
      {report.readiness && <ReadinessCard readiness={report.readiness} />}
      {report.readings.length > 0 && <VitalsCard readings={report.readings} />}

      <div className="mt-6 text-center text-[11px] text-text-light">
        GT86 Toolkit
      </div>
    </div>
  )
}
