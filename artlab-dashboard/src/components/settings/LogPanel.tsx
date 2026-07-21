import { useEffect, useState } from 'react'
import { getLogs } from '@/services/system.service'
import type { LogEntry } from '@/types/settings'
import { cn } from '@/utils/cn'

const levelColor: Record<LogEntry['level'], string> = {
  info: 'text-blue-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
  success: 'text-green-400',
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function LogPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    getLogs().then(setLogs)
    const interval = setInterval(() => getLogs().then(setLogs), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">📋 Logs del backend</h3>
        <p className="text-xs text-text-muted mb-3">Registro de actividad del servidor Colab</p>
      </div>

      <div className="bg-surface-base border border-surface-border rounded-xl p-3 max-h-80 overflow-auto font-mono text-[11px] space-y-1">
        {logs.length === 0 ? (
          <p className="text-text-muted italic">No hay logs disponibles</p>
        ) : (
          [...logs].reverse().map((entry, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-text-muted shrink-0">{formatTime(entry.timestamp)}</span>
              <span className={cn(levelColor[entry.level])}>{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
