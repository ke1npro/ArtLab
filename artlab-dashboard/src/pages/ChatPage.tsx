import { useChat } from '@/hooks/useChat'
import { ChatHistory } from '@/components/chat/ChatHistory'
import { ChatInput } from '@/components/chat/ChatInput'
import { ModelLoadBanner } from '@/components/ui/ModelLoadBanner'
import { useServerStatusContext } from '@/hooks/ServerStatusContext'
import { loadModel } from '@/services/system.service'

export function ChatPage() {
  const { offline } = useServerStatusContext()
  const { messages, sending, send } = useChat()

  const handleSend = async (content: string, context?: string, image?: string) => {
    try {
      await loadModel('qwen', true)
    } catch { /* silencio */ }
    send(content, context, image)
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-text-primary">Chat</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Asistente con soporte de contexto (.md), imágenes y razonamiento
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <ModelLoadBanner modelId="qwen" actionLabel="chatear" />
        <div className="flex-1 flex flex-col bg-surface-raised border border-surface-border rounded-xl overflow-hidden">
          <ChatHistory messages={messages} />
          <ChatInput onSend={handleSend} disabled={offline} loading={sending} />
        </div>
      </div>
    </div>
  )
}
