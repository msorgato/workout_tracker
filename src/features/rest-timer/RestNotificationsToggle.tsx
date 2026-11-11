import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Icon } from '../../components/ui/Icon'
import { disable, enable, isEnabled, notificationsSupported } from './restNotifications'

/** Interruttore "Notifiche di fine recupero" del Profilo; non compare se il browser non le supporta. */
export function RestNotificationsToggle() {
  const [checked, setChecked] = useState(() => isEnabled())
  const [message, setMessage] = useState<string | null>(null)

  if (!notificationsSupported()) return null

  async function handleToggle() {
    setMessage(null)
    if (checked) {
      disable()
      setChecked(false)
      return
    }
    const result = await enable()
    if (result === 'enabled') {
      setChecked(true)
    } else if (result === 'blocked') {
      setMessage('Notifiche bloccate: riattivale dalle impostazioni del sito nel browser.')
    } else {
      setMessage('Notifiche non autorizzate.')
    }
  }

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Icon name="bell" size={22} className="shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text">Notifiche di fine recupero</p>
          <p className="text-xs text-text-muted">
            Avviso quando il recupero finisce e l&apos;app è in secondo piano.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label="Notifiche di fine recupero"
          onClick={handleToggle}
          className="flex h-11 w-14 shrink-0 items-center justify-center"
        >
          <span
            className={`relative h-7 w-12 rounded-full border border-border transition-colors ${
              checked ? 'bg-accent' : 'bg-surface'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 size-6 rounded-full bg-text transition-transform ${
                checked ? 'translate-x-5' : ''
              }`}
            />
          </span>
        </button>
      </div>
      {message && (
        <p role="alert" className="text-sm text-danger">
          {message}
        </p>
      )}
    </Card>
  )
}
