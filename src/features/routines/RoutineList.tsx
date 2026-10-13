import { useState } from 'react'
import type { Routine } from '../../lib/types'

interface RoutineListProps {
  routines: Routine[]
  loading: boolean
  onEdit: (routine: Routine) => void
  onDelete: (routineId: string) => Promise<void>
  onStartSession: (routine: Routine) => void
  onCreateNew: () => void
}

export function RoutineList({
  routines,
  loading,
  onEdit,
  onDelete,
  onStartSession,
  onCreateNew,
}: RoutineListProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  async function confirmDelete(routineId: string) {
    await onDelete(routineId)
    setPendingDeleteId(null)
  }

  if (loading) {
    return <p className="text-sm text-text-muted">Caricamento routine...</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">Le tue routine</h2>
        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-contrast hover:bg-accent-hover"
        >
          Nuova routine
        </button>
      </div>

      {routines.length === 0 && (
        <p className="text-sm text-text-muted">Non hai ancora creato nessuna routine.</p>
      )}

      <ul className="flex flex-col gap-2">
        {routines.map((routine) => (
          <li
            key={routine.id}
            className="flex items-center justify-between rounded-md border border-border bg-surface p-3"
          >
            <div>
              <p className="font-medium text-text">{routine.name}</p>
              <p className="text-xs text-text-muted">{routine.exercises.length} esercizi</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onStartSession(routine)}
                className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-contrast hover:bg-accent-hover"
              >
                Avvia sessione
              </button>
              <button
                type="button"
                onClick={() => onEdit(routine)}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-text hover:bg-surface-hover"
              >
                Modifica
              </button>
              {pendingDeleteId === routine.id ? (
                <button
                  type="button"
                  onClick={() => confirmDelete(routine.id)}
                  className="rounded-md bg-danger px-3 py-1.5 text-xs font-medium text-white hover:bg-danger-hover"
                >
                  Conferma eliminazione
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPendingDeleteId(routine.id)}
                  className="rounded-md border border-danger px-3 py-1.5 text-xs text-danger"
                >
                  Elimina
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
