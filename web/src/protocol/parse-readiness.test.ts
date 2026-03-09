import { describe, it, expect } from 'vitest'
import { parseReadiness } from './parse-readiness'

describe('parseReadiness', () => {
  it('parses clean scenario — MIL off, all complete', () => {
    const result = parseReadiness('41 01 00 07 E1 00')
    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.readiness.milOn).toBe(false)
    expect(result.readiness.dtcCount).toBe(0)
    expect(result.readiness.monitors.every((m) => m.complete)).toBe(true)
  })

  it('parses modified scenario — MIL on, 1 DTC', () => {
    const result = parseReadiness('41 01 81 07 E1 00')
    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.readiness.milOn).toBe(true)
    expect(result.readiness.dtcCount).toBe(1)
    expect(result.readiness.monitors.every((m) => m.complete)).toBe(true)
  })

  it('parses suspect scenario — monitors incomplete', () => {
    const result = parseReadiness('41 01 00 07 E1 E1')
    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.readiness.milOn).toBe(false)
    expect(result.readiness.dtcCount).toBe(0)

    const incomplete = result.readiness.monitors.filter((m) => !m.complete)
    expect(incomplete.length).toBeGreaterThan(0)

    const catalyst = result.readiness.monitors.find((m) => m.name === 'Catalyst')
    expect(catalyst?.complete).toBe(false)
  })

  it('parses rough scenario — MIL on, 3 DTCs', () => {
    const result = parseReadiness('41 01 83 07 E1 00')
    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.readiness.milOn).toBe(true)
    expect(result.readiness.dtcCount).toBe(3)
  })

  it('identifies supported monitors', () => {
    // E1 = 1110 0001 → bits 0,5,6,7 set → Catalyst, Oxygen sensor, Oxygen sensor heater, EGR
    const result = parseReadiness('41 01 00 07 E1 00')
    expect(result.ok).toBe(true)
    if (!result.ok) return

    const names = result.readiness.monitors.map((m) => m.name)
    expect(names).toContain('Catalyst')
    expect(names).toContain('Oxygen sensor')
    expect(names).toContain('Oxygen sensor heater')
    expect(names).toContain('EGR/VVT system')
    expect(names).not.toContain('Secondary air system')
  })

  it('returns error for NO DATA', () => {
    expect(parseReadiness('NO DATA')).toEqual({ ok: false, error: 'NO DATA' })
  })

  it('returns error for wrong prefix', () => {
    const result = parseReadiness('43 00')
    expect(result.ok).toBe(false)
  })

  it('returns error for incomplete response', () => {
    const result = parseReadiness('41 01 00')
    expect(result.ok).toBe(false)
  })
})
