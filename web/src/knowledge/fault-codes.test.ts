import { describe, it, expect } from 'vitest'
import { lookupFaultCode } from './fault-codes'

describe('lookupFaultCode', () => {
  it('returns GT86 context for P0420', () => {
    const info = lookupFaultCode('P0420')
    expect(info.description).toContain('Catalyst')
    expect(info.gt86Context).toContain('aftermarket headers')
  })

  it('returns GT86 context for P0171', () => {
    const info = lookupFaultCode('P0171')
    expect(info.description).toContain('lean')
    expect(info.gt86Context).toContain('Bank 1')
    expect(info.gt86Context).toContain('FA20')
  })

  it('returns GT86 context for misfire codes', () => {
    const info = lookupFaultCode('P0301')
    expect(info.description).toContain('Cylinder 1')
    expect(info.gt86Context).toContain('spark plugs')
  })

  it('returns generic fallback for unknown codes', () => {
    const info = lookupFaultCode('P9999')
    expect(info.description).toContain('P9999')
    expect(info.gt86Context).toBeNull()
  })
})
