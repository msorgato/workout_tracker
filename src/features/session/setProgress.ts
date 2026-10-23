import type { SessionExercise } from '../../lib/types'

export interface SetProgress {
  done: number
  /** Serie previste dalla routine; undefined se l'esercizio non ha un limite. */
  target: number | undefined
  isComplete: boolean
  /** Se il pulsante "Serie N completata" può essere mostrato. */
  canLogSet: boolean
  nextSetNumber: number
  /** Serie registrate oltre il target. */
  extraCount: number
}

/**
 * Stato di avanzamento delle serie di un esercizio, derivato dai dati persistiti.
 * `extraUnlocked` copre solo il momento tra "Aggiungi serie extra" e la prima serie extra:
 * una volta registrata, `done > target` mantiene lo sblocco anche dopo un ricaricamento.
 */
export function getSetProgress(
  exercise: Pick<SessionExercise, 'sets' | 'targetSets'>,
  extraUnlocked: boolean,
): SetProgress {
  const done = exercise.sets.length
  const target = exercise.targetSets
  const hasTarget = typeof target === 'number' && target > 0

  if (!hasTarget) {
    return {
      done,
      target: undefined,
      isComplete: false,
      canLogSet: true,
      nextSetNumber: done + 1,
      extraCount: 0,
    }
  }

  const isComplete = done >= target
  return {
    done,
    target,
    isComplete,
    canLogSet: !isComplete || extraUnlocked || done > target,
    nextSetNumber: done + 1,
    extraCount: Math.max(0, done - target),
  }
}
