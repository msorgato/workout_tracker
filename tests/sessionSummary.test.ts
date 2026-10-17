import { describe, expect, it } from 'vitest'
import { groupSessionsByDay, summarizeSession } from '../src/features/history/sessionSummary'
import type { Session, SessionExercise } from '../src/lib/types'

function exercise(sets: [number, number][]): SessionExercise {
  return {
    exerciseId: 'e',
    exerciseName: 'E',
    order: 0,
    sets: sets.map(([weight, reps], i) => ({
      setNumber: i + 1,
      weight,
      reps,
      restSeconds: 90,
      completedAt: 0,
    })),
  }
}

function session(
  startedAt: number,
  endedAt: number | null,
  exercises: SessionExercise[] = [],
): Session {
  return { id: String(startedAt), startedAt, endedAt, exercises }
}

describe('summarizeSession', () => {
  it('calcola durata, esercizi, serie e volume', () => {
    const start = new Date(2026, 9, 10, 18, 0).getTime()
    const s = session(start, start + 52 * 60000, [
      exercise([
        [60, 10],
        [60, 10],
        [60, 10],
      ]),
      exercise([
        [20, 12],
        [20, 12],
      ]),
    ])
    expect(summarizeSession(s)).toEqual({
      durationMinutes: 52,
      exerciseCount: 2,
      setCount: 5,
      volumeKg: 2280,
    })
  })

  it('non mostra la durata senza endedAt', () => {
    expect(summarizeSession(session(1000, null)).durationMinutes).toBeNull()
  })
})

describe('groupSessionsByDay', () => {
  const now = new Date(2026, 9, 17, 12, 0).getTime()
  const today1 = new Date(2026, 9, 17, 8, 0).getTime()
  const today2 = new Date(2026, 9, 17, 19, 0).getTime()
  const yesterday = new Date(2026, 9, 16, 18, 0).getTime()

  it('raggruppa per giorno dal più recente', () => {
    const groups = groupSessionsByDay(
      [session(yesterday, null), session(today1, null), session(today2, null)],
      now,
    )
    expect(groups).toHaveLength(2)
    expect(groups[0].label).toBe('Oggi')
    expect(groups[0].sessions.map((s) => s.startedAt)).toEqual([today2, today1])
    expect(groups[1].label).toBe('Ieri')
  })

  it('usa la data estesa per giorni più vecchi', () => {
    const old = new Date(2026, 8, 1, 10, 0).getTime()
    const [group] = groupSessionsByDay([session(old, null)], now)
    expect(group.label).toMatch(/1 settembre/)
  })
})
