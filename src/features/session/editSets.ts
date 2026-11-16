import type { SessionExercise, SessionSet } from '../../lib/types'

export interface SetValues {
  weight: number
  reps: number
}

function renumber(sets: SessionSet[]): SessionSet[] {
  return sets.map((set, index) => ({ ...set, setNumber: index + 1 }))
}

/** Valori ammessi dall'editor: ripetizioni intere ≥ 1, peso finito ≥ 0 (0 = corpo libero). */
export function isValidSetValues({ weight, reps }: SetValues): boolean {
  return Number.isFinite(weight) && weight >= 0 && Number.isInteger(reps) && reps >= 1
}

/** Cambia peso e ripetizioni di una serie; numero, recupero e orario restano quelli originali. */
export function updateSet(
  exercise: SessionExercise,
  setIndex: number,
  values: SetValues,
): SessionExercise {
  if (setIndex < 0 || setIndex >= exercise.sets.length) return exercise
  return {
    ...exercise,
    sets: exercise.sets.map((set, index) =>
      index === setIndex ? { ...set, weight: values.weight, reps: values.reps } : set,
    ),
  }
}

/** Toglie una serie e rinumera le altre da 1. */
export function removeSet(exercise: SessionExercise, setIndex: number): SessionExercise {
  if (setIndex < 0 || setIndex >= exercise.sets.length) return exercise
  return { ...exercise, sets: renumber(exercise.sets.filter((_, index) => index !== setIndex)) }
}

/** Reinserisce una serie nella posizione indicata (limitata a 0..lunghezza) e rinumera. */
export function insertSet(
  exercise: SessionExercise,
  setIndex: number,
  set: SessionSet,
): SessionExercise {
  const position = Math.min(Math.max(setIndex, 0), exercise.sets.length)
  const sets = [...exercise.sets]
  sets.splice(position, 0, set)
  return { ...exercise, sets: renumber(sets) }
}
