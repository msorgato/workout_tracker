import { initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { readFileSync } from 'node:fs'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { parseRoutineCsv } from '../src/features/routines/csvImport'

const uid = 'test-user'

const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
  projectId: 'demo-workout-tracker',
  firestore: { rules: readFileSync('firestore.rules', 'utf8') },
})

const db = testEnv.authenticatedContext(uid).firestore()

vi.mock('../src/lib/firebase', () => ({ db }))

const { createRoutine, listRoutines } = await import('../src/features/routines/routinesApi')

afterAll(async () => {
  await testEnv.cleanup()
})

describe('CSV import -> createRoutine -> listRoutines round-trip', () => {
  for (const file of [
    'workouts/scheda_giorno1_push.csv',
    'workouts/scheda_giorno2_pull.csv',
    'workouts/scheda_giorno3_legs.csv',
  ]) {
    it(`preserves targetWeight through Firestore for ${file}`, async () => {
      const text = readFileSync(file, 'utf8')
      const parsed = parseRoutineCsv(text, file)

      const exercises = parsed.rows.map((row, i) => ({
        exerciseId: `ex-${i}`,
        exerciseName: row.exerciseName,
        targetSets: row.targetSets,
        targetReps: row.targetReps,
        targetRestSeconds: row.targetRestSeconds,
        targetWeight: row.targetWeight,
        order: i,
      }))

      const created = await createRoutine(uid, { name: parsed.suggestedName, exercises })

      const routines = await listRoutines(uid)
      const reloaded = routines.find((r) => r.id === created.id)

      expect(reloaded, 'routine should be found after reload').toBeDefined()

      for (let i = 0; i < exercises.length; i++) {
        const expected = exercises[i].targetWeight
        const actual = reloaded!.exercises[i].targetWeight
        expect(actual, `exercise ${i} (${exercises[i].exerciseName}) targetWeight`).toBe(expected)
      }
    })
  }
})
