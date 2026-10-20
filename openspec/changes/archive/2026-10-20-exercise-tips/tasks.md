## 1. Dominio e logica pura

- [x] 1.1 Aggiungere in `src/lib/types.ts` i tipi `TipCategory`, `PersonalTip`, `Tip` (con `source`) e creare `src/features/exercise-tips/categories.ts` con etichette italiane, ordine e costante `MAX_TIP_LENGTH = 280`; verificare con `npx tsc -b`
- [x] 1.2 Creare `src/features/exercise-tips/tips.ts` con `mergeTips`, `groupByCategory`, `firstPostureTip`, `validateTipText` e i test in `tests/exerciseTips.test.ts` (unione libreria prima, categorie vuote omesse, nessun tip di postura, testo vuoto/solo spazi/281 caratteri); aggiungere il file a `test:unit` e verificare con `npm run test:unit`

## 2. Contenuti della libreria

- [x] 2.1 Scrivere `src/data/exerciseTips.json` con 3–5 tips in italiano per ciascuno dei 17 esercizi predefiniti (almeno uno di Postura e uno di Movimento o Carico; Sicurezza dove rilevante), formulazioni prudenti e generali; verificare che `tsc -b` importi il JSON
- [x] 2.2 Aggiungere a `tests/exerciseTips.test.ts` il test di coerenza sul JSON (ogni id di `predefinedExercises.json` ha ≥ 1 tip, nessun id orfano, categorie valide, testi non vuoti ≤ 280) e verificare con `npm run test:unit`
- [x] 2.4 Ampliare la libreria con 8 esercizi delle schede in `workouts/` e aggiungere `src/data/exerciseTipAliases.json` con `resolveLibraryKey`/`normalizeExerciseName` in `tips.ts`, passando `exerciseName` a `TipsPanel`; verificare con `npm run test:unit` (test che ogni esercizio dei CSV risolva a dei tips) e `npm run build`
- [ ] 2.3 Sottoporre i contenuti all'utente per revisione (elenco per esercizio) e applicarne le correzioni; verificare con l'approvazione esplicita dell'utente

## 3. Persistenza dei tips personali

- [x] 3.1 Creare `src/features/exercise-tips/exerciseTipsApi.ts` (`listAll`, `saveTips` con `setDoc`, eliminazione del documento se l'array è vuoto) sul percorso `users/{uid}/exerciseTips/{exerciseId}`; verificare con `tsc -b` e `npm run lint`
- [ ] 3.2 Aggiungere a `tests/firestore.rules.test.ts` i casi per `users/{uid}/exerciseTips/{exerciseId}` (proprietario legge/scrive, altro utente e anonimo negati) e verificare con `npm run test:rules`
- [x] 3.3 Creare `useExerciseTips(uid)` con cache di modulo, una sola lettura della collezione, `addTip`/`updateTip`/`deleteTip` ottimistici con rollback ed errore esposto; verificare a vista (rete bloccata in DevTools → messaggio d'errore e stato ripristinato) e con `tsc -b`

## 4. Interfaccia

- [x] 4.1 Aggiungere le icone `info` e `lightbulb` a `src/components/ui/Icon.tsx`; verificare con `tsc -b`
- [x] 4.2 Creare `TipsPanel` (promemoria postura compatto, pulsante `Tips (n)` con `aria-expanded`, sezioni per categoria, badge "Personale", nota "Indicazioni generali…", tips di libreria in sola lettura); verificare a 375px che il pannello si apra/chiuda senza perdere i valori di peso e reps
- [x] 4.3 Creare l'editor inline dei tips personali (categoria, `textarea` con contatore 280, validazione, errore con testo mantenuto, modifica, eliminazione con conferma a due tocchi, stato "nessun tip" con invito ad aggiungerne uno); verificare aggiunta, modifica ed eliminazione su un esercizio predefinito e su uno custom
- [x] 4.4 Integrare `TipsPanel` nelle card di `ActiveSessionPage` (chiamando `useExerciseTips` una sola volta) senza alterare serie, stepper e timer; verificare che il timer ancorato resti visibile e attivo con il pannello aperto

## 5. Verifica d'insieme

- [ ] 5.1 Verificare che `npm run build`, `npm run lint`, `npm run test:unit` e `npm run test:rules` passino e che nessun file fuori da `src/features/exercise-tips/`, `src/data/`, `src/components/ui/Icon.tsx`, `src/features/session/ActiveSessionPage.tsx`, `src/lib/types.ts` e `tests/` sia stato modificato
- [ ] 5.2 Verifica manuale end-to-end a 375px: avvia una sessione da routine, leggi il promemoria postura, apri il pannello, aggiungi/modifica/elimina un tip personale, ricarica l'app e controlla la persistenza; controlla anche il numero di letture Firestore nel pannello Network (una sola query sulla collezione per sessione)

## Workflow follow-up

- Archiviare la change dopo la revisione dei contenuti e la verifica sul deploy.
