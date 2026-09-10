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
    return <p className="text-sm text-gray-500">Caricamento routine...</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Le tue routine</h2>
        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuova routine
        </button>
      </div>

      {routines.length === 0 && (
        <p className="text-sm text-gray-500">Non hai ancora creato nessuna routine.</p>
      )}

      <ul className="flex flex-col gap-2">
        {routines.map((routine) => (
          <li
            key={routine.id}
            className="flex items-center justify-between rounded-md border border-gray-200 p-3"
          >
            <div>
              <p className="font-medium text-gray-900">{routine.name}</p>
              <p className="text-xs text-gray-500">{routine.exercises.length} esercizi</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onStartSession(routine)}
                className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
              >
                Avvia sessione
              </button>
              <button
                type="button"
                onClick={() => onEdit(routine)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs"
              >
                Modifica
              </button>
              {pendingDeleteId === routine.id ? (
                <button
                  type="button"
                  onClick={() => confirmDelete(routine.id)}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Conferma eliminazione
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPendingDeleteId(routine.id)}
                  className="rounded-md border border-red-300 px-3 py-1.5 text-xs text-red-600"
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
