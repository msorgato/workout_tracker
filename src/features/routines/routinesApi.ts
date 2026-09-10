import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Routine, RoutineInput } from '../../lib/types'

function routinesCollection(uid: string) {
  return collection(db, 'users', uid, 'routines')
}

export async function listRoutines(uid: string): Promise<Routine[]> {
  const q = query(routinesCollection(uid), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      name: data.name as string,
      exercises: data.exercises ?? [],
      createdAt: (data.createdAt as Timestamp | undefined)?.toMillis() ?? Date.now(),
      updatedAt: (data.updatedAt as Timestamp | undefined)?.toMillis() ?? Date.now(),
    }
  })
}

export async function createRoutine(uid: string, input: RoutineInput): Promise<Routine> {
  const docRef = await addDoc(routinesCollection(uid), {
    name: input.name,
    exercises: input.exercises,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const now = Date.now()
  return {
    id: docRef.id,
    name: input.name,
    exercises: input.exercises,
    createdAt: now,
    updatedAt: now,
  }
}

export async function updateRoutine(uid: string, routineId: string, input: RoutineInput) {
  await updateDoc(doc(db, 'users', uid, 'routines', routineId), {
    name: input.name,
    exercises: input.exercises,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteRoutine(uid: string, routineId: string) {
  await deleteDoc(doc(db, 'users', uid, 'routines', routineId))
}
