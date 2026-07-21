import { useState } from 'react'
import type { ChatMessage as ChatMessageType } from '@/types/chat'
import { cn } from '@/utils/cn'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'
  const [showReasoning, setShowReasoning] = useState(false)

  return (
    <div className={cn(
      'flex gap-3 px-4 py-3',
      isUser && 'flex-row-reverse',
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
        isUser ? 'bg-accent/20 text-accent' : isSystem ? 'bg-status-warning/20 text-status-warning' : 'bg-surface-hover text-text-secondary',
      )}>
        {isUser ? 'U' : isSystem ? '!' : 'A'}
      </div>
      <div className={cn(
        'max-w-[70%] space-y-2',
        isUser && 'items-end flex flex-col',
      )}>
        {message.images && message.images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {message.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-32 h-24 rounded-lg object-cover border border-surface-border bg-surface-hover"
                loading="lazy"
              />
            ))}
          </div>
        )}

        <div className={cn(
          'rounded-xl px-4 py-2.5 text-sm leading-relaxed',
          isUser ? 'bg-accent/10 text-text-primary' : isSystem ? 'bg-status-warning/10 text-status-warning' : 'bg-surface-raised border border-surface-border text-text-primary',
        )}>
          {message.reasoning && (
            <div className="mb-2 pb-2 border-b border-surface-border">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-secondary transition-colors w-full"
              >
                {showReasoning ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                Razonamiento
              </button>
              {showReasoning && (
                <p className="text-xs text-text-secondary mt-1.5 italic leading-relaxed">
                  {message.reasoning}
                </p>
              )}
            </div>
          )}
          {message.content}
        </div>
      </div>
    </div>
  )
}
