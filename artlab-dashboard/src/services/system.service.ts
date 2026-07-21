import type { SystemResources, ModelInfo, LogEntry } from '@/types/settings'
import { apiGet, apiPost } from './api'

export async function getSystemResources(): Promise<SystemResources> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    return {
      ram: { total: 16, used: 7.2 + Math.random() * 2 },
      vram: { total: 24, used: 8.2 + Math.random() * 1 },
      disk: { total: 100, used: 34 + Math.random() * 0.5 },
    }
  }
  return apiGet<SystemResources>('/system')
}

export async function getModels(): Promise<ModelInfo[]> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    return [
      { id: 'sdxl', name: 'SDXL (BalancedAllInOnePhotorealAnime_v10)', type: 'sdxl', path: '/models/BalancedAllInOnePhotorealAnime_v10.safetensors', size: 6.46, status: 'unloaded' },
      { id: 'qwen', name: 'Qwen3.5-9B Q4_K_M (Uncensored)', type: 'llm', path: 'HF: HauhauCS/Qwen3.5-9B-Uncensored-HauhauCS-Aggressive', size: 5.3, status: 'unloaded' },
    ]
  }
  return apiGet<ModelInfo[]>('/models')
}

export async function loadModel(modelId: string, force = false): Promise<void> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000))
    return
  }
  await apiPost(`/models/${modelId}/load?force=${force}`, {})
}

export async function unloadModel(modelId: string): Promise<void> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise((r) => setTimeout(r, 500))
    return
  }
  await apiPost(`/models/${modelId}/unload`, {})
}

export async function getLogs(): Promise<LogEntry[]> {
  return [
    { timestamp: Date.now() - 3000, level: 'success', message: '✅ SDXL 1.0 loaded (custom.safetensors)' },
    { timestamp: Date.now() - 6000, level: 'info', message: '📦 Loading SDXL base model...' },
    { timestamp: Date.now() - 9000, level: 'info', message: '🔌 Connecting to backend...' },
    { timestamp: Date.now() - 12000, level: 'success', message: '🟢 Server ready — pipeline initialized' },
  ]
}
