import { useState, useCallback, useRef } from 'react'
import type { ChatMessage } from '@/types/chat'
import { sendChatMessage } from '@/services/chat.service'
import { getApiConfig } from '@/services/api'

function stripHistory(hist: ChatMessage[]): object[] {
  return hist.map(m => {
    const entry: any = { role: m.role, content: m.content }
    if (m.images?.length) {
      entry.content += '\n[imagen adjunta]'
    }
    return entry
  })
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesRef = useRef<ChatMessage[]>([])
  messagesRef.current = messages

  const sendViaHttp = useCallback(async (content: string, context?: string, image?: string) => {
    try {
      const hist = stripHistory(messagesRef.current)
      const res = await sendChatMessage({ message: content, context, image, history: hist })
      setMessages((prev) => [...prev, {
        id: res.messageId,
        role: 'assistant',
        content: res.reply,
        reasoning: res.reasoning,
        images: res.images,
        timestamp: Date.now(),
      }])
    } catch {
      setMessages((prev) => [...prev, {
        id: `error-${Date.now()}`,
        role: 'system',
        content: 'Error al enviar mensaje. El servidor no está disponible.',
        timestamp: Date.now(),
      }])
    } finally {
      setSending(false)
    }
  }, [])

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

    const assistantId = `assistant-${Date.now()}`
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() }])

    let reply = ''
    let reasoning = ''

    const tryWs = async (): Promise<boolean> => {
      return new Promise((resolve) => {
        try {
          const wsUrl = import.meta.env.DEV
            ? `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/chat/ws`
            : `${getApiConfig().baseUrl.replace(/^http/, 'ws')}/chat/ws`

          const ws = new WebSocket(wsUrl)
          wsRef.current = ws
          const timeout = setTimeout(() => { ws.close(); resolve(false) }, 2000)

          ws.onopen = () => {
            clearTimeout(timeout)
            ws.send(JSON.stringify({
              message: content,
              context: context || undefined,
              image: image || undefined,
              history: stripHistory(messagesRef.current.slice(0, -1)),
            }))
          }

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data)
              switch (data.type) {
                case 'token':
                  reply += data.text
                  setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: reply } : m))
                  break
                case 'think':
                  reasoning += data.text
                  setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, reasoning } : m))
                  break
                case 'think_start':
                  reasoning = ''
                  break
                case 'final':
                  reply = data.reply
                  reasoning = data.reasoning || ''
                  setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: data.reply, reasoning: data.reasoning || '' } : m))
                  break
                case 'done':
                  setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, id: data.messageId } : m))
                  setSending(false)
                  resolve(true)
                  break
                case 'error':
                  throw new Error(data.text)
              }
            } catch { /* ignora parse errors */ }
          }

          ws.onerror = () => { clearTimeout(timeout); ws.close(); resolve(false) }
          ws.onclose = () => { wsRef.current = null }
        } catch {
          resolve(false)
        }
      })
    }

    const ok = await tryWs()
    if (!ok) {
      if (wsRef.current) { wsRef.current.close(); wsRef.current = null }
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      await sendViaHttp(content, context, image)
    }
  }, [sendViaHttp])

  return { messages, sending, send }
}
