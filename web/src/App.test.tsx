import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the health report after scan', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Health Report')).toBeInTheDocument()
    })
  })

  it('shows the VIN', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('JF1ZNAA12E2345678')).toBeInTheDocument()
    })
  })

  it('shows fault codes card', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Fault Codes')).toBeInTheDocument()
    })
  })

  it('shows readiness monitors card', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Readiness Monitors')).toBeInTheDocument()
    })
  })

  it('shows engine vitals card', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Engine Vitals')).toBeInTheDocument()
    })
  })
})
