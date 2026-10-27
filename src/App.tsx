import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from './features/auth/AuthContext'
import { TabBar } from './components/ui/TabBar'
import { RouteGuard } from './features/auth/RouteGuard'
import { HistoryPage } from './features/history/HistoryPage'
import { ProfileProvider } from './features/profile/ProfileContext'
import { ProfilePage } from './features/profile/ProfilePage'
import { RoutinesPage } from './features/routines/RoutinesPage'
import { ActiveSessionPage } from './features/session/ActiveSessionPage'
import { SessionProvider } from './features/session/SessionContext'

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
      <Route path="/profile" element={<ProfilePage uid={uid} />} />
    </Routes>
  )
}

function App() {
  return (
    <RouteGuard>
      <ProfileProvider>
        <SessionProvider>
          <div className="mx-auto min-h-dvh max-w-md bg-bg text-text">
            <main className="px-4 pb-[calc(var(--tabbar-h)+var(--dock-h)+env(safe-area-inset-bottom)+1rem)]">
              <AppRoutes />
            </main>
            <TabBar />
          </div>
        </SessionProvider>
      </ProfileProvider>
    </RouteGuard>
  )
}

export default App
