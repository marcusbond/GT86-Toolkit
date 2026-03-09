import type { VinResult } from './types'

export function parseVin(response: string): VinResult {
  const trimmed = response.trim()

  if (trimmed === 'NO DATA' || trimmed === 'UNABLE TO CONNECT') {
    return { ok: false, error: trimmed }
  }

  const bytes = trimmed.split(' ')

  if (bytes[0] !== '49' || bytes[1] !== '02') {
    return { ok: false, error: `Unexpected response: ${trimmed}` }
  }

  // Skip prefix: 49 02 01, rest are ASCII bytes
  const asciiBytes = bytes.slice(3)
  if (asciiBytes.length < 17) {
    return { ok: false, error: `VIN too short: got ${asciiBytes.length} bytes, need 17` }
  }

  const chars = asciiBytes.slice(0, 17).map((b) => {
    const code = parseInt(b, 16)
    if (isNaN(code)) return null
    return String.fromCharCode(code)
  })

  if (chars.some((c) => c === null)) {
    return { ok: false, error: `Invalid VIN bytes: ${trimmed}` }
  }

  return { ok: true, vin: chars.join('') }
}
