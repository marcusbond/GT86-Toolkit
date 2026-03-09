import { describe, it, expect } from 'vitest'
import { parseVin } from './parse-vin'

describe('parseVin', () => {
  it('parses a GT86 VIN', () => {
    const response =
      '49 02 01 4A 46 31 5A 4E 41 41 31 32 45 32 33 34 35 36 37 38'
    const result = parseVin(response)
    expect(result).toEqual({ ok: true, vin: 'JF1ZNAA12E2345678' })
  })

  it('decodes ASCII bytes correctly', () => {
    // W = 57, P = 50, 0 = 30
    const response =
      '49 02 01 57 50 30 5A 5A 5A 39 39 5A 54 53 33 39 30 30 30 30'
    const result = parseVin(response)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.vin).toBe('WP0ZZZ99ZTS390000')
  })

  it('returns error for NO DATA', () => {
    expect(parseVin('NO DATA')).toEqual({ ok: false, error: 'NO DATA' })
  })

  it('returns error for wrong prefix', () => {
    const result = parseVin('41 05 7B')
    expect(result.ok).toBe(false)
  })

  it('returns error for too few bytes', () => {
    const result = parseVin('49 02 01 4A 46 31')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain('too short')
  })
})
