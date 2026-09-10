import { useCallback, useEffect, useState } from 'react'
import type { Routine, Session, SessionExercise } from '../../lib/types'
import {
  createFreeSession,
  createSessionFromRoutine,
  endSession as endSessionApi,
  findActiveSession,
  saveSessionExercises,
  saveSessionNotes,
} from './sessionsApi'

export function useActiveSession(uid: string | undefined) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      setLoading(false)
      return
    }
    let cancelled = false
    findActiveSession(uid).then((active) => {
      if (!cancelled) {
        setSession(active)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [uid])

  const startFromRoutine = useCallback(
    async (routine: Routine) => {
      if (!uid) throw new Error('Utente non autenticato')
      const created = await createSessionFromRoutine(uid, routine)
      setSession(created)
      return created
    },
    [uid],
  )

  const startFree = useCallback(async () => {
    if (!uid) throw new Error('Utente non autenticato')
    const created = await createFreeSession(uid)
    setSession(created)
    return created
  }, [uid])

  const addExercise = useCallback(
    async (exercise: { id: string; name: string }) => {
      if (!uid || !session) return
      const nextExercises: SessionExercise[] = [
        ...session.exercises,
        {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          order: session.exercises.length,
          sets: [],
        },
      ]
      setSession({ ...session, exercises: nextExercises })
      await saveSessionExercises(uid, session.id, nextExercises)
    },
    [uid, session],
  )

  const completeSet = useCallback(
    async (exerciseIndex: number, set: { weight: number; reps: number; restSeconds: number }) => {
      if (!uid || !session) return
      const nextExercises = session.exercises.map((exercise, index) => {
        if (index !== exerciseIndex) return exercise
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              setNumber: exercise.sets.length + 1,
              weight: set.weight,
              reps: set.reps,
              restSeconds: set.restSeconds,
              completedAt: Date.now(),
            },
          ],
        }
      })
      setSession({ ...session, exercises: nextExercises })
      await saveSessionExercises(uid, session.id, nextExercises)
    },
    [uid, session],
  )

  const updateNotes = useCallback(
    async (notes: string) => {
      if (!uid || !session) return
      setSession({ ...session, notes })
      await saveSessionNotes(uid, session.id, notes)
    },
    [uid, session],
  )

  const finishSession = useCallback(async () => {
    if (!uid || !session) return
    await endSessionApi(uid, session.id)
    setSession(null)
  }, [uid, session])

  return {
    session,
    loading,
    startFromRoutine,
    startFree,
    addExercise,
    completeSet,
    updateNotes,
    finishSession,
  }
}
