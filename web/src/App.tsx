import { useState, useEffect } from 'react'
import { MockConnection } from '@/connection'
import { runScan } from './scan'
import { Report } from '@/components/Report'
import type { Report as ReportData } from '@/knowledge'

export function App() {
  const [report, setReport] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const connection = new MockConnection('clean')
    runScan(connection)
      .then(setReport)
      .catch((err) => setError(err instanceof Error ? err.message : 'Scan failed'))
  }, [])

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-md mx-auto p-6">
        <p className="text-gray-400">Scanning...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">
        GT86 Toolkit
      </div>
      <Report report={report} />
    </div>
  )
}
