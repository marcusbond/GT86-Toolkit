import { describe, it, expect } from 'vitest'
import { MockConnection } from './mock'

describe('MockConnection', () => {
  it('starts disconnected', () => {
    const conn = new MockConnection()
    expect(conn.isConnected()).toBe(false)
  })

  it('connects and disconnects', async () => {
    const conn = new MockConnection()
    await conn.connect()
    expect(conn.isConnected()).toBe(true)
    await conn.disconnect()
    expect(conn.isConnected()).toBe(false)
  })

  it('throws when sending before connecting', async () => {
    const conn = new MockConnection()
    await expect(conn.send('01 05')).rejects.toThrow('Not connected')
  })

  it('responds to AT commands', async () => {
    const conn = new MockConnection()
    await conn.connect()
    expect(await conn.send('ATZ')).toBe('ELM327 v1.5')
    expect(await conn.send('ATE0')).toBe('OK')
    expect(await conn.send('ATSP6')).toBe('OK')
  })

  it('handles AT commands case-insensitively', async () => {
    const conn = new MockConnection()
    await conn.connect()
    expect(await conn.send('atz')).toBe('ELM327 v1.5')
    expect(await conn.send('ate0')).toBe('OK')
  })

  it('returns NO DATA for unknown commands', async () => {
    const conn = new MockConnection()
    await conn.connect()
    expect(await conn.send('01 FF')).toBe('NO DATA')
  })

  describe('clean scenario', () => {
    it('returns no stored DTCs', async () => {
      const conn = new MockConnection('clean')
      await conn.connect()
      expect(await conn.send('03')).toBe('43 00')
    })

    it('returns no pending DTCs', async () => {
      const conn = new MockConnection('clean')
      await conn.connect()
      expect(await conn.send('07')).toBe('47 00')
    })

    it('returns readiness with MIL off and all monitors complete', async () => {
      const conn = new MockConnection('clean')
      await conn.connect()
      expect(await conn.send('01 01')).toBe('41 01 00 07 E1 00')
    })

    it('returns coolant temp', async () => {
      const conn = new MockConnection('clean')
      await conn.connect()
      expect(await conn.send('01 05')).toBe('41 05 7B')
    })

    it('returns fuel trims', async () => {
      const conn = new MockConnection('clean')
      await conn.connect()
      expect(await conn.send('01 06')).toBe('41 06 82')
      expect(await conn.send('01 07')).toBe('41 07 7D')
      expect(await conn.send('01 08')).toBe('41 08 81')
      expect(await conn.send('01 09')).toBe('41 09 7F')
    })

    it('returns battery voltage', async () => {
      const conn = new MockConnection('clean')
      await conn.connect()
      expect(await conn.send('01 42')).toBe('41 42 38 A4')
    })

    it('returns VIN', async () => {
      const conn = new MockConnection('clean')
      await conn.connect()
      const response = await conn.send('09 02')
      expect(response).toMatch(/^49 02 01/)
    })
  })

  describe('modified scenario', () => {
    it('returns P0420 as stored DTC', async () => {
      const conn = new MockConnection('modified')
      await conn.connect()
      expect(await conn.send('03')).toBe('43 01 04 20')
    })

    it('returns MIL on with 1 DTC', async () => {
      const conn = new MockConnection('modified')
      await conn.connect()
      const response = await conn.send('01 01')
      expect(response).toBe('41 01 81 07 E1 00')
    })
  })

  describe('suspect scenario', () => {
    it('returns no stored DTCs (cleared)', async () => {
      const conn = new MockConnection('suspect')
      await conn.connect()
      expect(await conn.send('03')).toBe('43 00')
    })

    it('returns pending P0420 (coming back)', async () => {
      const conn = new MockConnection('suspect')
      await conn.connect()
      expect(await conn.send('07')).toBe('47 01 04 20')
    })

    it('returns incomplete monitors', async () => {
      const conn = new MockConnection('suspect')
      await conn.connect()
      const response = await conn.send('01 01')
      expect(response).toBe('41 01 00 07 E1 E1')
    })
  })

  describe('rough scenario', () => {
    it('returns multiple stored DTCs', async () => {
      const conn = new MockConnection('rough')
      await conn.connect()
      expect(await conn.send('03')).toBe('43 03 04 20 01 71 03 01')
    })

    it('returns overheating coolant', async () => {
      const conn = new MockConnection('rough')
      await conn.connect()
      expect(await conn.send('01 05')).toBe('41 05 9A')
    })

    it('returns low battery voltage', async () => {
      const conn = new MockConnection('rough')
      await conn.connect()
      expect(await conn.send('01 42')).toBe('41 42 2E E0')
    })
  })
})
