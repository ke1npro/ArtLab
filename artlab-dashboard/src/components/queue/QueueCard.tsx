import { useState } from 'react'
import type { QueueCard as QueueCardType } from '@/types/queue'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { GripVertical, Pencil, Trash2, Sparkles, Loader } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Draggable } from '@hello-pangea/dnd'

interface QueueCardProps {
  card: QueueCardType
  index: number
  onUpdate: (id: string, updates: Partial<QueueCardType>) => void
  onDelete: (id: string) => void
  onGenerate?: (id: string) => void
  generating?: boolean
}

const colorMap: Record<string, 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'gray'> = {
  default: 'gray',
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  red: 'red',
  purple: 'purple',
  pink: 'pink',
}

export function QueueCard({ card, index, onUpdate, onDelete, onGenerate, generating }: QueueCardProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)

  const handleSaveTitle = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== card.title) {
      onUpdate(card.id, { title: trimmed })
    } else {
      setEditTitle(card.title)
    }
    setEditing(false)
  }

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            'bg-surface-raised border border-surface-border rounded-lg p-3 group transition-shadow',
            snapshot.isDragging && 'shadow-xl ring-2 ring-accent/30',
          )}
        >
          <div className="flex items-start gap-2">
            <div {...provided.dragHandleProps} className="mt-0.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <GripVertical size={14} />
            </div>
            <div className="flex-1 min-w-0">
              {card.thumbnail && (
                <img
                  src={card.thumbnail}
                  alt={card.title}
                  className="w-full h-32 object-cover rounded-md mb-2 bg-surface-base"
                />
              )}
              {editing ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTitle(); if (e.key === 'Escape') { setEditTitle(card.title); setEditing(false) } }}
                  className="w-full text-sm font-medium bg-surface-input text-text-primary border border-accent rounded px-1.5 py-0.5 outline-none"
                />
              ) : (
                <p
                  className="text-sm font-medium text-text-primary cursor-pointer"
                  onDoubleClick={() => { setEditTitle(card.title); setEditing(true) }}
                >
                  {card.title}
                </p>
              )}
              {card.description && (
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">{card.description}</p>
              )}
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {card.tags.map((tag, i) => (
                    <Badge key={i} color={colorMap[tag] || 'gray'}>{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditTitle(card.title); setEditing(true) }}
                className="p-1 text-text-muted hover:text-text-primary transition-colors rounded"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={() => onDelete(card.id)}
                className="p-1 text-text-muted hover:text-status-offline transition-colors rounded"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {onGenerate && (
            <div className="mt-2 pt-2 border-t border-surface-border">
              <Button
                size="sm"
                className="w-full"
                onClick={() => onGenerate(card.id)}
                loading={generating}
                disabled={generating}
              >
                {generating ? <Loader size={12} /> : <Sparkles size={12} />}
                {generating ? 'Generando...' : 'Generar'}
              </Button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
