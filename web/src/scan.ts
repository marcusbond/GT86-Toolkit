import type { Connection } from '@/connection'
import {
  parseStoredDtcs,
  parsePendingDtcs,
  parseReadiness,
  parseCoolantTemp,
  parseBatteryVoltage,
  parseShortFuelTrimBank1,
  parseLongFuelTrimBank1,
  parseShortFuelTrimBank2,
  parseLongFuelTrimBank2,
  parseVin,
} from '@/protocol'
import type { PidReading } from '@/protocol'
import { enrichDtcs, enrichReadiness, enrichReading } from '@/knowledge'
import type { Report } from '@/knowledge'

export interface ScanProgress {
  step: string
  percent: number
}

export async function runScan(
  connection: Connection,
  onProgress?: (progress: ScanProgress) => void,
): Promise<Report> {
  const report = (step: string, percent: number) => onProgress?.({ step, percent })

  report('Connecting to vehicle…', 10)
  await connection.connect()

  try {
    // Init sequence
    await connection.send('ATZ')
    await connection.send('ATE0')
    await connection.send('ATL0')
    await connection.send('ATH0')
    await connection.send('ATSP6')

    // VIN
    report('Reading vehicle info…', 30)
    const vinRaw = await connection.send('09 02')
    const vinResult = parseVin(vinRaw)
    const vin = vinResult.ok ? vinResult.vin : null

    // Stored DTCs
    report('Checking fault codes…', 50)
    const storedRaw = await connection.send('03')
    const storedResult = parseStoredDtcs(storedRaw)
    const storedDtcs = storedResult.ok ? enrichDtcs(storedResult.dtcs) : []

    // Pending DTCs
    const pendingRaw = await connection.send('07')
    const pendingResult = parsePendingDtcs(pendingRaw)
    const pendingDtcs = pendingResult.ok ? enrichDtcs(pendingResult.dtcs) : []

    // Readiness
    report('Running readiness checks…', 70)
    const readinessRaw = await connection.send('01 01')
    const readinessResult = parseReadiness(readinessRaw)
    const readiness = readinessResult.ok ? enrichReadiness(readinessResult.readiness) : null

    // PID readings
    report('Reading engine vitals…', 85)
    const pidCommands: {
      command: string
      parse: (response: string) => { ok: true; reading: PidReading } | { ok: false; error: string }
    }[] = [
      { command: '01 05', parse: parseCoolantTemp },
      { command: '01 42', parse: parseBatteryVoltage },
      { command: '01 06', parse: parseShortFuelTrimBank1 },
      { command: '01 07', parse: parseLongFuelTrimBank1 },
      { command: '01 08', parse: parseShortFuelTrimBank2 },
      { command: '01 09', parse: parseLongFuelTrimBank2 },
    ]

    const readings = []
    for (const { command, parse } of pidCommands) {
      const raw = await connection.send(command)
      const result = parse(raw)
      if (result.ok) {
        readings.push(enrichReading(result.reading))
      }
    }

    report('Complete', 100)
    return { vin, storedDtcs, pendingDtcs, readiness, readings }
  } finally {
    await connection.disconnect()
  }
}
