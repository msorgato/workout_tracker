import { useEffect, useState } from 'react'
import type { Session } from '../../lib/types'
import { listCompletedSessions } from '../session/sessionsApi'
import { SessionDetail } from './SessionDetail'

export function HistoryPage({ uid }: { uid: string }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listCompletedSessions(uid).then((result) => {
      if (!cancelled) {
        setSessions(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [uid])

  if (loading) {
    return <p className="text-sm text-gray-500">Caricamento storico...</p>
  }

  const selected = sessions.find((session) => session.id === selectedId)
  if (selected) {
    return <SessionDetail session={selected} onBack={() => setSelectedId(null)} />
  }

  if (sessions.length === 0) {
    return <p className="text-sm text-gray-500">Non ci sono ancora sessioni registrate.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-900">Storico sessioni</h2>
      <ul className="flex flex-col gap-2">
        {sessions.map((session) => (
          <li key={session.id}>
            <button
              type="button"
              onClick={() => setSelectedId(session.id)}
              className="w-full rounded-md border border-gray-200 p-3 text-left hover:bg-gray-50"
            >
              <p className="font-medium text-gray-900">
                {session.routineName ?? 'Sessione libera'}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(session.startedAt).toLocaleString('it-IT')} · {session.exercises.length}{' '}
                esercizi
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
