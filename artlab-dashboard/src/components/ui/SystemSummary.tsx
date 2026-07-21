import { Wifi, WifiOff } from 'lucide-react'
import type { SystemResources, ModelInfo } from '@/types/settings'

interface SystemSummaryProps {
  resources: SystemResources | null
  serverOnline: boolean
  loadedModels: ModelInfo[]
}

export function SystemSummary({ resources, serverOnline, loadedModels }: SystemSummaryProps) {
  if (!resources) return null

  return (
    <div className="shrink-0 bg-surface-hover border border-surface-border rounded-lg px-3 py-2 text-[10px] leading-relaxed min-w-[140px]">
      <div className="flex items-center gap-1.5 mb-1">
        {serverOnline
          ? <><Wifi size={10} className="text-status-online" /><span className="text-status-online font-medium">Online</span></>
          : <><WifiOff size={10} className="text-status-offline" /><span className="text-status-offline font-medium">Offline</span></>
        }
      </div>
      {loadedModels.length > 0 ? (
        loadedModels.map((m) => (
          <div key={m.id} className="text-text-secondary truncate max-w-[160px]">✓ {m.name}</div>
        ))
      ) : (
        <div className="text-text-muted">Sin modelos cargados</div>
      )}
      <div className="text-text-muted mt-1 border-t border-surface-border pt-1">
        RAM {resources.ram.used.toFixed(1)}/{resources.ram.total.toFixed(1)} GB
        {resources.vram.total > 0 && ` · VRAM ${resources.vram.used.toFixed(1)}/${resources.vram.total.toFixed(1)} GB`}
      </div>
    </div>
  )
}
