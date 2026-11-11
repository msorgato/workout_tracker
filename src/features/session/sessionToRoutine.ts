import type { Routine, RoutineExercise, RoutineInput, Session, SessionExercise } from '../../lib/types'

const DEFAULT_REST_SECONDS = 90

export interface DerivedTargets {
  targetSets: number
  targetReps: number
  targetRestSeconds: number
  targetWeight?: number
}

export type ChangeField = 'targetWeight' | 'targetSets' | 'targetReps' | 'targetRestSeconds'

export type RoutineChange =
  | {
      kind: 'field'
      /** Posizione dell'esercizio nella routine ordinata per `order`. */
      routineIndex: number
      exerciseName: string
      field: ChangeField
      from: number | undefined
      to: number | undefined
    }
  | { kind: 'add'; exercise: RoutineExercise }

/**
 * Valori di routine di un esercizio di sessione: serie fatte, carico più alto, ripetizioni
 * della serie con quel carico (a parità, le più alte), recupero impostato (90 s se mai impostato).
 * Senza serie registrate non ci sono valori.
 */
export function deriveTargets(exercise: SessionExercise): DerivedTargets | null {
  if (exercise.sets.length === 0) return null
  const maxWeight = Math.max(...exercise.sets.map((set) => set.weight))
  const targetReps = Math.max(
    ...exercise.sets.filter((set) => set.weight === maxWeight).map((set) => set.reps),
  )
  return {
    targetSets: exercise.sets.length,
    targetReps,
    targetRestSeconds: exercise.targetRestSeconds ?? DEFAULT_REST_SECONDS,
    ...(maxWeight > 0 ? { targetWeight: maxWeight } : {}),
  }
}

function toRoutineExercise(exercise: SessionExercise, targets: DerivedTargets, order: number) {
  const result: RoutineExercise = {
    exerciseId: exercise.exerciseId,
    exerciseName: exercise.exerciseName,
    targetSets: targets.targetSets,
    targetReps: targets.targetReps,
    targetRestSeconds: targets.targetRestSeconds,
    order,
  }
  if (targets.targetWeight !== undefined) result.targetWeight = targets.targetWeight
  return result
}

/** Esercizi con almeno una serie, nell'ordine della sessione, pronti per una nuova routine. */
export function routineDraftFromSession(session: Session): RoutineExercise[] {
  const draft: RoutineExercise[] = []
  for (const exercise of session.exercises) {
    const targets = deriveTargets(exercise)
    if (targets) draft.push(toRoutineExercise(exercise, targets, draft.length))
  }
  return draft
}

function sortedByOrder(routine: Routine): RoutineExercise[] {
  return [...routine.exercises].sort((a, b) => a.order - b.order)
}

function sameWeight(a: number | undefined, b: number | undefined) {
  return Math.round((a ?? 0) * 100) === Math.round((b ?? 0) * 100)
}

/**
 * Differenze tra i valori ricavati dalla sessione e i target della routine salvata.
 * L'esercizio di sessione in posizione i si abbina a quello i della routine ordinata solo se
 * l'`exerciseId` coincide; gli esercizi oltre la lunghezza della routine sono "aggiunti".
 * Gli esercizi senza serie e gli abbinamenti incoerenti non producono differenze.
 */
export function diffRoutine(routine: Routine, session: Session): RoutineChange[] {
  const routineExercises = sortedByOrder(routine)
  const changes: RoutineChange[] = []
  const added: RoutineChange[] = []

  session.exercises.forEach((exercise, index) => {
    const targets = deriveTargets(exercise)
    if (!targets) return

    if (index >= routineExercises.length) {
      added.push({ kind: 'add', exercise: toRoutineExercise(exercise, targets, 0) })
      return
    }

    const current = routineExercises[index]
    if (current.exerciseId !== exercise.exerciseId) return

    const field = (name: ChangeField, from: number | undefined, to: number | undefined) =>
      changes.push({
        kind: 'field',
        routineIndex: index,
        exerciseName: current.exerciseName,
        field: name,
        from,
        to,
      })

    if (!sameWeight(current.targetWeight, targets.targetWeight)) {
      field('targetWeight', current.targetWeight, targets.targetWeight)
    }
    if (current.targetSets !== targets.targetSets) {
      field('targetSets', current.targetSets, targets.targetSets)
    }
    if (current.targetReps !== targets.targetReps) {
      field('targetReps', current.targetReps, targets.targetReps)
    }
    if (current.targetRestSeconds !== targets.targetRestSeconds) {
      field('targetRestSeconds', current.targetRestSeconds, targets.targetRestSeconds)
    }
  })

  return [...changes, ...added]
}

/** Applica le sole differenze indicate; gli esercizi aggiunti vanno in coda. Il nome non cambia. */
export function applyRoutineChanges(routine: Routine, changes: RoutineChange[]): RoutineInput {
  const exercises = sortedByOrder(routine).map((exercise) => ({ ...exercise }))

  for (const change of changes) {
    if (change.kind !== 'field') continue
    const target = exercises[change.routineIndex]
    if (!target) continue
    if (change.field === 'targetWeight') {
      if (change.to === undefined) delete target.targetWeight
      else target.targetWeight = change.to
    } else {
      target[change.field] = change.to as number
    }
  }

  for (const change of changes) {
    if (change.kind === 'add') exercises.push({ ...change.exercise })
  }

  return {
    name: routine.name,
    exercises: exercises.map((exercise, order) => ({ ...exercise, order })),
  }
}

function formatNumber(value: number) {
  return value.toLocaleString('it-IT', { maximumFractionDigits: 2 })
}

function weightLabel(value: number | undefined) {
  return value === undefined ? 'nessuno' : `${formatNumber(value)} kg`
}

/** Testo italiano per l'elenco delle differenze nel riquadro di aggiornamento. */
export function describeChange(change: RoutineChange): string {
  if (change.kind === 'add') {
    const { exerciseName, targetSets, targetReps, targetWeight } = change.exercise
    const weight = targetWeight !== undefined ? ` · ${formatNumber(targetWeight)} kg` : ''
    return `Nuovo esercizio: ${exerciseName} · ${targetSets} × ${targetReps}${weight}`
  }

  const { exerciseName: name, field, from, to } = change
  switch (field) {
    case 'targetWeight':
      return from !== undefined && to !== undefined
        ? `${name}: carico ${formatNumber(from)} → ${formatNumber(to)} kg`
        : `${name}: carico ${weightLabel(from)} → ${weightLabel(to)}`
    case 'targetSets':
      return `${name}: serie ${from} → ${to}`
    case 'targetReps':
      return `${name}: ripetizioni ${from} → ${to}`
    case 'targetRestSeconds':
      return `${name}: recupero ${from} → ${to} s`
  }
}
