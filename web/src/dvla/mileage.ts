import type { MotTest, MileageAnalysis, MileageAnomaly } from './types'

const MAX_REASONABLE_MILES_PER_YEAR = 20000

export function analyseMileage(motHistory: MotTest[]): MileageAnalysis {
  // Need at least 2 tests to compare anything
  if (motHistory.length < 2) {
    const latest = motHistory[0]
    return {
      status: 'consistent',
      latestMileage: latest?.mileage ?? 0,
      averagePerYear: 0,
      totalTests: motHistory.length,
      anomalies: [],
      summary: motHistory.length === 0
        ? 'No MOT history available.'
        : `${formatMiles(latest.mileage)} recorded. Not enough history to check consistency.`,
    }
  }

  // MOT history comes newest-first. Work through consecutive pairs.
  const anomalies: MileageAnomaly[] = []

  for (let i = 0; i < motHistory.length - 1; i++) {
    const newer = motHistory[i]
    const older = motHistory[i + 1]
    const diff = newer.mileage - older.mileage

    if (diff < 0) {
      anomalies.push({
        fromDate: older.date,
        toDate: newer.date,
        fromMileage: older.mileage,
        toMileage: newer.mileage,
        type: 'rollback',
        description: `Mileage decreased from ${formatMiles(older.mileage)} to ${formatMiles(newer.mileage)}. Possible rollback.`,
      })
    } else {
      const yearsBetween = estimateYearsBetween(older.date, newer.date)
      if (yearsBetween > 0) {
        const milesPerYear = diff / yearsBetween
        if (milesPerYear > MAX_REASONABLE_MILES_PER_YEAR) {
          anomalies.push({
            fromDate: older.date,
            toDate: newer.date,
            fromMileage: older.mileage,
            toMileage: newer.mileage,
            type: 'excessive',
            description: `${formatMiles(diff)} added in ${yearsBetween.toFixed(1)} years (~${formatMiles(Math.round(milesPerYear))}/year). Unusually high.`,
          })
        }
      }
    }
  }

  const latest = motHistory[0]
  const oldest = motHistory[motHistory.length - 1]
  const totalYears = estimateYearsBetween(oldest.date, latest.date)
  const averagePerYear = totalYears > 0 ? Math.round(latest.mileage / totalYears) : 0

  const status = anomalies.length > 0 ? 'anomaly' : 'consistent'

  const summary = anomalies.length > 0
    ? `${formatMiles(latest.mileage)} recorded at last MOT. ${anomalies.length} mileage ${anomalies.length === 1 ? 'anomaly' : 'anomalies'} found — check the detail below.`
    : `${formatMiles(latest.mileage)} recorded at last MOT. Avg ~${formatMiles(averagePerYear)}/year. Steady increase, no gaps or rollbacks.`

  return {
    status,
    latestMileage: latest.mileage,
    averagePerYear,
    totalTests: motHistory.length,
    anomalies,
    summary,
  }
}

function formatMiles(miles: number): string {
  return miles.toLocaleString('en-GB')
}

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

function estimateYearsBetween(olderDate: string, newerDate: string): number {
  const parse = (d: string): Date => {
    // Format: "28 Oct 2025" or "1 Nov 2023"
    const parts = d.split(' ')
    const day = parseInt(parts[0], 10)
    const month = MONTHS[parts[1]] ?? 0
    const year = parseInt(parts[2], 10)
    return new Date(year, month, day)
  }

  const older = parse(olderDate)
  const newer = parse(newerDate)
  const diffMs = newer.getTime() - older.getTime()
  return diffMs / (1000 * 60 * 60 * 24 * 365.25)
}
