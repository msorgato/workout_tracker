import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export interface Profile {
  avatarId?: string
}

function profileRef(uid: string) {
  return doc(db, 'users', uid, 'profile', 'main')
}

/** Documento assente = profilo vuoto (nessun avatar scelto). */
export async function getProfile(uid: string): Promise<Profile> {
  const snapshot = await getDoc(profileRef(uid))
  if (!snapshot.exists()) return {}
  return { avatarId: snapshot.data().avatarId as string | undefined }
}

export async function saveAvatar(uid: string, avatarId: string): Promise<void> {
  await setDoc(profileRef(uid), { avatarId, updatedAt: serverTimestamp() }, { merge: true })
}
