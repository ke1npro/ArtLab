import { useEffect, useState } from 'react'
import { getSystemResources, getModels } from '@/services/system.service'
import { loadModel, unloadModel } from '@/services/system.service'
import { getApiConfig } from '@/services/api'
import type { SystemResources, ModelInfo } from '@/types/settings'
import { Button } from '@/components/ui/Button'
import { HardDrive, MemoryStick, Cpu, Loader, Wifi, WifiOff } from 'lucide-react'

function Bar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = Math.min((used / total) * 100, 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-text-muted w-24 text-right shrink-0">{used.toFixed(1)}/{total.toFixed(1)} GB</span>
    </div>
  )
}

export function SystemPanel() {
  const [resources, setResources] = useState<SystemResources | null>(null)
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loadingModel, setLoadingModel] = useState<string | null>(null)
  const [loadLog, setLoadLog] = useState<string[]>([])
  const [serverOnline, setServerOnline] = useState(false)
  const isMock = import.meta.env.VITE_USE_MOCK !== 'false'

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

  const handleLoad = async (model: ModelInfo) => {
    setLoadingModel(model.id)
    setLoadLog((prev) => [...prev, `📦 Loading ${model.name}...`])
    try {
      await loadModel(model.id)
      setModels((prev) => prev.map((m) => m.id === model.id ? { ...m, status: 'loaded' } : m))
      setLoadLog((prev) => [...prev, `✅ ${model.name} loaded`])
    } catch {
      setLoadLog((prev) => [...prev, `❌ Failed to load ${model.name}`])
    } finally {
      setLoadingModel(null)
    }
  }

  const handleUnload = async (model: ModelInfo) => {
    setLoadingModel(model.id)
    try {
      await unloadModel(model.id)
      setModels((prev) => prev.map((m) => m.id === model.id ? { ...m, status: 'unloaded' } : m))
      setLoadLog((prev) => [...prev, `⏏️ ${model.name} unloaded`])
    } catch {
      setLoadLog((prev) => [...prev, `❌ Failed to unload ${model.name}`])
    } finally {
      setLoadingModel(null)
    }
  }

  const loadedModels = models.filter((m) => m.status === 'loaded')
  const isLive = serverOnline && !isMock

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-1">📊 Recursos del sistema</h3>
          <p className="text-xs text-text-muted mb-3">Monitoreo en vivo del servidor Colab</p>
        </div>

        {resources && (
          <div className="shrink-0 bg-surface-hover border border-surface-border rounded-lg px-3 py-2 text-[10px] leading-relaxed min-w-[140px]">
            <div className="flex items-center gap-1.5 mb-1">
              {serverOnline
                ? <><Wifi size={10} className="text-status-online" /><span className="text-status-online font-medium">Online</span></>
                : <><WifiOff size={10} className="text-status-offline" /><span className="text-status-offline font-medium">Offline</span></>
              }
              {isMock && <span className="text-text-muted ml-1">(Mock)</span>}
            </div>
            {loadedModels.length > 0 ? (
              loadedModels.map((m) => (
                <div key={m.id} className="text-text-secondary truncate max-w-[160px]">✓ {m.name}</div>
              ))
            ) : (
              <div className="text-text-muted">Sin modelos cargados</div>
            )}
            {resources && (
              <div className="text-text-muted mt-1 border-t border-surface-border pt-1">
                RAM {resources.ram.used.toFixed(1)}/{resources.ram.total.toFixed(1)} GB
                {resources.vram.total > 0 && ` · VRAM ${resources.vram.used.toFixed(1)}/${resources.vram.total.toFixed(1)} GB`}
              </div>
            )}
          </div>
        )}
      </div>

      {isLive && resources ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <MemoryStick size={14} /> RAM
          </div>
          <Bar used={resources.ram.used} total={resources.ram.total} color="bg-accent" />

          <div className="flex items-center gap-2 text-xs text-text-secondary mt-3">
            <Cpu size={14} /> VRAM
          </div>
          {resources.vram.total > 0 ? (
            <Bar used={resources.vram.used} total={resources.vram.total} color="bg-purple-500" />
          ) : (
            <p className="text-xs text-text-muted italic">No detectada (sin GPU)</p>
          )}

          <div className="flex items-center gap-2 text-xs text-text-secondary mt-3">
            <HardDrive size={14} /> Disco
          </div>
          <Bar used={resources.disk.used} total={resources.disk.total} color="bg-green-500" />
        </div>
      ) : (
        <div className="text-xs text-text-muted italic py-4 text-center border border-dashed border-surface-border rounded-lg">
          {isMock ? 'Conecta al servidor Colab para ver recursos reales' : 'Esperando datos del servidor...'}
        </div>
      )}

      <div className="border-t border-surface-border pt-4">
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
          🎯 Model Loader
        </h4>
        <div className="space-y-2">
          {models.map((model) => (
            <div key={model.id} className="flex items-center justify-between bg-surface-hover rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{model.name}</p>
                <p className="text-[10px] text-text-muted">
                  {model.type.toUpperCase()} &middot; {model.size} GB &middot; {model.path}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  model.status === 'loaded' ? 'bg-status-online/10 text-status-online' :
                  model.status === 'downloading' ? 'bg-status-warning/10 text-status-warning' :
                  'bg-surface-border text-text-muted'
                }`}>
                  {model.status === 'loaded' ? 'Loaded' : model.status === 'downloading' ? 'Downloading' : 'Unloaded'}
                </span>
                {model.status === 'loaded' ? (
                  <Button variant="ghost" size="sm" onClick={() => handleUnload(model)} disabled={loadingModel === model.id}>
                    {loadingModel === model.id ? <Loader size={12} className="animate-spin" /> : 'Unload'}
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => handleLoad(model)} disabled={loadingModel === model.id || !serverOnline}>
                    {loadingModel === model.id ? <Loader size={12} className="animate-spin" /> : 'Load'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {loadLog.length > 0 && (
        <div className="border-t border-surface-border pt-4">
          <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">📋 Carga resumida</h4>
          <div className="max-h-24 overflow-auto space-y-0.5">
            {loadLog.map((entry, i) => (
              <p key={i} className="text-[11px] font-mono text-text-secondary">{entry}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
