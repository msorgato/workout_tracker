import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useActiveSession } from './useActiveSession'
import { useSessionDraft } from './useSessionDraft'

type SessionContextValue = ReturnType<typeof useActiveSession> &
  ReturnType<typeof useSessionDraft>

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const active = useActiveSession(user?.uid)
  const draft = useSessionDraft(active.session?.id)

  return <SessionContext.Provider value={{ ...active, ...draft }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within a SessionProvider')
  return context
}
