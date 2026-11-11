import { describe, expect, it } from 'vitest'
import type { Routine, RoutineExercise, Session, SessionExercise } from '../src/lib/types'
import {
  applyRoutineChanges,
  deriveTargets,
  describeChange,
  diffRoutine,
  routineDraftFromSession,
} from '../src/features/session/sessionToRoutine'

function sets(...values: [number, number][]) {
  return values.map(([weight, reps], index) => ({
    setNumber: index + 1,
    weight,
    reps,
    restSeconds: 90,
    completedAt: index,
  }))
}

function sessionExercise(
  id: string,
  setValues: [number, number][],
  extra: Partial<SessionExercise> = {},
  order = 0,
): SessionExercise {
  return {
    exerciseId: id,
    exerciseName: id.toUpperCase(),
    order,
    sets: sets(...setValues),
    ...extra,
  }
}

function session(exercises: SessionExercise[], routineId?: string): Session {
  return { id: 's1', startedAt: 0, endedAt: 1, routineId, exercises }
}

function routineExercise(id: string, order: number, patch: Partial<RoutineExercise> = {}) {
  return {
    exerciseId: id,
    exerciseName: id.toUpperCase(),
    targetSets: 3,
    targetReps: 10,
    targetRestSeconds: 90,
    targetWeight: 60,
    order,
    ...patch,
  }
}

function routine(exercises: RoutineExercise[]): Routine {
  return { id: 'r1', name: 'Push', exercises, createdAt: 0, updatedAt: 0 }
}

describe('deriveTargets', () => {
  it('prende il carico più alto e le sue ripetizioni più alte', () => {
    const targets = deriveTargets(
      sessionExercise('panca', [
        [60, 10],
        [62.5, 8],
        [62.5, 9],
      ]),
    )
    expect(targets).toEqual({
      targetSets: 3,
      targetReps: 9,
      targetRestSeconds: 90,
      targetWeight: 62.5,
    })
  })

  it('non imposta il carico per esercizi a corpo libero', () => {
    const targets = deriveTargets(
      sessionExercise('trazioni', [
        [0, 8],
        [0, 10],
      ]),
    )
    expect(targets?.targetWeight).toBeUndefined()
    expect(targets?.targetReps).toBe(10)
  })

  it('non produce valori senza serie', () => {
    expect(deriveTargets(sessionExercise('panca', []))).toBeNull()
  })

  it('usa il recupero della sessione, 90 s se mai impostato', () => {
    expect(deriveTargets(sessionExercise('a', [[10, 5]]))?.targetRestSeconds).toBe(90)
    expect(
      deriveTargets(sessionExercise('a', [[10, 5]], { targetRestSeconds: 120 }))
        ?.targetRestSeconds,
    ).toBe(120)
  })
})

describe('routineDraftFromSession', () => {
  it('esclude gli esercizi senza serie e riassegna order', () => {
    const draft = routineDraftFromSession(
      session([
        sessionExercise('a', [[50, 10]], {}, 0),
        sessionExercise('b', [], {}, 1),
        sessionExercise('c', [[20, 12]], {}, 2),
      ]),
    )
    expect(draft.map((exercise) => [exercise.exerciseId, exercise.order])).toEqual([
      ['a', 0],
      ['c', 1],
    ])
    expect(draft[0]).toMatchObject({ targetSets: 1, targetReps: 10, targetWeight: 50 })
  })
})

