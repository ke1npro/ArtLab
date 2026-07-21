import type { SystemResources, ModelInfo, LogEntry } from '@/types/settings'
import { apiGet, apiPost } from './api'

export async function getSystemResources(): Promise<SystemResources> {
  return apiGet<SystemResources>('/system')
}

export async function getModels(): Promise<ModelInfo[]> {
  return apiGet<ModelInfo[]>('/models')
}

export async function loadModel(modelId: string, force = false): Promise<void> {
  await apiPost(`/models/${modelId}/load?force=${force}`, {})
}

export async function unloadModel(modelId: string): Promise<void> {
  await apiPost(`/models/${modelId}/unload`, {})
}

export async function getLogs(): Promise<LogEntry[]> {
  return apiGet<LogEntry[]>('/logs')
}
