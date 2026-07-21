import { useState } from 'react'
import type { Reference } from '@/types/reference'
import { ReferenceGrid } from '@/components/references/ReferenceGrid'
import { SelectedReferences } from '@/components/references/SelectedReferences'
import { useReferenceSelection } from '@/hooks/ReferenceSelectionContext'
import { Input } from '@/components/ui/Input'

const MOCK_REFERENCES: Reference[] = [
  { id: 'ref-1', name: 'Luna Concept', category: 'character', thumbnail: 'https://picsum.photos/seed/luna/400/300', selected: false },
  { id: 'ref-2', name: 'Atlas Design', category: 'character', thumbnail: 'https://picsum.photos/seed/atlas/400/300', selected: false },
  { id: 'ref-3', name: 'Anime Style', category: 'style', thumbnail: 'https://picsum.photos/seed/anime/400/300', selected: false },
  { id: 'ref-4', name: 'Render Study', category: 'style', thumbnail: 'https://picsum.photos/seed/render/400/300', selected: false },
  { id: 'ref-5', name: 'Coffee Shop', category: 'environment', thumbnail: 'https://picsum.photos/seed/coffee/400/300', selected: false },
  { id: 'ref-6', name: 'Neon Alley', category: 'environment', thumbnail: 'https://picsum.photos/seed/neon/400/300', selected: false },
  { id: 'ref-7', name: 'Character Sheet', category: 'character', thumbnail: 'https://picsum.photos/seed/sheet/400/300', selected: false },
  { id: 'ref-8', name: 'Mood Board', category: 'moodboard', thumbnail: 'https://picsum.photos/seed/mood/400/300', selected: false },
]

export function ReferencesPage() {
  const [references] = useState<Reference[]>(MOCK_REFERENCES)
  const [filter, setFilter] = useState('')
  const { selected, toggle } = useReferenceSelection()

  const filtered = references.filter((r) =>
    !filter || r.name.toLowerCase().includes(filter.toLowerCase()) || r.category.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">References</h1>
          <p className="text-sm text-text-muted mt-0.5">Gestiona tus imágenes de referencia</p>
        </div>
        <div className="w-64">
          <Input
            placeholder="Buscar referencias..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 overflow-auto">
          <ReferenceGrid
            references={filtered}
            onToggle={(id) => {
              const ref = references.find((r) => r.id === id)
              if (ref) toggle(ref)
            }}
            selectedIds={new Set(selected.map((r) => r.id))}
          />
        </div>
        <div className="w-64 shrink-0">
          <SelectedReferences
            references={selected}
            onToggle={(id) => {
              const ref = selected.find((r) => r.id === id)
              if (ref) toggle(ref)
            }}
          />
        </div>
      </div>
    </div>
  )
}
