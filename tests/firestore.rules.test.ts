import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'node:fs'
import { afterAll, afterEach, beforeAll, describe, it } from 'vitest'

const OWNER_UID = 'owner-uid'
const OTHER_UID = 'other-uid'

let testEnv: RulesTestEnvironment

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-workout-tracker',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  })
})

afterEach(async () => {
  await testEnv.clearFirestore()
})

afterAll(async () => {
  await testEnv.cleanup()
})

describe('users/{uid}/** security rules', () => {
  it('denies read/write for an unauthenticated user', async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    const doc = db.doc(`users/${OWNER_UID}/routines/r1`)

    await assertFails(doc.set({ name: 'Push day' }))
    await assertFails(doc.get())
  })

  it('allows the owner to read/write their own data', async () => {
    const db = testEnv.authenticatedContext(OWNER_UID).firestore()

    await assertSucceeds(db.doc(`users/${OWNER_UID}/routines/r1`).set({ name: 'Push day' }))
    await assertSucceeds(db.doc(`users/${OWNER_UID}/routines/r1`).get())
    await assertSucceeds(db.doc(`users/${OWNER_UID}/sessions/s1`).set({ startedAt: Date.now() }))
    await assertSucceeds(db.doc(`users/${OWNER_UID}/customExercises/e1`).set({ name: 'Curl' }))
  })

  it("denies another authenticated user from reading/writing someone else's data", async () => {
    const db = testEnv.authenticatedContext(OTHER_UID).firestore()

    await assertFails(db.doc(`users/${OWNER_UID}/routines/r1`).set({ name: 'Push day' }))
    await assertFails(db.doc(`users/${OWNER_UID}/routines/r1`).get())
  })
})
