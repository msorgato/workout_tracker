import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AvatarBadge } from '../../features/profile/AvatarBadge'
import { useProfile } from '../../features/profile/ProfileContext'

interface PageHeaderProps {
  title: string
  actions?: ReactNode
  /** Seconda riga sotto titolo e avatar (es. contatore XP e "Termina" nella sessione). */
  toolbar?: ReactNode
  /** Mostra l'avatar del profilo come accesso al Profilo (nascosto nella pagina Profilo). */
  showAvatar?: boolean
}

export function PageHeader({ title, actions, toolbar, showAvatar = true }: PageHeaderProps) {
  const { avatarId } = useProfile()

  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 flex flex-col gap-2 bg-bg/85 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur">
      <div className="flex items-start gap-2">
        <div className="flex min-h-11 min-w-0 flex-1 items-center">
          <h1 className="line-clamp-2 break-words font-display text-4xl font-bold uppercase leading-[0.95] tracking-wide text-text">
            {title}
          </h1>
        </div>
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
      </div>
      {toolbar && <div className="flex items-center justify-between gap-2">{toolbar}</div>}
    </header>
  )
}
