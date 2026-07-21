import type { ServerStatus as ServerStatusType } from '@/types/server'
import { cn } from '@/utils/cn'

interface ServerStatusProps {
  status: ServerStatusType
}

const config: Record<ServerStatusType, { label: string; dot: string }> = {
  online: { label: 'Online', dot: 'bg-status-online' },
  connecting: { label: 'Connecting...', dot: 'bg-status-warning animate-pulse' },
  offline: { label: 'Offline', dot: 'bg-status-offline' },
}

export function ServerStatus({ status }: ServerStatusProps) {
  const { label, dot } = config[status]

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-hover border border-surface-border">
      <span className={cn('w-2 h-2 rounded-full', dot)} />
      <span className={cn(
        'text-xs font-medium',
        status === 'online' && 'text-status-online',
        status === 'connecting' && 'text-status-warning',
        status === 'offline' && 'text-status-offline',
      )}>
        {label}
      </span>
    </div>
  )
}
