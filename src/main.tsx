import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './features/auth/AuthContext.tsx'
// Registra subito i listener di installazione: l'evento può arrivare prima del Profilo.
import './features/install/useInstallPrompt.ts'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import '@fontsource-variable/inter/wght.css'
import './index.css'

// Service worker minimo (solo notifiche, nessuna cache): in produzione, dopo il caricamento.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Senza service worker l'app funziona uguale, solo senza notifiche di sistema.
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
