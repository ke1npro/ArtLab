import { useState, useCallback, useMemo } from 'react'
import type { Reference } from '@/types/reference'

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

export function useReferences() {
  const [references] = useState<Reference[]>(MOCK_REFERENCES)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectedList = useMemo(
    () => references.filter((r) => selected.has(r.id)),
    [references, selected],
  )

  return { references, selected: selectedList, toggle, selectedIds: selected }
}
