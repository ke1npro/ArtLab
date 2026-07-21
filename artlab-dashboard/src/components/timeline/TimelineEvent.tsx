import type { TimelineEvent as TimelineEventType } from '@/types/timeline'
import { Badge } from '@/components/ui/Badge'
import { Sparkles, Globe, Eye, Lightbulb, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'

interface TimelineEventProps {
  event: TimelineEventType
}

const iconMap = {
  generation: Sparkles,
  publication: Globe,
  review: Eye,
  idea: Lightbulb,
}

const colorMap: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'gray'> = {
  luna: 'blue',
  atlas: 'purple',
  cyberpunk: 'pink',
  retrato: 'gray',
  coffee_shop: 'yellow',
  noche: 'blue',
  café: 'yellow',
  pixelart: 'green',
  fantasia: 'purple',
  criatura: 'green',
}

export function TimelineEvent({ event }: TimelineEventProps) {
  const Icon = iconMap[event.type]

  const timeAgo = () => {
    const diff = Date.now() - event.timestamp
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `hace ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `hace ${hours} h`
    const days = Math.floor(hours / 24)
    return `hace ${days} día${days > 1 ? 's' : ''}`
  }

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center border shrink-0',
          event.type === 'generation' && 'bg-accent/10 border-accent/30 text-accent',
          event.type === 'publication' && 'bg-green-500/10 border-green-500/30 text-green-400',
          event.type === 'review' && 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
          event.type === 'idea' && 'bg-purple-500/10 border-purple-500/30 text-purple-400',
        )}>
          <Icon size={16} />
        </div>
        <div className="w-px flex-1 bg-surface-border mt-2" />
      </div>

      <div className="flex-1 pb-6 min-w-0">
        <div className="bg-surface-raised border border-surface-border rounded-xl p-4 hover:border-surface-hover transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-text-primary">{event.title}</h3>
              <p className="text-xs text-text-muted mt-1">{event.description}</p>

              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {event.tags.map((tag, i) => (
                    <Badge key={i} color={colorMap[tag] || 'gray'}>{tag}</Badge>
                  ))}
                </div>
              )}

              {event.promptUsed && (
                <details className="mt-2">
                  <summary className="text-[11px] text-text-muted cursor-pointer hover:text-text-secondary transition-colors">
                    Ver prompt usado
                  </summary>
                  <p className="text-xs text-text-secondary mt-1.5 p-2 bg-surface-input rounded-md font-mono leading-relaxed">
                    {event.promptUsed}
                  </p>
                </details>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[10px] text-text-muted flex items-center gap-1">
                <Clock size={10} />
                {timeAgo()}
              </span>
              {event.thumbnail && (
                <img
                  src={event.thumbnail}
                  alt=""
                  className="w-16 h-12 rounded-md object-cover bg-surface-hover border border-surface-border"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
