import { useState, useEffect } from 'react'
import { AlertTriangle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { apiPost, getApiConfig } from '@/services/api'

interface HealthStatus {
  sdxl_loaded: boolean
  qwen_loaded: boolean
}

interface ModelLoadBannerProps {
  modelId: 'sdxl' | 'qwen'
  actionLabel: string
}

export function ModelLoadBanner({ modelId, actionLabel }: ModelLoadBannerProps) {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const isLoaded = health?.[modelId === 'sdxl' ? 'sdxl_loaded' : 'qwen_loaded']

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const { baseUrl } = getApiConfig()
        const url = import.meta.env.DEV ? '/health' : `${baseUrl}/health`
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
        if (res.ok) {
          setHealth(await res.json())
        }
      } catch { /* silencio */ }
    }
    fetchHealth()
    const interval = setInterval(fetchHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  if (health === null || isLoaded === undefined) {
    return null
  }

  if (isLoaded) {
    return null
  }

  const handleForceLoad = async () => {
    setLoading(true)
    try {
      await apiPost(`/models/${modelId}/load?force=true`, {})
    } catch { /* silencio */ }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
      <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
      <p className="text-text-secondary flex-1 min-w-0">
        <span className="font-medium text-text-primary capitalize">{modelId === 'sdxl' ? 'SDXL' : 'Qwen'}</span>
        {' '}no está cargado — se cargará automáticamente al {actionLabel}
        {modelId === 'qwen' ? ' (desconectará SDXL)' : ' (desconectará Qwen)'}
      </p>
      <Button size="sm" onClick={handleForceLoad} loading={loading} disabled={loading}>
        {loading ? <Loader size={12} /> : null}
        Forzar carga ahora
      </Button>
    </div>
  )
}
