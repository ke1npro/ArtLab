import { useState, useEffect } from 'react'
import { getSystemResources, getModels } from '@/services/system.service'
import { getApiConfig } from '@/services/api'
import type { SystemResources, ModelInfo } from '@/types/settings'

export function useSystemMonitor() {
  const [resources, setResources] = useState<SystemResources | null>(null)
  const [models, setModels] = useState<ModelInfo[]>([])
  const [serverOnline, setServerOnline] = useState(false)

  const refresh = async () => {
    try {
      const res = await fetch(`${getApiConfig().baseUrl}/health`, { signal: AbortSignal.timeout(3000) })
      if (res.ok) {
        setServerOnline(true)
        setResources(await getSystemResources())
        setModels(await getModels())
        return
      }
    } catch { /* ignora */ }
    setServerOnline(false)
    setResources(null)
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadedModels = models.filter((m) => m.status === 'loaded')

  return { resources, models, loadedModels, serverOnline }
}
