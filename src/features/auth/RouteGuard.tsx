import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { LoginPage } from './LoginPage'

export function RouteGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Caricamento...
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <>{children}</>
}
