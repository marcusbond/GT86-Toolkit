import { useState, useCallback } from 'react'
import { MockConnection } from '@/connection'
import type { ScenarioName } from '@/connection'
import { runScan } from './scan'
import type { ScanProgress } from './scan'
import { Report } from '@/components/Report'
import { ConnectScreen } from '@/components/ConnectScreen'
import { ScanScreen } from '@/components/ScanScreen'
import type { Report as ReportData } from '@/knowledge'

type Screen = 'connect' | 'scanning' | 'report' | 'error'

const SCENARIOS: ScenarioName[] = ['clean', 'modified', 'suspect', 'rough']

export function App() {
  const [screen, setScreen] = useState<Screen>('connect')
  const [scenario, setScenario] = useState<ScenarioName>('modified')
  const [report, setReport] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<ScanProgress>({ step: 'Connecting…', percent: 0 })

  const startScan = useCallback(
    async (scenarioOverride?: ScenarioName) => {
      const target = scenarioOverride ?? scenario
      setScreen('scanning')
      setProgress({ step: 'Connecting to vehicle…', percent: 0 })
      setError(null)

      try {
        const delay = import.meta.env.MODE === 'test' ? 0 : 400
        const connection = new MockConnection(target, delay)
        const result = await runScan(connection, setProgress, target)
        setReport(result)
        setScreen('report')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Scan failed')
        setScreen('error')
      }
    },
    [scenario],
  )

  const resetToConnect = useCallback(() => {
    setScreen('connect')
    setReport(null)
    setError(null)
  }, [])

  return (
    <div className="max-w-md mx-auto px-4 py-6 font-sans">
      {/* Dev-only scenario picker */}
      <div className="flex items-center justify-end mb-4">
        <select
          value={scenario}
          onChange={(e) => {
            const next = e.target.value as ScenarioName
            setScenario(next)
            if (screen === 'report') {
              startScan(next)
            }
          }}
          className="text-xs border border-border rounded px-2 py-1 text-text-light bg-white"
        >
          {SCENARIOS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {screen === 'connect' && <ConnectScreen onConnect={startScan} />}

      {screen === 'scanning' && <ScanScreen progress={progress} />}

      {screen === 'report' && report && (
        <div>
          <Report report={report} />
          <button
            onClick={resetToConnect}
            className="mt-4 w-full py-3 text-[13px] font-semibold text-text-mid border border-border rounded cursor-pointer bg-surface transition-colors hover:bg-bg"
          >
            Scan another car
          </button>
        </div>
      )}

      {screen === 'error' && (
        <div className="text-center mt-[100px]">
          <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-accent mb-4 text-left">
            GT86 Toolkit
          </div>
          <h2 className="text-[18px] font-semibold mb-2 text-fail">Scan failed</h2>
          <p className="text-[14px] text-text-mid mb-6">{error}</p>
          <button
            onClick={resetToConnect}
            className="py-3 px-8 text-[14px] font-semibold bg-text text-white border-none rounded cursor-pointer transition-colors hover:bg-[#333] font-sans"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
