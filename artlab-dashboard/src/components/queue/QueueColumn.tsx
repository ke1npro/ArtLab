import { useState } from 'react'
import type { QueueColumn as QueueColumnType, QueueCard as QueueCardType } from '@/types/queue'
import { QueueCard } from './QueueCard'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { Droppable } from '@hello-pangea/dnd'

interface QueueColumnProps {
  column: QueueColumnType
  onAddCard: (columnId: string, title: string) => void
  onUpdateCard: (id: string, updates: Partial<QueueCardType>) => void
  onDeleteCard: (id: string) => void
  onGenerateCard?: (id: string) => void
  generatingId?: string | null
}

export function QueueColumn({ column, onAddCard, onUpdateCard, onDeleteCard, onGenerateCard, generatingId }: QueueColumnProps) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleAdd = () => {
    const trimmed = newTitle.trim()
    if (!trimmed) return
    onAddCard(column.id, trimmed)
    setNewTitle('')
    setAdding(false)
  }

  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <div className="flex flex-col bg-surface-base rounded-xl min-w-[280px] w-[280px] shrink-0 max-h-full">
          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                {column.title}
              </h3>
              <span className="text-[10px] text-text-muted bg-surface-hover px-1.5 py-0.5 rounded-full">
                {column.cards.length}
              </span>
            </div>
            <button
              onClick={() => setAdding(true)}
              className="text-text-muted hover:text-text-primary transition-colors p-0.5"
            >
              <Plus size={14} />
            </button>
          </div>

          <div
            className={`flex-1 overflow-auto px-2 pb-2 space-y-2 min-h-[60px] transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? 'bg-accent/5' : ''
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {adding && (
              <div className="bg-surface-raised border border-accent rounded-lg p-2 space-y-2">
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAdding(false); setNewTitle('') } }}
                  placeholder="Título de la tarjeta..."
                  className="w-full text-sm bg-surface-input text-text-primary border border-surface-border rounded px-2 py-1 outline-none focus:border-accent"
                />
                <div className="flex gap-1.5">
                  <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>Añadir</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNewTitle('') }}>Cancelar</Button>
                </div>
              </div>
            )}

            {column.cards.map((card, idx) => (
              <QueueCard
                key={card.id}
                card={card}
                index={idx}
                onUpdate={onUpdateCard}
                onDelete={onDeleteCard}
                onGenerate={column.id === 'idea' ? onGenerateCard : undefined}
                generating={generatingId === card.id}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}
