import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import exerciseTipAliases from '../src/data/exerciseTipAliases.json'
import exerciseTips from '../src/data/exerciseTips.json'
import predefinedExercises from '../src/data/predefinedExercises.json'
import {
  firstPostureTip,
  groupByCategory,
  mergeTips,
  normalizeExerciseName,
  resolveLibraryKey,
  validateTipText,
} from '../src/features/exercise-tips/tips'

const library = [
  { category: 'carico' as const, text: 'Aumenta di poco alla volta' },
  { category: 'postura' as const, text: 'Schiena neutra' },
]
const personal = [{ id: 'p1', category: 'postura' as const, text: 'Scapole addotte' }]

describe('mergeTips', () => {
  it('mette la libreria prima dei tips personali e marca la fonte', () => {
    const merged = mergeTips('squat', library, personal)
    expect(merged.map((tip) => tip.source)).toEqual(['library', 'library', 'personal'])
    expect(merged[0].id).toBe('lib:squat:0')
    expect(merged[2].id).toBe('p1')
  })

  it('gestisce esercizi senza tips di libreria', () => {
    expect(mergeTips('custom', [], personal)).toHaveLength(1)
    expect(mergeTips('custom', [], [])).toEqual([])
  })
})

describe('groupByCategory', () => {
  it('ordina le categorie e omette quelle vuote', () => {
    const groups = groupByCategory(mergeTips('squat', library, personal))
    expect(groups.map((group) => group.category)).toEqual(['postura', 'carico'])
    expect(groups[0].tips).toHaveLength(2)
  })
})

describe('firstPostureTip', () => {
  it('restituisce il primo tip di postura (libreria prima)', () => {
    expect(firstPostureTip(mergeTips('squat', library, personal))?.text).toBe('Schiena neutra')
  })

  it('restituisce undefined senza tips di postura', () => {
    expect(firstPostureTip(mergeTips('x', [library[0]], []))).toBeUndefined()
  })
})

describe('validateTipText', () => {
  it('rifiuta testo vuoto o di soli spazi', () => {
    expect(validateTipText('').ok).toBe(false)
    expect(validateTipText('   ').ok).toBe(false)
  })

  it('accetta 280 caratteri e rifiuta 281', () => {
    expect(validateTipText('a'.repeat(280)).ok).toBe(true)
    expect(validateTipText('a'.repeat(281)).ok).toBe(false)
  })

  it('restituisce il testo ripulito', () => {
    expect(validateTipText('  ciao  ')).toEqual({ ok: true, text: 'ciao' })
  })
})

describe('libreria dei tips (exerciseTips.json)', () => {
  const categories = ['postura', 'movimento', 'carico', 'sicurezza']
  const predefinedIds = predefinedExercises.map((exercise) => exercise.id)
  const libraryIds = Object.keys(exerciseTips)
  const aliasTargets = new Set(Object.values(exerciseTipAliases))

  it('copre tutti gli esercizi predefiniti', () => {
    for (const id of predefinedIds) {
      expect(exerciseTips[id as keyof typeof exerciseTips]?.length, id).toBeGreaterThanOrEqual(1)
    }
  })

  it('ogni voce extra ha almeno un alias e ogni alias punta a una voce esistente', () => {
    const extra = libraryIds.filter((id) => !predefinedIds.includes(id))
    for (const id of extra) expect(aliasTargets.has(id), id).toBe(true)
    for (const [alias, target] of Object.entries(exerciseTipAliases)) {
      expect(libraryIds, alias).toContain(target)
      expect(normalizeExerciseName(alias), alias).toBe(alias)
    }
  })

  it('usa categorie valide e testi non vuoti entro il limite', () => {
    for (const [id, tips] of Object.entries(exerciseTips)) {
      for (const tip of tips) {
        expect(categories, id).toContain(tip.category)
        expect(validateTipText(tip.text).ok, `${id}: ${tip.text}`).toBe(true)
      }
    }
  })
})

describe('resolveLibraryKey', () => {
  const keys = new Set(Object.keys(exerciseTips))

  it("preferisce l'id per gli esercizi predefiniti", () => {
    expect(resolveLibraryKey('squat', 'Qualunque nome', keys, exerciseTipAliases)).toBe('squat')
  })

  it('risolve per nome senza distinguere maiuscole, accenti e spazi', () => {
    expect(resolveLibraryKey('abc123', '  Face  PULL al cavo ', keys, exerciseTipAliases)).toBe(
      'face-pull',
    )
  })

  it('restituisce undefined per esercizi sconosciuti', () => {
    expect(
      resolveLibraryKey('abc123', 'Esercizio inventato', keys, exerciseTipAliases),
    ).toBeUndefined()
  })

  it('trova i tips per tutti gli esercizi dei CSV in workouts/', () => {
    for (const file of [
      'workouts/scheda_giorno1_push.csv',
      'workouts/scheda_giorno2_pull.csv',
      'workouts/scheda_giorno3_legs.csv',
    ]) {
      const names = readFileSync(file, 'utf8')
        .replace(/^\uFEFF/, '')
        .split(/\r?\n/)
        .slice(1)
        .map((line) => line.split(',')[0])
        .filter(Boolean)
      for (const name of names) {
        expect(resolveLibraryKey('custom-id', name, keys, exerciseTipAliases), name).toBeDefined()
      }
    }
  })
})
