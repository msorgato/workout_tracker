import { useEffect, useState } from 'react'
import { listCompletedSessions } from '../session/sessionsApi'
import { levelProgress, totalXp, type LevelProgress } from '../xp/xp'

/** XP totali e avanzamento di livello, derivati dallo storico (nessuna cache: cambia a ogni sessione conclusa). */
export function useXpSummary(uid: string | undefined) {
  const [state, setState] = useState<{
    xp: number
    progress: LevelProgress
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!uid) {
      setLoading(false)
      return
    }
    let cancelled = false
    listCompletedSessions(uid)
      .then((sessions) => {
        if (cancelled) return
        const xp = totalXp(sessions)
        setState({ xp, progress: levelProgress(xp) })
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [uid])

  return { xp: state?.xp ?? 0, progress: state?.progress ?? null, loading, error }
}
