import { describe, expect, it } from 'vitest'
import { AVATARS, DEFAULT_AVATAR_ID, getAvatar } from '../src/features/profile/avatars'

describe('avatars', () => {
  it('espone i 16 avatar del preset con id univoci ed etichette', () => {
    expect(AVATARS).toHaveLength(16)
    expect(new Set(AVATARS.map((a) => a.id)).size).toBe(16)
    for (const avatar of AVATARS) {
      expect(avatar.label.trim(), avatar.id).not.toBe('')
      expect(avatar.label, avatar.id).not.toBe(avatar.id)
      expect(avatar.src, avatar.id).toBeTruthy()
    }
  })

  it('include gli id attesi', () => {
    const ids = AVATARS.map((a) => a.id).sort()
    expect(ids).toEqual(
      [
        'barbell',
        'bolt',
        'calendar',
        'crown',
        'dumbbell',
        'flame',
        'heartbeat',
        'kettlebell',
        'medal',
        'muscle',
        'shaker',
        'sneaker',
        'star',
        'stopwatch',
        'target',
        'trophy',
      ].sort(),
    )
  })

  it('id sconosciuto o assente → avatar predefinito (muscle)', () => {
    expect(DEFAULT_AVATAR_ID).toBe('muscle')
    expect(getAvatar('non-esiste').id).toBe('muscle')
    expect(getAvatar(undefined).id).toBe('muscle')
    expect(getAvatar(null).id).toBe('muscle')
  })

  it("restituisce l'avatar richiesto", () => {
    expect(getAvatar('trophy').label).toBe('Trofeo')
  })
})
