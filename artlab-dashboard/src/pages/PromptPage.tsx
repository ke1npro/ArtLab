import { usePrompt } from '@/hooks/usePrompt'
import { useContextDocuments } from '@/hooks/useContextDocuments'
import { useReferenceSelection } from '@/hooks/ReferenceSelectionContext'
import { useTimelineContext } from '@/hooks/TimelineContext'
import { useQueueContext } from '@/hooks/QueueContext'
import { useSettingsContext } from '@/hooks/SettingsContext'
import { useSystemMonitor } from '@/hooks/useSystemMonitor'
import { PromptForm } from '@/components/prompt/PromptForm'
import { PromptPreview } from '@/components/prompt/PromptPreview'
import { ContextImporter } from '@/components/prompt/ContextImporter'
import { ContextPreview } from '@/components/prompt/ContextPreview'
import { SystemSummary } from '@/components/ui/SystemSummary'
import { Button } from '@/components/ui/Button'
import { Hammer, ListPlus, Image, X } from 'lucide-react'
import { useServerStatusContext } from '@/hooks/ServerStatusContext'

export function PromptPage() {
  const { offline } = useServerStatusContext()
  const { resources, serverOnline, loadedModels } = useSystemMonitor()
  const { genDefaults } = useSettingsContext()
  const { form, result, building, updateField, build } = usePrompt({
    cfg: genDefaults.cfg,
    steps: genDefaults.steps,
    pipeline: genDefaults.pipeline,
    ti2iStrength: genDefaults.ti2iStrength,
  })
  const { documents, stats, contextPreview, toggleDocument, buildContext, clearPreview } = useContextDocuments()
  const { selected, toggle, clear } = useReferenceSelection()
  const { addEvent } = useTimelineContext()
  const { addCard } = useQueueContext()

  const handleBuild = () => {
    const selectedDocs = documents.filter((d) => d.selected)
    const context = selectedDocs.length > 0
      ? selectedDocs.map((d) => `=== ${d.name} ===\n${d.content}`).join('\n\n')
      : undefined
    const refs = selected.map((r) => ({ id: r.id, name: r.name, thumbnail: r.thumbnail }))
    build(context, refs)
  }

  const handleSendToQueue = () => {
    const title = form.positivePrompt || form.sceneDescription || 'Nueva generación'
    const refNames = selected.map((r) => r.name).join(', ')
    const desc = [
      form.sceneDescription,
      form.positivePrompt,
      refNames ? `Refs: ${refNames}` : '',
    ].filter(Boolean).join(' | ')
    const tags = selected.map((r) => r.name.split(' ')[0].toLowerCase())

    addCard('idea', title, desc, tags)

    addEvent({
      type: 'generation',
      title: `📥 En cola — "${title.slice(0, 50)}..."`,
      description: (result?.prompt || '').slice(0, 120),
      tags,
      status: 'draft',
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Constructor de Prompts</h1>
          <p className="text-sm text-text-muted mt-0.5">Construye prompts, incluye referencias, y envíalos a generar</p>
        </div>
        <SystemSummary resources={resources} serverOnline={serverOnline} loadedModels={loadedModels} />
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-4 overflow-auto pr-2">
          <div className="bg-surface-raised border border-surface-border rounded-xl p-5">
            <PromptForm form={form} onChange={updateField} />
          </div>

          <ContextImporter
            documents={documents}
            stats={stats}
            offline={offline}
            onToggle={toggleDocument}
            onImport={buildContext}
          />

          {contextPreview && (
            <ContextPreview content={contextPreview} onClose={clearPreview} />
          )}
        </div>

        <div className="w-96 shrink-0 flex flex-col gap-4">
          <div className="bg-surface-raised border border-surface-border rounded-xl p-5 flex-1">
            <PromptPreview result={result} building={building} />
          </div>

          {selected.length > 0 && (
            <div className="bg-surface-raised border border-surface-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Image size={14} className="text-text-secondary" />
                  <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Referencias activas
                  </span>
                </div>
                <button onClick={clear} className="text-[10px] text-text-muted hover:text-text-primary transition-colors">
                  Limpiar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.map((ref) => (
                  <div key={ref.id} className="flex items-center gap-1.5 bg-surface-hover rounded-lg px-2 py-1 group">
                    <img src={ref.thumbnail} alt="" className="w-6 h-5 rounded object-cover" />
                    <span className="text-xs text-text-primary truncate max-w-24">{ref.name}</span>
                    <button onClick={() => toggle(ref)} className="text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all p-0.5">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleBuild}
            disabled={offline || building}
            loading={building}
            size="lg"
            className="w-full"
          >
            <Hammer size={16} />
            Build Prompt
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={!result || offline}
            onClick={handleSendToQueue}
          >
            <ListPlus size={16} />
            Enviar a cola de generación
          </Button>
        </div>
      </div>
    </div>
  )
}
