export type ServerStatus = 'online' | 'connecting' | 'offline'

export interface HealthResponse {
  status: ServerStatus
  model_loaded?: boolean
  queue_length?: number
}
