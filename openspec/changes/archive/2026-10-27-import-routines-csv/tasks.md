## 1. Dipendenze e modello dati

- [x] 1.1 Installare `papaparse` (e i tipi `@types/papaparse`) come dipendenza
- [x] 1.2 Aggiungere il campo opzionale `targetWeight?: number` a `RoutineExercise` e `SessionExercise` in `src/lib/types.ts`
- [x] 1.3 Aggiornare `createSessionFromRoutine` (`sessionsApi.ts`) per copiare `targetWeight` dall'esercizio di routine al corrispondente esercizio di sessione (stesso pattern già usato per `targetRestSeconds`)

## 2. Parsing CSV

- [x] 2.1 Creare `src/features/routines/csvImport.ts` con una funzione che usa `papaparse` per leggere il file e validare la presenza delle colonne attese (`Esercizio, Serie, Ripetizioni, Carico Ipotetico (kg), Recupero`), lanciando un errore descrittivo se mancanti
- [x] 2.2 Mappare ogni riga in un oggetto `{ exerciseName, targetSets, targetReps, targetWeight?, targetRestSeconds, isValid, error? }`, validando che Serie/Ripetizioni/Recupero siano numeri interi (Carico Ipotetico opzionale)
- [x] 2.3 Proporre un nome routine di default a partire dal nome del file caricato (es. rimuovendo estensione e caratteri non alfabetici)

## 3. Match esercizi e creazione automatica

- [x] 3.1 Implementare la ricerca case-insensitive del nome esercizio tra libreria predefinita e `customExercises` esistenti
- [x] 3.2 Per i nomi senza corrispondenza, predisporre la creazione di un nuovo esercizio personalizzato (riuso di `createCustomExercise`) al momento della conferma import (non durante la sola anteprima)

## 4. UI di importazione

- [x] 4.1 Aggiungere un punto di ingresso "Importa da CSV" in `RoutinesPage.tsx` (input file)
- [x] 4.2 Creare un componente di anteprima (riuso dello stile di `RoutineForm.tsx`) che mostra nome routine proposto ed elenco esercizi con i valori letti, editabili, con le righe non valide evidenziate e un messaggio di errore specifico
- [x] 4.3 Mostrare un messaggio di errore chiaro se il parsing fallisce (colonne mancanti o file non valido), senza procedere all'anteprima
- [x] 4.4 Impedire la conferma finché restano righe non valide non corrette/rimosse
- [x] 4.5 Alla conferma, creare gli esercizi personalizzati mancanti e poi la routine (riuso di `createRoutine`), quindi tornare alla lista routine con la nuova routine visibile

## 5. Precompilazione del carico target

- [x] 5.1 Mostrare/editare `targetWeight` accanto ai controlli serie/reps/recupero di ogni esercizio in `RoutineForm.tsx`
- [x] 5.2 In `ActiveSessionPage.tsx`, precompilare il campo peso di un esercizio con `targetWeight` (se presente) quando non è già stato modificato dall'utente per quella serie

## 6. Verifica finale

- [ ] 6.1 Importare i 3 CSV reali in `workouts/` (push/pull/legs) e verificare che le 3 routine risultanti abbiano esercizi e target corretti
- [ ] 6.2 Verificare che gli esercizi non presenti in libreria (es. "Face Pull al cavo") vengano creati come esercizi personalizzati e riutilizzabili nell'autocomplete
- [ ] 6.3 Avviare una sessione da una routine importata e verificare che il peso proposto per la prima serie corrisponda al `targetWeight` configurato
- [x] 6.4 Eseguire `npm run build` e `npm run lint` per verificare che non ci siano regressioni
