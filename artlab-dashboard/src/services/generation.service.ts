import type { GenerateRequest, GenerateResponse } from '@/types/generation'
import { apiPost } from './api'

export async function generateImage(request: GenerateRequest): Promise<GenerateResponse> {
  return apiPost<GenerateResponse>('/generate', request)
}
