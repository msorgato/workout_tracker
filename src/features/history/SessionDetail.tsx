import type { Session } from '../../lib/types'

export function SessionDetail({ session, onBack }: { session: Session; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={onBack} className="self-start text-sm text-accent">
        ← Torna allo storico
      </button>

      <h2 className="text-lg font-semibold text-text">
        {session.routineName ?? 'Sessione libera'}
      </h2>
      <p className="text-xs text-text-muted">
        {new Date(session.startedAt).toLocaleString('it-IT')}
        {session.endedAt ? ` — ${new Date(session.endedAt).toLocaleString('it-IT')}` : ''}
      </p>
      {session.notes && <p className="text-sm text-text">{session.notes}</p>}

      <ul className="flex flex-col gap-3">
        {session.exercises.map((exercise, index) => (
          <li
            key={`${exercise.exerciseId}-${index}`}
            className="rounded-md border border-border bg-surface p-3"
          >
            <p className="mb-2 font-medium text-text">{exercise.exerciseName}</p>
            <ul className="flex flex-col gap-1 text-sm text-text-muted">
              {exercise.sets.map((set) => (
                <li key={set.setNumber}>
                  Serie {set.setNumber}: {set.weight}kg × {set.reps} reps (recupero{' '}
                  {set.restSeconds}s)
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
