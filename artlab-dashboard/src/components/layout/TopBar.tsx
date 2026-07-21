import { useState, useEffect } from 'react'
import type { ServerStatus as ServerStatusType } from '@/types/server'
import type { SyncStatus } from '@/types/settings'
import { ServerStatus } from './ServerStatus'
import { SettingsModal } from './SettingsModal'
import { Settings } from 'lucide-react'
import { cn } from '@/utils/cn'
import { getSyncConfig, getSyncStatus, onSyncStatusChange } from '@/services/sync.service'

interface TopBarProps {
  status: ServerStatusType
  offline: boolean
}

const syncDot: Record<SyncStatus, string> = {
  connected: 'bg-status-online',
  connecting: 'bg-status-warning animate-pulse',
  disconnected: 'bg-status-offline',
}

export function TopBar({ status, offline }: TopBarProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus())
  const syncEnabled = getSyncConfig().enabled

  useEffect(() => {
    const unsub = onSyncStatusChange(setSyncStatus)
    return unsub
  }, [])

  return (
    <>
      <header className={cn(
        'h-12 border-b px-4 flex items-center justify-between shrink-0',
        'bg-surface-base border-surface-border',
      )}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-text-primary tracking-wide">ArtLab</span>
          {offline && (
            <span className="text-xs text-status-offline bg-status-offline/10 px-2 py-0.5 rounded">
              Backend no disponible
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {syncEnabled && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-hover">
              <span className={cn('w-1.5 h-1.5 rounded-full', syncDot[syncStatus])} />
              <span className="text-[10px] text-text-muted">
                {syncStatus === 'connected' ? 'Sync live' : syncStatus === 'connecting' ? 'Syncing...' : 'Sync off'}
              </span>
            </div>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <ServerStatus status={status} />
        </div>
      </header>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}
