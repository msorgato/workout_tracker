import { useState } from 'react'
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4">
      <h1 className="text-2xl font-semibold text-text">Workout Tracker</h1>
      <button
        type="button"
        onClick={handleLogin}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:bg-accent-hover"
      >
        Accedi con Google
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
