## 1. Logica pura

- [x] 1.1 Creare `src/features/session/editSets.ts` con `updateSet`, `removeSet` (con rinumerazione da 1), `insertSet` e `isValidSetValues` come funzioni pure che non mutano gli input
- [x] 1.2 Scrivere `tests/editSets.test.ts` con gli scenari del design (modifica che conserva `setNumber`, `restSeconds` e `completedAt`, indice non valido, rimozione prima/intermedia/ultima/unica, inserimento all'inizio/in mezzo/oltre la fine, rimozione + reinserimento = originale, validazione reps 0/decimali/peso negativo/NaN, nessuna mutazione) e aggiungerlo a `test:unit`; verificare con `npm run test:unit` (da `C:\`)

## 2. Azioni sulla sessione

- [x] 2.1 Aggiungere a `useActiveSession` `updateSet`, `removeSet` e `restoreSet` (aggiornamento di `session` e scrittura immediata di `exercises`, come `completeSet`); verificare con `npx tsc -b` e `npm run lint`

## 3. Interfaccia

- [x] 3.1 Creare il componente `SetRow` (riga come `button` ≥ 44px con `aria-label` e `aria-expanded`; editor con `Stepper` di peso e ripetizioni precompilati, "Salva" disabilitato se i valori non sono validi, "Annulla" ed "Elimina" separato dagli altri) e usarlo in `ActiveSessionPage` al posto delle righe attuali, con stato `editing` (una sola serie in modifica), flash della riga salvata e riga di aiuto "Tocca una serie per modificarla."; verificare con `npx tsc -b` e `npm run lint`
- [x] 3.2 In `ActiveSessionPage` collegare "Elimina" a `removeSet` con interruzione del recupero se si elimina l'ultima serie dell'esercizio in recupero, e aggiungere l'avviso "Serie N eliminata · Annulla" (`role="status"`, 5 secondi, sostituito da una nuova eliminazione, `restoreSet` nella posizione originale, timeout annullato allo smontaggio); verificare con `npx tsc -b`, `npm run lint` e `npm run build`

## 4. Verifica

- [x] 4.1 Verificare che `npm run build`, `npm run lint` e `npm run test:unit` passino (dal percorso `C:\`) e che le modifiche siano limitate a `editSets.ts`, `SetRow`, `useActiveSession.ts`, `ActiveSessionPage.tsx`, `package.json` e ai test
- [x] 4.2 Prova manuale a 375px e 320px in una sessione libera e in una da routine: correggere il peso e le ripetizioni di una serie (riga che si illumina, XP invariati), valori non validi (Salva disabilitato), Annulla dell'editor, aprire un'altra serie con l'editor già aperto, eliminare una serie intermedia (rinumerazione, XP −10), eliminare da un esercizio completato (badge e XP −35, pulsante per la serie successiva di nuovo visibile), Annulla entro 5 secondi (serie e numeri originali), attendere i 5 secondi (definitiva), due eliminazioni di fila, eliminare l'ultima serie con il recupero in corso (timer interrotto), ricaricare l'app dopo modifica ed eliminazione (persistenza), serie non modificabili nel dettaglio di una sessione conclusa
