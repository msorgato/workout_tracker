import Papa from 'papaparse'
import type { ExerciseOption } from '../../lib/types'

const REQUIRED_COLUMNS = ['Esercizio', 'Serie', 'Ripetizioni', 'Carico Ipotetico (kg)', 'Recupero']

export interface ParsedRoutineExerciseRow {
  exerciseName: string
  targetSets: number
  targetReps: number
  targetWeight?: number
  targetRestSeconds: number
  isValid: boolean
  error?: string
}

export interface ParsedCsvImport {
  suggestedName: string
  rows: ParsedRoutineExerciseRow[]
}

function parseRequiredInt(value: string | undefined): number | null {
  const trimmed = (value ?? '').trim()
  if (!/^\d+$/.test(trimmed)) return null
  return Number.parseInt(trimmed, 10)
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  const trimmed = (value ?? '').trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function suggestRoutineNameFromFileName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, '')
  const cleaned = withoutExtension.replace(/[_-]+/g, ' ').trim()
  return cleaned.length > 0 ? cleaned : 'Routine importata'
}

export function parseRoutineCsv(csvText: string, fileName: string): ParsedCsvImport {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  const headers = result.meta.fields ?? []
  const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.includes(column))
  if (missingColumns.length > 0) {
    throw new Error(
      `Colonne mancanti nel CSV: ${missingColumns.join(', ')}. Attese: ${REQUIRED_COLUMNS.join(', ')}.`,
    )
  }

  const rows: ParsedRoutineExerciseRow[] = result.data.map((record) => {
    const exerciseName = (record['Esercizio'] ?? '').trim()
    const targetSets = parseRequiredInt(record['Serie'])
    const targetReps = parseRequiredInt(record['Ripetizioni'])
    const targetRestSeconds = parseRequiredInt(record['Recupero'])
    const targetWeight = parseOptionalNumber(record['Carico Ipotetico (kg)'])

    if (!exerciseName) {
      return {
        exerciseName: '(nome mancante)',
        targetSets: 0,
        targetReps: 0,
        targetRestSeconds: 0,
        targetWeight,
        isValid: false,
        error: 'Nome esercizio mancante',
      }
    }

    if (targetSets === null || targetReps === null || targetRestSeconds === null) {
      return {
        exerciseName,
        targetSets: targetSets ?? 0,
        targetReps: targetReps ?? 0,
        targetRestSeconds: targetRestSeconds ?? 0,
        targetWeight,
        isValid: false,
        error: 'Serie, Ripetizioni e Recupero devono essere numeri interi',
      }
    }

    return {
      exerciseName,
      targetSets,
      targetReps,
      targetRestSeconds,
      targetWeight,
      isValid: true,
    }
  })

  return {
    suggestedName: suggestRoutineNameFromFileName(fileName),
    rows,
  }
}

export function readFileAsText(file: File): Promise<string> {
  return file.text()
}

export function findExerciseByName(
  options: ExerciseOption[],
  name: string,
): ExerciseOption | undefined {
  const normalized = name.trim().toLowerCase()
  return options.find((option) => option.name.trim().toLowerCase() === normalized)
}
