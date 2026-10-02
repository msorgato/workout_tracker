## Context

Il modello `RoutineExercise` ha già un campo `targetRestSeconds`, impostabile nel form routine (`RoutineForm.tsx`). Quando una sessione viene creata da routine (`createSessionFromRoutine` in `sessionsApi.ts`), gli esercizi vengono copiati in `SessionExercise[]` ma il campo `targetRestSeconds` viene scartato — `SessionExercise` non lo prevede. Di conseguenza `ActiveSessionPage.tsx` chiama sempre `handleCompleteSet(index, 90)` con un valore fisso, ignorando qualunque configurazione. Per esercizi senza routine (sessione libera o aggiunti al volo tramite `addExercise`) non esiste comunque alcun target da cui partire.

## Goals / Non-Goals

**Goals:**
- Propagare `targetRestSeconds` dalla routine alla sessione al momento della creazione, così il countdown usa il valore configurato.
- Permettere di impostare/modificare il tempo di recupero per esercizio direttamente nella sessione attiva (per esercizi senza routine, o per override last-minute), con default 90s.
- Rendere la vibrazione a fine countdown più percepibile (pattern a impulsi ripetuti).

**Non-Goals:**
- Non modificare il modello dati Firestore delle routine (`targetRestSeconds` su `RoutineExercise` resta invariato).
- Le modifiche al tempo di recupero fatte durante una sessione NON si ripropagano alla routine di origine (restano locali a quella sessione) — evita di confondere "modifica al volo" con "modifica del template".
- Nessuna nuova lettura/scrittura Firestore aggiuntiva: il target viaggia già dentro il documento sessione esistente.

## Decisions

### 1. Aggiungere `targetRestSeconds?: number` a `SessionExercise`
Il tipo `SessionExercise` (in `src/lib/types.ts`) guadagna un campo opzionale `targetRestSeconds`. `createSessionFromRoutine` lo popola copiando il valore dall'esercizio di routine corrispondente. `useActiveSession.addExercise` (esercizi aggiunti al volo o in sessione libera) lo inizializza a un default di 90s. Il campo è mutabile lato client e viene salvato con lo stesso `updateDoc` incrementale già usato per `exercises` (nessuna nuova scrittura).
**Alternative considerate**: derivare il target rest "al volo" rileggendo la routine originale (`routineId`) ad ogni completamento serie — scartato perché richiede una lettura Firestore aggiuntiva per sessione (costo/quota non giustificato) e non funziona per esercizi aggiunti senza routine.

### 2. Editing inline nella UI della sessione attiva
Accanto ai controlli di peso/reps di ogni esercizio, un piccolo input numerico mostra e permette di modificare `targetRestSeconds` per quell'esercizio. Il valore corrente (eventualmente modificato dall'utente) è quello passato a `RestTimer` al completamento della serie successiva.
**Alternative considerate**: modale/dialog dedicato per l'editing — scartato per complessità non necessaria; un input inline è coerente con lo stile minimale già usato per peso/reps.

### 3. Pattern di vibrazione a impulsi ripetuti
`navigator.vibrate([300, 100, 300])` (vibra, pausa, vibra) al posto del singolo impulso da 400ms attuale. La feature detection (`typeof navigator.vibrate === 'function'`) e il fallback silenzioso restano invariati.
**Alternative considerate**: pattern più lungo/insistente — scartato per non essere invasivo; due impulsi brevi sono un compromesso ragionevole tra percepibilità e discrezione.

## Risks / Trade-offs

- **[Rischio]** Se l'utente modifica il recupero durante la sessione, il valore non si sincronizza con la routine originale, quindi la prossima sessione dalla stessa routine riparte dal target originale → **Mitigazione**: comportamento intenzionale (vedi Non-Goals); se l'utente vuole rendere il cambiamento permanente, può modificare la routine separatamente.
- **[Rischio]** `SessionExercise.targetRestSeconds` è opzionale per compatibilità con sessioni già esistenti in Firestore (create prima di questa modifica, che non hanno il campo) → **Mitigazione**: la UI e `handleCompleteSet` usano un default 90s quando il campo è assente, nessuna migrazione dati necessaria.
