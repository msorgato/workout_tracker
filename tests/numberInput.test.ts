import { describe, expect, it } from 'vitest'
import { parseDecimal, stepValue } from '../src/lib/numberInput'

describe('parseDecimal', () => {
  it('accetta virgola e punto', () => {
    expect(parseDecimal('57,5')).toBe(57.5)
    expect(parseDecimal('57.5')).toBe(57.5)
  })

  it('restituisce 0 per stringa vuota o non numerica', () => {
    expect(parseDecimal('')).toBe(0)
    expect(parseDecimal('abc')).toBe(0)
  })
})

describe('stepValue', () => {
  it('incrementa il peso di 2,5', () => {
    expect(stepValue('40', 2.5)).toBe('42.5')
  })

  it('parte da zero con valore vuoto', () => {
    expect(stepValue('', 1)).toBe('1')
  })

  it('non scende sotto zero', () => {
    expect(stepValue('0', -1)).toBe('0')
    expect(stepValue('1', -2.5)).toBe('0')
  })

  it('accetta valori con la virgola', () => {
    expect(stepValue('57,5', 2.5)).toBe('60')
  })
})
