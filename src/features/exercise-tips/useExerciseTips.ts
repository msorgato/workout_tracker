import { useCallback, useEffect, useState } from 'react'
import type { PersonalTip, TipCategory } from '../../lib/types'
import { listAllPersonalTips, savePersonalTips } from './exerciseTipsApi'

// Cache a livello di modulo come per le librerie esercizi: una sola lettura
// della collezione per sessione di navigazione, poi aggiornata dalle mutazioni.
let cache: { uid: string; tips: Map<string, PersonalTip[]> } | null = null

export function useExerciseTips(uid: string | undefined) {
  const [tipsByExercise, setTipsByExercise] = useState<Map<string, PersonalTip[]>>(
    cache && cache.uid === uid ? cache.tips : new Map(),
  )
  const [loading, setLoading] = useState(!(cache && cache.uid === uid))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!uid || (cache && cache.uid === uid)) {
      setLoading(false)
      return
    }

    let cancelled = false
    listAllPersonalTips(uid)
      .then((tips) => {
        if (cancelled) return
        cache = { uid, tips }
        setTipsByExercise(tips)
      })
      .catch(() => {
        if (!cancelled) setError('Impossibile caricare i tips personali')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [uid])

  /** Applica `next` subito (ottimistico) e lo salva; se fallisce ripristina lo stato precedente. */
  const persist = useCallback(
    async (exerciseId: string, next: PersonalTip[]): Promise<boolean> => {
      if (!uid) return false
      const previous = tipsByExercise
      const updated = new Map(previous)
      if (next.length > 0) updated.set(exerciseId, next)
      else updated.delete(exerciseId)

      setTipsByExercise(updated)
      cache = { uid, tips: updated }
      setError(null)
      try {
        await savePersonalTips(uid, exerciseId, next)
        return true
      } catch {
        setTipsByExercise(previous)
        cache = { uid, tips: previous }
        setError('Salvataggio non riuscito. Riprova.')
        return false
      }
    },
    [uid, tipsByExercise],
  )

  const addTip = useCallback(
    (exerciseId: string, input: { category: TipCategory; text: string }) =>
      persist(exerciseId, [
        ...(tipsByExercise.get(exerciseId) ?? []),
        { id: crypto.randomUUID(), ...input },
      ]),
    [persist, tipsByExercise],
  )

  const updateTip = useCallback(
    (exerciseId: string, tipId: string, input: { category: TipCategory; text: string }) =>
      persist(
        exerciseId,
        (tipsByExercise.get(exerciseId) ?? []).map((tip) =>
          tip.id === tipId ? { ...tip, ...input } : tip,
        ),
      ),
    [persist, tipsByExercise],
  )

  const deleteTip = useCallback(
    (exerciseId: string, tipId: string) =>
      persist(
        exerciseId,
        (tipsByExercise.get(exerciseId) ?? []).filter((tip) => tip.id !== tipId),
      ),
    [persist, tipsByExercise],
  )

  return { tipsByExercise, loading, error, addTip, updateTip, deleteTip }
}
