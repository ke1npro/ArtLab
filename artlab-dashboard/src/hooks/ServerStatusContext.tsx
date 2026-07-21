import { createContext, useContext, type ReactNode } from 'react'
import { useServerStatus } from './useServerStatus'
import type { ServerStatus } from '@/types/server'

interface ServerStatusContextValue {
  status: ServerStatus
  offline: boolean
}

const ServerStatusContext = createContext<ServerStatusContextValue | null>(null)

export function ServerStatusProvider({ children }: { children: ReactNode }) {
  const { status } = useServerStatus()
  return (
    <ServerStatusContext.Provider value={{ status, offline: status === 'offline' }}>
      {children}
    </ServerStatusContext.Provider>
  )
}

export function useServerStatusContext() {
  const ctx = useContext(ServerStatusContext)
  if (!ctx) throw new Error('useServerStatusContext must be used within ServerStatusProvider')
  return ctx
}
