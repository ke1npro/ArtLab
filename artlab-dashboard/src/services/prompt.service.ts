import type { BuildPromptRequest, BuildPromptResponse } from '@/types/prompt'
import { apiPost } from './api'

function mockDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 500))
}

function buildMockPrompt(data: BuildPromptRequest): string {
  const parts: string[] = []
  if (data.sceneDescription) parts.push(`Scene: ${data.sceneDescription}`)
  if (data.positivePrompt) parts.push(`Positive: ${data.positivePrompt}`)
  if (data.negativePrompt) parts.push(`Negative: ${data.negativePrompt}`)
  if (data.seed !== null) parts.push(`Seed: ${data.seed}`)
  if (data.cfg !== undefined) parts.push(`CFG: ${data.cfg}`)
  if (data.steps !== undefined) parts.push(`Steps: ${data.steps}`)
  if (data.context) parts.push(`\n--- Context ---\n${data.context}`)
  if (data.references && data.references.length > 0) {
    parts.push(`\n--- References ---`)
    data.references.forEach((ref) => parts.push(`- ${ref.name} (${ref.thumbnail})`))
  }
  return parts.join('\n')
}

export async function buildPrompt(request: BuildPromptRequest): Promise<BuildPromptResponse> {
  await mockDelay()
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    return { prompt: buildMockPrompt(request) }
  }
  return apiPost<BuildPromptResponse>('/build_prompt', request)
}
