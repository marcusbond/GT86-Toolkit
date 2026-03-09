import { describe, it, expect } from 'vitest'
import {
  parseCoolantTemp,
  parseBatteryVoltage,
  parseShortFuelTrimBank1,
  parseLongFuelTrimBank1,
  parseShortFuelTrimBank2,
  parseLongFuelTrimBank2,
} from './parse-pids'

describe('parseCoolantTemp', () => {
  it('parses normal temp (83C)', () => {
    const result = parseCoolantTemp('41 05 7B')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBe(83)
    expect(result.reading.unit).toBe('°C')
  })

  it('parses overheating temp (114C)', () => {
    const result = parseCoolantTemp('41 05 9A')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBe(114)
  })

  it('parses cold engine (0C)', () => {
    const result = parseCoolantTemp('41 05 28')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBe(0)
  })

  it('returns error for NO DATA', () => {
    expect(parseCoolantTemp('NO DATA')).toEqual({ ok: false, error: 'NO DATA' })
  })
})

describe('parseBatteryVoltage', () => {
  it('parses charging voltage (14.5V)', () => {
    const result = parseBatteryVoltage('41 42 38 A4')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBeCloseTo(14.5, 1)
    expect(result.reading.unit).toBe('V')
  })

  it('parses low voltage (12.0V)', () => {
    const result = parseBatteryVoltage('41 42 2E E0')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBeCloseTo(12.0, 1)
  })

  it('returns error for NO DATA', () => {
    expect(parseBatteryVoltage('NO DATA')).toEqual({ ok: false, error: 'NO DATA' })
  })
})

describe('fuel trim parsers', () => {
  it('parses neutral trim (0%)', () => {
    const result = parseShortFuelTrimBank1('41 06 80')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBe(0)
    expect(result.reading.unit).toBe('%')
  })

  it('parses slightly positive trim (+1.6%)', () => {
    const result = parseShortFuelTrimBank1('41 06 82')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBeCloseTo(1.6, 0)
  })

  it('parses negative trim (-2.3%)', () => {
    const result = parseLongFuelTrimBank1('41 07 7D')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBeCloseTo(-2.3, 0)
  })

  it('parses high lean trim (+17.2%)', () => {
    const result = parseShortFuelTrimBank1('41 06 96')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBeCloseTo(17.2, 0)
  })

  it('parses bank 2 short term', () => {
    const result = parseShortFuelTrimBank2('41 08 81')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBeCloseTo(0.8, 0)
    expect(result.reading.name).toContain('bank 2')
  })

  it('parses bank 2 long term', () => {
    const result = parseLongFuelTrimBank2('41 09 7F')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.reading.value).toBeCloseTo(-0.8, 0)
  })

  it('returns error for NO DATA', () => {
    expect(parseShortFuelTrimBank1('NO DATA')).toEqual({ ok: false, error: 'NO DATA' })
  })

  it('returns error for wrong PID', () => {
    const result = parseShortFuelTrimBank1('41 05 7B')
    expect(result.ok).toBe(false)
  })
})
