## Why

Il tempo di recupero target (`targetRestSeconds`) impostato per ogni esercizio in fase di creazione/modifica di una routine viene salvato ma non è mai usato durante la sessione attiva: il countdown di recupero parte sempre con un valore fisso di 90 secondi, indipendentemente da cosa è stato configurato. La configurazione esiste nell'interfaccia ma non produce alcun effetto reale, il che è fuorviante per l'utente. Inoltre, per le sessioni libere (senza routine) o per esercizi aggiunti al volo, non esiste alcun modo di impostare un tempo di recupero diverso dal default. Va infine rafforzato il feedback di vibrazione a fine countdown, così il segnale resta percepibile anche senza guardare lo schermo.

## What Changes

- Il completamento di una serie durante una sessione avviata da routine avvia il countdown di recupero usando il `targetRestSeconds` configurato per quell'esercizio nella routine, invece del valore fisso 90s hardcoded.
- Per esercizi senza un target da routine (sessione libera, o esercizi aggiunti durante la sessione) l'utente può impostare il tempo di recupero desiderato direttamente nella UI della sessione attiva, con un default di 90s se non modificato.
- Il tempo di recupero mostrato/usato per un esercizio resta modificabile in ogni momento della sessione (non solo alla creazione della routine), per gestire varianti last-minute.
- Rinforzo del pattern di vibrazione a fine countdown (vibrazione a impulsi ripetuti anziché singolo impulso breve) per renderlo più percepibile, mantenendo invariato il fallback silenzioso su dispositivi senza supporto (iOS/Safari).

## Capabilities

### New Capabilities
(nessuna)

### Modified Capabilities
- `workout-session`: il completamento di una serie deve avviare il countdown di recupero usando il tempo target configurato per l'esercizio (dalla routine di partenza, o un valore impostato dall'utente per esercizi senza routine), invece di un valore fisso non configurabile.
- `rest-timer`: il pattern di vibrazione a fine countdown viene rafforzato (impulsi ripetuti) per una migliore percepibilità, mantenendo il comportamento invariato su dispositivi/browser senza supporto all'API di vibrazione.

## Impact

- **Codice modificato**: `src/features/session/ActiveSessionPage.tsx` (rimozione del valore hardcoded, aggiunta UI per impostare/modificare il recupero per esercizio), `src/features/rest-timer/RestTimer.tsx` (pattern di vibrazione).
- **Nessuna modifica al modello dati Firestore**: `targetRestSeconds` su `RoutineExercise` e `restSeconds` su `SessionSet` esistono già e sono sufficienti.
- **Nessun impatto su costi/piano Spark**: modifica puramente client-side, nessuna nuova lettura/scrittura Firestore.
