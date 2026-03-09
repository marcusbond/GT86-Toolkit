import type { ReadinessResult, Monitor } from './types'

const SPARK_MONITORS: { bit: number; name: string }[] = [
  { bit: 0, name: 'Catalyst' },
  { bit: 1, name: 'Heated catalyst' },
  { bit: 2, name: 'Evaporative system' },
  { bit: 3, name: 'Secondary air system' },
  { bit: 4, name: 'A/C refrigerant' },
  { bit: 5, name: 'Oxygen sensor' },
  { bit: 6, name: 'Oxygen sensor heater' },
  { bit: 7, name: 'EGR/VVT system' },
]

export function parseReadiness(response: string): ReadinessResult {
  const trimmed = response.trim()

  if (trimmed === 'NO DATA' || trimmed === 'UNABLE TO CONNECT') {
    return { ok: false, error: trimmed }
  }

  const bytes = trimmed.split(' ')

  if (bytes[0] !== '41' || bytes[1] !== '01') {
    return { ok: false, error: `Unexpected response: ${trimmed}` }
  }

  if (bytes.length < 6) {
    return { ok: false, error: `Incomplete readiness response: ${trimmed}` }
  }

  const a = parseInt(bytes[2], 16)
  const c = parseInt(bytes[4], 16)
  const d = parseInt(bytes[5], 16)

  if ([a, c, d].some(isNaN)) {
    return { ok: false, error: `Invalid readiness bytes: ${trimmed}` }
  }

  const milOn = (a & 0x80) !== 0
  const dtcCount = a & 0x7f

  const monitors: Monitor[] = []
  for (const { bit, name } of SPARK_MONITORS) {
    const supported = (c & (1 << bit)) !== 0
    if (supported) {
      const incomplete = (d & (1 << bit)) !== 0
      monitors.push({ name, supported: true, complete: !incomplete })
    }
  }

  return {
    ok: true,
    readiness: { milOn, dtcCount, monitors },
  }
}
