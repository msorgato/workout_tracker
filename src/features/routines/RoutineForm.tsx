import { useState } from 'react'
import { ExerciseAutocomplete } from '../../components/ExerciseAutocomplete'
import { Button, IconButton } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { NumberField, TextField } from '../../components/ui/fields'
import { PageHeader } from '../../components/ui/PageHeader'
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
      <PageHeader
        title={initialRoutine ? 'Modifica routine' : 'Nuova routine'}
        actions={<IconButton icon="x" label="Annulla" onClick={onCancel} />}
      />

      <div>
        <TextField
          label="Nome routine"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Es. Push day"
        />
        {nameError && <p className="mt-1 text-sm text-danger">{nameError}</p>}
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Aggiungi esercizio
        </span>
        <ExerciseAutocomplete uid={uid} onSelect={addExercise} />
      </div>

      <ul className="flex flex-col gap-3">
        {exercises.map((exercise, index) => (
          <li key={`${exercise.exerciseId}-${index}`}>
            <Card className="flex flex-col gap-3 p-3">
              <div className="flex items-center gap-1">
                <span className="min-w-0 flex-1 truncate font-semibold text-text">
                  {exercise.exerciseName}
                </span>
                <IconButton
                  icon="chevron-left"
                  label="Sposta su"
                  className="rotate-90"
                  onClick={() => moveExercise(index, -1)}
                  disabled={index === 0}
                />
                <IconButton
                  icon="chevron-left"
                  label="Sposta giù"
                  className="-rotate-90"
                  onClick={() => moveExercise(index, 1)}
                  disabled={index === exercises.length - 1}
                />
                <IconButton
                  icon="trash"
                  label="Rimuovi esercizio"
                  variant="danger-outline"
                  onClick={() => removeExercise(index)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumberField
                  label="Serie"
                  min={1}
                  value={exercise.targetSets}
                  onChange={(event) =>
                    updateExercise(index, { targetSets: Number(event.target.value) })
                  }
                />
                <NumberField
                  label="Reps"
                  min={1}
                  value={exercise.targetReps}
                  onChange={(event) =>
                    updateExercise(index, { targetReps: Number(event.target.value) })
                  }
                />
                <NumberField
                  label="Carico (kg)"
                  min={0}
                  value={exercise.targetWeight ?? ''}
                  onChange={(event) =>
                    updateExercise(index, {
                      targetWeight: event.target.value ? Number(event.target.value) : undefined,
                    })
                  }
                />
                <NumberField
                  label="Recupero (s)"
                  min={0}
                  value={exercise.targetRestSeconds}
                  onChange={(event) =>
                    updateExercise(index, { targetRestSeconds: Number(event.target.value) })
                  }
                />
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={saving}>
          Salva routine
        </Button>
        <Button type="button" size="lg" onClick={onCancel}>
          Annulla
        </Button>
      </div>
    </form>
  )
}
