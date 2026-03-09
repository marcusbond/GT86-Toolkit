import type { Connection } from './types'
import { AT_RESPONSES, scenarios } from './scenarios'
import type { ScenarioName, ScenarioData } from './scenarios'

export class MockConnection implements Connection {
  private connected = false
  private scenario: ScenarioData

  constructor(scenarioName: ScenarioName = 'clean') {
    this.scenario = scenarios[scenarioName]
  }

  async connect(): Promise<void> {
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
      return response
    }

    return 'NO DATA'
  }

  async disconnect(): Promise<void> {
    this.connected = false
  }

  isConnected(): boolean {
    return this.connected
  }
}
