import { describe, it, expect } from 'vitest'
import { analyseMileage } from './mileage'
import type { MotTest } from './types'

function mot(date: string, mileage: number): MotTest {
  return { date, result: 'pass', mileage, advisories: [], failures: [] }
}

describe('analyseMileage', () => {
  it('returns consistent for steady mileage increase', () => {
    const history = [
      mot('28 Oct 2025', 67430),
      mot('30 Oct 2024', 59812),
      mot('1 Nov 2023', 52105),
      mot('28 Oct 2022', 44290),
      mot('2 Nov 2021', 36800),
    ]

    const result = analyseMileage(history)

    expect(result.status).toBe('consistent')
    expect(result.anomalies).toHaveLength(0)
    expect(result.latestMileage).toBe(67430)
    expect(result.totalTests).toBe(5)
    expect(result.averagePerYear).toBeGreaterThan(0)
  })

  it('detects mileage rollback', () => {
    const history = [
      mot('10 Jul 2025', 48200),
      mot('12 Jul 2024', 45900),
      mot('8 Jul 2023', 52100), // higher than 2024 = rollback
      mot('15 Jul 2022', 44800),
    ]

    const result = analyseMileage(history)

    expect(result.status).toBe('anomaly')
    expect(result.anomalies).toHaveLength(1)
    expect(result.anomalies[0].type).toBe('rollback')
    expect(result.anomalies[0].fromMileage).toBe(52100)
    expect(result.anomalies[0].toMileage).toBe(45900)
  })

  it('detects excessive mileage in a single period', () => {
    const history = [
      mot('1 Oct 2025', 80000),
      mot('1 Oct 2024', 55000), // 25k in one year
      mot('1 Oct 2023', 50000),
    ]

    const result = analyseMileage(history)

    expect(result.status).toBe('anomaly')
    expect(result.anomalies).toHaveLength(1)
    expect(result.anomalies[0].type).toBe('excessive')
  })

  it('does not flag normal mileage as excessive', () => {
    const history = [
      mot('1 Oct 2025', 30000),
      mot('1 Oct 2024', 20000), // 10k in one year — normal
      mot('1 Oct 2023', 10000),
    ]

    const result = analyseMileage(history)

    expect(result.status).toBe('consistent')
    expect(result.anomalies).toHaveLength(0)
  })

  it('handles single MOT entry', () => {
    const history = [mot('28 Oct 2025', 67430)]

    const result = analyseMileage(history)

    expect(result.status).toBe('consistent')
    expect(result.latestMileage).toBe(67430)
    expect(result.summary).toContain('Not enough history')
  })

  it('handles empty history', () => {
    const result = analyseMileage([])

    expect(result.status).toBe('consistent')
    expect(result.latestMileage).toBe(0)
    expect(result.totalTests).toBe(0)
    expect(result.summary).toContain('No MOT history')
  })

  it('detects multiple anomalies', () => {
    const history = [
      mot('1 Oct 2025', 30000),
      mot('1 Oct 2024', 35000), // rollback (higher in 2024 than 2025)
      mot('1 Oct 2023', 10000),
    ]

    const result = analyseMileage(history)

    expect(result.status).toBe('anomaly')
    expect(result.anomalies.length).toBeGreaterThanOrEqual(1)
    expect(result.anomalies.some((a) => a.type === 'rollback')).toBe(true)
  })

  it('includes average per year in summary for consistent history', () => {
    const history = [
      mot('28 Oct 2025', 60000),
      mot('30 Oct 2024', 50000),
      mot('1 Nov 2023', 40000),
    ]

    const result = analyseMileage(history)

    expect(result.summary).toContain('60,000')
    expect(result.summary).toContain('/year')
    expect(result.averagePerYear).toBeGreaterThan(0)
  })

  it('works with the suspect scenario data (rollback pattern)', () => {
    // From mock.ts suspect scenario — mileage goes 52100 → 45900 (rollback)
    const history = [
      mot('10 Jul 2025', 48200),
      mot('12 Jul 2024', 45900),
      mot('8 Jul 2023', 52100),
      mot('15 Jul 2022', 44800),
      mot('20 Jul 2021', 38200),
      mot('22 Jul 2020', 31400),
      mot('18 Jul 2019', 24500),
      mot('12 Jul 2018', 17200),
    ]

    const result = analyseMileage(history)

    expect(result.status).toBe('anomaly')
    expect(result.anomalies).toHaveLength(1)
    expect(result.anomalies[0].type).toBe('rollback')
    expect(result.summary).toContain('anomal')
  })
})
