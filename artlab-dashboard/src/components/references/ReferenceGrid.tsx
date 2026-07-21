import type { Reference } from '@/types/reference'
import { ReferenceCard } from './ReferenceCard'

interface ReferenceGridProps {
  references: Reference[]
  onToggle: (id: string) => void
  selectedIds: Set<string>
}

export function ReferenceGrid({ references, onToggle, selectedIds }: ReferenceGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {references.map((ref) => (
        <ReferenceCard
          key={ref.id}
          reference={{ ...ref, selected: selectedIds.has(ref.id) }}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
