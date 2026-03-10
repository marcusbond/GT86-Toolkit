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

export async function runScan(connection: Connection): Promise<Report> {
  await connection.connect()

  try {
    // Init sequence
    await connection.send('ATZ')
    await connection.send('ATE0')
    await connection.send('ATL0')
    await connection.send('ATH0')
    await connection.send('ATSP6')

    // VIN
    const vinRaw = await connection.send('09 02')
    const vinResult = parseVin(vinRaw)
    const vin = vinResult.ok ? vinResult.vin : null

    // Stored DTCs
    const storedRaw = await connection.send('03')
    const storedResult = parseStoredDtcs(storedRaw)
    const storedDtcs = storedResult.ok ? enrichDtcs(storedResult.dtcs) : []

    // Pending DTCs
    const pendingRaw = await connection.send('07')
    const pendingResult = parsePendingDtcs(pendingRaw)
    const pendingDtcs = pendingResult.ok ? enrichDtcs(pendingResult.dtcs) : []

    // Readiness
    const readinessRaw = await connection.send('01 01')
    const readinessResult = parseReadiness(readinessRaw)
    const readiness = readinessResult.ok ? enrichReadiness(readinessResult.readiness) : null

    // PID readings
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

    return { vin, storedDtcs, pendingDtcs, readiness, readings }
  } finally {
    await connection.disconnect()
  }
}
