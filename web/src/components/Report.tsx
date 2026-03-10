import { useState } from 'react'
import type { Report as ReportData } from '@/knowledge'
import { Scorecard } from './Scorecard'
import { VehicleDetailsCard } from './VehicleDetailsCard'
import { MileageHistoryCard } from './MileageHistoryCard'
import { MotHistoryCard } from './MotHistoryCard'
import { FaultCodesCard } from './FaultCodesCard'
import { PendingCodesCard } from './PendingCodesCard'
import { ReadinessCard } from './ReadinessCard'
import { VitalsCard } from './VitalsCard'

type Tab = 'history' | 'diagnostics'

interface ReportProps {
  report: ReportData
}

export function Report({ report }: ReportProps) {
  const [tab, setTab] = useState<Tab>('history')

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

      <div className="flex border-b-2 border-border mb-4">
        <TabButton label="Vehicle History" active={tab === 'history'} onClick={() => setTab('history')} />
        <TabButton label="Live Diagnostics" active={tab === 'diagnostics'} onClick={() => setTab('diagnostics')} />
      </div>

      {tab === 'history' && (
        <>
          {report.dvla && <VehicleDetailsCard vehicle={report.dvla.vehicle} />}
          {report.dvla && report.mileage && (
            <MileageHistoryCard motHistory={report.dvla.motHistory} analysis={report.mileage} />
          )}
          {report.dvla && <MotHistoryCard motHistory={report.dvla.motHistory} />}
        </>
      )}

      {tab === 'diagnostics' && (
        <>
          <FaultCodesCard dtcs={report.storedDtcs} />
          <PendingCodesCard dtcs={report.pendingDtcs} />
          {report.readiness && <ReadinessCard readiness={report.readiness} />}
          {report.readings.length > 0 && <VitalsCard readings={report.readings} />}
        </>
      )}

      <div className="mt-6 text-center text-[11px] text-text-light">
        GT86 Toolkit
      </div>
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 text-center text-[13px] font-semibold border-b-2 -mb-[2px] cursor-pointer transition-colors bg-transparent ${
        active
          ? 'text-text border-text'
          : 'text-text-light border-transparent hover:text-text-mid'
      }`}
    >
      {label}
    </button>
  )
}
