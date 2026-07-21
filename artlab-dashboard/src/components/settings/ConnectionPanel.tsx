import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getApiConfig, setApiConfig, apiHealthCheck } from '@/services/api'
import { exportAllData, importAllData } from '@/services/storage.service'
import {
  getSyncConfig, saveSyncConfig, getSyncStatus, onSyncStatusChange,
  connectWebSocket, disconnectWebSocket,
  getPreferencesExport, loadPreferencesToServer,
} from '@/services/sync.service'
import type { SyncStatus } from '@/types/settings'
import { Wifi, WifiOff, Download, Upload, Check, AlertCircle, Loader, Globe } from 'lucide-react'
import { cn } from '@/utils/cn'

const syncLabels: Record<SyncStatus, { text: string; color: string }> = {
  connected: { text: 'Synced', color: 'text-status-online' },
  connecting: { text: 'Syncing...', color: 'text-status-warning' },
  disconnected: { text: 'Disconnected', color: 'text-status-offline' },
}

export function ConnectionPanel() {
  const [url, setUrl] = useState(getApiConfig().baseUrl.replace(/\/+$/, ''))
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [latency, setLatency] = useState(0)
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [prefMsg, setPrefMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [syncConfig, setSyncConfig] = useState(getSyncConfig)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const prefFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsub = onSyncStatusChange(setSyncStatus)
    return unsub
  }, [])

  const normalizeUrl = (raw: string) => {
    const trimmed = raw.replace(/\/+$/, '')
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`
    return trimmed
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult('idle')
    const normalized = normalizeUrl(url)
    setUrl(normalized)
    setApiConfig({ baseUrl: normalized })
    const start = performance.now()
    const ok = await apiHealthCheck()
    setLatency(Math.round(performance.now() - start))
    setTestResult(ok ? 'ok' : 'fail')
    setTesting(false)
  }

  const handleExportData = () => {
    const json = exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `artlab-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = importAllData(reader.result as string)
      if (result.ok) {
        setImportMsg({ ok: true, text: `Importados ${result.count} items. Recarga.` })
      } else {
        setImportMsg({ ok: false, text: result.error || 'Error' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExportPrefs = () => {
    const json = getPreferencesExport()
    const blob = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `artlab-preferences-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const handleLoadPrefs = async () => {
    setPrefMsg(null)
    const json = getPreferencesExport()
    const ok = await loadPreferencesToServer(json)
    setPrefMsg(ok
      ? { ok: true, text: 'Preferencias cargadas al servidor' }
      : { ok: false, text: 'No se pudo conectar. Configura el webhook primero.' }
    )
  }

  const handleImportPrefs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = importAllData(reader.result as string)
      if (result.ok) {
        setImportMsg({ ok: true, text: `Preferencias importadas (${result.count} items). Recarga.` })
      } else {
        setImportMsg({ ok: false, text: result.error || 'Error' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleToggleSync = () => {
    const next = !syncConfig.enabled
    setSyncConfig(saveSyncConfig({ enabled: next }))
    if (next) {
      connectWebSocket(syncConfig.webhookUrl)
    } else {
      disconnectWebSocket()
    }
  }

  const handleSaveWebhook = () => {
    setSyncConfig(saveSyncConfig({ webhookUrl: syncConfig.webhookUrl }))
    if (syncConfig.enabled) {
      disconnectWebSocket()
      connectWebSocket(syncConfig.webhookUrl)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">🔌 Conexión al backend</h3>
        <p className="text-xs text-text-muted mb-3">URL del servidor Colab o API</p>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Input
            label="API URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:8000"
          />
        </div>
        <Button variant="secondary" onClick={handleTest} loading={testing} size="md" className="mb-0.5">
          {testing ? <Loader size={14} /> : 'Test'}
        </Button>
      </div>

      {testResult !== 'idle' && (
        <div className={cn(
          'flex items-center gap-2 text-sm px-3 py-2 rounded-lg border',
          testResult === 'ok'
            ? 'bg-status-online/10 border-status-online/30 text-status-online'
            : 'bg-status-offline/10 border-status-offline/30 text-status-offline',
        )}>
          {testResult === 'ok' ? <><Wifi size={14} /> Online — {latency}ms</> : <><WifiOff size={14} /> No responde</>}
        </div>
      )}

      <div className="border-t border-surface-border pt-4">
        <h3 className="text-sm font-semibold text-text-primary mb-1">🌐 Sync en tiempo real</h3>
        <p className="text-xs text-text-muted mb-3">Sincroniza el estado entre usuarios mediante webhook o WebSocket</p>

        <div className="flex gap-2 items-end mb-3">
          <div className="flex-1">
            <Input
              label="Webhook / WebSocket URL"
              value={syncConfig.webhookUrl}
              onChange={(e) => setSyncConfig((prev) => ({ ...prev, webhookUrl: e.target.value }))}
              placeholder="https://colab.ngrok.io/sync"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handleSaveWebhook} className="mb-0.5">
            Guardar
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSync}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              syncConfig.enabled ? 'bg-accent' : 'bg-surface-border',
            )}
          >
            <span className={cn(
              'inline-block h-4 w-4 rounded-full bg-white transition-transform',
              syncConfig.enabled ? 'translate-x-6' : 'translate-x-1',
            )} />
          </button>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={cn(
              'w-2 h-2 rounded-full',
              syncStatus === 'connected' ? 'bg-status-online' :
              syncStatus === 'connecting' ? 'bg-status-warning animate-pulse' : 'bg-status-offline',
            )} />
            <span className={syncLabels[syncStatus].color}>{syncLabels[syncStatus].text}</span>
          </span>
          {syncConfig.lastSyncAt && (
            <span className="text-[10px] text-text-muted">
              Último sync: {new Date(syncConfig.lastSyncAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-surface-border pt-4">
        <h3 className="text-sm font-semibold text-text-primary mb-1">💾 Datos</h3>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-text-secondary font-medium mb-2">Proyecto completo (Kanban + Timeline + Settings)</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleExportData}>
                <Download size={14} /> Exportar todo
              </Button>
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload size={14} /> Importar todo
              </Button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </div>
          </div>

          <div className="border-t border-surface-border pt-3">
            <p className="text-xs text-text-secondary font-medium mb-2">Preferencias (LLM, defaults, sync)</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleExportPrefs}>
                <Download size={14} /> Exportar preferencias
              </Button>
              <Button variant="secondary" size="sm" onClick={() => prefFileInputRef.current?.click()}>
                <Upload size={14} /> Importar preferencias
              </Button>
              <input ref={prefFileInputRef} type="file" accept=".json" onChange={handleImportPrefs} className="hidden" />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLoadPrefs}
                disabled={!syncConfig.enabled}
              >
                <Globe size={14} /> Cargar al servidor
              </Button>
            </div>
            {prefMsg && (
              <div className={cn(
                'flex items-center gap-2 text-xs mt-2 px-3 py-2 rounded-lg border',
                prefMsg.ok
                  ? 'bg-status-online/10 border-status-online/30 text-status-online'
                  : 'bg-status-offline/10 border-status-offline/30 text-status-offline',
              )}>
                {prefMsg.ok ? <Check size={12} /> : <AlertCircle size={12} />}
                {prefMsg.text}
              </div>
            )}
          </div>
        </div>

        {importMsg && (
          <div className={cn(
            'flex items-center gap-2 text-xs mt-3 px-3 py-2 rounded-lg border',
            importMsg.ok
              ? 'bg-status-online/10 border-status-online/30 text-status-online'
              : 'bg-status-offline/10 border-status-offline/30 text-status-offline',
          )}>
            {importMsg.ok ? <Check size={12} /> : <AlertCircle size={12} />}
            {importMsg.text}
          </div>
        )}
      </div>
    </div>
  )
}
