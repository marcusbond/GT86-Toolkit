import type { DTC, DtcResult } from './types'

const CATEGORY_MAP: Record<number, DTC['category']> = {
  0: 'P',
  1: 'P',
  2: 'C',
  3: 'B',
}

const SECOND_DIGIT: Record<number, string> = {
  0: '0',
  1: '1',
  2: '2',
  3: '3',
}

export function decodeDtcBytes(byte1: number, byte2: number): DTC {
  const categoryBits = (byte1 >> 6) & 0x03
  const category = CATEGORY_MAP[categoryBits]
  const secondDigit = SECOND_DIGIT[(byte1 >> 4) & 0x03]
  const thirdDigit = ((byte1) & 0x0f).toString(16).toUpperCase()
  const fourthDigit = ((byte2 >> 4) & 0x0f).toString(16).toUpperCase()
  const fifthDigit = (byte2 & 0x0f).toString(16).toUpperCase()

  const code = `${category}${secondDigit}${thirdDigit}${fourthDigit}${fifthDigit}`
  return { code, category }
}

export function parseStoredDtcs(response: string): DtcResult {
  return parseDtcResponse(response, '43')
}

export function parsePendingDtcs(response: string): DtcResult {
  return parseDtcResponse(response, '47')
}

function parseDtcResponse(response: string, expectedPrefix: string): DtcResult {
  const trimmed = response.trim()

  if (trimmed === 'NO DATA' || trimmed === 'UNABLE TO CONNECT') {
    return { ok: false, error: trimmed }
  }

  const bytes = trimmed.split(' ')

  if (bytes[0] !== expectedPrefix) {
    return { ok: false, error: `Unexpected response: ${trimmed}` }
  }

  const count = parseInt(bytes[1], 16)
  if (isNaN(count)) {
    return { ok: false, error: `Invalid DTC count: ${bytes[1]}` }
  }

  if (count === 0) {
    return { ok: true, dtcs: [] }
  }

  const dtcBytes = bytes.slice(2)
  if (dtcBytes.length < count * 2) {
    return { ok: false, error: `Expected ${count} DTCs but got ${Math.floor(dtcBytes.length / 2)}` }
  }

  const dtcs: DTC[] = []
  for (let i = 0; i < count; i++) {
    const b1 = parseInt(dtcBytes[i * 2], 16)
    const b2 = parseInt(dtcBytes[i * 2 + 1], 16)
    if (isNaN(b1) || isNaN(b2)) {
      return { ok: false, error: `Invalid DTC bytes at position ${i}` }
    }
    dtcs.push(decodeDtcBytes(b1, b2))
  }

  return { ok: true, dtcs }
}
