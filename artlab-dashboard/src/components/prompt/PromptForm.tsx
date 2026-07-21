import type { PromptFormData } from '@/types/prompt'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface PromptFormProps {
  form: PromptFormData
  onChange: <K extends keyof PromptFormData>(field: K, value: PromptFormData[K]) => void
}

export function PromptForm({ form, onChange }: PromptFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Pipeline</label>
          <div className="flex gap-2">
            <button
              onClick={() => onChange('pipeline', 't2i')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                form.pipeline === 't2i'
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'bg-surface-input text-text-secondary border-surface-border hover:border-surface-hover'
              }`}
            >
              T2I
            </button>
            <button
              onClick={() => onChange('pipeline', 'ti2i')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                form.pipeline === 'ti2i'
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'bg-surface-input text-text-secondary border-surface-border hover:border-surface-hover'
              }`}
            >
              TI2I
            </button>
          </div>
        </div>
        {form.pipeline === 'ti2i' && (
          <div className="w-48">
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Strength: {form.ti2iStrength.toFixed(2)}
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={form.ti2iStrength}
              onChange={(e) => onChange('ti2iStrength', Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-0.5">
              <span>Más libertad</span>
              <span>Más fidelidad</span>
            </div>
          </div>
        )}
      </div>

      <Textarea
        label="Descripción de la escena"
        placeholder="Describe la escena que quieres generar..."
        value={form.sceneDescription}
        onChange={(e) => onChange('sceneDescription', e.target.value)}
        rows={3}
      />
      <Textarea
        label="Prompt positivo"
        placeholder="Lo que quieres ver en la imagen..."
        value={form.positivePrompt}
        onChange={(e) => onChange('positivePrompt', e.target.value)}
        rows={3}
      />
      <Textarea
        label="Prompt negativo"
        placeholder="Lo que NO quieres ver en la imagen..."
        value={form.negativePrompt}
        onChange={(e) => onChange('negativePrompt', e.target.value)}
        rows={2}
      />
      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Seed"
          type="number"
          placeholder="Aleatorio"
          value={form.seed ?? ''}
          onChange={(e) => onChange('seed', e.target.value ? Number(e.target.value) : null)}
        />
        <Input
          label="CFG"
          type="number"
          min={1}
          max={30}
          step={0.5}
          value={form.cfg}
          onChange={(e) => onChange('cfg', Number(e.target.value))}
        />
        <Input
          label="Steps"
          type="number"
          min={1}
          max={150}
          value={form.steps}
          onChange={(e) => onChange('steps', Number(e.target.value))}
        />
      </div>
    </div>
  )
}
