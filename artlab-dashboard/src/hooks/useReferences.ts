import { useState, useCallback, useMemo } from 'react'
import type { Reference } from '@/types/reference'

export function useReferences() {
  const [references] = useState<Reference[]>([])
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
