## Why

Una serie registrata durante la sessione non si può più correggere: un peso o delle ripetizioni digitati male, o una serie registrata per errore, restano nella sessione e falsano volume, XP e storico. Serve un modo per correggere o eliminare una serie mentre la sessione è ancora attiva.

## What Changes

- **Modifica di una serie**: toccando la riga di una serie registrata, la riga si espande in un editor con gli stessi stepper di peso e ripetizioni della registrazione, precompilati con i valori attuali, e i pulsanti "Salva", "Annulla" ed "Elimina". Salvando, la serie cambia peso e ripetizioni; numero, recupero e orario di completamento restano quelli originali.
- **Eliminazione di una serie**: "Elimina" nell'editor toglie la serie e rinumera quelle successive (1, 2, 3…).
- **Annullamento dell'eliminazione**: dopo l'eliminazione compare, per circa 5 secondi, un avviso "Serie N eliminata · Annulla" nella card dell'esercizio; toccando "Annulla" la serie torna nella sua posizione con i valori originali. Trascorsi i 5 secondi l'eliminazione è definitiva.
- **Ambito**: ogni sessione attiva, libera o avviata da una routine. Le sessioni concluse (storico) restano non modificabili.
- **Conseguenze coerenti**: volume, XP della sessione, badge "Serie N/M" e "Completato" si ricalcolano dalle serie rimaste (eliminare una serie toglie 10 XP e, se l'esercizio non è più completo, anche il bonus esercizio); se si elimina l'ultima serie di un esercizio mentre il suo recupero è in corso, il recupero si interrompe.
- **Persistenza**: ogni modifica o eliminazione viene scritta subito su Firestore, come la registrazione di una serie.
- Nessuna modifica a routine, storico, XP globali (restano derivati), regole Firestore o timer.

## Capabilities

### New Capabilities
Nessuna.

### Modified Capabilities
- `workout-session`: nuovi requisiti per la modifica di una serie registrata, la sua eliminazione e l'annullamento dell'eliminazione.

## Impact

- **Codice nuovo**: `src/features/session/editSets.ts` (funzioni pure per modificare, rimuovere e ripristinare una serie con rinumerazione) con test `tests/editSets.test.ts` aggiunto a `test:unit`; componente `SetRow` (riga con editor).
- **Codice modificato**: `src/features/session/useActiveSession.ts` (`updateSet`, `removeSet`, `restoreSet`, con scrittura immediata come `completeSet`), `src/features/session/ActiveSessionPage.tsx` (stato di modifica, avviso di annullamento, interruzione del recupero).
- **Dati**: nessun nuovo campo né modifica allo schema: si riscrive l'array `exercises` della sessione, come già fa la registrazione di una serie.
- **Fuori scope**: modifica delle sessioni concluse, eliminazione o riordino di interi esercizi, modifica del recupero o dell'orario di una serie, annullamento di una modifica già salvata.
- **Assunzioni**: valori ammessi nell'editor: ripetizioni intere ≥ 1, peso ≥ 0 (0 = corpo libero); una scrittura che fallisce segue lo stesso comportamento delle altre scritture di sessione (nessuna gestione dedicata in questa change).
