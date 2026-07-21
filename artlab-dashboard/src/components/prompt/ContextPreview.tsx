import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { estimateTokens, formatSize } from '@/utils/tokenCounter'

interface ContextPreviewProps {
  content: string
  onClose: () => void
}

export function ContextPreview({ content, onClose }: ContextPreviewProps) {
  const tokens = estimateTokens(content)
  const size = formatSize(new TextEncoder().encode(content).length)

  return (
    <div className="bg-surface-raised border border-surface-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Contexto generado
          </h3>
          <span className="text-[10px] text-text-muted bg-surface-hover px-2 py-0.5 rounded">
            ~{tokens} tokens &middot; {size}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={14} />
        </Button>
      </div>
      <div className="p-4 max-h-60 overflow-auto">
        <pre className="text-sm text-text-primary whitespace-pre-wrap font-sans leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  )
}
