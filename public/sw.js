// Service worker minimo: serve solo a mostrare le notifiche di fine recupero e a riaprire l'app
// al tocco. Nessuna cache e nessun gestore `fetch`: l'app resta online-only.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const existing = windows.find((client) => new URL(client.url).origin === self.location.origin)
      if (existing) {
        await existing.focus()
        // Navigazione dentro l'app (senza ricaricare la pagina): la gestisce App.tsx.
        existing.postMessage({ type: 'navigate', url: '/session' })
        return
      }
      await self.clients.openWindow('/session')
    })(),
  )
})
