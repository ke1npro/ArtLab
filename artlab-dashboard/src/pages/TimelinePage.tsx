import { useMemo } from 'react'
import { useTimelineContext } from '@/hooks/TimelineContext'
import { TimelineFeed } from '@/components/timeline/TimelineFeed'

export function TimelinePage() {
  const { events } = useTimelineContext()

  const groupedByDate = useMemo(() => {
    const sorted = [...events].sort((a, b) => b.timestamp - a.timestamp)
    const groups: Record<string, typeof events> = {}
    for (const event of sorted) {
      const date = new Date(event.timestamp).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
      if (!groups[date]) groups[date] = []
      groups[date].push(event)
    }
    return groups
  }, [events])

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-text-primary">Timeline</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Historial de todo lo que generas y publicas
        </p>
        {events.length === 0 && (
          <p className="text-xs text-text-muted mt-2">
            Aún no hay eventos. Construye un prompt y envíalo a la cola de generación para empezar.
          </p>
        )}
      </div>

      <div className="flex-1 overflow-auto pr-2">
        <TimelineFeed groupedByDate={groupedByDate} />
      </div>
    </div>
  )
}
