import type { Reference } from '@/types/reference'
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'

interface ReferenceCardProps {
  reference: Reference
  onToggle: (id: string) => void
}

export function ReferenceCard({ reference, onToggle }: ReferenceCardProps) {
  const selected = reference.selected

  return (
    <button
      onClick={() => onToggle(reference.id)}
      className={cn(
        'group relative rounded-xl overflow-hidden border-2 transition-all text-left cursor-pointer',
        selected
          ? 'border-accent bg-accent/5'
          : 'border-surface-border hover:border-surface-hover bg-surface-raised',
      )}
    >
      <div className="aspect-[4/3] bg-surface-hover overflow-hidden">
        <img
          src={reference.thumbnail}
          alt={reference.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {selected && (
          <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1">
            <Check size={14} />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-text-primary truncate">{reference.name}</p>
        <p className="text-xs text-text-muted mt-0.5">{reference.category}</p>
      </div>
    </button>
  )
}
