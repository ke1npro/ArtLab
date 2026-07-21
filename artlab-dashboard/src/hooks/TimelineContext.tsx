import { createContext, useContext, useCallback, type ReactNode } from 'react'
import type { TimelineEvent } from '@/types/timeline'
import { usePersistedState } from './usePersistedState'

interface TimelineContextValue {
  events: TimelineEvent[]
  addEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void
  clearEvents: () => void
}

const TimelineContext = createContext<TimelineContextValue | null>(null)

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = usePersistedState<TimelineEvent[]>('timeline_events', [])

  const addEvent = useCallback((data: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const event: TimelineEvent = {
      ...data,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
    }
    setEvents((prev) => [event, ...prev])
  }, [setEvents])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [setEvents])

  return (
    <TimelineContext.Provider value={{ events, addEvent, clearEvents }}>
      {children}
    </TimelineContext.Provider>
  )
}

export function useTimelineContext() {
  const ctx = useContext(TimelineContext)
  if (!ctx) throw new Error('useTimelineContext must be used within TimelineProvider')
  return ctx
}
