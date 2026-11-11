import { useSyncExternalStore } from 'react'

// Non è in lib.dom: evento non standard emesso da Chrome quando l'app è installabile.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Chrome emette `beforeinstallprompt` una sola volta, spesso prima che l'utente apra il Profilo:
// i listener stanno a livello di modulo (importato in main.tsx) e conservano l'evento.
let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    notify()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return deferredPrompt !== null && !isStandalone()
}

export function useInstallPrompt() {
  const canInstall = useSyncExternalStore(subscribe, getSnapshot, () => false)

  async function install() {
    const prompt = deferredPrompt
    if (!prompt) return
    await prompt.prompt()
    await prompt.userChoice
    // L'evento non è riutilizzabile: dopo accettazione o rifiuto va scartato.
    deferredPrompt = null
    notify()
  }

  return { canInstall, install }
}
