import type { Session, SessionExercise } from '../../lib/types'

// Le costanti sono l'unico punto da ritoccare: XP e livello non sono salvati,
// quindi un cambio qui ricalcola anche le sessioni passate (il livello può scendere).
export const XP_PER_SET = 10
export const XP_EXERCISE_BONUS = 25
export const XP_SESSION_BONUS = 50
export const LEVEL_BASE = 100

/** Esercizio con serie previste e tutte registrate (le serie extra non tolgono il bonus). */
export function isExerciseComplete(
  exercise: Pick<SessionExercise, 'sets' | 'targetSets'>,
): boolean {
  const target = exercise.targetSets
  return typeof target === 'number' && target > 0 && exercise.sets.length >= target
}

/** XP di una sessione; il bonus di sessione vale solo a sessione conclusa. */
export function sessionXp(
  session: Pick<Session, 'exercises'>,
  options: { concluded: boolean },
): number {
  let xp = 0
  for (const exercise of session.exercises) {
    xp += exercise.sets.length * XP_PER_SET
    if (isExerciseComplete(exercise)) xp += XP_EXERCISE_BONUS
  }
  return options.concluded ? xp + XP_SESSION_BONUS : xp
}

export function totalXp(completedSessions: Pick<Session, 'exercises'>[]): number {
  return completedSessions.reduce(
    (sum, session) => sum + sessionXp(session, { concluded: true }),
    0,
  )
}

/** XP totali necessari per raggiungere il livello n (n ≥ 1): 100 · n · (n − 1). */
export function levelThreshold(level: number): number {
  return LEVEL_BASE * level * (level - 1)
}

export function levelForXp(xp: number): number {
  const safeXp = Math.max(0, xp)
  let level = Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * safeXp) / LEVEL_BASE)) / 2))
  // Correzione di arrotondamento in virgola mobile rispetto alle soglie esatte.
  while (levelThreshold(level + 1) <= safeXp) level += 1
  while (level > 1 && levelThreshold(level) > safeXp) level -= 1
  return level
}

export interface LevelProgress {
  level: number
  xpIntoLevel: number
  xpForNext: number
  /** 0..1 verso il livello successivo. */
  fraction: number
}

export function levelProgress(xp: number): LevelProgress {
  const safeXp = Math.max(0, xp)
  const level = levelForXp(safeXp)
  const start = levelThreshold(level)
  const xpForNext = levelThreshold(level + 1) - start
  const xpIntoLevel = safeXp - start
  return { level, xpIntoLevel, xpForNext, fraction: xpIntoLevel / xpForNext }
}
