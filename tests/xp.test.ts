import { describe, expect, it } from 'vitest'
import {
  isExerciseComplete,
  levelForXp,
  levelProgress,
  levelThreshold,
  sessionXp,
  totalXp,
} from '../src/features/xp/xp'

function exercise(setCount: number, targetSets?: number) {
  return {
    sets: Array.from({ length: setCount }, (_, i) => ({
      setNumber: i + 1,
      weight: 40,
      reps: 8,
      restSeconds: 90,
      completedAt: 0,
    })),
    targetSets,
  }
}

const session = (...exercises: ReturnType<typeof exercise>[]) => ({
  exercises: exercises.map((e, i) => ({
    exerciseId: `e${i}`,
    exerciseName: `E${i}`,
    order: i,
    ...e,
  })),
})

describe('sessionXp', () => {
  it('3 serie valgono 30 XP', () => {
    expect(sessionXp(session(exercise(3)), { concluded: false })).toBe(30)
  })

  it('esercizio 3/3 vale 55 XP, sessione conclusa 105', () => {
    const s = session(exercise(3, 3))
    expect(sessionXp(s, { concluded: false })).toBe(55)
    expect(sessionXp(s, { concluded: true })).toBe(105)
  })

  it("senza targetSets non c'è bonus esercizio", () => {
    expect(sessionXp(session(exercise(3, undefined)), { concluded: false })).toBe(30)
  })

  it('esercizio incompleto senza bonus', () => {
    expect(sessionXp(session(exercise(2, 4)), { concluded: false })).toBe(20)
  })

  it('le serie extra valgono 10 XP e mantengono il bonus', () => {
    expect(sessionXp(session(exercise(5, 4)), { concluded: false })).toBe(75)
  })

  it("contatore dell'esempio: 2 serie + esercizio 2/2 = 45 XP", () => {
    expect(sessionXp(session(exercise(2, 2)), { concluded: false })).toBe(45)
  })
})

describe('isExerciseComplete', () => {
  it('richiede un target e tutte le serie registrate', () => {
    expect(isExerciseComplete(exercise(4, 4))).toBe(true)
    expect(isExerciseComplete(exercise(3, 4))).toBe(false)
    expect(isExerciseComplete(exercise(9))).toBe(false)
  })
})

describe('totalXp', () => {
  it('somma le sessioni concluse con il bonus di sessione', () => {
    expect(totalXp([session(exercise(3, 3)), session(exercise(1))])).toBe(105 + 60)
  })

  it('storico vuoto → 0', () => {
    expect(totalXp([])).toBe(0)
  })
})

describe('livelli', () => {
  it('soglie 100·n·(n−1)', () => {
    expect(levelThreshold(1)).toBe(0)
    expect(levelThreshold(2)).toBe(200)
    expect(levelThreshold(3)).toBe(600)
    expect(levelThreshold(4)).toBe(1200)
  })

  it('livello per XP sulle soglie', () => {
    expect(levelForXp(0)).toBe(1)
    expect(levelForXp(199)).toBe(1)
    expect(levelForXp(200)).toBe(2)
    expect(levelForXp(599)).toBe(2)
    expect(levelForXp(600)).toBe(3)
    expect(levelForXp(1199)).toBe(3)
    expect(levelForXp(1200)).toBe(4)
  })

  it('coerente con le soglie per molti livelli', () => {
    for (let level = 1; level <= 60; level++) {
      expect(levelForXp(levelThreshold(level))).toBe(level)
      expect(levelForXp(levelThreshold(level + 1) - 1)).toBe(level)
    }
  })

  it('avanzamento del 50% a 400 XP (livello 2)', () => {
    expect(levelProgress(400)).toEqual({
      level: 2,
      xpIntoLevel: 200,
      xpForNext: 400,
      fraction: 0.5,
    })
  })

  it('180 XP + sessione da 105 XP supera il livello 2', () => {
    expect(levelForXp(180)).toBe(1)
    expect(levelForXp(180 + 105)).toBe(2)
  })

  it('nessuna sessione → livello 1 a 0 XP', () => {
    expect(levelProgress(0)).toMatchObject({ level: 1, xpIntoLevel: 0, fraction: 0 })
  })
})
