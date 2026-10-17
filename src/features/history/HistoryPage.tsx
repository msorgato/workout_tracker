import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import type { Session } from '../../lib/types'
import { listCompletedSessions } from '../session/sessionsApi'
import { SessionDetail } from './SessionDetail'
import { SummaryStats } from './SummaryStats'
import { groupSessionsByDay, summarizeSession } from './sessionSummary'

export function HistoryPage({ uid }: { uid: string }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const groups = useMemo(() => groupSessionsByDay(sessions), [sessions])

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
    return <p className="text-sm text-text-muted">Caricamento storico...</p>
  }

  const selected = sessions.find((session) => session.id === selectedId)
  if (selected) {
    return <SessionDetail session={selected} onBack={() => setSelectedId(null)} />
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Storico" />

      {sessions.length === 0 ? (
        <EmptyState icon="history" message="Non ci sono ancora sessioni registrate." />
      ) : (
        groups.map((group) => (
          <section key={group.dayKey} className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {group.label}
            </h2>
            <ul className="flex flex-col gap-2">
              {group.sessions.map((session) => {
                const summary = summarizeSession(session)
                return (
                  <li key={session.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(session.id)}
                      className="w-full text-left transition active:scale-[0.98] motion-reduce:active:scale-100"
                    >
                      <Card className="flex flex-col gap-3 hover:bg-surface-hover">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate font-display text-2xl font-bold uppercase tracking-wide text-text">
                            {session.routineName ?? 'Sessione libera'}
                          </p>
                          <p className="shrink-0 text-xs text-text-muted">
                            {new Date(session.startedAt).toLocaleTimeString('it-IT', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <SummaryStats summary={summary} />
                      </Card>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
