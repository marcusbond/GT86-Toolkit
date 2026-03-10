import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { App } from './App'

async function scanAndWaitForReport() {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByText('Connect and scan'))
  await waitFor(() => {
    expect(screen.getByText('Health Report')).toBeInTheDocument()
  })
  return user
}

describe('App', () => {
  it('starts on the connect screen', () => {
    render(<App />)
    expect(screen.getByText('Connect and scan')).toBeInTheDocument()
    expect(screen.getByText(/Pre-purchase/)).toBeInTheDocument()
  })

  it('transitions from connect to report after clicking connect', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByText('Connect and scan'))
    await waitFor(() => {
      expect(screen.getByText('Health Report')).toBeInTheDocument()
    })
    expect(screen.queryByText('Connect and scan')).not.toBeInTheDocument()
  })

  it('renders the health report after scan', async () => {
    await scanAndWaitForReport()
  })

  it('shows the VIN', async () => {
    await scanAndWaitForReport()
    expect(screen.getByText('JF1ZNAA12E2345678')).toBeInTheDocument()
  })

  it('shows vehicle history tab by default', async () => {
    await scanAndWaitForReport()
    expect(screen.getByText('Vehicle Details')).toBeInTheDocument()
    expect(screen.getByText('Mileage History')).toBeInTheDocument()
    expect(screen.getByText('MOT History')).toBeInTheDocument()
  })

  it('shows diagnostics cards after switching tab', async () => {
    const user = await scanAndWaitForReport()
    await user.click(screen.getByText('Live Diagnostics'))
    expect(screen.getByText('Fault Codes')).toBeInTheDocument()
    expect(screen.getByText('Readiness Monitors')).toBeInTheDocument()
    expect(screen.getByText('Engine Vitals')).toBeInTheDocument()
  })

  it('can return to connect screen after report', async () => {
    const user = await scanAndWaitForReport()
    await user.click(screen.getByText('Scan another car'))
    expect(screen.getByText('Connect and scan')).toBeInTheDocument()
  })
})
