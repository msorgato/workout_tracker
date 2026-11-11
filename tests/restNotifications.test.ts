import { describe, expect, it } from 'vitest'
import { shouldNotify } from '../src/features/rest-timer/restNotifications'

const deadline = 1_000_000

describe('shouldNotify', () => {
  it('notifica con app nascosta e scadenza raggiunta', () => {
    expect(
      shouldNotify({ enabled: true, visibility: 'hidden', now: deadline, deadline }),
    ).toBe(true)
  })

  it('non notifica con app in primo piano', () => {
    expect(
      shouldNotify({ enabled: true, visibility: 'visible', now: deadline, deadline }),
    ).toBe(false)
  })

  it('non notifica con preferenza spenta', () => {
    expect(
      shouldNotify({ enabled: false, visibility: 'hidden', now: deadline, deadline }),
    ).toBe(false)
  })

  it('non notifica prima della scadenza (salto manuale o fine sessione)', () => {
    expect(
      shouldNotify({ enabled: true, visibility: 'hidden', now: deadline - 10_000, deadline }),
    ).toBe(false)
  })

  it('tollera un timeout scattato pochi ms prima', () => {
    expect(
      shouldNotify({ enabled: true, visibility: 'hidden', now: deadline - 100, deadline }),
    ).toBe(true)
  })

  it('non notifica un recupero scaduto da troppo tempo', () => {
    expect(
      shouldNotify({ enabled: true, visibility: 'hidden', now: deadline + 5 * 60_000, deadline }),
    ).toBe(false)
  })
})
