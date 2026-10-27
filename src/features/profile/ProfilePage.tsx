import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { useAuth } from '../auth/AuthContext'
import { XpBar } from '../xp/XpBar'
import { AvatarBadge } from './AvatarBadge'
import { AvatarPicker } from './AvatarPicker'
import { useProfile } from './ProfileContext'
import { useXpSummary } from './useXpSummary'

export function ProfilePage({ uid }: { uid: string }) {
  const { user, logout } = useAuth()
  const profile = useProfile()
  const xpSummary = useXpSummary(uid)
  const [editing, setEditing] = useState(false)

  const name = user?.displayName || user?.email || 'Atleta'

  function closePicker() {
    setEditing(false)
    profile.clearError()
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Profilo"
        showAvatar={false}
        actions={
          !editing ? (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Modifica
            </Button>
          ) : undefined
        }
      />

      <section aria-label="Utente" className="flex animate-fade-up items-center gap-4">
        <AvatarBadge avatarId={profile.avatarId} size={104} />
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="truncate font-display text-3xl font-bold uppercase leading-tight tracking-wide text-text">
            {name}
          </h2>
          {xpSummary.progress && (
            <span className="self-start rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-contrast">
              Livello {xpSummary.progress.level}
            </span>
          )}
        </div>
      </section>

      {editing && (
        <AvatarPicker
          currentAvatarId={profile.avatarId}
          error={profile.error}
          onSave={profile.saveAvatar}
          onCancel={closePicker}
        />
      )}

      <Card className="flex flex-col gap-3">
        {xpSummary.loading ? (
          <p className="text-sm text-text-muted">Caricamento esperienza...</p>
        ) : xpSummary.error || !xpSummary.progress ? (
          <p className="text-sm text-text-muted">
            XP e livello non disponibili al momento. Riprova più tardi.
          </p>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Esperienza totale
              </span>
              <span className="font-display text-4xl font-bold tabular-nums text-accent">
                {xpSummary.xp.toLocaleString('it-IT')} XP
              </span>
            </div>
            <XpBar fraction={xpSummary.progress.fraction} />
            <div className="flex justify-between text-xs tabular-nums text-text-muted">
              <span>Livello {xpSummary.progress.level}</span>
              <span>
                {xpSummary.progress.xpIntoLevel} / {xpSummary.progress.xpForNext} XP
              </span>
            </div>
          </>
        )}
      </Card>

      <Button icon="log-out" fullWidth onClick={logout}>
        Esci
      </Button>
    </div>
  )
}
