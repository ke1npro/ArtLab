import type { BuildPromptRequest, BuildPromptResponse } from '@/types/prompt'
import { apiPost } from './api'

export async function buildPrompt(request: BuildPromptRequest): Promise<BuildPromptResponse> {
  return apiPost<BuildPromptResponse>('/build_prompt', request)
}
