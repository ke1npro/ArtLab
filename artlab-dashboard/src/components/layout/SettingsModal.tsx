import { useState } from 'react'
import { X, Plug, Monitor, Bot, Sliders, ScrollText } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ConnectionPanel } from '@/components/settings/ConnectionPanel'
import { SystemPanel } from '@/components/settings/SystemPanel'
import { ModelParams } from '@/components/settings/ModelParams'
import { GenDefaults } from '@/components/settings/GenDefaults'
import { LogPanel } from '@/components/settings/LogPanel'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

const tabs = [
  { id: 'connection', label: 'Conexión', icon: Plug },
  { id: 'system', label: 'Sistema', icon: Monitor },
  { id: 'model', label: 'Modelo LLM', icon: Bot },
  { id: 'defaults', label: 'Defaults', icon: Sliders },
  { id: 'logs', label: 'Logs', icon: ScrollText },
] as const

type TabId = (typeof tabs)[number]['id']

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('connection')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full h-full bg-surface-base flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 border-b border-surface-border shrink-0">
          <h2 className="text-base font-bold text-text-primary">Settings</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-surface-hover">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <nav className="w-52 shrink-0 border-r border-surface-border p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left',
                  activeTab === tab.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'connection' && <ConnectionPanel />}
            {activeTab === 'system' && <SystemPanel />}
            {activeTab === 'model' && <ModelParams />}
            {activeTab === 'defaults' && <GenDefaults />}
            {activeTab === 'logs' && <LogPanel />}
          </div>
        </div>
      </div>
    </div>
  )
}
