import { createContext, useContext, useCallback, type ReactNode } from 'react'
import type { QueueCard, QueueColumn } from '@/types/queue'
import { usePersistedState } from './usePersistedState'

interface QueueContextValue {
  columns: QueueColumn[]
  addCard: (columnId: string, title: string, description?: string, tags?: string[]) => void
  moveCard: (cardId: string, sourceColId: string, destColId: string, destIndex: number) => void
  updateCard: (cardId: string, updates: Partial<QueueCard>) => void
  deleteCard: (cardId: string) => void
}

const INITIAL_COLUMNS: QueueColumn[] = [
  { id: 'idea', title: 'Idea', cards: [] },
  { id: 'revision', title: 'En Revisión', cards: [] },
  { id: 'publicado', title: 'Publicado', cards: [] },
]

const QueueContext = createContext<QueueContextValue | null>(null)

export function QueueProvider({ children }: { children: ReactNode }) {
  const [columns, setColumns] = usePersistedState<QueueColumn[]>('queue_columns', INITIAL_COLUMNS)

  const addCard = useCallback((columnId: string, title: string, description = '', tags: string[] = []) => {
    const newCard: QueueCard = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      description,
      tags,
      columnId,
      order: 0,
      createdAt: Date.now(),
    }
    setColumns((prev) => prev.map((col) =>
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
    ))
  }, [setColumns])

  const moveCard = useCallback((cardId: string, sourceColId: string, destColId: string, destIndex: number) => {
    setColumns((prev) => {
      const sourceCol = prev.find((c) => c.id === sourceColId)
      const destCol = prev.find((c) => c.id === destColId)
      if (!sourceCol || !destCol) return prev

      const card = sourceCol.cards.find((c) => c.id === cardId)
      if (!card) return prev

      if (sourceColId === destColId) {
        const newCards = sourceCol.cards.filter((c) => c.id !== cardId)
        newCards.splice(destIndex, 0, { ...card, columnId: destColId })
        return prev.map((col) => col.id === sourceColId ? { ...col, cards: newCards } : col)
      }

      const newSourceCards = sourceCol.cards.filter((c) => c.id !== cardId)
      const newDestCards = [...destCol.cards]
      newDestCards.splice(destIndex, 0, { ...card, columnId: destColId })

      return prev.map((col) => {
        if (col.id === sourceColId) return { ...col, cards: newSourceCards }
        if (col.id === destColId) return { ...col, cards: newDestCards }
        return col
      })
    })
  }, [setColumns])

  const updateCard = useCallback((cardId: string, updates: Partial<QueueCard>) => {
    setColumns((prev) => prev.map((col) => ({
      ...col,
      cards: col.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
    })))
  }, [setColumns])

  const deleteCard = useCallback((cardId: string) => {
    setColumns((prev) => prev.map((col) => ({
      ...col,
      cards: col.cards.filter((c) => c.id !== cardId),
    })))
  }, [setColumns])

  return (
    <QueueContext.Provider value={{ columns, addCard, moveCard, updateCard, deleteCard }}>
      {children}
    </QueueContext.Provider>
  )
}

export function useQueueContext() {
  const ctx = useContext(QueueContext)
  if (!ctx) throw new Error('useQueueContext must be used within QueueProvider')
  return ctx
}
