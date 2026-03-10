import type { DTC, ReadinessMonitors, PidReading } from '@/protocol'
import type { DvlaData, MileageAnalysis } from '@/dvla'
import { lookupFaultCode } from './fault-codes'
import type { FaultCodeInfo } from './fault-codes'
import { checkRange } from './ranges'
import type { RangeCheck } from './ranges'
import { getMonitorContext } from './monitors'
import type { MonitorContext } from './monitors'

export interface EnrichedDtc {
  code: string
  category: DTC['category']
  info: FaultCodeInfo
}

export interface EnrichedMonitor {
  name: string
  supported: boolean
  complete: boolean
  context: MonitorContext
}

export interface EnrichedReading {
  pid: string
  name: string
  value: number
  unit: string
  range: RangeCheck
}

export interface EnrichedReadiness {
  milOn: boolean
  dtcCount: number
  monitors: EnrichedMonitor[]
  allComplete: boolean
  incompleteCount: number
}

export interface Report {
  vin: string | null
  storedDtcs: EnrichedDtc[]
  pendingDtcs: EnrichedDtc[]
  readiness: EnrichedReadiness | null
  readings: EnrichedReading[]
  dvla: DvlaData | null
  mileage: MileageAnalysis | null
}

export function enrichDtcs(dtcs: DTC[]): EnrichedDtc[] {
  return dtcs.map((dtc) => ({
    code: dtc.code,
    category: dtc.category,
    info: lookupFaultCode(dtc.code),
  }))
}

export function enrichReadiness(readiness: ReadinessMonitors): EnrichedReadiness {
  const monitors = readiness.monitors.map((m) => ({
    ...m,
    context: getMonitorContext(m.name),
  }))

  const incompleteCount = monitors.filter((m) => !m.complete).length
  const allComplete = incompleteCount === 0

  return {
    milOn: readiness.milOn,
    dtcCount: readiness.dtcCount,
    monitors,
    allComplete,
    incompleteCount,
  }
}

const PID_RANGE_MAP: Record<string, string> = {
  '05': 'coolant',
  '42': 'batteryVoltage',
  '06': 'fuelTrim',
  '07': 'fuelTrim',
  '08': 'fuelTrim',
  '09': 'fuelTrim',
}

export function enrichReading(reading: PidReading): EnrichedReading {
  const rangeKey = PID_RANGE_MAP[reading.pid] ?? reading.pid
  return {
    ...reading,
    range: checkRange(rangeKey, reading.value),
  }
}
