import type { Session } from '../../lib/types'

export interface SessionSummary {
  durationMinutes: number | null
  exerciseCount: number
  setCount: number
  volumeKg: number
}

export interface SessionDayGroup {
  dayKey: string
  label: string
  sessions: Session[]
}

export function summarizeSession(session: Session): SessionSummary {
  let setCount = 0
  let volumeKg = 0
  for (const exercise of session.exercises) {
    for (const set of exercise.sets) {
      setCount += 1
      volumeKg += set.weight * set.reps
    }
  }
  const durationMinutes =
    session.endedAt === null || session.endedAt === undefined
      ? null
      : Math.round((session.endedAt - session.startedAt) / 60000)

  return {
    durationMinutes,
    exerciseCount: session.exercises.length,
    setCount,
    volumeKg: Math.round(volumeKg * 100) / 100,
  }
}

function dayKeyOf(timestamp: number): string {
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function labelForDay(timestamp: number, now: number): string {
  const key = dayKeyOf(timestamp)
  if (key === dayKeyOf(now)) return 'Oggi'
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (key === dayKeyOf(yesterday.getTime())) return 'Ieri'
  return new Date(timestamp).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/** Raggruppa per giorno di inizio, dal più recente; l'ordine delle sessioni nel gruppo è quello in ingresso. */
export function groupSessionsByDay(
  sessions: Session[],
  now: number = Date.now(),
): SessionDayGroup[] {
  const groups = new Map<string, SessionDayGroup>()
  const sorted = [...sessions].sort((a, b) => b.startedAt - a.startedAt)
  for (const session of sorted) {
    const dayKey = dayKeyOf(session.startedAt)
    const group = groups.get(dayKey)
    if (group) {
      group.sessions.push(session)
    } else {
      groups.set(dayKey, {
        dayKey,
        label: labelForDay(session.startedAt, now),
        sessions: [session],
      })
    }
  }
  return [...groups.values()]
}
