import { useState } from 'react'
import { ExerciseAutocomplete } from '../../components/ExerciseAutocomplete'
import { RestTimer } from '../rest-timer/RestTimer'
import { useSession } from './SessionContext'

interface ActiveSessionPageProps {
  uid: string
  onDone: () => void
}

export function ActiveSessionPage({ uid, onDone }: ActiveSessionPageProps) {
  const { session, addExercise, completeSet, updateNotes, finishSession } = useSession()
  const [restFor, setRestFor] = useState<{ exerciseIndex: number; seconds: number } | null>(null)
  const [weightInputs, setWeightInputs] = useState<Record<number, string>>({})
  const [repsInputs, setRepsInputs] = useState<Record<number, string>>({})

  if (!session) {
    return <p className="text-sm text-gray-500">Nessuna sessione attiva.</p>
  }

  async function handleCompleteSet(exerciseIndex: number, defaultRestSeconds: number) {
    const weight = Number(weightInputs[exerciseIndex] ?? 0)
    const reps = Number(repsInputs[exerciseIndex] ?? 0)
    await completeSet(exerciseIndex, { weight, reps, restSeconds: defaultRestSeconds })
    setRestFor({ exerciseIndex, seconds: defaultRestSeconds })
  }

  async function handleFinish() {
    await finishSession()
    onDone()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {session.routineName ?? 'Sessione libera'}
        </h2>
        <button
          type="button"
          onClick={handleFinish}
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          Termina sessione
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {session.exercises.map((exercise, index) => (
          <li
            key={`${exercise.exerciseId}-${index}`}
            className="rounded-md border border-gray-200 p-3"
          >
            <p className="mb-2 font-medium text-gray-900">{exercise.exerciseName}</p>

            <ul className="mb-2 flex flex-col gap-1 text-sm text-gray-600">
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
                value={weightInputs[index] ?? ''}
                onChange={(event) =>
                  setWeightInputs((current) => ({ ...current, [index]: event.target.value }))
                }
                className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Reps"
                value={repsInputs[index] ?? ''}
                onChange={(event) =>
                  setRepsInputs((current) => ({ ...current, [index]: event.target.value }))
                }
                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => handleCompleteSet(index, 90)}
                className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white"
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
        <p className="mb-1 text-sm font-medium text-gray-700">Aggiungi esercizio</p>
        <ExerciseAutocomplete uid={uid} onSelect={addExercise} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
        <textarea
          value={session.notes ?? ''}
          onChange={(event) => updateNotes(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          rows={2}
        />
      </div>
    </div>
  )
}
