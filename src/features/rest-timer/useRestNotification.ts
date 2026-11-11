import { useEffect } from 'react'
import { isEnabled, shouldNotify, showRestFinished } from './restNotifications'

/**
 * Programma la notifica di fine recupero alla scadenza di `restFor`, indipendentemente dalla
 * pagina Sessione (che si smonta cambiando sezione). Mostra la notifica solo se l'app è nascosta:
 * in primo piano bastano suono e vibrazione del timer.
 */
export function useRestNotification(deadline: number | undefined, exerciseName: string | undefined) {
  useEffect(() => {
    if (deadline === undefined || !isEnabled()) return

    let fired = false
    function fire() {
      if (fired) return
      fired = true
      if (
        shouldNotify({
          enabled: true,
          visibility: document.visibilityState,
          now: Date.now(),
          deadline: deadline!,
        })
      ) {
        void showRestFinished(exerciseName).catch(() => {
          // Notifica facoltativa: un errore non deve toccare la sessione.
        })
      }
    }

    const timer = setTimeout(fire, Math.max(0, deadline - Date.now()))
    return () => {
      clearTimeout(timer)
      // Se il recupero è finito per scadenza (il timer della pagina ha azzerato `restFor` un
      // istante prima del nostro timeout) la notifica parte ora; "Salta" o la fine della sessione
      // arrivano prima della scadenza e non notificano.
      fire()
    }
  }, [deadline, exerciseName])
}
