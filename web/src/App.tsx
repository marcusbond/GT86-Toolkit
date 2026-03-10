import { useState, useEffect, useCallback } from 'react'
import { MockConnection } from '@/connection'
import type { ScenarioName } from '@/connection'
import { runScan } from './scan'
import { Report } from '@/components/Report'
import type { Report as ReportData } from '@/knowledge'

const SCENARIOS: ScenarioName[] = ['clean', 'modified', 'suspect', 'rough']

export function App() {
  const [scenario, setScenario] = useState<ScenarioName>('modified')
  const [report, setReport] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const scan = useCallback(async (name: ScenarioName) => {
    setReport(null)
    setError(null)
    try {
      const connection = new MockConnection(name)
      const result = await runScan(connection)
      setReport(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed')
    }
  }, [])

  useEffect(() => {
    scan(scenario)
  }, [scenario, scan])

  return (
    <div className="max-w-md mx-auto px-4 py-6 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-blue-600">
          GT86 Toolkit
        </div>
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value as ScenarioName)}
          className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500 bg-white"
        >
          {SCENARIOS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 font-semibold">Error: {error}</p>}

      {!report && !error && <p className="text-gray-400">Scanning...</p>}

      {report && <Report report={report} />}
    </div>
  )
}
