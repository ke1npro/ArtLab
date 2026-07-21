export interface GenerateRequest {
  prompt: string
  negativePrompt?: string
  seed?: number
  cfg?: number
  steps?: number
  pipeline?: 't2i' | 'ti2i'
  ti2iStrength?: number
  referenceImage?: string
  width?: number
  height?: number
}

export interface GenerateResponse {
  image: string
  seed: number
  info?: {
    pipeline: string
    steps: number
    cfg: number
  }
}
