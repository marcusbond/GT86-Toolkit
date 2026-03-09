import type { PidResult } from './types'

function parseModeOneResponse(
  response: string,
  expectedPid: string,
): { ok: true; dataBytes: number[] } | { ok: false; error: string } {
  const trimmed = response.trim()

  if (trimmed === 'NO DATA' || trimmed === 'UNABLE TO CONNECT') {
    return { ok: false, error: trimmed }
  }

  const bytes = trimmed.split(' ')

  if (bytes[0] !== '41' || bytes[1] !== expectedPid) {
    return { ok: false, error: `Unexpected response: ${trimmed}` }
  }

  const dataBytes = bytes.slice(2).map((b) => parseInt(b, 16))
  if (dataBytes.some(isNaN)) {
    return { ok: false, error: `Invalid data bytes: ${trimmed}` }
  }

  return { ok: true, dataBytes }
}

export function parseCoolantTemp(response: string): PidResult {
  const result = parseModeOneResponse(response, '05')
  if (!result.ok) return result

  const value = result.dataBytes[0] - 40
  return {
    ok: true,
    reading: { pid: '05', name: 'Coolant temperature', value, unit: '°C' },
  }
}

export function parseBatteryVoltage(response: string): PidResult {
  const result = parseModeOneResponse(response, '42')
  if (!result.ok) return result

  const value = (result.dataBytes[0] * 256 + result.dataBytes[1]) / 1000
  return {
    ok: true,
    reading: { pid: '42', name: 'Battery voltage', value, unit: 'V' },
  }
}

export function parseFuelTrim(
  response: string,
  pid: string,
  name: string,
): PidResult {
  const result = parseModeOneResponse(response, pid)
  if (!result.ok) return result

  const value = ((result.dataBytes[0] - 128) * 100) / 128
  return {
    ok: true,
    reading: { pid, name, value: Math.round(value * 10) / 10, unit: '%' },
  }
}

export function parseShortFuelTrimBank1(response: string): PidResult {
  return parseFuelTrim(response, '06', 'Short term fuel trim (bank 1)')
}

export function parseLongFuelTrimBank1(response: string): PidResult {
  return parseFuelTrim(response, '07', 'Long term fuel trim (bank 1)')
}

export function parseShortFuelTrimBank2(response: string): PidResult {
  return parseFuelTrim(response, '08', 'Short term fuel trim (bank 2)')
}

export function parseLongFuelTrimBank2(response: string): PidResult {
  return parseFuelTrim(response, '09', 'Long term fuel trim (bank 2)')
}
