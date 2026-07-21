export type PipelineType = 't2i' | 'ti2i'

export interface PromptFormData {
  sceneDescription: string
  positivePrompt: string
  negativePrompt: string
  seed: number | null
  cfg: number
  steps: number
  pipeline: PipelineType
  ti2iStrength: number
}

export interface BuildPromptRequest extends PromptFormData {
  context?: string
  references?: { id: string; name: string; thumbnail: string }[]
}

export interface BuildPromptResponse {
  prompt: string
}

export interface ContextDocument {
  path: string
  name: string
  category: string
  content: string
  size: number
  selected: boolean
}
