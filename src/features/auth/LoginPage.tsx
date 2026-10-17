import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const { loginWithGoogle } = useAuth()
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    setError(null)
    try {
      await loginWithGoogle()
    } catch {
      setError('Accesso annullato o non riuscito. Riprova.')
    }
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-between overflow-hidden bg-bg px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(4rem+env(safe-area-inset-top))]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
      />
      <div className="relative flex animate-fade-up flex-col items-start gap-6">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-contrast shadow-glow">
          <Icon name="dumbbell" size={34} />
        </span>
        <h1 className="font-display text-7xl font-bold uppercase leading-[0.9] tracking-wide text-text">
          Workout
          <br />
          <span className="text-accent">Tracker</span>
        </h1>
        <p className="max-w-xs text-text-muted">
          Registra serie, carichi e recuperi. Ogni allenamento, a portata di pollice.
        </p>
      </div>

      <div className="relative flex flex-col gap-3">
        <Button variant="primary" size="lg" fullWidth onClick={handleLogin}>
          Accedi con Google
        </Button>
        {error && <p className="text-center text-sm text-danger">{error}</p>}
      </div>
    </div>
  )
}
