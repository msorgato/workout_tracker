## 1. Serie target nella sessione

- [x] 1.1 Aggiungere `targetSets?: number` a `SessionExercise` in `src/lib/types.ts` e copiarlo da `routine.exercises[].targetSets` in `createSessionFromRoutine` (`src/features/session/sessionsApi.ts`); verificare con `npx tsc -b` e controllando che il documento di sessione creato da una routine contenga `targetSets`
- [x] 1.2 Creare `src/features/session/setProgress.ts` con `getSetProgress` e i test in `tests/setProgress.test.ts` (nessun target, 1/4, 4/4, 4/4 con sblocco, 5/4, esercizio senza `targetSets` di una sessione preesistente); aggiungerlo a `test:unit` e verificare con `npm run test:unit`

## 2. Interfaccia della sessione

- [ ] 2.1 Riprodurre il troncamento del peso a 320px e 375px con valori come 42.5 e 142.5 (DevTools, modalità dispositivo) e annotare la causa osservata; se non è il layout dello `Stepper`, fermarsi e aggiornare design.md
- [x] 2.2 Rifare il layout: stepper Peso e Reps impilati a tutta larghezza in `ActiveSessionPage` e campo valore dello `Stepper` che non tronca mai (larghezza minima, dimensione testo responsive); verificare a 320px che "142.5" sia visibile per intero sia dopo "+" sia digitato a mano
- [x] 2.3 Mostrare nella card l'avanzamento (badge "Serie n/N", "Completato N/N" con check, "n/N · extra"), nascondere stepper e CTA a esercizio completato, aggiungere "Aggiungi serie extra" con stato locale e marcare come extra le righe oltre il target, usando `getSetProgress`; verificare avviando una sessione da routine con 2 serie: dopo la seconda compare "Completato 2/2" e non si può registrare una terza serie senza "Aggiungi serie extra"
- [ ] 2.4 Verificare i casi limite: sessione libera, esercizio aggiunto in sessione e sessione già in corso senza `targetSets` restano senza limite né indicatore; dopo ricaricamento un esercizio completato resta completato e uno con serie extra mostra ancora la CTA; il timer di recupero parte ancora dopo ogni serie e `TipsPanel` resta funzionante

## 3. Verifica d'insieme

- [x] 3.1 Verificare che `npm run build`, `npm run lint` e `npm run test:unit` passino e che le modifiche siano limitate a `types.ts`, `sessionsApi.ts`, `setProgress.ts`, `ActiveSessionPage.tsx`, `Stepper.tsx` e ai test
- [ ] 3.2 Prova manuale end-to-end a 375px: avvia una sessione da una routine importata da CSV (es. Push), completa le serie previste di un esercizio, controlla "Completato", l'aggiunta di una serie extra e i pesi con decimali oltre 100 kg

## Workflow follow-up

- Archiviare la change dopo la verifica manuale.
