import { useState, useCallback } from 'react'
import { useQueueContext } from '@/hooks/QueueContext'
import { useTimelineContext } from '@/hooks/TimelineContext'
import { useSystemMonitor } from '@/hooks/useSystemMonitor'
import { generateImage } from '@/services/generation.service'
import { loadModel } from '@/services/system.service'
import { ModelLoadBanner } from '@/components/ui/ModelLoadBanner'
import { SystemSummary } from '@/components/ui/SystemSummary'
import { QueueBoard } from '@/components/queue/QueueBoard'

export function QueuePage() {
  const { resources, serverOnline, loadedModels } = useSystemMonitor()
  const { columns, moveCard, addCard, updateCard, deleteCard } = useQueueContext()
  const { addEvent } = useTimelineContext()
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  const handleGenerate = useCallback(async (cardId: string) => {
    const card = columns.flatMap((c) => c.cards).find((c) => c.id === cardId)
    if (!card) return

    setGeneratingId(cardId)

    try {
      await loadModel('sdxl', true)
    } catch { /* silencio */ }

    addEvent({
      type: 'generation',
      title: `⚡ Generando — "${card.title.slice(0, 50)}..."`,
      description: card.description.slice(0, 120),
      tags: card.tags,
      status: 'draft',
    })

    try {
      const result = await generateImage({
        prompt: card.title + (card.description ? `, ${card.description}` : ''),
        steps: 20,
        cfg: 7,
      })

      updateCard(cardId, {
        thumbnail: result.image,
        description: card.description
          ? `${card.description}\n\n[semilla: ${result.seed}]`
          : `semilla: ${result.seed}`,
      })

      addEvent({
        type: 'generation',
        title: `✅ Generado — "${card.title.slice(0, 50)}"`,
        description: `Seed: ${result.seed} | Pasos: ${result.info?.steps || 20}`,
        tags: card.tags,
        status: 'completed',
      })

      moveCard(cardId, 'idea', 'revision', 0)
    } catch (err) {
      addEvent({
        type: 'generation',
        title: `❌ Error — "${card.title.slice(0, 50)}"`,
        description: err instanceof Error ? err.message : 'Error desconocido',
        tags: card.tags,
        status: 'error',
      })
    }

    setGeneratingId(null)
  }, [columns, addEvent, moveCard, updateCard])

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Kanban</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Ideas → Revisión → Publicado. Las tarjetas en Idea tienen botón "Generar" que las mueve a Revisión automáticamente.
          </p>
        </div>
        <SystemSummary resources={resources} serverOnline={serverOnline} loadedModels={loadedModels} />
      </div>

      <div className="mb-3">
        <ModelLoadBanner modelId="sdxl" actionLabel="generar" />
      </div>
      <div className="flex-1 min-h-0">
        <QueueBoard
          columns={columns}
          onMoveCard={moveCard}
          onAddCard={addCard}
          onUpdateCard={updateCard}
          onDeleteCard={deleteCard}
          onGenerateCard={handleGenerate}
          generatingId={generatingId}
        />
      </div>
    </div>
  )
}
