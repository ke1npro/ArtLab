import type { Reference } from '@/types/reference'
import { Image, X } from 'lucide-react'

interface SelectedReferencesProps {
  references: Reference[]
  onToggle: (id: string) => void
}

export function SelectedReferences({ references, onToggle }: SelectedReferencesProps) {
  if (references.length === 0) {
    return (
      <div className="bg-surface-raised border border-surface-border rounded-xl p-4">
        <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
          Referencias seleccionadas
        </h3>
        <div className="flex flex-col items-center justify-center py-6 text-text-muted">
          <Image size={24} className="mb-2 opacity-40" />
          <p className="text-xs">Ninguna seleccionada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-raised border border-surface-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          Seleccionadas
        </h3>
        <span className="text-xs text-text-muted">{references.length}</span>
      </div>
      <div className="space-y-1.5">
        {references.map((ref) => (
          <div key={ref.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-surface-hover">
            <div className="w-8 h-8 rounded bg-surface-border overflow-hidden shrink-0">
              <img src={ref.thumbnail} alt={ref.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">{ref.name}</p>
              <p className="text-xs text-text-muted">{ref.category}</p>
            </div>
            <button
              onClick={() => onToggle(ref.id)}
              className="text-text-muted hover:text-text-primary transition-colors p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
