import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { getProfile, saveAvatar as saveAvatarApi } from './profileApi'

interface ProfileState {
  avatarId: string | undefined
  loading: boolean
  error: string | null
  /**
   * Salva l'avatar e lo applica al profilo SOLO a scrittura riuscita; in caso di errore
   * restituisce false, espone `error` e lascia invariato l'avatar mostrato.
   */
  saveAvatar: (nextId: string) => Promise<boolean>
  clearError: () => void
}

const ProfileContext = createContext<ProfileState | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const uid = user?.uid
  const [avatarId, setAvatarId] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!uid) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    getProfile(uid)
      .then((profile) => {
        if (!cancelled) setAvatarId(profile.avatarId)
      })
      .catch(() => {
        if (!cancelled) setError('Impossibile caricare il profilo')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [uid])

  const saveAvatar = useCallback(
    async (nextId: string): Promise<boolean> => {
      if (!uid) return false
      setError(null)
      try {
        await saveAvatarApi(uid, nextId)
        setAvatarId(nextId)
        return true
      } catch {
        setError('Salvataggio non riuscito. Riprova.')
        return false
      }
    },
    [uid],
  )

  const clearError = useCallback(() => setError(null), [])

  return (
    <ProfileContext.Provider value={{ avatarId, loading, error, saveAvatar, clearError }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile must be used within a ProfileProvider')
  return context
}
