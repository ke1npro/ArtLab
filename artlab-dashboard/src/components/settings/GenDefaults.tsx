import { useSettingsContext } from '@/hooks/SettingsContext'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { PipelineType } from '@/types/settings'

const SAMPLERS = [
  { value: 'dpmpp_2m_karras', label: 'DPM++ 2M Karras' },
  { value: 'dpmpp_2m_sde_karras', label: 'DPM++ 2M SDE Karras' },
  { value: 'euler_a', label: 'Euler A' },
  { value: 'euler', label: 'Euler' },
  { value: 'ddim', label: 'DDIM' },
  { value: 'lms', label: 'LMS' },
  { value: 'heun', label: 'Heun' },
]

const RESOLUTIONS = [
  { value: '1024x1024', label: '1024×1024 (cuadrado)' },
  { value: '1216x832', label: '1216×832 (horizontal)' },
  { value: '832x1216', label: '832×1216 (vertical)' },
  { value: '1536x640', label: '1536×640 (panorámica)' },
  { value: '640x1536', label: '640×1536 (retrato completo)' },
]

export function GenDefaults() {
  const { genDefaults, updateGenDefaults } = useSettingsContext()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">⚙️ Valores por defecto</h3>
        <p className="text-xs text-text-muted mb-3">Se persisten y se precargan en el Prompt Builder</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1.5">Pipeline predeterminado</label>
        <div className="flex gap-2">
          {(['t2i', 'ti2i'] as PipelineType[]).map((p) => (
            <button
              key={p}
              onClick={() => updateGenDefaults({ pipeline: p })}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
                genDefaults.pipeline === p
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'bg-surface-input text-text-secondary border-surface-border'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {genDefaults.pipeline === 'ti2i' && (
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            TI2I Strength: {genDefaults.ti2iStrength.toFixed(2)}
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={genDefaults.ti2iStrength}
            onChange={(e) => updateGenDefaults({ ti2iStrength: Number(e.target.value) })}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] text-text-muted mt-0.5">
            <span>Más libertad</span>
            <span>Más fidelidad</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="CFG"
          type="number"
          min={1}
          max={30}
          step={0.5}
          value={genDefaults.cfg}
          onChange={(e) => updateGenDefaults({ cfg: Number(e.target.value) })}
        />
        <Input
          label="Steps"
          type="number"
          min={1}
          max={150}
          value={genDefaults.steps}
          onChange={(e) => updateGenDefaults({ steps: Number(e.target.value) })}
        />
      </div>

      <Select
        label="Resolución"
        options={RESOLUTIONS}
        value={`${genDefaults.width}x${genDefaults.height}`}
        onChange={(e) => {
          const [w, h] = e.target.value.split('x').map(Number)
          updateGenDefaults({ width: w, height: h })
        }}
      />

      <Select
        label="Sampler"
        options={SAMPLERS}
        value={genDefaults.sampler}
        onChange={(e) => updateGenDefaults({ sampler: e.target.value })}
      />
    </div>
  )
}
