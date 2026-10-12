import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseRoutineCsv } from '../src/features/routines/csvImport'

describe('parseRoutineCsv against real workout CSVs', () => {
  for (const file of [
    'workouts/scheda_giorno1_push.csv',
    'workouts/scheda_giorno2_pull.csv',
    'workouts/scheda_giorno3_legs.csv',
  ]) {
    it(`parses ${file} with correct targetWeight for every row`, () => {
      const text = readFileSync(file, 'utf8')
      const parsed = parseRoutineCsv(text, file)

      for (const row of parsed.rows) {
        expect(row.isValid, `row for "${row.exerciseName}" should be valid: ${row.error}`).toBe(
          true,
        )
        expect(
          row.targetWeight,
          `row for "${row.exerciseName}" should have a numeric targetWeight`,
        ).toBeTypeOf('number')
      }
    })
  }
})
