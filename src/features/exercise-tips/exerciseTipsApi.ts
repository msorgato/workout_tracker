import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { PersonalTip } from '../../lib/types'

function exerciseTipsCollection(uid: string) {
  return collection(db, 'users', uid, 'exerciseTips')
}

/** Legge tutti i tips personali dell'utente: un documento per esercizio, indicizzato per exerciseId. */
export async function listAllPersonalTips(uid: string): Promise<Map<string, PersonalTip[]>> {
  const snapshot = await getDocs(exerciseTipsCollection(uid))
  const result = new Map<string, PersonalTip[]>()
  for (const document of snapshot.docs) {
    const tips = (document.data().tips as PersonalTip[] | undefined) ?? []
    if (tips.length > 0) result.set(document.id, tips)
  }
  return result
}

/** Sostituisce i tips di un esercizio; con array vuoto elimina il documento. */
export async function savePersonalTips(
  uid: string,
  exerciseId: string,
  tips: PersonalTip[],
): Promise<void> {
  const ref = doc(db, 'users', uid, 'exerciseTips', exerciseId)
  if (tips.length === 0) {
    await deleteDoc(ref)
    return
  }
  await setDoc(ref, { tips, updatedAt: serverTimestamp() })
}
