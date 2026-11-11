import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Icon } from '../../components/ui/Icon'
import type { Routine, Session } from '../../lib/types'
import { getRoutine, updateRoutine } from '../routines/routinesApi'
import {
  applyRoutineChanges,
  describeChange,
  diffRoutine,
  type RoutineChange,
} from './sessionToRoutine'

type Proposal = { routine: Routine; changes: RoutineChange[] }
type Phase = 'idle' | 'saving' | 'saved' | 'dismissed'

interface UpdateRoutineCardProps {
  uid: string
  /** Sessione appena conclusa, avviata da una routine. */
  session: Session
}

/**
 * Proposta di fine sessione da routine: salvare nella routine le differenze (carico, serie,
 * ripetizioni, recupero, esercizi aggiunti). Non mostra nulla finché carica, se la routine non si
 * legge o non c'è nessuna differenza.
 */
export function UpdateRoutineCard({ uid, session }: UpdateRoutineCardProps) {
  const [proposal, setProposal] = useState<Proposal | null>(null)

  useEffect(() => {
    if (!session.routineId) return
    let cancelled = false
    getRoutine(uid, session.routineId)
      .then((routine) => {
        if (cancelled || !routine) return
        const changes = diffRoutine(routine, session)
        if (changes.length > 0) setProposal({ routine, changes })
      })
      .catch(() => {
        // Proposta facoltativa: se la routine non si legge il riepilogo resta com'è.
      })
    return () => {
      cancelled = true
    }
  }, [uid, session])

  if (!proposal) return null
  return <ProposalCard uid={uid} proposal={proposal} />
}

function ProposalCard({ uid, proposal }: { uid: string; proposal: Proposal }) {
  const { routine, changes } = proposal
  const [selected, setSelected] = useState(() => new Set(changes.map((_, index) => index)))
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)

  if (phase === 'dismissed') return null

  if (phase === 'saved') {
    return (
      <Card className="flex items-center gap-2 text-accent">
        <Icon name="check" size={20} />
        <span className="font-semibold">Routine aggiornata</span>
      </Card>
    )
  }

  function toggle(index: number) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  async function handleSave() {
    setPhase('saving')
    setError(null)
    try {
      const chosen = changes.filter((_, index) => selected.has(index))
      await updateRoutine(uid, routine.id, applyRoutineChanges(routine, chosen))
      setPhase('saved')
    } catch {
      setError('Aggiornamento non riuscito. Riprova.')
      setPhase('idle')
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <p className="font-display text-2xl font-bold uppercase leading-tight tracking-wide text-text">
        Aggiorna la routine «{routine.name}»
      </p>
      <ul className="flex flex-col">
        {changes.map((change, index) => (
          <li key={index}>
            <label className="flex min-h-11 items-center gap-3 text-sm text-text">
              <input
                type="checkbox"
                checked={selected.has(index)}
                onChange={() => toggle(index)}
                className="size-5 shrink-0 accent-accent"
              />
              {describeChange(change)}
            </label>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <Button
          variant="primary"
          fullWidth
          disabled={selected.size === 0 || phase === 'saving'}
          onClick={handleSave}
        >
          Salva nella routine
        </Button>
        <Button disabled={phase === 'saving'} onClick={() => setPhase('dismissed')}>
          Lascia invariata
        </Button>
      </div>
    </Card>
  )
}
