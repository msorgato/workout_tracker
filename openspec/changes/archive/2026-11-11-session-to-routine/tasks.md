## 1. Logica pura

- [x] 1.1 Creare `src/features/session/sessionToRoutine.ts` con `deriveTargets`, `routineDraftFromSession`, `diffRoutine`, `applyRoutineChanges` e `describeChange` secondo il design (abbinamento per posizione con `exerciseId` coincidente, `undefined`/0 come nessun carico, esercizi senza serie esclusi, esercizi aggiunti in coda)
- [x] 1.2 Scrivere `tests/sessionToRoutine.test.ts` con gli scenari della spec (carichi diversi → 3 × 9 a 62,5; corpo libero; esercizio senza serie; serie extra e recupero come differenze separate; esercizio aggiunto; selezione parziale; esercizio saltato; nessuna differenza; routine disallineata) e aggiungerlo a `test:unit`; verificare con `npm run test:unit`

## 2. Dati e modulo routine

- [x] 2.1 Aggiungere `getRoutine(uid, id)` a `routinesApi.ts` (`null` se il documento non esiste); verificare con `npx tsc -b`
- [x] 2.2 Estendere `RoutineForm` con `initialValues?: RoutineInput` e `title?: string` e con un messaggio d'errore se `onSave` fallisce (modulo aperto, dati conservati), senza cambiare il comportamento esistente in `RoutinesPage`; verificare con `npx tsc -b` e `npm run lint`

## 3. Riepilogo di fine sessione

- [x] 3.1 Aggiungere a `SessionSummaryScreen` la prop `actions` (tra le statistiche e "Vai allo storico") e in `ActiveSessionPage` conservare lo snapshot della sessione conclusa insieme al riepilogo; verificare con `npx tsc -b`
- [x] 3.2 Creare `SaveAsRoutineCard` (solo sessione libera con almeno un esercizio con serie) e il flusso `creatingRoutine` in `ActiveSessionPage`: `RoutineForm` precompilato con `routineDraftFromSession`, salvataggio con `createRoutine` e poi `/routines`, "Annulla" che torna al riepilogo; verificare con `npx tsc -b` e `npm run lint`
- [x] 3.3 Creare `UpdateRoutineCard` (solo sessione da routine): lettura con `getRoutine`, nessun riquadro durante il caricamento, in errore, con routine assente o senza differenze; elenco di differenze con checkbox selezionate di default (≥ 44px) e testo da `describeChange`; "Salva nella routine" con `applyRoutineChanges` + `updateRoutine`, conferma "Routine aggiornata", errore con selezioni conservate; "Lascia invariata" che chiude il riquadro; verificare con `npx tsc -b`, `npm run lint` e `npm run build`

## 4. Verifica

- [x] 4.1 Verificare che `npm run build`, `npm run lint` e `npm run test:unit` passino e che le modifiche siano limitate a `sessionToRoutine.ts`, ai due componenti del riepilogo, `SessionSummaryScreen.tsx`, `ActiveSessionPage.tsx`, `RoutineForm.tsx`, `routinesApi.ts`, `package.json` e ai test
- [x] 4.2 Prova manuale a 375px: sessione libera con due esercizi → "Salva come routine", modulo precompilato con i valori attesi, salvataggio e routine nell'elenco, "Annulla" che torna al riepilogo; sessione libera vuota senza azione; sessione da routine con carico aumentato, serie extra, recupero cambiato ed esercizio aggiunto → riquadro con le differenze, deselezione di una voce, salvataggio e verifica della routine modificata; sessione da routine identica ai target senza riquadro; "Lascia invariata"
