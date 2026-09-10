import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Routine, RoutineInput } from '../../lib/types'
import { useSession } from '../session/SessionContext'
import { RoutineForm } from './RoutineForm'
import { RoutineList } from './RoutineList'
import { useRoutines } from './useRoutines'

export function RoutinesPage({ uid }: { uid: string }) {
  const { routines, loading, addRoutine, editRoutine, removeRoutine } = useRoutines(uid)
  const { startFromRoutine, startFree } = useSession()
  const [editingRoutine, setEditingRoutine] = useState<Routine | 'new' | null>(null)
  const navigate = useNavigate()

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
      <button
        type="button"
        onClick={handleStartFreeSession}
        className="self-start rounded-md border border-gray-300 px-3 py-1.5 text-sm"
      >
        Avvia sessione libera
      </button>
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
