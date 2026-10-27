import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { AVATARS, getAvatar } from './avatars'
import { AvatarBadge } from './AvatarBadge'

interface AvatarPickerProps {
  currentAvatarId: string | undefined
  error: string | null
  /** Restituisce false se il salvataggio è fallito: il selettore resta aperto con la scelta. */
  onSave: (avatarId: string) => Promise<boolean>
  onCancel: () => void
}

export function AvatarPicker({ currentAvatarId, error, onSave, onCancel }: AvatarPickerProps) {
  const [draftId, setDraftId] = useState(getAvatar(currentAvatarId).id)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const saved = await onSave(draftId)
      if (saved) onCancel()
    } finally {
      setSaving(false)
    }
  }

  return (
    <section
      aria-label="Scegli il tuo avatar"
      className="flex animate-fade-up flex-col gap-4 rounded-card border border-border bg-surface-raised p-4"
    >
      <div className="flex items-center gap-4">
        <AvatarBadge avatarId={draftId} size={72} />
        <div>
          <p className="font-display text-2xl font-bold uppercase tracking-wide text-text">
            {getAvatar(draftId).label}
          </p>
          <p className="text-xs text-text-muted">Anteprima del tuo avatar</p>
        </div>
      </div>

      <ul className="grid grid-cols-4 gap-3">
        {AVATARS.map((avatar) => {
          const selected = avatar.id === draftId
          return (
            <li key={avatar.id} className="flex justify-center">
              <button
                type="button"
                aria-label={avatar.label}
                aria-pressed={selected}
                onClick={() => setDraftId(avatar.id)}
                className={`flex size-16 items-center justify-center rounded-[30%] transition active:scale-95 motion-reduce:active:scale-100 ${
                  selected
                    ? 'ring-2 ring-text ring-offset-2 ring-offset-surface-raised'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                <AvatarBadge avatarId={avatar.id} size={56} />
              </button>
            </li>
          )
        })}
      </ul>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2">
        <Button variant="primary" fullWidth disabled={saving} onClick={handleSave}>
          Salva
        </Button>
        <Button onClick={onCancel}>Annulla</Button>
      </div>
    </section>
  )
}
