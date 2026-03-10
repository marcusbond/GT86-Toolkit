import type { Connection } from './types'
import { AT_RESPONSES, scenarios } from './scenarios'
import type { ScenarioName, ScenarioData } from './scenarios'

export class MockConnection implements Connection {
  private connected = false
  private scenario: ScenarioData
  private delay: number

  constructor(scenarioName: ScenarioName = 'clean', delay = 0) {
    this.scenario = scenarios[scenarioName]
    this.delay = delay
  }

  private async wait(): Promise<void> {
    if (this.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delay))
    }
  }

  async connect(): Promise<void> {
    await this.wait()
    this.connected = true
  }

  async send(command: string): Promise<string> {
    if (!this.connected) {
      throw new Error('Not connected')
    }

    const trimmed = command.trim().toUpperCase()

    const atResponse = AT_RESPONSES[trimmed]
    if (atResponse !== undefined) {
      return atResponse
    }

    const obdCommand = command.trim()
    const response = this.scenario[obdCommand]
    if (response !== undefined) {
      await this.wait()
      return response
    }

    return 'NO DATA'
  }

  async disconnect(): Promise<void> {
    await this.wait()
    this.connected = false
  }

  isConnected(): boolean {
    return this.connected
  }
}
