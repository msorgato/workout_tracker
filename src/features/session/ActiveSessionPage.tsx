import { useState } from 'react'
import { ExerciseAutocomplete } from '../../components/ExerciseAutocomplete'
import { RestTimer } from '../rest-timer/RestTimer'
import { useSession } from './SessionContext'

interface ActiveSessionPageProps {
  uid: string
  onDone: () => void
}

const DEFAULT_REST_SECONDS = 90

export function ActiveSessionPage({ uid, onDone }: ActiveSessionPageProps) {
  const { session, addExercise, completeSet, updateExerciseRestSeconds, updateNotes, finishSession } =
    useSession()
  const [restFor, setRestFor] = useState<{ exerciseIndex: number; seconds: number } | null>(null)
  const [weightInputs, setWeightInputs] = useState<Record<number, string>>({})
  const [repsInputs, setRepsInputs] = useState<Record<number, string>>({})

  if (!session) {
    return <p className="text-sm text-text-muted">Nessuna sessione attiva.</p>
  }

  async function handleCompleteSet(exerciseIndex: number, restSeconds: number) {
    const targetWeight = session!.exercises[exerciseIndex]?.targetWeight
    const weight = Number(weightInputs[exerciseIndex] ?? targetWeight ?? 0)
    const reps = Number(repsInputs[exerciseIndex] ?? 0)
    await completeSet(exerciseIndex, { weight, reps, restSeconds })
    setRestFor({ exerciseIndex, seconds: restSeconds })
  }

  async function handleFinish() {
    await finishSession()
    onDone()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">
          {session.routineName ?? 'Sessione libera'}
        </h2>
        <button
          type="button"
          onClick={handleFinish}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text hover:bg-surface-hover"
        >
          Termina sessione
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {session.exercises.map((exercise, index) => (
          <li
            key={`${exercise.exerciseId}-${index}`}
            className="rounded-md border border-border bg-surface p-3"
          >
            <p className="mb-2 font-medium text-text">{exercise.exerciseName}</p>

            <ul className="mb-2 flex flex-col gap-1 text-sm text-text-muted">
              {exercise.sets.map((set) => (
                <li key={set.setNumber}>
                  Serie {set.setNumber}: {set.weight}kg × {set.reps} reps
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                placeholder="Peso (kg)"
                value={weightInputs[index] ?? (exercise.targetWeight?.toString() ?? '')}
                onChange={(event) =>
                  setWeightInputs((current) => ({ ...current, [index]: event.target.value }))
                }
                className="w-24 rounded border border-border bg-bg px-2 py-1 text-sm text-text"
              />
              <input
                type="number"
                placeholder="Reps"
                value={repsInputs[index] ?? ''}
                onChange={(event) =>
                  setRepsInputs((current) => ({ ...current, [index]: event.target.value }))
                }
                className="w-20 rounded border border-border bg-bg px-2 py-1 text-sm text-text"
              />
              <label className="flex items-center gap-1 text-xs text-text-muted">
                Recupero (s)
                <input
                  type="number"
                  min={0}
                  value={exercise.targetRestSeconds ?? DEFAULT_REST_SECONDS}
                  onChange={(event) =>
                    updateExerciseRestSeconds(index, Number(event.target.value))
                  }
                  className="w-16 rounded border border-border bg-bg px-2 py-1 text-text"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  handleCompleteSet(index, exercise.targetRestSeconds ?? DEFAULT_REST_SECONDS)
                }
                className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-contrast hover:bg-accent-hover"
              >
                Serie completata
              </button>
            </div>

            {restFor?.exerciseIndex === index && (
              <div className="mt-2">
                <RestTimer
                  key={exercise.sets.length}
                  targetSeconds={restFor.seconds}
                  onFinish={() => setRestFor(null)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <div>
        <p className="mb-1 text-sm font-medium text-text-muted">Aggiungi esercizio</p>
        <ExerciseAutocomplete uid={uid} onSelect={addExercise} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text-muted">Note</label>
        <textarea
          value={session.notes ?? ''}
          onChange={(event) => updateNotes(event.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
          rows={2}
        />
      </div>
    </div>
  )
}
