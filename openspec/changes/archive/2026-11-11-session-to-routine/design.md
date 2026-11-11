## Context

Motivazione in proposal.md, requisiti in specs/. Stato osservato:

- `Routine.exercises[]`: `exerciseId`, `exerciseName`, `targetSets`, `targetReps`, `targetRestSeconds`, `targetWeight?`, `order`.
- `Session.exercises[]`: `exerciseId`, `exerciseName`, `order`, `sets[]` (`weight`, `reps`, …), `targetSets?`, `targetRestSeconds?`, `targetWeight?`. **Non** contiene `targetReps`: `createSessionFromRoutine` copia solo serie, recupero e carico. Una sessione libera non ha `routineId`.
- Gli esercizi di una sessione da routine sono gli esercizi della routine ordinati per `order`, nella stessa posizione; quelli aggiunti con `addExercise` vanno in coda con `targetRestSeconds: 90`. Il recupero cambiato in sessione aggiorna `targetRestSeconds` dell'esercizio di sessione.
- `ActiveSessionPage.handleFinish` prende uno `snapshot` della sessione, chiama `finishSession()` e mostra `SessionSummaryScreen` (dati: XP, serie, volume, livello) con un solo pulsante "Vai allo storico" (`onDone` → `/history`).
- `RoutineForm` riceve `initialRoutine?: Routine` (decide anche il titolo "Nuova/Modifica routine") e `onSave(input)`; è mostrato da `RoutinesPage` come vista interna, non come route.
- `routinesApi`: `listRoutines`, `createRoutine`, `updateRoutine`, `deleteRoutine`; nessuna lettura singola.
- Scelte confermate dall'utente: proposta a fine sessione; regola "serie con il carico più alto"; modulo precompilato; differenze su carico/serie/ripetizioni, recupero ed esercizi aggiunti; esercizi saltati esclusi.

## Goals / Non-Goals

**Goals:**
- Logica di calcolo e confronto pura e testata, separata dalla UI.
- Riepilogo che resta veloce e utilizzabile anche se la routine non si legge.

**Non-Goals:**
- Proposte durante la sessione, rimozione di esercizi saltati, riordino della routine, conversione di sessioni libere già nello storico, nuovi campi dati.

## Decisions

### 1. Modulo puro `sessionToRoutine.ts`
`src/features/session/sessionToRoutine.ts`:
- `deriveTargets(exercise: SessionExercise): DerivedTargets | null` — regola del requisito (null se nessuna serie; `targetWeight` assente se il massimo è 0; recupero `exercise.targetRestSeconds ?? 90`).
- `routineDraftFromSession(session): RoutineExercise[]` — esercizi con serie, nell'ordine della sessione, `order` riassegnato da 0.
- `diffRoutine(routine, session): RoutineChange[]` — abbina l'esercizio di sessione in posizione *i* all'esercizio *i* della routine ordinata **solo se** l'`exerciseId` coincide e *i* < numero di esercizi della routine; gli esercizi di sessione oltre quella soglia (aggiunti) con almeno una serie diventano `{ kind: 'add', exercise }`. Per gli abbinati con almeno una serie produce una modifica per ogni campo diverso: `{ kind: 'field', routineIndex, field: 'targetWeight' | 'targetSets' | 'targetReps' | 'targetRestSeconds', from, to }`. Il confronto sul carico tratta `undefined` e 0 come "nessun carico"; i decimali si confrontano dopo l'arrotondamento al centesimo. Abbinamenti non coerenti (routine modificata durante la sessione) vengono ignorati, senza errori.
- `applyRoutineChanges(routine, changes): RoutineInput` — applica i campi selezionati e accoda gli esercizi aggiunti con `order` progressivo; nome invariato.
- `describeChange(change): string` — testo in italiano per l'elenco ("Panca piana: carico 60 → 62,5 kg", "serie 3 → 4", "ripetizioni 10 → 8", "recupero 90 → 120 s", "Nuovo esercizio: Curl · 3 × 10 · 12 kg").
Test in `tests/sessionToRoutine.test.ts`: tutti gli scenari della spec (carichi diversi, corpo libero, esercizio senza serie, serie extra, recupero, esercizio aggiunto, selezione parziale, esercizio saltato, nessuna differenza, routine modificata/disallineata).
**Alternativa**: copiare `targetReps` nella sessione all'avvio per confrontarla senza leggere la routine — scartata: richiede un nuovo campo, non copre le sessioni già in corso e i target della routine potrebbero essere cambiati nel frattempo; leggere la routine salvata è più corretto.

### 2. Lettura della routine nel riepilogo
`routinesApi.getRoutine(uid, id): Promise<Routine | null>` (`getDoc`). `UpdateRoutineCard` la legge al montaggio; finché carica non mostra nulla (niente scatti nel riepilogo); se assente o in errore non mostra nulla; se `diffRoutine` è vuoto non mostra nulla. Una lettura in più a fine sessione, trascurabile sul piano Spark.

### 3. Riepilogo con slot per le azioni
`SessionSummaryScreen` riceve `actions?: ReactNode`, mostrato tra le statistiche e "Vai allo storico". `ActiveSessionPage` conserva lo `snapshot` della sessione conclusa insieme al riepilogo e passa:
- `SaveAsRoutineCard` se `!snapshot.routineId` e `routineDraftFromSession(snapshot).length > 0`: card con testo breve e pulsante "Salva come routine";
- `UpdateRoutineCard` se `snapshot.routineId`: elenco a checkbox (target ≥ 44px, tutte selezionate), "Salva nella routine" (primary, disabilitato senza selezioni) e "Lascia invariata"; dopo il successo mostra "Routine aggiornata"; in errore mostra il messaggio e conserva le selezioni.

### 4. Modulo precompilato senza cambiare route
`RoutineForm` accetta anche `initialValues?: RoutineInput` (usato quando non c'è `initialRoutine`) e `title?: string`. In `ActiveSessionPage`, "Salva come routine" imposta uno stato `creatingRoutine` che rende `RoutineForm` al posto del riepilogo (`title="Nuova routine"`, nome vuoto, esercizi da `routineDraftFromSession`). `onSave` chiama `createRoutine` e poi `navigate('/routines')`; in errore il modulo resta aperto con un messaggio (oggi `RoutineForm` non mostra errori di salvataggio: si aggiunge la gestione dell'errore nel `handleSubmit`). `onCancel` torna al riepilogo, che resta montato nello stato della pagina (lo `summary` non si perde).
**Alternativa**: navigare a `/routines` passando la bozza nello state del router — scartata: `RoutinesPage` gestisce il modulo come stato interno e andrebbe esteso per leggere lo state, e "Annulla" non riporterebbe al riepilogo.

## Risks / Trade-offs

- **[Rischio]** Abbinamento per posizione se la routine viene modificata durante la sessione → **Mitigazione**: si abbina solo con `exerciseId` coincidente; il resto viene ignorato, e il caso è coperto dai test.
- **[Rischio]** La regola "carico più alto" può proporre un carico raggiunto in una sola serie → **Trade-off accettato** (scelta dell'utente); ogni differenza è deselezionabile e il modulo precompilato è modificabile.
- **[Rischio]** Lasciando il riepilogo con "Vai allo storico" la proposta si perde → **Trade-off accettato**: la proposta è facoltativa e legata al momento di fine sessione.
- **[Trade-off]** Esercizi saltati mai rimossi: per toglierli resta la modifica manuale della routine.

## Migration Plan

Solo frontend, nessun nuovo campo: nessuna migrazione. Deploy con il merge su `main`; rollback = revert.
