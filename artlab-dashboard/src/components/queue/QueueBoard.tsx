import type { QueueColumn as QueueColumnType, QueueCard as QueueCardType } from '@/types/queue'
import { QueueColumn } from './QueueColumn'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'

interface QueueBoardProps {
  columns: QueueColumnType[]
  onMoveCard: (cardId: string, sourceColId: string, destColId: string, destIndex: number) => void
  onAddCard: (columnId: string, title: string) => void
  onUpdateCard: (id: string, updates: Partial<QueueCardType>) => void
  onDeleteCard: (id: string) => void
  onGenerateCard?: (id: string) => void
  generatingId?: string | null
}

export function QueueBoard({ columns, onMoveCard, onAddCard, onUpdateCard, onDeleteCard, onGenerateCard, generatingId }: QueueBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { draggableId, source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return
    onMoveCard(draggableId, source.droppableId, destination.droppableId, destination.index)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-auto pb-4 h-full">
        {columns.map((col) => (
          <QueueColumn
            key={col.id}
            column={col}
            onAddCard={onAddCard}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
            onGenerateCard={onGenerateCard}
            generatingId={generatingId}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
