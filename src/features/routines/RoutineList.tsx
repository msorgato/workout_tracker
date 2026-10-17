import { useState } from 'react'
import { Button, IconButton } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
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

  if (routines.length === 0) {
    return (
      <EmptyState icon="list" message="Non hai ancora creato nessuna routine.">
        <Button variant="primary" icon="plus" onClick={onCreateNew}>
          Crea la prima routine
        </Button>
      </EmptyState>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {routines.map((routine) => {
        const preview = routine.exercises.slice(0, 3).map((exercise) => exercise.exerciseName)
        const extra = routine.exercises.length - preview.length
        return (
          <li key={routine.id}>
            <Card className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-2xl font-bold uppercase tracking-wide text-text">
                    {routine.name}
                  </h2>
                  <p className="text-xs text-text-muted">{routine.exercises.length} esercizi</p>
                </div>
                <IconButton icon="pencil" label="Modifica" onClick={() => onEdit(routine)} />
                <IconButton
                  icon="trash"
                  label="Elimina"
                  onClick={() => setPendingDeleteId(routine.id)}
                />
              </div>

              {preview.length > 0 && (
                <p className="text-sm text-text-muted">
                  {preview.join(' · ')}
                  {extra > 0 ? ` · +${extra}` : ''}
                </p>
              )}

              {pendingDeleteId === routine.id ? (
                <div className="flex gap-2">
                  <Button variant="danger" fullWidth onClick={() => confirmDelete(routine.id)}>
                    Conferma eliminazione
                  </Button>
                  <Button onClick={() => setPendingDeleteId(null)}>Annulla</Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  icon="play"
                  fullWidth
                  onClick={() => onStartSession(routine)}
                >
                  Avvia sessione
                </Button>
              )}
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
