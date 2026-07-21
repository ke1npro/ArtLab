import { apiPost, apiGet } from './api'
import { loadState, saveState } from './storage.service'
import type { SyncConfig, SyncStatus } from '@/types/settings'

const SYNC_CONFIG_KEY = 'sync_config'
const DEFAULT_CONFIG: SyncConfig = {
  webhookUrl: '',
  enabled: false,
  mode: 'polling',
  lastSyncAt: null,
}

let ws: WebSocket | null = null
let statusListeners: ((s: SyncStatus) => void)[] = []
let dataListeners: ((data: string) => void)[] = []
let currentStatus: SyncStatus = 'disconnected'

function notifyStatus(s: SyncStatus) {
  currentStatus = s
  statusListeners.forEach((fn) => fn(s))
}

export function getSyncConfig(): SyncConfig {
  return loadState(SYNC_CONFIG_KEY, DEFAULT_CONFIG)
}

export function saveSyncConfig(config: Partial<SyncConfig>) {
  const current = getSyncConfig()
  saveState(SYNC_CONFIG_KEY, { ...current, ...config })
  return getSyncConfig()
}

export function getSyncStatus(): SyncStatus {
  return currentStatus
}

export function onSyncStatusChange(fn: (s: SyncStatus) => void) {
  statusListeners.push(fn)
  return () => { statusListeners = statusListeners.filter((f) => f !== fn) }
}

export function onSyncData(fn: (data: string) => void) {
  dataListeners.push(fn)
  return () => { dataListeners = dataListeners.filter((f) => f !== fn) }
}

export async function pushState(appState: string): Promise<boolean> {
  const config = getSyncConfig()
  if (!config.enabled || !config.webhookUrl) return false

  notifyStatus('connecting')
  try {
    if (config.mode === 'polling') {
      await apiPost('/sync/push', { data: appState, timestamp: Date.now() })
    }
    notifyStatus('connected')
    saveSyncConfig({ lastSyncAt: Date.now() })
    return true
  } catch {
    notifyStatus('disconnected')
    return false
  }
}

export async function pullState(): Promise<string | null> {
  const config = getSyncConfig()
  if (!config.enabled || !config.webhookUrl) return null

  notifyStatus('connecting')
  try {
    if (config.mode === 'polling') {
      const res = await apiGet<{ data: string; timestamp: number }>('/sync/pull')
      notifyStatus('connected')
      return res.data
    }
    return null
  } catch {
    notifyStatus('disconnected')
    return null
  }
}

export function connectWebSocket(url: string) {
  disconnectWebSocket()

  if (!url) return
  notifyStatus('connecting')

  try {
    const wsUrl = url.replace(/^http/, 'ws') + '/sync/ws'
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      notifyStatus('connected')
      saveSyncConfig({ lastSyncAt: Date.now() })
    }

    ws.onmessage = (event) => {
      dataListeners.forEach((fn) => fn(event.data))
    }

    ws.onclose = () => {
      notifyStatus('disconnected')
      ws = null
    }

    ws.onerror = () => {
      notifyStatus('disconnected')
    }
  } catch {
    notifyStatus('disconnected')
  }
}

export function disconnectWebSocket() {
  if (ws) {
    ws.close()
    ws = null
  }
}

export function getPreferencesExport(): string {
  const keys = ['settings_llm', 'settings_gen', 'sync_config']
  const data: Record<string, unknown> = {}
  for (const key of keys) {
    const val = loadState(key, null)
    if (val !== null) data[key] = val
  }
  return JSON.stringify({
    version: 1,
    exportedAt: Date.now(),
    app: 'artlab-dashboard',
    type: 'preferences',
    data,
  }, null, 2)
}

export async function loadPreferencesToServer(json: string): Promise<boolean> {
  const config = getSyncConfig()
  if (!config.enabled || !config.webhookUrl) return false

  notifyStatus('connecting')
  try {
    await apiPost('/sync/preferences', { data: json })
    notifyStatus('connected')
    return true
  } catch {
    notifyStatus('disconnected')
    return false
  }
}
