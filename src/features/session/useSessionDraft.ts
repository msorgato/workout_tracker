import { useCallback, useState } from 'react'

export interface RestState {
  exerciseIndex: number
  seconds: number
  /** Scadenza assoluta (ms): il countdown prosegue anche mentre la pagina Sessione è smontata. */
  deadline: number
}

interface Draft {
  sessionId: string | undefined
  restFor: RestState | null
  weightInputs: Record<number, string>
  repsInputs: Record<number, string>
  extraUnlocked: Record<number, boolean>
}

type Update<T> = T | ((current: T) => T)

function emptyDraft(sessionId: string | undefined): Draft {
  return { sessionId, restFor: null, weightInputs: {}, repsInputs: {}, extraUnlocked: {} }
}

function resolve<T>(update: Update<T>, current: T): T {
  return typeof update === 'function' ? (update as (value: T) => T)(current) : update
}

/**
 * Stato a video della sessione attiva che deve sopravvivere alla navigazione tra sezioni
 * (la pagina Sessione si smonta cambiando route). Si azzera al cambio o alla fine della sessione.
 */
export function useSessionDraft(sessionId: string | undefined) {
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(sessionId))

  // Reset durante il render: nessun frame con lo stato della sessione precedente.
  if (draft.sessionId !== sessionId) setDraft(emptyDraft(sessionId))

  const setRestFor = useCallback(
    (update: Update<RestState | null>) =>
      setDraft((current) => ({ ...current, restFor: resolve(update, current.restFor) })),
    [],
  )
  const setWeightInputs = useCallback(
    (update: Update<Record<number, string>>) =>
      setDraft((current) => ({ ...current, weightInputs: resolve(update, current.weightInputs) })),
    [],
  )
  const setRepsInputs = useCallback(
    (update: Update<Record<number, string>>) =>
      setDraft((current) => ({ ...current, repsInputs: resolve(update, current.repsInputs) })),
    [],
  )
  const setExtraUnlocked = useCallback(
    (update: Update<Record<number, boolean>>) =>
      setDraft((current) => ({
        ...current,
        extraUnlocked: resolve(update, current.extraUnlocked),
      })),
    [],
  )

  return {
    restFor: draft.restFor,
    weightInputs: draft.weightInputs,
    repsInputs: draft.repsInputs,
    extraUnlocked: draft.extraUnlocked,
    setRestFor,
    setWeightInputs,
    setRepsInputs,
    setExtraUnlocked,
  }
}
