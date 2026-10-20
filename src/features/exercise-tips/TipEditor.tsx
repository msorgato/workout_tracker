import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { inputClass } from '../../components/ui/fields'
import type { PersonalTip, TipCategory } from '../../lib/types'
import { MAX_TIP_LENGTH, TIP_CATEGORIES, TIP_CATEGORY_LABELS } from './categories'
import { validateTipText } from './tips'

interface TipEditorProps {
  initialTip?: PersonalTip
  /** Restituisce false se il salvataggio è fallito: il testo resta nel campo per un nuovo tentativo. */
  onSave: (input: { category: TipCategory; text: string }) => Promise<boolean>
  onCancel: () => void
}

export function TipEditor({ initialTip, onSave, onCancel }: TipEditorProps) {
  const [category, setCategory] = useState<TipCategory>(initialTip?.category ?? 'postura')
  const [text, setText] = useState(initialTip?.text ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    const result = validateTipText(text)
    if (!result.ok) {
      setValidationError(result.error)
      return
    }
    setValidationError(null)
    setSaving(true)
    try {
      const saved = await onSave({ category, text: result.text })
      if (saved) onCancel()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3">
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Categoria
        </span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as TipCategory)}
          className={inputClass}
        >
          {TIP_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {TIP_CATEGORY_LABELS[value]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-muted">
          Il tuo tip
        </span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          className={`${inputClass} py-2`}
          placeholder="Es. Scapole addotte e piedi ben a terra"
        />
      </label>
      <div className="flex items-center justify-between text-xs">
        <span className={text.length > MAX_TIP_LENGTH ? 'text-danger' : 'text-text-muted'}>
          {text.length}/{MAX_TIP_LENGTH}
        </span>
        {validationError && <span className="text-danger">{validationError}</span>}
      </div>

      <div className="flex gap-2">
        <Button variant="primary" fullWidth disabled={saving} onClick={handleSave}>
          Salva tip
        </Button>
        <Button onClick={onCancel}>Annulla</Button>
      </div>
    </div>
  )
}
