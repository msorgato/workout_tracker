const STORAGE_KEY = 'restNotificationsEnabled'
// Tolleranza sul tempo: un timeout può scattare pochi ms prima della scadenza calcolata.
const EARLY_TOLERANCE_MS = 250
// Oltre questo ritardo (pagina congelata e poi ripresa in background) la notifica non ha più senso.
const MAX_LATE_MS = 2 * 60 * 1000

// Preferenza in memoria se `localStorage` non è disponibile (finestre private, dati bloccati).
let memoryPreference = false

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'Notification' in window
}

function readPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return memoryPreference
  }
}

function writePreference(enabled: boolean) {
  memoryPreference = enabled
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0')
  } catch {
    // Ignorato: resta valida la preferenza in memoria.
  }
}

/** Attive solo con preferenza accesa E permesso concesso: un permesso revocato spegne tutto. */
export function isEnabled() {
  return notificationsSupported() && Notification.permission === 'granted' && readPreference()
}

export type EnableResult = 'enabled' | 'denied' | 'blocked'

/** Chiede il permesso (da un gesto dell'utente) e salva la preferenza solo se concesso. */
export async function enable(): Promise<EnableResult> {
  if (!notificationsSupported() || Notification.permission === 'denied') return 'blocked'
  const permission =
    Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
  if (permission !== 'granted') return 'denied'
  writePreference(true)
  return 'enabled'
}

export function disable() {
  writePreference(false)
}

type RestNotificationOptions = NotificationOptions & { renotify?: boolean; vibrate?: number[] }

/** Mostra "Recupero finito" tramite il service worker (l'unico modo su Chrome per Android). */
export async function showRestFinished(exerciseName?: string) {
  if (!notificationsSupported()) return
  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) return
  const options: RestNotificationOptions = {
    body: exerciseName,
    // Stesso tag: una sola notifica per recupero, le precedenti vengono sostituite.
    tag: 'rest-timer',
    renotify: true,
    vibrate: [300, 100, 300],
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  }
  await registration.showNotification('Recupero finito', options)
}

/** Notifica di sistema solo se l'app è nascosta e la scadenza è appena stata raggiunta. */
export function shouldNotify({
  enabled,
  visibility,
  now,
  deadline,
}: {
  enabled: boolean
  visibility: DocumentVisibilityState
  now: number
  deadline: number
}) {
  if (!enabled || visibility !== 'hidden') return false
  return now >= deadline - EARLY_TOLERANCE_MS && now - deadline <= MAX_LATE_MS
}
