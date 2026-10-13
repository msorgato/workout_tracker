import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from './features/auth/AuthContext'
import { RouteGuard } from './features/auth/RouteGuard'
import { HistoryPage } from './features/history/HistoryPage'
import { RoutinesPage } from './features/routines/RoutinesPage'
import { ActiveSessionPage } from './features/session/ActiveSessionPage'
import { SessionProvider } from './features/session/SessionContext'

function NavBar() {
  const { logout } = useAuth()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium ${isActive ? 'text-accent' : 'text-text-muted hover:text-text'}`

  return (
    <nav className="flex items-center justify-between border-b border-border px-4 py-2">
      <div className="flex gap-1">
        <NavLink to="/routines" className={linkClass}>
          Routine
        </NavLink>
        <NavLink to="/session" className={linkClass}>
          Sessione
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          Storico
        </NavLink>
      </div>
      <button type="button" onClick={logout} className="text-sm text-text-muted hover:text-text">
        Esci
      </button>
    </nav>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const uid = user!.uid

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/routines" replace />} />
      <Route path="/routines" element={<RoutinesPage uid={uid} />} />
      <Route
        path="/session"
        element={<ActiveSessionPage uid={uid} onDone={() => navigate('/history')} />}
      />
      <Route path="/history" element={<HistoryPage uid={uid} />} />
    </Routes>
  )
}

function App() {
  return (
    <RouteGuard>
      <SessionProvider>
        <div className="mx-auto min-h-screen max-w-2xl bg-bg text-text">
          <NavBar />
          <main className="p-4">
            <AppRoutes />
          </main>
        </div>
      </SessionProvider>
    </RouteGuard>
  )
}

export default App
