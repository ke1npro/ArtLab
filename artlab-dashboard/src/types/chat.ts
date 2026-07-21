export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  reasoning?: string
  images?: string[]
  timestamp: number
}

export interface ChatRequest {
  message: string
  context?: string
  image?: string
  history?: ChatMessage[]
}

export interface ChatResponse {
  reply: string
  reasoning?: string
  images?: string[]
  messageId: string
}
