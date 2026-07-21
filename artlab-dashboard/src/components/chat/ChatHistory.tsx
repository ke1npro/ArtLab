import { useEffect, useRef } from 'react'
import type { ChatMessage as ChatMessageType } from '@/types/chat'
import { ChatMessage } from './ChatMessage'

interface ChatHistoryProps {
  messages: ChatMessageType[]
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-sm">No hay mensajes aún.</p>
          <p className="text-text-muted text-xs mt-1">Escribe algo para comenzar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
