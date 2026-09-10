import { useCallback, useEffect, useState } from 'react'
import type { Routine, RoutineInput } from '../../lib/types'
import { createRoutine, deleteRoutine, listRoutines, updateRoutine } from './routinesApi'

export function useRoutines(uid: string | undefined) {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!uid) return
    setLoading(true)
    const result = await listRoutines(uid)
    setRoutines(result)
    setLoading(false)
  }, [uid])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addRoutine(input: RoutineInput) {
    if (!uid) throw new Error('Utente non autenticato')
    const created = await createRoutine(uid, input)
    setRoutines((current) => [created, ...current])
    return created
  }

  async function editRoutine(routineId: string, input: RoutineInput) {
    if (!uid) throw new Error('Utente non autenticato')
    await updateRoutine(uid, routineId, input)
    setRoutines((current) =>
      current.map((routine) =>
        routine.id === routineId ? { ...routine, ...input, updatedAt: Date.now() } : routine,
      ),
    )
  }

  async function removeRoutine(routineId: string) {
    if (!uid) throw new Error('Utente non autenticato')
    await deleteRoutine(uid, routineId)
    setRoutines((current) => current.filter((routine) => routine.id !== routineId))
  }

  return { routines, loading, addRoutine, editRoutine, removeRoutine, refresh }
}
