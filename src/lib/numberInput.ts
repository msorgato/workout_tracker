/** Accetta sia la virgola che il punto come separatore decimale. Stringa vuota o non valida → 0. */
export function parseDecimal(value: string): number {
  const parsed = Number(value.trim().replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

/** Somma `step` al valore corrente senza scendere sotto `min`, arrotondando a 2 decimali. */
export function stepValue(value: string, step: number, min = 0): string {
  const next = Math.max(min, Math.round((parseDecimal(value) + step) * 100) / 100)
  return String(next)
}
