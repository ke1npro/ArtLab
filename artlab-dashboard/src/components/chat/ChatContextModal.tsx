import { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FileText } from 'lucide-react'
import { cn } from '@/utils/cn'
import { getAvailableDocuments, buildContextBlock } from '@/services/context.service'
import { estimateTokens, formatSize } from '@/utils/tokenCounter'

interface ChatContextModalProps {
  open: boolean
  onClose: () => void
  onImport: (content: string, label: string) => void
}

export function ChatContextModal({ open, onClose, onImport }: ChatContextModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const documents = useMemo(() => getAvailableDocuments(), [])

  const categories = [...new Set(documents.map((d) => d.category))]

  const toggle = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const selectedDocs = documents.filter((d) => selected.has(d.path))

  const stats = useMemo(() => {
    const totalSize = selectedDocs.reduce((acc, d) => acc + d.size, 0)
    const fullText = selectedDocs.map((d) => d.content).join('\n')
    return {
      count: selectedDocs.length,
      size: formatSize(totalSize),
      tokens: estimateTokens(fullText),
    }
  }, [selectedDocs])

  const handleImport = () => {
    const block = buildContextBlock(selectedDocs)
    const label = selectedDocs.map((d) => d.name).join(', ')
    onImport(block, label)
    setSelected(new Set())
  }

  return (
    <Modal open={open} onClose={onClose} title="Adjuntar contexto al chat" className="max-w-xl">
      <div className="space-y-4">
        <p className="text-xs text-text-muted">
          Selecciona documentos .md para incluirlos como contexto del mensaje.
        </p>

        <div className="max-h-60 overflow-auto space-y-1 border border-surface-border rounded-lg p-2">
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
                      selected.has(doc.path) && 'bg-accent/5',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(doc.path)}
                      onChange={() => toggle(doc.path)}
                      className="accent-accent rounded"
                    />
                    <FileText size={14} className="text-text-muted shrink-0" />
                    <span className="text-text-primary truncate">{doc.name}</span>
                  </label>
                ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-text-muted">
            {stats.count} docs &middot; {stats.size} &middot; ~{stats.tokens} tokens
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
            <Button size="sm" onClick={handleImport} disabled={stats.count === 0}>
              Adjuntar contexto
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
