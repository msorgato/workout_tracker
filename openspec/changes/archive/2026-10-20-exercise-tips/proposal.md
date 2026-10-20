## Why

Durante l'allenamento l'app mostra solo il nome dell'esercizio e i campi per registrare le serie: non c'è nulla che ricordi come eseguirlo bene. Postura, gestione del carico e traiettoria del movimento sono proprio le cose che si dimenticano a serie avanzata o quando si prova un esercizio nuovo. Vogliamo avere quei promemoria a portata di mano nella card dell'esercizio, e poter aggiungere i propri.

## What Changes

- Una **libreria di tips statica** (file JSON nel codice, come la libreria degli esercizi) con consigli per i 17 esercizi predefiniti, raggruppati in categorie: **Postura**, **Movimento**, **Carico**, **Sicurezza**. Contenuti scritti in italiano, brevi e pratici (un consiglio = una frase).
- **Tips personali** per qualsiasi esercizio (predefinito, custom o importato da CSV): l'utente può aggiungere, modificare ed eliminare i propri consigli, salvati su Firestore in `users/{uid}/exerciseTips/{exerciseId}`. I tips personali si affiancano a quelli della libreria e sono contrassegnati; i tips della libreria non sono modificabili.
- **Pannello tips nella sessione attiva**: ogni card esercizio mostra un pulsante "Tips" che apre un pannello comprimibile con i consigli per categoria. Un indicatore sul pulsante mostra se l'esercizio ha tips; un esercizio senza tips propone di aggiungerne uno personale.
- **Promemoria postura in evidenza**: i tips della categoria Postura sono mostrati in forma compatta (anteprima del primo consiglio) già nella card chiusa, così il reminder è visibile senza aprire nulla.
- Nessuna modifica a registrazione serie, timer di recupero, routine, storico o regole di sicurezza Firestore (le regole su `users/{uid}/**` coprono già la nuova collezione).

## Capabilities

### New Capabilities
- `exercise-tips`: libreria di consigli per esercizio (statica + personale), categorie, aggiunta/modifica/eliminazione dei tips personali e regole di unione/visualizzazione.

### Modified Capabilities
- `workout-session`: la card esercizio della sessione attiva mostra il promemoria postura e il pannello tips. Il comportamento di registrazione delle serie non cambia. Il delta usa solo `ADDED` (la spec principale esiste in `openspec/specs/workout-session/`, ancora parziale perché `workout-tracker-mvp` non è archiviata).

## Impact

- **Codice nuovo**: `src/data/exerciseTips.json` (contenuti), `src/features/exercise-tips/` (tipi, hook `useExerciseTips`, API Firestore `exerciseTipsApi.ts`, componenti `TipsPanel` e editor), funzione pura di unione statico + personale con test Vitest.
- **Codice modificato**: `src/features/session/ActiveSessionPage.tsx` (integrazione nella card esercizio), `src/lib/types.ts` (tipi dei tips).
- **Dati**: nuova collezione `users/{uid}/exerciseTips/{exerciseId}` (un documento per esercizio con l'array dei tips personali). Nessuna regola da cambiare. Costo: una lettura per esercizio aperto in sessione, con cache in memoria; trascurabile per il piano Spark.
- **Dipendenze**: nessuna nuova.
- **Fuori scope**: tips nella form routine o nella ricerca esercizio, reminder temporizzati/notifiche push, immagini o video dimostrativi (richiederebbero Cloud Storage), tips per esercizi custom precompilati, traduzioni, consigli medici personalizzati (i contenuti sono indicazioni generali, non sostituiscono un istruttore).
