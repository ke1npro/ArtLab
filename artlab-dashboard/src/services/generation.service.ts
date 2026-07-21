import type { GenerateRequest, GenerateResponse } from '@/types/generation'
import { apiPost } from './api'

async function mockDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000))
}

export async function generateImage(request: GenerateRequest): Promise<GenerateResponse> {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await mockDelay()
    return {
      image: `https://picsum.photos/seed/generate-${Date.now()}/1024/1024`,
      seed: Math.floor(Math.random() * 2 ** 32),
      info: {
        pipeline: request.pipeline || 't2i',
        steps: request.steps || 20,
        cfg: request.cfg || 7,
      },
    }
  }
  return apiPost<GenerateResponse>('/generate', request)
}
