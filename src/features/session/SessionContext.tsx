import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useActiveSession } from './useActiveSession'

type ActiveSessionState = ReturnType<typeof useActiveSession>

const SessionContext = createContext<ActiveSessionState | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const value = useActiveSession(user?.uid)

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within a SessionProvider')
  return context
}
