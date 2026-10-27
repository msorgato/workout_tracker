## 1. Modello dati sessione

- [x] 1.1 Aggiungere il campo opzionale `targetRestSeconds?: number` a `SessionExercise` in `src/lib/types.ts`
- [x] 1.2 Aggiornare `createSessionFromRoutine` (`sessionsApi.ts`) per copiare `targetRestSeconds` da ogni `RoutineExercise` della routine nel corrispondente `SessionExercise`
- [x] 1.3 Aggiornare `useActiveSession.addExercise` per inizializzare `targetRestSeconds` a 90 quando l'esercizio viene aggiunto senza routine di riferimento (sessione libera o esercizio non pianificato)

## 2. UI sessione attiva: recupero configurabile

- [x] 2.1 Aggiungere in `ActiveSessionPage.tsx` un input numerico per visualizzare/modificare `targetRestSeconds` per ciascun esercizio, con default 90 se assente
- [x] 2.2 Persistere la modifica del tempo di recupero sul documento sessione (stesso `updateDoc` incrementale già usato per `exercises`, nessuna nuova scrittura Firestore)
- [x] 2.3 Sostituire il valore fisso `90` passato a `handleCompleteSet` con il `targetRestSeconds` corrente dell'esercizio
- [x] 2.4 Verificare che il countdown avviato da `RestTimer` rifletta esattamente il valore configurato (da routine o modificato manualmente)

## 3. Vibrazione a impulsi ripetuti

- [x] 3.1 Sostituire in `RestTimer.tsx` la chiamata `navigator.vibrate(400)` con un pattern a impulsi ripetuti (es. `navigator.vibrate([300, 100, 300])`)
- [x] 3.2 Verificare che il fallback silenzioso su dispositivi/browser senza supporto all'API di vibrazione resti invariato (nessun errore, nessun blocco UI)

## 4. Verifica finale

- [ ] 4.1 Percorrere manualmente lo scenario: routine con `targetRestSeconds` personalizzato per un esercizio → avvio sessione da routine → completamento serie → il countdown parte dal valore configurato (non 90 fisso)
- [ ] 4.2 Percorrere manualmente lo scenario: sessione libera → aggiunta esercizio → modifica del tempo di recupero proposto di default → completamento serie → il countdown usa il nuovo valore
- [ ] 4.3 Verificare su dispositivo mobile reale che la vibrazione a fine countdown sia percepibile (pattern a impulsi) dove supportata, e che su iOS/Safari non generi errori
- [x] 4.4 Eseguire `npm run build` e `npm run lint` per verificare che non ci siano regressioni
