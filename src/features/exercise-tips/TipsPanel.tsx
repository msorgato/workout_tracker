import { useId, useMemo, useState } from 'react'
import { Button, IconButton } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import exerciseTipAliases from '../../data/exerciseTipAliases.json'
import exerciseTipsLibrary from '../../data/exerciseTips.json'
import type { PersonalTip, TipCategory } from '../../lib/types'
import { TIP_CATEGORY_LABELS } from './categories'
import { TipEditor } from './TipEditor'
import {
  firstPostureTip,
  groupByCategory,
  mergeTips,
  resolveLibraryKey,
  type LibraryTip,
} from './tips'

interface TipsPanelProps {
  exerciseId: string
  exerciseName: string
  personalTips: PersonalTip[]
  error: string | null
  onAdd: (exerciseId: string, input: { category: TipCategory; text: string }) => Promise<boolean>
  onUpdate: (
    exerciseId: string,
    tipId: string,
    input: { category: TipCategory; text: string },
  ) => Promise<boolean>
  onDelete: (exerciseId: string, tipId: string) => Promise<boolean>
}

const library = exerciseTipsLibrary as Record<string, LibraryTip[]>
const libraryKeys = new Set(Object.keys(library))

export function TipsPanel({
  exerciseId,
  exerciseName,
  personalTips,
  error,
  onAdd,
  onUpdate,
  onDelete,
}: TipsPanelProps) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const tips = useMemo(() => {
    const key = resolveLibraryKey(exerciseId, exerciseName, libraryKeys, exerciseTipAliases)
    return mergeTips(exerciseId, key ? library[key] : [], personalTips)
  }, [exerciseId, exerciseName, personalTips])
  const groups = groupByCategory(tips)
  const posture = firstPostureTip(tips)

  async function confirmDelete(tipId: string) {
    await onDelete(exerciseId, tipId)
    setPendingDeleteId(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {posture && (
        <p className="flex items-start gap-2 rounded-lg bg-accent/10 px-3 py-2 text-sm text-text">
          <Icon name="lightbulb" size={18} className="mt-0.5 shrink-0 text-accent" />
          <span className="line-clamp-2">{posture.text}</span>
        </p>
      )}

      <Button
        variant="ghost"
        icon="info"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="self-start"
      >
        Tips{tips.length > 0 ? ` (${tips.length})` : ''}
      </Button>

      {open && (
        <div id={panelId} className="flex flex-col gap-3 rounded-xl border border-border p-3">
          {groups.length === 0 && !adding && (
            <p className="text-sm text-text-muted">
              Nessun tip per questo esercizio. Aggiungi un promemoria personale.
            </p>
          )}

          {groups.map((group) => (
            <section key={group.category} className="flex flex-col gap-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
                {TIP_CATEGORY_LABELS[group.category]}
              </h3>
              <ul className="flex flex-col gap-1">
                {group.tips.map((tip) => (
                  <li key={tip.id}>
                    {editingId === tip.id ? (
                      <TipEditor
                        initialTip={tip}
                        onSave={(input) => onUpdate(exerciseId, tip.id, input)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <div className="flex items-start gap-1">
                        <p className="min-w-0 flex-1 py-2 text-sm text-text">
                          {tip.text}
                          {tip.source === 'personal' && (
                            <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                              Personale
                            </span>
                          )}
                        </p>
                        {tip.source === 'personal' &&
                          (pendingDeleteId === tip.id ? (
                            <Button variant="danger" onClick={() => confirmDelete(tip.id)}>
                              Conferma
                            </Button>
                          ) : (
                            <>
                              <IconButton
                                icon="pencil"
                                label="Modifica tip"
                                onClick={() => setEditingId(tip.id)}
                              />
                              <IconButton
                                icon="trash"
                                label="Elimina tip"
                                onClick={() => setPendingDeleteId(tip.id)}
                              />
                            </>
                          ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {error && <p className="text-sm text-danger">{error}</p>}

          {adding ? (
            <TipEditor
              onSave={(input) => onAdd(exerciseId, input)}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <Button icon="plus" onClick={() => setAdding(true)}>
              Aggiungi tip
            </Button>
          )}

          <p className="text-xs text-text-muted">
            Indicazioni generali, non sostituiscono un istruttore.
          </p>
        </div>
      )}
    </div>
  )
}
