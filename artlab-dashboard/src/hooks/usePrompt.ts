import { useState, useCallback } from 'react'
import type { PromptFormData, BuildPromptResponse } from '@/types/prompt'
import { buildPrompt } from '@/services/prompt.service'

export function usePrompt(defaults?: Partial<PromptFormData>) {
  const DEFAULT_FORM: PromptFormData = {
    sceneDescription: '',
    positivePrompt: '',
    negativePrompt: '',
    seed: null,
    cfg: defaults?.cfg ?? 7,
    steps: defaults?.steps ?? 20,
    pipeline: defaults?.pipeline ?? 't2i',
    ti2iStrength: defaults?.ti2iStrength ?? 0.8,
  }

  const [form, setForm] = useState<PromptFormData>(DEFAULT_FORM)
  const [result, setResult] = useState<BuildPromptResponse | null>(null)
  const [building, setBuilding] = useState(false)

  const updateField = useCallback(<K extends keyof PromptFormData>(field: K, value: PromptFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const build = useCallback(async (context?: string, references?: { id: string; name: string; thumbnail: string }[]) => {
    setBuilding(true)
    try {
      const res = await buildPrompt({ ...form, context, references })
      setResult(res)
    } catch {
      setResult({ prompt: 'Error building prompt.' })
    } finally {
      setBuilding(false)
    }
  }, [form])

  const reset = useCallback(() => {
    setForm(DEFAULT_FORM)
    setResult(null)
  }, [])

  return { form, result, building, updateField, build, reset }
}
