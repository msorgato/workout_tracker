import type { ReactNode } from 'react'
import { useAuth } from '../../features/auth/AuthContext'
import { IconButton } from './Button'

interface PageHeaderProps {
  title: string
  actions?: ReactNode
  /** Mostra il pulsante di logout (solo nelle sezioni principali). */
  showLogout?: boolean
}

export function PageHeader({ title, actions, showLogout = true }: PageHeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 flex items-center gap-2 bg-bg/85 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur">
      <h1 className="min-w-0 flex-1 truncate font-display text-4xl font-bold uppercase leading-none tracking-wide text-text">
        {title}
      </h1>
      {actions}
      {showLogout && <IconButton icon="log-out" label="Esci" onClick={logout} />}
    </header>
  )
}
