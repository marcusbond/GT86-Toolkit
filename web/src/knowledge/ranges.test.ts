import { describe, it, expect } from 'vitest'
import { checkRange } from './ranges'

describe('checkRange', () => {
  describe('coolant', () => {
    it('flags normal operating temp', () => {
      expect(checkRange('coolant', 83).status).toBe('normal')
    })

    it('flags cold engine as warning', () => {
      expect(checkRange('coolant', 65).status).toBe('warning')
    })

    it('flags overheating as critical', () => {
      expect(checkRange('coolant', 120).status).toBe('critical')
    })

    it('provides context for overheating', () => {
      const result = checkRange('coolant', 120)
      expect(result.message).toContain('Overheating')
    })
  })

  describe('batteryVoltage', () => {
    it('flags normal charging voltage', () => {
      expect(checkRange('batteryVoltage', 14.5).status).toBe('normal')
    })

    it('flags low voltage as warning', () => {
      expect(checkRange('batteryVoltage', 12.5).status).toBe('warning')
    })

    it('flags very low voltage as critical', () => {
      expect(checkRange('batteryVoltage', 11.5).status).toBe('critical')
    })
  })

  describe('fuelTrim', () => {
    it('flags normal trim', () => {
      expect(checkRange('fuelTrim', 2.0).status).toBe('normal')
    })

    it('flags slightly lean as warning', () => {
      expect(checkRange('fuelTrim', 12.0).status).toBe('warning')
    })

    it('flags very lean as critical', () => {
      expect(checkRange('fuelTrim', 17.0).status).toBe('critical')
    })

    it('flags slightly rich as warning', () => {
      expect(checkRange('fuelTrim', -12.0).status).toBe('warning')
    })

    it('flags very rich as critical', () => {
      expect(checkRange('fuelTrim', -16.0).status).toBe('critical')
    })

    it('provides context for lean condition', () => {
      const result = checkRange('fuelTrim', 17.0)
      expect(result.message).toContain('lean')
    })
  })

  describe('unknown PID', () => {
    it('returns normal for unknown PIDs', () => {
      expect(checkRange('unknown', 42).status).toBe('normal')
    })
  })
})
