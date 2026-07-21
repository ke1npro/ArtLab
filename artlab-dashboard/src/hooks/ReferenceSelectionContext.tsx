import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Reference } from '@/types/reference'

interface ReferenceSelectionValue {
  selected: Reference[]
  toggle: (ref: Reference) => void
  clear: () => void
  isSelected: (id: string) => boolean
}

const ReferenceSelectionContext = createContext<ReferenceSelectionValue | null>(null)

export function ReferenceSelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Reference[]>([])

  const toggle = useCallback((ref: Reference) => {
    setSelected((prev) => {
      const exists = prev.find((r) => r.id === ref.id)
      if (exists) return prev.filter((r) => r.id !== ref.id)
      return [...prev, ref]
    })
  }, [])

  const clear = useCallback(() => setSelected([]), [])

  const isSelected = useCallback((id: string) => {
    return selected.some((r) => r.id === id)
  }, [selected])

  return (
    <ReferenceSelectionContext.Provider value={{ selected, toggle, clear, isSelected }}>
      {children}
    </ReferenceSelectionContext.Provider>
  )
}

export function useReferenceSelection() {
  const ctx = useContext(ReferenceSelectionContext)
  if (!ctx) throw new Error('useReferenceSelection must be used within ReferenceSelectionProvider')
  return ctx
}
