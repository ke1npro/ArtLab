import { createContext, useContext, type ReactNode } from 'react'
import type { LLMParams, GenDefaults } from '@/types/settings'
import { usePersistedState } from './usePersistedState'

interface SettingsValue {
  llm: LLMParams
  genDefaults: GenDefaults
  updateLlm: (updates: Partial<LLMParams>) => void
  updateGenDefaults: (updates: Partial<GenDefaults>) => void
}

const DEFAULT_LLM: LLMParams = {
  model: 'Qwen3.5-9B-Q8',
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxTokens: 2048,
  contextSize: 8192,
  frequencyPenalty: 0,
  presencePenalty: 0,
}

const DEFAULT_GEN: GenDefaults = {
  pipeline: 't2i',
  cfg: 7,
  steps: 20,
  width: 1024,
  height: 1024,
  sampler: 'dpmpp_2m_karras',
  ti2iStrength: 0.8,
}

const SettingsContext = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [llm, setLlm] = usePersistedState<LLMParams>('settings_llm', DEFAULT_LLM)
  const [genDefaults, setGenDefaults] = usePersistedState<GenDefaults>('settings_gen', DEFAULT_GEN)

  const updateLlm = (updates: Partial<LLMParams>) => {
    setLlm((prev) => ({ ...prev, ...updates }))
  }

  const updateGenDefaults = (updates: Partial<GenDefaults>) => {
    setGenDefaults((prev) => ({ ...prev, ...updates }))
  }

  return (
    <SettingsContext.Provider value={{ llm, genDefaults, updateLlm, updateGenDefaults }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettingsContext must be used within SettingsProvider')
  return ctx
}
