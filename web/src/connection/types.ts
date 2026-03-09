export interface Connection {
  connect(): Promise<void>
  send(command: string): Promise<string>
  disconnect(): Promise<void>
  isConnected(): boolean
}
