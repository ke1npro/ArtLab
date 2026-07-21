import type { ContextDocument } from '@/types/prompt'
import { Button } from '@/components/ui/Button'
import { FileText, FolderOpen } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ContextImporterProps {
  documents: ContextDocument[]
  stats: { count: number; size: string; tokens: number }
  offline: boolean
  onToggle: (path: string) => void
  onImport: () => void
}

export function ContextImporter({ documents, stats, offline, onToggle, onImport }: ContextImporterProps) {
  const categories = [...new Set(documents.map((d) => d.category))]

  return (
    <div className="bg-surface-raised border border-surface-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className="text-text-secondary" />
          <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">Importar detalles</h3>
        </div>
        <div className="text-xs text-text-muted">
          {stats.count} docs &middot; {stats.size} &middot; ~{stats.tokens} tokens
        </div>
      </div>

      <div className="space-y-1 mb-3 max-h-40 overflow-auto">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-[10px] font-medium text-text-muted uppercase px-1 pt-2 pb-1">{cat}</p>
            {documents
              .filter((d) => d.category === cat)
              .map((doc) => (
                <label
                  key={doc.path}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm',
                    'hover:bg-surface-hover',
                    doc.selected && 'bg-accent/5',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={doc.selected}
                    onChange={() => onToggle(doc.path)}
                    className="accent-accent rounded"
                  />
                  <FileText size={14} className="text-text-muted shrink-0" />
                  <span className="text-text-primary truncate">{doc.name}</span>
                </label>
              ))}
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        disabled={stats.count === 0 || offline}
        onClick={onImport}
      >
        Importar detalles
      </Button>
    </div>
  )
}
