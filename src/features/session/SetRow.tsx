import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Stepper } from '../../components/ui/Stepper'
import { parseDecimal } from '../../lib/numberInput'
import type { SessionSet } from '../../lib/types'
import { isValidSetValues, type SetValues } from './editSets'

const WEIGHT_STEP = 2.5
const REPS_STEP = 1

interface SetRowProps {
  set: SessionSet
  /** Ultima serie dell'esercizio: evidenziata. */
  isLast: boolean
  /** Serie oltre il target della routine. */
  isExtra: boolean
  flash: boolean
  editing: boolean
  onStartEdit: () => void
  onSave: (values: SetValues) => void
  onCancel: () => void
  onDelete: () => void
}

/** Riga di una serie registrata: un tocco apre l'editor (peso, ripetizioni, elimina) nella riga. */
export function SetRow({
  set,
  isLast,
  isExtra,
  flash,
  editing,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
}: SetRowProps) {
  if (editing) {
    return (
      <li>
        <SetEditor set={set} onSave={onSave} onCancel={onCancel} onDelete={onDelete} />
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        aria-label={`Modifica serie ${set.setNumber}`}
        aria-expanded={false}
        onClick={onStartEdit}
        className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition active:scale-[0.99] motion-reduce:active:scale-100 ${
          isLast ? 'bg-accent/10 text-text' : 'bg-surface text-text-muted'
        } ${flash ? 'animate-row-flash' : ''}`}
      >
        <span className="w-6 font-display text-lg font-bold tabular-nums text-accent">
          {set.setNumber}
        </span>
        <span className="flex-1 tabular-nums">{set.weight} kg</span>
        <span className="tabular-nums">× {set.reps} reps</span>
        {isExtra && (
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs text-text-muted">
            extra
          </span>
        )}
      </button>
    </li>
  )
}

function SetEditor({
  set,
  onSave,
  onCancel,
  onDelete,
}: Pick<SetRowProps, 'set' | 'onSave' | 'onCancel' | 'onDelete'>) {
  const [weight, setWeight] = useState(String(set.weight))
  const [reps, setReps] = useState(String(set.reps))

  const values: SetValues = { weight: parseDecimal(weight), reps: parseDecimal(reps) }
  const valid = isValidSetValues(values)

  return (
    <div
      role="group"
      aria-label={`Modifica serie ${set.setNumber}`}
      className="flex flex-col gap-3 rounded-lg border border-accent/50 bg-surface px-3 py-3"
    >
      <p className="font-display text-lg font-bold uppercase tracking-wide text-accent">
        Serie {set.setNumber}
      </p>
      <Stepper
        label="Peso"
        unit="kg"
        decimal
        step={WEIGHT_STEP}
        value={weight}
        onChange={setWeight}
      />
      <Stepper label="Reps" step={REPS_STEP} value={reps} onChange={setReps} />
      {!valid && (
        <p role="alert" className="text-xs text-danger">
          Ripetizioni: un numero intero da 1 in su. Peso: 0 o più.
        </p>
      )}
      <div className="flex gap-2">
        <Button variant="primary" fullWidth disabled={!valid} onClick={() => onSave(values)}>
          Salva
        </Button>
        <Button onClick={onCancel}>Annulla</Button>
      </div>
      <Button variant="danger-outline" icon="trash" fullWidth onClick={onDelete}>
        Elimina serie
      </Button>
    </div>
  )
}
