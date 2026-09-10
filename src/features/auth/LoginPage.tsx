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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4">
      <h1 className="text-2xl font-semibold text-gray-900">Workout Tracker</h1>
      <button
        type="button"
        onClick={handleLogin}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Accedi con Google
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
