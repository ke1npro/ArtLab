import type { ChatRequest, ChatResponse } from '@/types/chat'
import { apiPost } from './api'

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  return apiPost<ChatResponse>('/chat', request)
}
