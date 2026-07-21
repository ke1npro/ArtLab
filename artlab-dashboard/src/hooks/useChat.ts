import { useState, useCallback } from 'react'
import type { ChatMessage } from '@/types/chat'
import { sendChatMessage } from '@/services/chat.service'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)

  const send = useCallback(async (content: string, context?: string, image?: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      images: image ? [image] : undefined,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setSending(true)

    try {
      const res = await sendChatMessage({ message: content, context, image, history: messages })
      const assistantMsg: ChatMessage = {
        id: res.messageId,
        role: 'assistant',
        content: res.reply,
        reasoning: res.reasoning,
        images: res.images,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'system',
        content: 'Error al enviar mensaje. El servidor no está disponible.',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setSending(false)
    }
  }, [messages])

  return { messages, sending, send }
}
