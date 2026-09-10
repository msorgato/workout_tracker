import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { CustomExercise } from '../../lib/types'

function customExercisesCollection(uid: string) {
  return collection(db, 'users', uid, 'customExercises')
}

export async function listCustomExercises(uid: string): Promise<CustomExercise[]> {
  const q = query(customExercisesCollection(uid), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name as string,
      muscleGroup: data.muscleGroup as string | undefined,
      createdAt: (data.createdAt as Timestamp | undefined)?.toMillis() ?? Date.now(),
    }
  })
}

export async function createCustomExercise(
  uid: string,
  input: { name: string; muscleGroup?: string },
): Promise<CustomExercise> {
  const docRef = await addDoc(customExercisesCollection(uid), {
    name: input.name,
    muscleGroup: input.muscleGroup ?? null,
    createdAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    name: input.name,
    muscleGroup: input.muscleGroup,
    createdAt: Date.now(),
  }
}
