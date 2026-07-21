import { TimelineEvent } from './TimelineEvent'
import type { TimelineEvent as TimelineEventType } from '@/types/timeline'

interface TimelineFeedProps {
  groupedByDate: Record<string, TimelineEventType[]>
}

export function TimelineFeed({ groupedByDate }: TimelineFeedProps) {
  const dates = Object.keys(groupedByDate)

  if (dates.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-text-muted text-sm">No hay eventos en el timeline.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {dates.map((date) => (
        <div key={date}>
          <div className="sticky top-0 py-2 bg-surface-base z-10">
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              {date}
            </h3>
          </div>
          {groupedByDate[date].map((event) => (
            <TimelineEvent key={event.id} event={event} />
          ))}
        </div>
      ))}
    </div>
  )
}
