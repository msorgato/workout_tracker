import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AvatarBadge } from '../../features/profile/AvatarBadge'
import { useProfile } from '../../features/profile/ProfileContext'

interface PageHeaderProps {
  title: string
  actions?: ReactNode
  /** Mostra l'avatar del profilo come accesso al Profilo (nascosto nella pagina Profilo). */
  showAvatar?: boolean
}

export function PageHeader({ title, actions, showAvatar = true }: PageHeaderProps) {
  const { avatarId } = useProfile()

  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 flex items-center gap-2 bg-bg/85 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur">
      <h1 className="min-w-0 flex-1 truncate font-display text-4xl font-bold uppercase leading-none tracking-wide text-text">
        {title}
      </h1>
      {actions}
      {showAvatar && (
        <Link
          to="/profile"
          aria-label="Profilo"
          className="-mr-1 flex size-11 shrink-0 items-center justify-center rounded-full transition active:scale-95"
        >
          <AvatarBadge avatarId={avatarId} size={36} />
        </Link>
      )}
    </header>
  )
}
