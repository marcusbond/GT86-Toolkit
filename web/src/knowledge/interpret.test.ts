import { describe, it, expect } from 'vitest'
import { enrichDtcs, enrichReadiness, enrichReading } from './interpret'
import type { DTC, ReadinessMonitors, PidReading } from '@/protocol'

describe('enrichDtcs', () => {
  it('adds GT86 context to known codes', () => {
    const dtcs: DTC[] = [{ code: 'P0420', category: 'P' }]
    const enriched = enrichDtcs(dtcs)
    expect(enriched[0].info.gt86Context).toContain('aftermarket headers')
  })

  it('provides fallback for unknown codes', () => {
    const dtcs: DTC[] = [{ code: 'P9999', category: 'P' }]
    const enriched = enrichDtcs(dtcs)
    expect(enriched[0].info.gt86Context).toBeNull()
    expect(enriched[0].info.description).toContain('P9999')
  })

  it('handles empty array', () => {
    expect(enrichDtcs([])).toEqual([])
  })
})

describe('enrichReadiness', () => {
  it('reports all complete when no monitors are incomplete', () => {
    const readiness: ReadinessMonitors = {
      milOn: false,
      dtcCount: 0,
      monitors: [
        { name: 'Catalyst', supported: true, complete: true },
        { name: 'Oxygen sensor', supported: true, complete: true },
      ],
    }
    const enriched = enrichReadiness(readiness)
    expect(enriched.allComplete).toBe(true)
    expect(enriched.incompleteCount).toBe(0)
  })

  it('counts incomplete monitors', () => {
    const readiness: ReadinessMonitors = {
      milOn: false,
      dtcCount: 0,
      monitors: [
        { name: 'Catalyst', supported: true, complete: false },
        { name: 'Oxygen sensor', supported: true, complete: true },
        { name: 'EGR/VVT system', supported: true, complete: false },
      ],
    }
    const enriched = enrichReadiness(readiness)
    expect(enriched.allComplete).toBe(false)
    expect(enriched.incompleteCount).toBe(2)
  })

  it('adds context to monitors', () => {
    const readiness: ReadinessMonitors = {
      milOn: false,
      dtcCount: 0,
      monitors: [{ name: 'Catalyst', supported: true, complete: false }],
    }
    const enriched = enrichReadiness(readiness)
    expect(enriched.monitors[0].context.incompleteWarning).toContain('drive cycles')
  })
})

describe('enrichReading', () => {
  it('checks coolant temp against FA20 range', () => {
    const reading: PidReading = { pid: '05', name: 'Coolant temperature', value: 83, unit: '°C' }
    const enriched = enrichReading(reading)
    expect(enriched.range.status).toBe('normal')
  })

  it('flags overheating coolant', () => {
    const reading: PidReading = { pid: '05', name: 'Coolant temperature', value: 114, unit: '°C' }
    const enriched = enrichReading(reading)
    expect(enriched.range.status).toBe('warning')
  })

  it('checks battery voltage', () => {
    const reading: PidReading = { pid: '42', name: 'Battery voltage', value: 14.5, unit: 'V' }
    const enriched = enrichReading(reading)
    expect(enriched.range.status).toBe('normal')
  })

  it('flags low battery', () => {
    const reading: PidReading = { pid: '42', name: 'Battery voltage', value: 12.0, unit: 'V' }
    const enriched = enrichReading(reading)
    expect(enriched.range.status).toBe('warning')
  })

  it('checks fuel trims against FA20 range', () => {
    const reading: PidReading = { pid: '06', name: 'Short term fuel trim (bank 1)', value: 1.6, unit: '%' }
    const enriched = enrichReading(reading)
    expect(enriched.range.status).toBe('normal')
  })

  it('flags high fuel trims', () => {
    const reading: PidReading = { pid: '06', name: 'Short term fuel trim (bank 1)', value: 17.2, unit: '%' }
    const enriched = enrichReading(reading)
    expect(enriched.range.status).toBe('critical')
  })
})
