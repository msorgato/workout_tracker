import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExerciseAutocomplete } from '../../components/ExerciseAutocomplete'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { inputClass } from '../../components/ui/fields'
import { PageHeader } from '../../components/ui/PageHeader'
import { Stepper } from '../../components/ui/Stepper'
import { parseDecimal } from '../../lib/numberInput'
import { TipsPanel } from '../exercise-tips/TipsPanel'
import { useExerciseTips } from '../exercise-tips/useExerciseTips'
import { RestTimer } from '../rest-timer/RestTimer'
import { summarizeSession } from '../history/sessionSummary'
import { SessionSummaryScreen, type SessionSummaryData } from '../xp/SessionSummaryScreen'
import { XP_EXERCISE_BONUS, XP_PER_SET, sessionXp, totalXp } from '../xp/xp'
import { XpChip } from '../xp/XpChip'
import { XpPop } from '../xp/XpPop'
import { useSession } from './SessionContext'
import { listCompletedSessions } from './sessionsApi'
import { getSetProgress } from './setProgress'

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
    restFor,
    setRestFor,
    weightInputs,
    setWeightInputs,
    repsInputs,
    setRepsInputs,
    extraUnlocked,
    setExtraUnlocked,
  } = useSession()
  const navigate = useNavigate()
  const exerciseTips = useExerciseTips(uid)
  // Effetti effimeri guidati dall'evento "serie completata" (non da diff dello stato):
  // così non scattano al ricaricamento di una sessione già completata.
  const [pops, setPops] = useState<{ id: number; exerciseIndex: number; amount: number }[]>([])
  const [lastAddedSet, setLastAddedSet] = useState<{ exerciseIndex: number; setNumber: number }>()
  const [poppedBadge, setPoppedBadge] = useState<number>()
  const popIdRef = useRef(0)
  const [finishing, setFinishing] = useState(false)
  const [summary, setSummary] = useState<SessionSummaryData>()

  const timerVisible = restFor !== null
  useEffect(() => {
    if (!timerVisible) return
    document.documentElement.style.setProperty('--dock-h', TIMER_DOCK_HEIGHT)
    return () => {
      document.documentElement.style.setProperty('--dock-h', '0px')
    }
  }, [timerVisible])

  if (summary) {
    return <SessionSummaryScreen summary={summary} onClose={onDone} />
  }

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
    const exercise = session!.exercises[exerciseIndex]
    const completesExercise =
      typeof exercise.targetSets === 'number' && exercise.sets.length + 1 === exercise.targetSets
    await completeSet(exerciseIndex, { weight, reps, restSeconds })
    setRestFor({ exerciseIndex, seconds: restSeconds, deadline: Date.now() + restSeconds * 1000 })

    const newPops = [{ id: ++popIdRef.current, exerciseIndex, amount: XP_PER_SET }]
    if (completesExercise) {
      newPops.push({ id: ++popIdRef.current, exerciseIndex, amount: XP_EXERCISE_BONUS })
      setPoppedBadge(exerciseIndex)
      setTimeout(() => setPoppedBadge(undefined), 1000)
    }
    setPops((current) => [...current, ...newPops])
    setLastAddedSet({ exerciseIndex, setNumber: exercise.sets.length + 1 })
    setTimeout(() => setLastAddedSet(undefined), 1000)
  }

  function removePop(id: number) {
    setPops((current) => current.filter((pop) => pop.id !== id))
  }

  async function handleFinish() {
    if (finishing) return
    setFinishing(true)
    const snapshot = session!
    // Lo storico si legge PRIMA di concludere: la sessione attiva non è ancora inclusa.
    // Se la lettura fallisce la sessione si conclude comunque, senza livello nel riepilogo.
    let before: number | null = null
    try {
      before = totalXp(await listCompletedSessions(uid))
    } catch {
      before = null
    }
    try {
      await finishSession()
    } catch (error) {
      setFinishing(false)
      throw error
    }
    setRestFor(null)
    const xpGained = sessionXp(snapshot, { concluded: true })
    const stats = summarizeSession(snapshot)
    setSummary({
      xpGained,
      setCount: stats.setCount,
      volumeKg: stats.volumeKg,
      before,
      after: before === null ? null : before + xpGained,
    })
  }

  const restExercise = restFor ? session.exercises[restFor.exerciseIndex] : undefined

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={session.routineName ?? 'Sessione libera'}
        actions={
          <>
            <XpChip xp={sessionXp(session, { concluded: false })} />
            <Button variant="secondary" onClick={handleFinish} disabled={finishing}>
              Termina
            </Button>
          </>
        }
      />

      <ul className="flex flex-col gap-3">
        {session.exercises.map((exercise, index) => {
          const weightValue = weightInputs[index] ?? exercise.targetWeight?.toString() ?? ''
          const repsValue = repsInputs[index] ?? ''
          const restSeconds = exercise.targetRestSeconds ?? DEFAULT_REST_SECONDS
          const isResting = restFor?.exerciseIndex === index
          const progress = getSetProgress(exercise, extraUnlocked[index] ?? false)

          return (
            <li key={`${exercise.exerciseId}-${index}`}>
              <Card glow={isResting} className="relative flex flex-col gap-4">
                <div className="pointer-events-none absolute right-4 top-14 z-10 flex flex-col items-end gap-1">
                  {pops
                    .filter((pop) => pop.exerciseIndex === index)
                    .map((pop) => (
                      <XpPop key={pop.id} amount={pop.amount} onDone={() => removePop(pop.id)} />
                    ))}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="min-w-0 font-display text-2xl font-bold uppercase tracking-wide text-text">
                    {exercise.exerciseName}
                  </h2>
                  {progress.target !== undefined && (
                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tabular-nums ${
                        progress.isComplete
                          ? 'bg-accent text-accent-contrast'
                          : 'bg-surface text-text-muted'
                      } ${poppedBadge === index ? 'animate-badge-pop' : ''}`}
                    >
                      {progress.isComplete && <Icon name="check" size={14} />}
                      {progress.isComplete ? 'Completato ' : 'Serie '}
                      {progress.done}/{progress.target}
                      {progress.extraCount > 0 && ' · extra'}
                    </span>
                  )}
                </div>

                <TipsPanel
                  exerciseId={exercise.exerciseId}
                  exerciseName={exercise.exerciseName}
                  personalTips={exerciseTips.tipsByExercise.get(exercise.exerciseId) ?? []}
                  error={exerciseTips.error}
                  onAdd={exerciseTips.addTip}
                  onUpdate={exerciseTips.updateTip}
                  onDelete={exerciseTips.deleteTip}
                />

                {exercise.sets.length > 0 && (
                  <ul className="flex flex-col gap-1">
                    {exercise.sets.map((set, setIndex) => (
                      <li
                        key={set.setNumber}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                          setIndex === exercise.sets.length - 1
                            ? 'bg-accent/10 text-text'
                            : 'bg-surface text-text-muted'
                        } ${
                          lastAddedSet?.exerciseIndex === index &&
                          lastAddedSet.setNumber === set.setNumber
                            ? 'animate-row-flash'
                            : ''
                        }`}
                      >
                        <span className="w-6 font-display text-lg font-bold tabular-nums text-accent">
                          {set.setNumber}
                        </span>
                        <span className="flex-1 tabular-nums">{set.weight} kg</span>
                        <span className="tabular-nums">× {set.reps} reps</span>
                        {progress.target !== undefined && set.setNumber > progress.target && (
                          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs text-text-muted">
                            extra
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {!progress.canLogSet ? (
                  <Button
                    icon="plus"
                    fullWidth
                    onClick={() => setExtraUnlocked((current) => ({ ...current, [index]: true }))}
                  >
                    Aggiungi serie extra
                  </Button>
                ) : (
                  <>
                    <div className="flex flex-col gap-3">
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
                      Serie {progress.nextSetNumber} completata
                    </Button>
                  </>
                )}
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
            deadline={restFor.deadline}
            exerciseName={restExercise?.exerciseName}
            onFinish={() => setRestFor(null)}
          />
        </div>
      )}
    </div>
  )
}
