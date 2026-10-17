import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import type { Routine, RoutineExercise, RoutineInput } from '../../lib/types'
import { useSession } from '../session/SessionContext'
import { RoutineCsvImport } from './RoutineCsvImport'
import { RoutineForm } from './RoutineForm'
import { RoutineList } from './RoutineList'
import { useRoutines } from './useRoutines'

export function RoutinesPage({ uid }: { uid: string }) {
  const { routines, loading, addRoutine, editRoutine, removeRoutine } = useRoutines(uid)
  const { startFromRoutine, startFree } = useSession()
  const [editingRoutine, setEditingRoutine] = useState<Routine | 'new' | null>(null)
  const [importingCsv, setImportingCsv] = useState(false)
  const navigate = useNavigate()

  async function handleImportCsv(name: string, exercises: RoutineExercise[]) {
    await addRoutine({ name, exercises })
    setImportingCsv(false)
  }

  async function handleSave(input: RoutineInput) {
    if (editingRoutine && editingRoutine !== 'new') {
      await editRoutine(editingRoutine.id, input)
    } else {
      await addRoutine(input)
    }
    setEditingRoutine(null)
  }

  async function handleStartSession(routine: Routine) {
    await startFromRoutine(routine)
    navigate('/session')
  }

  async function handleStartFreeSession() {
    await startFree()
    navigate('/session')
  }

  if (importingCsv) {
    return (
      <RoutineCsvImport
        uid={uid}
        onImport={handleImportCsv}
        onCancel={() => setImportingCsv(false)}
      />
    )
  }

  if (editingRoutine) {
    return (
      <RoutineForm
        uid={uid}
        initialRoutine={editingRoutine === 'new' ? undefined : editingRoutine}
        onSave={handleSave}
        onCancel={() => setEditingRoutine(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Routine"
        actions={
          <Button variant="primary" icon="plus" onClick={() => setEditingRoutine('new')}>
            Nuova
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-2">
        <Button icon="flame" onClick={handleStartFreeSession}>
          Sessione libera
        </Button>
        <Button icon="upload" onClick={() => setImportingCsv(true)}>
          Importa CSV
        </Button>
      </div>
      <RoutineList
        routines={routines}
        loading={loading}
        onEdit={setEditingRoutine}
        onDelete={removeRoutine}
        onStartSession={handleStartSession}
        onCreateNew={() => setEditingRoutine('new')}
      />
    </div>
  )
}
