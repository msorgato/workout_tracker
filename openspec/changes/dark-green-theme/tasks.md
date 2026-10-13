## 1. Design token

- [x] 1.1 Definire la palette come variabili CSS in un blocco `@theme` in `src/index.css` (`--color-bg`, `--color-surface`, `--color-surface-hover`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-accent-hover`, `--color-accent-pressed`, `--color-accent-contrast`, `--color-danger`, `--color-danger-hover`)
- [x] 1.2 Impostare `color-scheme: dark` su `:root` e lo sfondo body sul token `--color-bg`

## 2. Layout e autenticazione

- [x] 2.1 Aggiornare `App.tsx` (contenitore root, NavBar, link di navigazione attivi/inattivi) ai nuovi token
- [x] 2.2 Aggiornare `features/auth/LoginPage.tsx` (sfondo, titolo, pulsante "Accedi con Google" come azione primaria in verde)
- [x] 2.3 Aggiornare `features/auth/RouteGuard.tsx` (testo di caricamento)

## 3. Gestione routine

- [x] 3.1 Aggiornare `features/routines/RoutinesPage.tsx` (pulsanti "Avvia sessione libera" / "Importa da CSV" come azioni secondarie)
- [x] 3.2 Aggiornare `features/routines/RoutineList.tsx` (card routine, pulsante "Avvia sessione" primario, "Modifica" secondario, "Elimina"/conferma come danger)
- [x] 3.3 Aggiornare `features/routines/RoutineForm.tsx` (input, pulsante "Salva routine" primario, "Annulla" secondario, controlli riordino)
- [x] 3.4 Aggiornare `features/routines/RoutineCsvImport.tsx` (anteprima righe, righe non valide evidenziate col colore danger, pulsante "Conferma e crea routine" primario)

## 4. Sessione attiva e timer

- [x] 4.1 Aggiornare `features/session/ActiveSessionPage.tsx` (pulsante "Serie completata" primario, "Termina sessione" secondario, note)
- [x] 4.2 Aggiornare `features/rest-timer/RestTimer.tsx` (box countdown col nuovo accento invece del box blu attuale)

## 5. Storico e componenti condivisi

- [x] 5.1 Aggiornare `features/history/HistoryPage.tsx` e `features/history/SessionDetail.tsx`
- [x] 5.2 Aggiornare `components/ExerciseAutocomplete.tsx` (dropdown suggerimenti, voce "crea esercizio" come azione primaria)

## 6. Verifica finale

- [x] 6.1 Eseguire `npm run build` e `npm run lint` per verificare che non ci siano regressioni
- [x] 6.2 Avviare l'app in locale e controllare visivamente ogni vista principale (login, routine, form routine, import CSV, sessione attiva con timer, storico, dettaglio sessione) per residui della palette chiara precedente
- [x] 6.3 Verificare il contrasto testo/sfondo nelle combinazioni principali (testo su `bg`/`surface`, testo scuro su pulsanti `accent`, testo su `danger`)
