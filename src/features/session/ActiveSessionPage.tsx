import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExerciseAutocomplete } from '../../components/ExerciseAutocomplete'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { inputClass } from '../../components/ui/fields'
import { PageHeader } from '../../components/ui/PageHeader'
import { Stepper } from '../../components/ui/Stepper'
import { parseDecimal } from '../../lib/numberInput'
import { RestTimer } from '../rest-timer/RestTimer'
import { useSession } from './SessionContext'

interface ActiveSessionPageProps {
  uid: string
  onDone: () => void
}

const DEFAULT_REST_SECONDS = 90
const WEIGHT_STEP = 2.5
const REPS_STEP = 1
// Spazio riservato in fondo alla pagina per il timer ancorato sopra la tab bar.
const TIMER_DOCK_HEIGHT = '6rem'

export function ActiveSessionPage({ uid, onDone }: ActiveSessionPageProps) {
  const {
    session,
    startFree,
    addExercise,
    completeSet,
    updateExerciseRestSeconds,
    updateNotes,
    finishSession,
  } = useSession()
  const navigate = useNavigate()
  const [restFor, setRestFor] = useState<{ exerciseIndex: number; seconds: number } | null>(null)
  const [weightInputs, setWeightInputs] = useState<Record<number, string>>({})
  const [repsInputs, setRepsInputs] = useState<Record<number, string>>({})

  const timerVisible = restFor !== null
  useEffect(() => {
    if (!timerVisible) return
    document.documentElement.style.setProperty('--dock-h', TIMER_DOCK_HEIGHT)
    return () => {
      document.documentElement.style.setProperty('--dock-h', '0px')
    }
  }, [timerVisible])

  if (!session) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Sessione" />
        <EmptyState
          icon="dumbbell"
          message="Nessuna sessione attiva. Parti da una routine o allenati liberamente."
        >
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Button variant="primary" size="lg" icon="flame" fullWidth onClick={() => startFree()}>
              Avvia sessione libera
            </Button>
            <Button icon="list" fullWidth onClick={() => navigate('/routines')}>
              Scegli una routine
            </Button>
          </div>
        </EmptyState>
      </div>
    )
  }

  async function handleCompleteSet(exerciseIndex: number, restSeconds: number) {
    const targetWeight = session!.exercises[exerciseIndex]?.targetWeight
    const weight = parseDecimal(weightInputs[exerciseIndex] ?? targetWeight?.toString() ?? '')
    const reps = parseDecimal(repsInputs[exerciseIndex] ?? '')
    await completeSet(exerciseIndex, { weight, reps, restSeconds })
    setRestFor({ exerciseIndex, seconds: restSeconds })
  }

  async function handleFinish() {
    await finishSession()
    onDone()
  }

  const restExercise = restFor ? session.exercises[restFor.exerciseIndex] : undefined

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={session.routineName ?? 'Sessione libera'}
        showLogout={false}
        actions={
          <Button variant="secondary" onClick={handleFinish}>
            Termina
          </Button>
        }
      />

      <ul className="flex flex-col gap-3">
        {session.exercises.map((exercise, index) => {
          const weightValue = weightInputs[index] ?? exercise.targetWeight?.toString() ?? ''
          const repsValue = repsInputs[index] ?? ''
          const restSeconds = exercise.targetRestSeconds ?? DEFAULT_REST_SECONDS
          const isResting = restFor?.exerciseIndex === index

          return (
            <li key={`${exercise.exerciseId}-${index}`}>
              <Card glow={isResting} className="flex flex-col gap-4">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-text">
                  {exercise.exerciseName}
                </h2>

                {exercise.sets.length > 0 && (
                  <ul className="flex flex-col gap-1">
                    {exercise.sets.map((set, setIndex) => (
                      <li
                        key={set.setNumber}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                          setIndex === exercise.sets.length - 1
                            ? 'bg-accent/10 text-text'
                            : 'bg-surface text-text-muted'
                        }`}
                      >
                        <span className="w-6 font-display text-lg font-bold tabular-nums text-accent">
                          {set.setNumber}
                        </span>
                        <span className="flex-1 tabular-nums">{set.weight} kg</span>
                        <span className="tabular-nums">× {set.reps} reps</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-3">
                  <Stepper
                    label="Peso"
                    unit="kg"
                    decimal
                    step={WEIGHT_STEP}
                    value={weightValue}
                    onChange={(value) =>
                      setWeightInputs((current) => ({ ...current, [index]: value }))
                    }
                  />
                  <Stepper
                    label="Reps"
                    step={REPS_STEP}
                    value={repsValue}
                    onChange={(value) =>
                      setRepsInputs((current) => ({ ...current, [index]: value }))
                    }
                  />
                </div>

                <label className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                  Recupero (s)
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={restSeconds}
                    onChange={(event) =>
                      updateExerciseRestSeconds(index, Number(event.target.value))
                    }
                    className={`${inputClass} w-24 text-center`}
                  />
                </label>

                <Button
                  variant="primary"
                  size="lg"
                  icon="check"
                  fullWidth
                  onClick={() => handleCompleteSet(index, restSeconds)}
                >
                  Serie {exercise.sets.length + 1} completata
                </Button>
              </Card>
            </li>
          )
        })}
      </ul>

      <div>
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Aggiungi esercizio
        </span>
        <ExerciseAutocomplete uid={uid} onSelect={addExercise} />
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Note
        </span>
        <textarea
          value={session.notes ?? ''}
          onChange={(event) => updateNotes(event.target.value)}
          className={`${inputClass} py-2`}
          rows={2}
        />
      </label>

      {restFor && (
        <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.5rem)] z-20 mx-auto max-w-md px-4">
          <RestTimer
            key={restExercise?.sets.length}
            targetSeconds={restFor.seconds}
            exerciseName={restExercise?.exerciseName}
            onFinish={() => setRestFor(null)}
          />
        </div>
      )}
    </div>
  )
}
