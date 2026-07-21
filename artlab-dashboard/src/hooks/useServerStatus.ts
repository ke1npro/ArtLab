import { useState, useEffect, useCallback, useRef } from 'react'
import type { ServerStatus } from '@/types/server'
import { apiHealthCheck } from '@/services/api'

export function useServerStatus() {
  const [status, setStatus] = useState<ServerStatus>('connecting')
  const currentRef = useRef<ServerStatus>('connecting')
  const initial = useRef(true)

  const check = useCallback(async () => {
    const ok = await apiHealthCheck()
    const current = currentRef.current

    if (initial.current) {
      initial.current = false
      const next: ServerStatus = ok ? 'online' : 'offline'
      currentRef.current = next
      setStatus(next)
      return
    }

    if (ok && current === 'offline') {
      currentRef.current = 'online'
      setStatus('online')
    } else if (!ok && current === 'online') {
      currentRef.current = 'offline'
      setStatus('offline')
    }
  }, [])

  useEffect(() => {
    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [check])

  return { status, check }
}
