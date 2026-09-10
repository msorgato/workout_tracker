import { useCallback, useEffect, useState } from 'react'
import predefinedExercises from '../../data/predefinedExercises.json'
import type { ExerciseOption } from '../../lib/types'
import { createCustomExercise, listCustomExercises } from './customExercises'

const predefinedOptions: ExerciseOption[] = predefinedExercises.map((exercise) => ({
  ...exercise,
  isCustom: false,
}))

// Cached in memory for the app session: predefined exercises never change at
// runtime and custom exercises rarely do, so we avoid re-reading Firestore
// every time the autocomplete mounts.
let customOptionsCache: ExerciseOption[] | null = null

export function useExerciseLibrary(uid: string | undefined) {
  const [customOptions, setCustomOptions] = useState<ExerciseOption[]>(customOptionsCache ?? [])
  const [loading, setLoading] = useState(customOptionsCache === null)

  useEffect(() => {
    if (!uid || customOptionsCache !== null) {
      setLoading(false)
      return
    }

    let cancelled = false
    listCustomExercises(uid).then((exercises) => {
      if (cancelled) return
      const options = exercises.map((exercise) => ({ ...exercise, isCustom: true as const }))
      customOptionsCache = options
      setCustomOptions(options)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [uid])

  const addCustomExercise = useCallback(
    async (input: { name: string; muscleGroup?: string }) => {
      if (!uid) throw new Error('Utente non autenticato')
      const created = await createCustomExercise(uid, input)
      const option: ExerciseOption = { ...created, isCustom: true }
      customOptionsCache = [option, ...(customOptionsCache ?? [])]
      setCustomOptions(customOptionsCache)
      return option
    },
    [uid],
  )

  return {
    options: [...predefinedOptions, ...customOptions] as ExerciseOption[],
    loading,
    addCustomExercise,
  }
}
