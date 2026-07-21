import { useState, useCallback } from 'react'
import { loadState, saveState } from '@/services/storage.service'

export function usePersistedState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => loadState(key, defaultValue))

  const setPersisted = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof newValue === 'function'
        ? (newValue as (p: T) => T)(prev)
        : newValue
      saveState(key, next)
      return next
    })
  }, [key])

  return [value, setPersisted] as const
}
