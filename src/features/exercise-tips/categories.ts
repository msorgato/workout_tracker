import type { TipCategory } from '../../lib/types'

export const MAX_TIP_LENGTH = 280

/** Ordine di visualizzazione delle categorie nel pannello. */
export const TIP_CATEGORIES: TipCategory[] = ['postura', 'movimento', 'carico', 'sicurezza']

export const TIP_CATEGORY_LABELS: Record<TipCategory, string> = {
  postura: 'Postura',
  movimento: 'Movimento',
  carico: 'Carico',
  sicurezza: 'Sicurezza',
}
