const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface ApiConfig {
  baseUrl: string
}

let config: ApiConfig = { baseUrl: API_BASE }

export function setApiConfig(newConfig: Partial<ApiConfig>) {
  config = { ...config, ...newConfig }
}

export function getApiConfig() {
  return config
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${config.baseUrl}${path}`)
  if (!res.ok) throw new Error(`API GET ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API POST ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiHealthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${config.baseUrl}/health`, { signal: AbortSignal.timeout(3000) })
    return res.ok
  } catch {
    return false
  }
}
