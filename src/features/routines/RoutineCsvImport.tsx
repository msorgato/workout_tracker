import { useState } from 'react'
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
      <h2 className="text-lg font-semibold text-gray-900">Importa routine da CSV</h2>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">File CSV</label>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="block w-full text-sm"
        />
        {parseError && <p className="mt-1 text-sm text-red-600">{parseError}</p>}
      </div>

      {rows && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nome routine</label>
            <input
              type="text"
              value={routineName}
              onChange={(event) => setRoutineName(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <ul className="flex flex-col gap-2">
            {rows.map((row, index) => (
              <li
                key={index}
                className={`flex flex-wrap items-center gap-2 rounded-md border p-2 ${
                  row.isValid ? 'border-gray-200' : 'border-red-300 bg-red-50'
                }`}
              >
                <input
                  type="text"
                  value={row.exerciseName}
                  onChange={(event) => updateRow(index, { exerciseName: event.target.value })}
                  className="min-w-[160px] flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <label className="text-xs text-gray-500">
                  Serie
                  <input
                    type="number"
                    min={1}
                    value={row.targetSets}
                    onChange={(event) =>
                      updateRow(index, { targetSets: Number(event.target.value) })
                    }
                    className="ml-1 w-14 rounded border border-gray-300 px-1 py-0.5"
                  />
                </label>
                <label className="text-xs text-gray-500">
                  Reps
                  <input
                    type="number"
                    min={1}
                    value={row.targetReps}
                    onChange={(event) =>
                      updateRow(index, { targetReps: Number(event.target.value) })
                    }
                    className="ml-1 w-14 rounded border border-gray-300 px-1 py-0.5"
                  />
                </label>
                <label className="text-xs text-gray-500">
                  Carico (kg)
                  <input
                    type="number"
                    min={0}
                    value={row.targetWeight ?? ''}
                    onChange={(event) =>
                      updateRow(index, {
                        targetWeight: event.target.value ? Number(event.target.value) : undefined,
                      })
                    }
                    className="ml-1 w-16 rounded border border-gray-300 px-1 py-0.5"
                  />
                </label>
                <label className="text-xs text-gray-500">
                  Recupero (s)
                  <input
                    type="number"
                    min={0}
                    value={row.targetRestSeconds}
                    onChange={(event) =>
                      updateRow(index, { targetRestSeconds: Number(event.target.value) })
                    }
                    className="ml-1 w-16 rounded border border-gray-300 px-1 py-0.5"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-600"
                >
                  Rimuovi
                </button>
                {row.error && <p className="w-full text-xs text-red-600">{row.error}</p>}
              </li>
            ))}
          </ul>

          {hasInvalidRows && (
            <p className="text-sm text-red-600">
              Correggi o rimuovi le righe segnalate prima di confermare.
            </p>
          )}
        </>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!rows || rows.length === 0 || hasInvalidRows || importing}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Conferma e crea routine
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
        >
          Annulla
        </button>
      </div>
    </div>
  )
}
