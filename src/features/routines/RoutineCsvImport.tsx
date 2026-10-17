import { useState } from 'react'
import { Button, IconButton } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { NumberField, TextField, inputClass } from '../../components/ui/fields'
import { PageHeader } from '../../components/ui/PageHeader'
import type { ExerciseOption, RoutineExercise } from '../../lib/types'
import { useExerciseLibrary } from '../exercise-library/useExerciseLibrary'
import {
  findExerciseByName,
  parseRoutineCsv,
  readFileAsText,
  type ParsedRoutineExerciseRow,
} from './csvImport'

interface RoutineCsvImportProps {
  uid: string | undefined
  onImport: (name: string, exercises: RoutineExercise[]) => Promise<void>
  onCancel: () => void
}

export function RoutineCsvImport({ uid, onImport, onCancel }: RoutineCsvImportProps) {
  const { options, addCustomExercise } = useExerciseLibrary(uid)
  const [routineName, setRoutineName] = useState('')
  const [rows, setRows] = useState<ParsedRoutineExerciseRow[] | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setParseError(null)
    try {
      const text = await readFileAsText(file)
      const parsed = parseRoutineCsv(text, file.name)
      setRoutineName(parsed.suggestedName)
      setRows(parsed.rows)
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Impossibile leggere il file CSV')
      setRows(null)
    }
  }

  function updateRow(index: number, patch: Partial<ParsedRoutineExerciseRow>) {
    setRows((current) =>
      current
        ? current.map((row, i) =>
            i === index ? { ...row, ...patch, isValid: true, error: undefined } : row,
          )
        : current,
    )
  }

  function removeRow(index: number) {
    setRows((current) => (current ? current.filter((_, i) => i !== index) : current))
  }

  const hasInvalidRows = rows?.some((row) => !row.isValid) ?? false

  async function handleConfirm() {
    if (!rows || rows.length === 0 || hasInvalidRows) return
    setImporting(true)
    try {
      const knownOptions: ExerciseOption[] = [...options]
      const exercises: RoutineExercise[] = []

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        let option = findExerciseByName(knownOptions, row.exerciseName)
        if (!option) {
          option = await addCustomExercise({ name: row.exerciseName })
          knownOptions.push(option)
        }
        exercises.push({
          exerciseId: option.id,
          exerciseName: option.name,
          targetSets: row.targetSets,
          targetReps: row.targetReps,
          targetRestSeconds: row.targetRestSeconds,
          targetWeight: row.targetWeight,
          order: i,
        })
      }

      await onImport(routineName.trim() || 'Routine importata', exercises)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Importa CSV"
        showLogout={false}
        actions={<IconButton icon="x" label="Annulla" onClick={onCancel} />}
      />

      <div>
        <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-muted">
          File CSV
        </span>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="block w-full rounded-xl border border-dashed border-border bg-surface p-3 text-sm text-text file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:font-semibold file:text-accent-contrast"
        />
        {parseError && <p className="mt-1 text-sm text-danger">{parseError}</p>}
      </div>

      {rows && (
        <>
          <TextField
            label="Nome routine"
            value={routineName}
            onChange={(event) => setRoutineName(event.target.value)}
          />

          <ul className="flex flex-col gap-3">
            {rows.map((row, index) => (
              <li key={index}>
                <Card
                  className={`flex flex-col gap-3 p-3 ${
                    row.isValid ? '' : 'border-danger bg-danger/10'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      aria-label="Nome esercizio"
                      value={row.exerciseName}
                      onChange={(event) => updateRow(index, { exerciseName: event.target.value })}
                      className={`${inputClass} flex-1`}
                    />
                    <IconButton
                      icon="trash"
                      label="Rimuovi riga"
                      variant="danger-outline"
                      onClick={() => removeRow(index)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <NumberField
                      label="Serie"
                      min={1}
                      value={row.targetSets}
                      onChange={(event) =>
                        updateRow(index, { targetSets: Number(event.target.value) })
                      }
                    />
                    <NumberField
                      label="Reps"
                      min={1}
                      value={row.targetReps}
                      onChange={(event) =>
                        updateRow(index, { targetReps: Number(event.target.value) })
                      }
                    />
                    <NumberField
                      label="Carico (kg)"
                      min={0}
                      value={row.targetWeight ?? ''}
                      onChange={(event) =>
                        updateRow(index, {
                          targetWeight: event.target.value ? Number(event.target.value) : undefined,
                        })
                      }
                    />
                    <NumberField
                      label="Recupero (s)"
                      min={0}
                      value={row.targetRestSeconds}
                      onChange={(event) =>
                        updateRow(index, { targetRestSeconds: Number(event.target.value) })
                      }
                    />
                  </div>
                  {row.error && <p className="text-xs text-danger">{row.error}</p>}
                </Card>
              </li>
            ))}
          </ul>

          {hasInvalidRows && (
            <p className="text-sm text-danger">
              Correggi o rimuovi le righe segnalate prima di confermare.
            </p>
          )}
        </>
      )}

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleConfirm}
          disabled={!rows || rows.length === 0 || hasInvalidRows || importing}
        >
          Conferma e crea routine
        </Button>
        <Button size="lg" onClick={onCancel}>
          Annulla
        </Button>
      </div>
    </div>
  )
}
