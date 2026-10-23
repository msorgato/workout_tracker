import { describe, expect, it } from 'vitest'
import { getSetProgress } from '../src/features/session/setProgress'

function sets(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    setNumber: i + 1,
    weight: 40,
    reps: 8,
    restSeconds: 90,
    completedAt: 0,
  }))
}

describe('getSetProgress', () => {
  it('senza target non ha limite né indicatore', () => {
    const progress = getSetProgress({ sets: sets(7) }, false)
    expect(progress).toMatchObject({
      target: undefined,
      isComplete: false,
      canLogSet: true,
      nextSetNumber: 8,
      extraCount: 0,
    })
  })

  it('una sessione preesistente senza targetSets resta senza limite', () => {
    expect(getSetProgress({ sets: [], targetSets: undefined }, false).canLogSet).toBe(true)
  })

  it('1/4: si può registrare la serie 2', () => {
    expect(getSetProgress({ sets: sets(1), targetSets: 4 }, false)).toMatchObject({
      done: 1,
      target: 4,
      isComplete: false,
      canLogSet: true,
      nextSetNumber: 2,
    })
  })

  it('4/4: completato, nessuna serie senza sblocco esplicito', () => {
    expect(getSetProgress({ sets: sets(4), targetSets: 4 }, false)).toMatchObject({
      isComplete: true,
      canLogSet: false,
      extraCount: 0,
    })
  })

  it('4/4 con "Aggiungi serie extra": si può registrare', () => {
    const progress = getSetProgress({ sets: sets(4), targetSets: 4 }, true)
    expect(progress.isComplete).toBe(true)
    expect(progress.canLogSet).toBe(true)
  })

  it('5/4: lo sblocco persiste senza stato locale e la serie è extra', () => {
    expect(getSetProgress({ sets: sets(5), targetSets: 4 }, false)).toMatchObject({
      isComplete: true,
      canLogSet: true,
      extraCount: 1,
    })
  })
})
