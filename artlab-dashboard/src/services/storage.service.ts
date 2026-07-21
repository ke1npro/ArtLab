const STORAGE_PREFIX = 'artlab_'

export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch {
    /* quota exceeded or private mode */
  }
}

export function removeState(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    /* no-op */
  }
}

export function exportAllData(): string {
  const data: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_PREFIX)) {
      data[key.slice(STORAGE_PREFIX.length)] = JSON.parse(localStorage.getItem(key)!)
    }
  }
  return JSON.stringify({ version: 1, exportedAt: Date.now(), app: 'artlab-dashboard', data }, null, 2)
}

export function importAllData(json: string): { ok: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(json)
    if (parsed.app !== 'artlab-dashboard') {
      return { ok: false, count: 0, error: 'Formato de archivo inválido' }
    }
    let count = 0
    for (const [key, value] of Object.entries(parsed.data)) {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
      count++
    }
    return { ok: true, count }
  } catch (e) {
    return { ok: false, count: 0, error: String(e) }
  }
}
