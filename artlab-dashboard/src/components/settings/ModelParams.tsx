import { useSettingsContext } from '@/hooks/SettingsContext'

function Slider({ label, value, onChange, min, max, step = 0.1 }: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-xs text-text-primary font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </div>
  )
}

export function ModelParams() {
  const { llm, updateLlm } = useSettingsContext()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">🤖 Qwen3.5-9B (Q8)</h3>
        <p className="text-xs text-text-muted mb-3">Parámetros del LLM de chat — se persisten automáticamente</p>
      </div>

      <div className="bg-surface-hover rounded-lg px-3 py-2 text-xs text-text-secondary font-mono">
        Modelo: <span className="text-text-primary">Qwen3.5-9B-Q8.gguf</span> &middot; Cuantización: <span className="text-text-primary">Q8_0</span> &middot; RAM estimada: <span className="text-text-primary">~4.5 GB</span>
      </div>

      <div className="space-y-3">
        <Slider label="Temperature" value={llm.temperature} onChange={(v) => updateLlm({ temperature: v })} min={0} max={2} step={0.05} />
        <Slider label="Top P" value={llm.topP} onChange={(v) => updateLlm({ topP: v })} min={0} max={1} step={0.05} />
        <Slider label="Top K" value={llm.topK} onChange={(v) => updateLlm({ topK: v })} min={0} max={100} step={1} />
        <Slider label="Max tokens" value={llm.maxTokens} onChange={(v) => updateLlm({ maxTokens: v })} min={128} max={8192} step={128} />
        <Slider label="Context size" value={llm.contextSize} onChange={(v) => updateLlm({ contextSize: v })} min={1024} max={65536} step={1024} />
        <Slider label="Frequency penalty" value={llm.frequencyPenalty} onChange={(v) => updateLlm({ frequencyPenalty: v })} min={0} max={2} step={0.1} />
        <Slider label="Presence penalty" value={llm.presencePenalty} onChange={(v) => updateLlm({ presencePenalty: v })} min={0} max={2} step={0.1} />
      </div>
    </div>
  )
}
