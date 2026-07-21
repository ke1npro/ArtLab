export type PipelineType = 't2i' | 'ti2i'
export type SyncStatus = 'connected' | 'connecting' | 'disconnected'
export type SyncMode = 'polling' | 'websocket'

export interface SyncConfig {
  webhookUrl: string
  enabled: boolean
  mode: SyncMode
  lastSyncAt: number | null
}

export interface ModelInfo {
  id: string
  name: string
  type: 'sdxl' | 'vae' | 'llm' | 'lora' | 'refiner'
  path: string
  size: number
  status: 'loaded' | 'unloaded' | 'downloading' | 'error'
}

export interface SystemResources {
  ram: { total: number; used: number }
  vram: { total: number; used: number }
  disk: { total: number; used: number }
}

export interface LLMParams {
  model: string
  temperature: number
  topP: number
  topK: number
  maxTokens: number
  contextSize: number
  frequencyPenalty: number
  presencePenalty: number
}

export interface GenDefaults {
  pipeline: PipelineType
  cfg: number
  steps: number
  width: number
  height: number
  sampler: string
  ti2iStrength: number
}

export interface LogEntry {
  timestamp: number
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
}
