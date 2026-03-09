import { describe, it, expect } from 'vitest'
import { parseStoredDtcs, parsePendingDtcs, decodeDtcBytes } from './parse-dtcs'

describe('decodeDtcBytes', () => {
  it('decodes P0420', () => {
    expect(decodeDtcBytes(0x04, 0x20)).toEqual({ code: 'P0420', category: 'P' })
  })

  it('decodes P0171', () => {
    expect(decodeDtcBytes(0x01, 0x71)).toEqual({ code: 'P0171', category: 'P' })
  })

  it('decodes P0301', () => {
    expect(decodeDtcBytes(0x03, 0x01)).toEqual({ code: 'P0301', category: 'P' })
  })

  it('decodes B0001', () => {
    expect(decodeDtcBytes(0xc0, 0x01)).toEqual({ code: 'B0001', category: 'B' })
  })

  it('decodes C0100', () => {
    expect(decodeDtcBytes(0x81, 0x00)).toEqual({ code: 'C0100', category: 'C' })
  })
})

describe('parseStoredDtcs', () => {
  it('parses no DTCs', () => {
    const result = parseStoredDtcs('43 00')
    expect(result).toEqual({ ok: true, dtcs: [] })
  })

  it('parses single DTC (P0420)', () => {
    const result = parseStoredDtcs('43 01 04 20')
    expect(result).toEqual({
      ok: true,
      dtcs: [{ code: 'P0420', category: 'P' }],
    })
  })

  it('parses multiple DTCs', () => {
    const result = parseStoredDtcs('43 03 04 20 01 71 03 01')
    expect(result).toEqual({
      ok: true,
      dtcs: [
        { code: 'P0420', category: 'P' },
        { code: 'P0171', category: 'P' },
        { code: 'P0301', category: 'P' },
      ],
    })
  })

  it('returns error for NO DATA', () => {
    const result = parseStoredDtcs('NO DATA')
    expect(result).toEqual({ ok: false, error: 'NO DATA' })
  })

  it('returns error for unexpected prefix', () => {
    const result = parseStoredDtcs('41 05 7B')
    expect(result).toEqual({ ok: false, error: 'Unexpected response: 41 05 7B' })
  })

  it('returns error for truncated response', () => {
    const result = parseStoredDtcs('43 02 04 20')
    expect(result).toEqual({ ok: false, error: 'Expected 2 DTCs but got 1' })
  })
})

describe('parsePendingDtcs', () => {
  it('parses no pending DTCs', () => {
    const result = parsePendingDtcs('47 00')
    expect(result).toEqual({ ok: true, dtcs: [] })
  })

  it('parses pending P0420', () => {
    const result = parsePendingDtcs('47 01 04 20')
    expect(result).toEqual({
      ok: true,
      dtcs: [{ code: 'P0420', category: 'P' }],
    })
  })

  it('returns error for NO DATA', () => {
    const result = parsePendingDtcs('NO DATA')
    expect(result).toEqual({ ok: false, error: 'NO DATA' })
  })
})
