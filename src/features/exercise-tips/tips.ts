import type { PersonalTip, Tip, TipCategory } from '../../lib/types'
import { MAX_TIP_LENGTH, TIP_CATEGORIES } from './categories'

export interface LibraryTip {
  category: TipCategory
  text: string
}

/** Unisce i tips di libreria (prima, con id derivato) e quelli personali. */
export function mergeTips(
  exerciseId: string,
  libraryTips: LibraryTip[],
  personalTips: PersonalTip[],
): Tip[] {
  return [
    ...libraryTips.map((tip, index) => ({
      id: `lib:${exerciseId}:${index}`,
      category: tip.category,
      text: tip.text,
      source: 'library' as const,
    })),
    ...personalTips.map((tip) => ({ ...tip, source: 'personal' as const })),
  ]
}

/** Raggruppa per categoria nell'ordine fisso, omettendo le categorie vuote. */
export function groupByCategory(tips: Tip[]): { category: TipCategory; tips: Tip[] }[] {
  return TIP_CATEGORIES.map((category) => ({
    category,
    tips: tips.filter((tip) => tip.category === category),
  })).filter((group) => group.tips.length > 0)
}

export function firstPostureTip(tips: Tip[]): Tip | undefined {
  return tips.find((tip) => tip.category === 'postura')
}

export type TipTextValidation = { ok: true; text: string } | { ok: false; error: string }

export function validateTipText(text: string): TipTextValidation {
  const trimmed = text.trim()
  if (!trimmed) return { ok: false, error: 'Scrivi il testo del tip' }
  if (trimmed.length > MAX_TIP_LENGTH) {
    return { ok: false, error: `Massimo ${MAX_TIP_LENGTH} caratteri` }
  }
  return { ok: true, text: trimmed }
}

/** Minuscolo, senza accenti, spazi compattati: confronto tollerante dei nomi esercizio. */
export function normalizeExerciseName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Trova la chiave della libreria per un esercizio: prima per id (esercizi predefiniti),
 * poi per nome tramite alias (es. esercizi importati da CSV con nomi più descrittivi).
 */
export function resolveLibraryKey(
  exerciseId: string,
  exerciseName: string,
  libraryKeys: ReadonlySet<string>,
  aliases: Readonly<Record<string, string>>,
): string | undefined {
  if (libraryKeys.has(exerciseId)) return exerciseId
  const target = aliases[normalizeExerciseName(exerciseName)]
  return target && libraryKeys.has(target) ? target : undefined
}