describe('diffRoutine', () => {
  const base = routine([routineExercise('panca', 0), routineExercise('squat', 1)])
  const same = [
    sessionExercise('panca', [[60, 10], [60, 10], [60, 10]], { targetRestSeconds: 90 }),
    sessionExercise('squat', [[60, 10], [60, 10], [60, 10]], { targetRestSeconds: 90 }, 1),
  ]

  it('non produce differenze se i valori coincidono', () => {
    expect(diffRoutine(base, session(same, 'r1'))).toEqual([])
  })

  it('propone il carico aumentato', () => {
    const changes = diffRoutine(
      base,
      session(
        [
          sessionExercise('panca', [[62.5, 10], [62.5, 10], [62.5, 10]], { targetRestSeconds: 90 }),
          same[1],
        ],
        'r1',
      ),
    )
    expect(changes).toHaveLength(1)
    expect(describeChange(changes[0])).toBe('PANCA: carico 60 → 62,5 kg')
  })

  it('propone serie e recupero come differenze separate', () => {
    const changes = diffRoutine(
      base,
      session(
        [
          sessionExercise('panca', [[60, 10], [60, 10], [60, 10], [60, 10]], {
            targetRestSeconds: 120,
          }),
          same[1],
        ],
        'r1',
      ),
    )
    expect(changes.map(describeChange)).toEqual(['PANCA: serie 3 → 4', 'PANCA: recupero 90 → 120 s'])
  })

  it('propone le ripetizioni diverse', () => {
    const changes = diffRoutine(
      base,
      session([sessionExercise('panca', [[60, 8], [60, 8], [60, 8]], {}), same[1]], 'r1'),
    )
    expect(changes.map(describeChange)).toEqual(['PANCA: ripetizioni 10 → 8'])
  })

  it('propone gli esercizi aggiunti in coda', () => {
    const changes = diffRoutine(
      base,
      session([...same, sessionExercise('curl', [[12, 10], [12, 10], [12, 10]], {}, 2)], 'r1'),
    )
    expect(changes).toHaveLength(1)
    expect(changes[0].kind).toBe('add')
    expect(describeChange(changes[0])).toBe('Nuovo esercizio: CURL · 3 × 10 · 12 kg')
  })

  it('ignora gli esercizi saltati e quelli aggiunti senza serie', () => {
    const changes = diffRoutine(
      base,
      session(
        [sessionExercise('panca', []), same[1], sessionExercise('curl', [], {}, 2)],
        'r1',
      ),
    )
    expect(changes).toEqual([])
  })

  it('ignora gli abbinamenti incoerenti (routine modificata durante la sessione)', () => {
    const changes = diffRoutine(
      base,
      session([sessionExercise('dip', [[0, 10], [0, 10], [0, 10]], {}), same[1]], 'r1'),
    )
    expect(changes).toEqual([])
  })

  it('tratta carico assente e 0 come uguali', () => {
    const noWeight = routine([routineExercise('trazioni', 0, { targetWeight: undefined })])
    const changes = diffRoutine(
      noWeight,
      session([sessionExercise('trazioni', [[0, 10], [0, 10], [0, 10]], {})], 'r1'),
    )
    expect(changes).toEqual([])
  })
})

describe('applyRoutineChanges', () => {
  const base = routine([routineExercise('panca', 0), routineExercise('squat', 1)])
  const finished = session(
    [
      sessionExercise('panca', [[62.5, 10], [62.5, 10], [62.5, 10], [62.5, 10]], {
        targetRestSeconds: 90,
      }),
      sessionExercise('squat', [[60, 10], [60, 10], [60, 10]], { targetRestSeconds: 90 }, 1),
      sessionExercise('curl', [[12, 10], [12, 10], [12, 10]], {}, 2),
    ],
    'r1',
  )

  it('applica tutte le differenze e accoda gli esercizi aggiunti', () => {
    const changes = diffRoutine(base, finished)
    const result = applyRoutineChanges(base, changes)
    expect(result.name).toBe('Push')
    expect(result.exercises.map((exercise) => exercise.exerciseId)).toEqual([
      'panca',
      'squat',
      'curl',
    ])
    expect(result.exercises[0]).toMatchObject({ targetWeight: 62.5, targetSets: 4 })
    expect(result.exercises[2].order).toBe(2)
  })

  it('applica solo le differenze selezionate', () => {
    const changes = diffRoutine(base, finished)
    const weightOnly = changes.filter(
      (change) => change.kind === 'field' && change.field === 'targetWeight',
    )
    const result = applyRoutineChanges(base, weightOnly)
    expect(result.exercises).toHaveLength(2)
    expect(result.exercises[0]).toMatchObject({ targetWeight: 62.5, targetSets: 3 })
  })

  it('non modifica la routine di partenza', () => {
    const before = JSON.stringify(base)
    applyRoutineChanges(base, diffRoutine(base, finished))
    expect(JSON.stringify(base)).toBe(before)
  })
})
