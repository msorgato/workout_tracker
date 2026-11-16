import { describe, expect, it } from 'vitest'
import type { SessionExercise } from '../src/lib/types'
import {
  insertSet,
  isValidSetValues,
  removeSet,
  updateSet,
} from '../src/features/session/editSets'

function exercise(...values: [number, number][]): SessionExercise {
  return {
    exerciseId: 'panca',
    exerciseName: 'Panca',
    order: 0,
    sets: values.map(([weight, reps], index) => ({
      setNumber: index + 1,
      weight,
      reps,
      restSeconds: 90 + index,
      completedAt: 1000 + index,
    })),
  }
}

const three = () => exercise([60, 10], [60, 9], [62.5, 8])

describe('updateSet', () => {
  it('cambia solo peso e ripetizioni mantenendo numero, recupero e orario', () => {
    const result = updateSet(three(), 1, { weight: 62.5, reps: 10 })
    expect(result.sets[1]).toEqual({
      setNumber: 2,
      weight: 62.5,
      reps: 10,
      restSeconds: 91,
      completedAt: 1001,
    })
    expect(result.sets[0]).toEqual(three().sets[0])
    expect(result.sets[2]).toEqual(three().sets[2])
  })

  it('lascia invariato l\'esercizio con un indice non valido', () => {
    const original = three()
    expect(updateSet(original, 3, { weight: 1, reps: 1 })).toBe(original)
    expect(updateSet(original, -1, { weight: 1, reps: 1 })).toBe(original)
  })

  it('non muta l\'esercizio di partenza', () => {
    const original = three()
    const before = JSON.stringify(original)
    updateSet(original, 0, { weight: 100, reps: 1 })
    expect(JSON.stringify(original)).toBe(before)
  })
})

describe('removeSet', () => {
  it('toglie una serie intermedia e rinumera le successive', () => {
    const result = removeSet(three(), 1)
    expect(result.sets.map((set) => [set.setNumber, set.weight, set.reps])).toEqual([
      [1, 60, 10],
      [2, 62.5, 8],
    ])
  })

  it('toglie la prima e l\'ultima serie', () => {
    expect(removeSet(three(), 0).sets.map((set) => set.setNumber)).toEqual([1, 2])
    expect(removeSet(three(), 2).sets.map((set) => set.weight)).toEqual([60, 60])
  })

  it('lascia un esercizio senza serie se si toglie l\'unica', () => {
    expect(removeSet(exercise([50, 5]), 0).sets).toEqual([])
  })

  it('lascia invariato l\'esercizio con un indice non valido', () => {
    const original = three()
    expect(removeSet(original, 5)).toBe(original)
  })

  it('non muta l\'esercizio di partenza', () => {
    const original = three()
    const before = JSON.stringify(original)
    removeSet(original, 1)
    expect(JSON.stringify(original)).toBe(before)
  })
})

describe('insertSet', () => {
  const removed = three().sets[1]

  it('rimuovere e reinserire restituisce l\'originale', () => {
    const original = three()
    const restored = insertSet(removeSet(original, 1), 1, removed)
    expect(restored).toEqual(original)
  })

  it('inserisce all\'inizio e rinumera', () => {
    const result = insertSet(exercise([50, 5], [55, 5]), 0, removed)
    expect(result.sets.map((set) => [set.setNumber, set.weight])).toEqual([
      [1, 60],
      [2, 50],
      [3, 55],
    ])
  })

  it('limita la posizione alla fine se oltre la lunghezza', () => {
    const result = insertSet(exercise([50, 5]), 9, removed)
    expect(result.sets.map((set) => set.weight)).toEqual([50, 60])
    expect(result.sets.map((set) => set.setNumber)).toEqual([1, 2])
  })
})

describe('isValidSetValues', () => {
  it('accetta ripetizioni intere ≥ 1 e peso ≥ 0', () => {
    expect(isValidSetValues({ weight: 62.5, reps: 8 })).toBe(true)
    expect(isValidSetValues({ weight: 0, reps: 10 })).toBe(true)
  })

  it('rifiuta ripetizioni a 0, decimali o non finite', () => {
    expect(isValidSetValues({ weight: 60, reps: 0 })).toBe(false)
    expect(isValidSetValues({ weight: 60, reps: 8.5 })).toBe(false)
    expect(isValidSetValues({ weight: 60, reps: Number.NaN })).toBe(false)
  })

  it('rifiuta pesi negativi o non finiti', () => {
    expect(isValidSetValues({ weight: -1, reps: 5 })).toBe(false)
    expect(isValidSetValues({ weight: Number.NaN, reps: 5 })).toBe(false)
    expect(isValidSetValues({ weight: Number.POSITIVE_INFINITY, reps: 5 })).toBe(false)
  })
})
