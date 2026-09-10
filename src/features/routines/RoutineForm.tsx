import { useState } from 'react'
import { ExerciseAutocomplete } from '../../components/ExerciseAutocomplete'
import type { Routine, RoutineExercise, RoutineInput } from '../../lib/types'

interface RoutineFormProps {
  uid: string | undefined
  initialRoutine?: Routine
  onSave: (input: RoutineInput) => Promise<void>
  onCancel: () => void
}

export function RoutineForm({ uid, initialRoutine, onSave, onCancel }: RoutineFormProps) {
  const [name, setName] = useState(initialRoutine?.name ?? '')
  const [exercises, setExercises] = useState<RoutineExercise[]>(initialRoutine?.exercises ?? [])
  const [nameError, setNameError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function addExercise(exercise: { id: string; name: string }) {
    setExercises((current) => [
      ...current,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        targetSets: 3,
        targetReps: 10,
        targetRestSeconds: 90,
        order: current.length,
      },
    ])
  }

  function updateExercise(index: number, patch: Partial<RoutineExercise>) {
    setExercises((current) =>
      current.map((exercise, i) => (i === index ? { ...exercise, ...patch } : exercise)),
    )
  }

  function removeExercise(index: number) {
    setExercises((current) =>
      current.filter((_, i) => i !== index).map((exercise, i) => ({ ...exercise, order: i })),
    )
  }

  function moveExercise(index: number, direction: -1 | 1) {
    setExercises((current) => {
      const target = index + direction
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next.map((exercise, i) => ({ ...exercise, order: i }))
    })
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError('Il nome della routine è obbligatorio')
      return
    }
    setNameError(null)
    setSaving(true)
    try {
      await onSave({ name: trimmedName, exercises })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nome routine</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Es. Push day"
        />
        {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Aggiungi esercizio</label>
        <ExerciseAutocomplete uid={uid} onSelect={addExercise} />
      </div>

      <ul className="flex flex-col gap-2">
        {exercises.map((exercise, index) => (
          <li
            key={`${exercise.exerciseId}-${index}`}
            className="flex flex-wrap items-center gap-2 rounded-md border border-gray-200 p-2"
          >
            <span className="min-w-[120px] flex-1 text-sm font-medium">
              {exercise.exerciseName}
            </span>
            <label className="text-xs text-gray-500">
              Serie
              <input
                type="number"
                min={1}
                value={exercise.targetSets}
                onChange={(event) =>
                  updateExercise(index, { targetSets: Number(event.target.value) })
                }
                className="ml-1 w-14 rounded border border-gray-300 px-1 py-0.5"
              />
            </label>
            <label className="text-xs text-gray-500">
              Reps
              <input
                type="number"
                min={1}
                value={exercise.targetReps}
                onChange={(event) =>
                  updateExercise(index, { targetReps: Number(event.target.value) })
                }
                className="ml-1 w-14 rounded border border-gray-300 px-1 py-0.5"
              />
            </label>
            <label className="text-xs text-gray-500">
              Recupero (s)
              <input
                type="number"
                min={0}
                value={exercise.targetRestSeconds}
                onChange={(event) =>
                  updateExercise(index, { targetRestSeconds: Number(event.target.value) })
                }
                className="ml-1 w-16 rounded border border-gray-300 px-1 py-0.5"
              />
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => moveExercise(index, -1)}
                disabled={index === 0}
                className="rounded border border-gray-300 px-2 py-0.5 text-xs disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveExercise(index, 1)}
                disabled={index === exercises.length - 1}
                className="rounded border border-gray-300 px-2 py-0.5 text-xs disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeExercise(index)}
                className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-600"
              >
                Rimuovi
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Salva routine
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
        >
          Annulla
        </button>
      </div>
    </form>
  )
}
