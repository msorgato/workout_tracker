import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Routine, Session, SessionExercise } from '../../lib/types'

function sessionsCollection(uid: string) {
  return collection(db, 'users', uid, 'sessions')
}

function fromDoc(id: string, data: Record<string, unknown>): Session {
  return {
    id,
    startedAt: (data.startedAt as Timestamp | undefined)?.toMillis() ?? Date.now(),
    endedAt: (data.endedAt as Timestamp | undefined)?.toMillis() ?? null,
    routineId: data.routineId as string | undefined,
    routineName: data.routineName as string | undefined,
    notes: data.notes as string | undefined,
    exercises: (data.exercises as SessionExercise[] | undefined) ?? [],
  }
}

export async function createSessionFromRoutine(uid: string, routine: Routine): Promise<Session> {
  const exercises: SessionExercise[] = routine.exercises
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((exercise) => ({
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.exerciseName,
      order: exercise.order,
      sets: [],
    }))

  const docRef = await addDoc(sessionsCollection(uid), {
    startedAt: serverTimestamp(),
    endedAt: null,
    routineId: routine.id,
    routineName: routine.name,
    exercises,
  })

  return {
    id: docRef.id,
    startedAt: Date.now(),
    endedAt: null,
    routineId: routine.id,
    routineName: routine.name,
    exercises,
  }
}

export async function createFreeSession(uid: string): Promise<Session> {
  const docRef = await addDoc(sessionsCollection(uid), {
    startedAt: serverTimestamp(),
    endedAt: null,
    exercises: [],
  })

  return { id: docRef.id, startedAt: Date.now(), endedAt: null, exercises: [] }
}

export async function findActiveSession(uid: string): Promise<Session | null> {
  const q = query(
    sessionsCollection(uid),
    where('endedAt', '==', null),
    orderBy('startedAt', 'desc'),
    limit(1),
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return fromDoc(docSnap.id, docSnap.data())
}

export async function saveSessionExercises(
  uid: string,
  sessionId: string,
  exercises: SessionExercise[],
) {
  await updateDoc(doc(db, 'users', uid, 'sessions', sessionId), { exercises })
}

export async function saveSessionNotes(uid: string, sessionId: string, notes: string) {
  await updateDoc(doc(db, 'users', uid, 'sessions', sessionId), { notes })
}

export async function endSession(uid: string, sessionId: string) {
  await updateDoc(doc(db, 'users', uid, 'sessions', sessionId), { endedAt: serverTimestamp() })
}

export async function listCompletedSessions(uid: string): Promise<Session[]> {
  const q = query(sessionsCollection(uid), where('endedAt', '!=', null), orderBy('endedAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => fromDoc(docSnap.id, docSnap.data()))
}

export async function getSession(uid: string, sessionId: string): Promise<Session | null> {
  const snapshot = await getDocs(query(sessionsCollection(uid), where('__name__', '==', sessionId)))
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return fromDoc(docSnap.id, docSnap.data())
}
