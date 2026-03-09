export interface DTC {
  code: string // e.g. "P0420"
  category: 'P' | 'C' | 'B' | 'U'
}

export interface ReadinessMonitors {
  milOn: boolean
  dtcCount: number
  monitors: Monitor[]
}

export interface Monitor {
  name: string
  supported: boolean
  complete: boolean
}

export interface PidReading {
  pid: string
  name: string
  value: number
  unit: string
}

export type VinResult =
  | { ok: true; vin: string }
  | { ok: false; error: string }

export type DtcResult =
  | { ok: true; dtcs: DTC[] }
  | { ok: false; error: string }

export type ReadinessResult =
  | { ok: true; readiness: ReadinessMonitors }
  | { ok: false; error: string }

export type PidResult =
  | { ok: true; reading: PidReading }
  | { ok: false; error: string }
