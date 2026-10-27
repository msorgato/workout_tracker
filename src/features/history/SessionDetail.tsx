import { Card } from '../../components/ui/Card'
import { IconButton } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import type { Session } from '../../lib/types'
import { SummaryStats } from './SummaryStats'
import { summarizeSession } from './sessionSummary'

export function SessionDetail({ session, onBack }: { session: Session; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={session.routineName ?? 'Sessione libera'}
        actions={<IconButton icon="chevron-left" label="Torna allo storico" onClick={onBack} />}
      />
      <p className="-mt-2 text-xs text-text-muted">
        {new Date(session.startedAt).toLocaleString('it-IT')}
        {session.endedAt ? ` — ${new Date(session.endedAt).toLocaleString('it-IT')}` : ''}
      </p>
      <Card>
        <SummaryStats summary={summarizeSession(session)} />
      </Card>
      {session.notes && <p className="text-sm text-text">{session.notes}</p>}

      <ul className="flex flex-col gap-3">
        {session.exercises.map((exercise, index) => (
          <li key={`${exercise.exerciseId}-${index}`}>
            <Card className="flex flex-col gap-3">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-text">
                {exercise.exerciseName}
              </h2>
              <ul className="flex flex-col gap-1">
                {exercise.sets.map((set) => (
                  <li
                    key={set.setNumber}
                    className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2 text-sm"
                  >
                    <span className="w-6 font-display text-lg font-bold tabular-nums text-accent">
                      {set.setNumber}
                    </span>
                    <span className="flex-1 tabular-nums text-text">{set.weight} kg</span>
                    <span className="tabular-nums text-text">× {set.reps}</span>
                    <span className="text-xs text-text-muted">rec. {set.restSeconds}s</span>
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
