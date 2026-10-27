import { NavLink, useLocation } from 'react-router-dom'
import { useSession } from '../../features/session/SessionContext'
import { Icon, type IconName } from './Icon'

const TABS: { to: string; label: string; icon: IconName }[] = [
  { to: '/routines', label: 'Routine', icon: 'list' },
  { to: '/session', label: 'Sessione', icon: 'dumbbell' },
  { to: '/history', label: 'Storico', icon: 'history' },
  { to: '/profile', label: 'Profilo', icon: 'user' },
]

export function TabBar() {
  const { session } = useSession()
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-border bg-bg/85 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="flex">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `relative flex h-[var(--tabbar-h)] flex-col items-center justify-center gap-1 text-xs font-medium transition ${
                  isActive ? 'text-accent' : 'text-text-muted hover:text-text'
                }`
              }
            >
              <Icon name={tab.icon} size={24} />
              {tab.label}
              {tab.to === '/session' && session && !pathname.startsWith('/session') && (
                <span
                  aria-label="Sessione in corso"
                  className="absolute right-1/2 top-3 size-2.5 translate-x-5 animate-pulse-dot rounded-full bg-accent shadow-glow"
                />
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
