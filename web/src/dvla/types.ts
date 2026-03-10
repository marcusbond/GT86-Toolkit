export interface MotTest {
  date: string
  result: 'pass' | 'fail'
  mileage: number
  advisories: string[]
  failures: string[]
}

export interface VehicleDetails {
  registrationDate: string
  colour: string
  engine: string
  taxStatus: string
  taxDueDate: string | null
  motExpiry: string | null
}

export interface DvlaData {
  vehicle: VehicleDetails
  motHistory: MotTest[]
}

export interface MileageAnalysis {
  status: 'consistent' | 'anomaly'
  latestMileage: number
  averagePerYear: number
  totalTests: number
  anomalies: MileageAnomaly[]
  summary: string
}

export interface MileageAnomaly {
  fromDate: string
  toDate: string
  fromMileage: number
  toMileage: number
  type: 'rollback' | 'gap' | 'excessive'
  description: string
}
