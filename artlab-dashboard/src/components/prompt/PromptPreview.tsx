import type { BuildPromptResponse } from '@/types/prompt'

interface PromptPreviewProps {
  result: BuildPromptResponse | null
  building: boolean
}

export function PromptPreview({ result, building }: PromptPreviewProps) {
  return (
    <div>
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
        Vista previa del prompt
      </h3>
      <div className="bg-surface-input border border-surface-border rounded-xl p-4 min-h-[200px]">
        {building ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Construyendo prompt...
            </div>
          </div>
        ) : result ? (
          <pre className="text-sm text-text-primary whitespace-pre-wrap font-sans leading-relaxed">
            {result.prompt}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted text-sm">Completa los campos y presiona "Build Prompt"</p>
          </div>
        )}
      </div>
    </div>
  )
}
