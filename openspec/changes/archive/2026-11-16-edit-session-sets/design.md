## Context

Motivazione in proposal.md, requisiti in specs/. Stato osservato:

- `SessionExercise.sets[]` contiene `setNumber`, `weight`, `reps`, `restSeconds`, `completedAt`. `ActiveSessionPage` mostra le serie come righe di sola lettura (numero, peso, reps, badge "extra", riga evidenziata per l'ultima, flash `animate-row-flash` sull'ultima aggiunta tramite `lastAddedSet`).
- `useActiveSession` modifica la sessione con funzioni `useCallback` dello stesso schema: costruisce `nextExercises`, `setSession(...)` (aggiornamento ottimistico) e `saveSessionExercises` (riscrive l'intero array `exercises` su Firestore). Nessuna gestione dell'errore di scrittura.
- XP, avanzamento e completamento sono **derivati** dalle serie (`sessionXp`, `isExerciseComplete`, `getSetProgress`): eliminare una serie li ricalcola senza codice aggiuntivo; `extraUnlocked`, `weightInputs` e `repsInputs` sono indicizzati per esercizio, non per serie.
- `Stepper` lavora con valori stringa (`parseDecimal`, `stepValue`), passo 2,5 kg per il peso e 1 per le ripetizioni nella pagina.
- `RestTimer` è montato con `key={restExercise?.sets.length}` e riceve una `deadline` assoluta: cambiare il numero di serie lo rimonta senza far ripartire il conto.
- Scelte confermate dall'utente: vale per ogni sessione attiva; annullamento temporaneo (non conferma); modifica con tocco sulla riga ed editor nella riga.

## Goals / Non-Goals

**Goals:**
- Correggere peso e ripetizioni, o eliminare una serie, con pochi tocchi e senza finestre sovrapposte.
- Logica di modifica pura e testata, separata dalla UI.
- Annullare un'eliminazione accidentale.

**Non-Goals:**
- Modifica delle sessioni concluse; eliminazione o riordino di interi esercizi; modifica di recupero e orario; annullamento di una modifica già salvata; gestione degli errori di scrittura oltre il comportamento esistente.

## Decisions

### 1. Modulo puro `editSets.ts`
`src/features/session/editSets.ts`, funzioni su `SessionExercise` che restituiscono un nuovo oggetto (nessuna mutazione):
- `updateSet(exercise, setIndex, { weight, reps })` — sostituisce solo `weight` e `reps` della serie, mantenendo `setNumber`, `restSeconds`, `completedAt`; indice fuori intervallo → esercizio invariato.
- `removeSet(exercise, setIndex)` — toglie la serie e rinumera `setNumber` da 1 in ordine.
- `insertSet(exercise, setIndex, set)` — inserisce la serie nella posizione indicata (limitata a `0..sets.length`) e rinumera; serve all'annullamento.
- `isValidSetValues({ weight, reps })` — `reps` intero ≥ 1 e `weight` finito ≥ 0.
Test in `tests/editSets.test.ts`: modifica conservando gli altri campi, indice non valido, rimozione con rinumerazione (prima, intermedia, ultima, unica), inserimento (all'inizio, in mezzo, oltre la fine) e che rimuovere e reinserire restituisca l'originale, validazione (reps 0, decimali, peso negativo, NaN). Non muta gli input.

### 2. Azioni in `useActiveSession`
Tre nuove funzioni con lo stesso schema di `completeSet`: `updateSet(exerciseIndex, setIndex, values)`, `removeSet(exerciseIndex, setIndex)` e `restoreSet(exerciseIndex, setIndex, set)`. Ognuna applica la funzione pura all'esercizio, aggiorna `session` e riscrive `exercises` subito. Esposte da `SessionContext` tramite `useSession()` (il tipo del contesto deriva dall'hook, nessuna modifica al provider).

### 3. Riga con editor: `SetRow`
Nuovo componente `SetRow` con la riga attuale come stato di sola lettura (ora un `button` a tutta larghezza, `min-h-11`, con `aria-label="Modifica serie N"` e `aria-expanded`) e, in modifica, un blocco con due `Stepper` (peso con passo 2,5, ripetizioni con passo 1), valori iniziali della serie, e tre pulsanti: "Salva" (primary, disabilitato se `!isValidSetValues`), "Annulla" (secondary) ed "Elimina" (variante di pericolo, separata dagli altri due). Gli input restano stringhe nello stato locale del componente e vengono convertiti con `parseDecimal` al salvataggio. Sotto l'elenco delle serie di ogni esercizio una riga di aiuto "Tocca una serie per modificarla." per rendere scopribile il gesto.
In `ActiveSessionPage` uno stato `editing: { exerciseIndex, setIndex } | null`: aprire una serie chiude l'altra; salvare, annullare o eliminare lo azzera; nessun salvataggio automatico alla chiusura.
**Alternative**: icone matita e cestino per riga (scelta scartata dall'utente: righe più affollate a 320px); finestra modale (scartata: sovrappone il timer di recupero ancorato in basso).

### 4. Annullamento dell'eliminazione
Stato nella pagina: `undo: { exerciseIndex, setIndex, set } | null` con un `setTimeout` di 5 secondi (annullato allo smontaggio e a ogni nuova eliminazione, che sostituisce l'avviso precedente). "Elimina" chiama `removeSet`, imposta `undo` con la serie tolta e avvia il timeout. L'avviso "Serie N eliminata · Annulla" compare nella card dell'esercizio, sotto l'elenco delle serie, con `role="status"`. "Annulla" chiama `restoreSet` con la posizione originale (limitata alla lunghezza attuale se nel frattempo sono cambiate le serie) e azzera l'avviso. L'eliminazione è già scritta su Firestore quando compare l'avviso: l'annullamento riscrive la serie (la persistenza non aspetta lo scadere del tempo, così una chiusura dell'app non perde l'eliminazione).
**Alternativa**: ritardare la scrittura fino alla scadenza dell'avviso — scartata: un ricaricamento dell'app nel frattempo farebbe riapparire la serie e il comportamento persistente non sarebbe coerente con la registrazione.

### 5. Effetti collegati
- **Recupero**: se `restFor.exerciseIndex` coincide con l'esercizio e la serie eliminata è l'ultima, `setRestFor(null)` interrompe il recupero (non c'è più la serie che l'aveva avviato); l'annullamento non lo ripristina. Modificare una serie non tocca il timer.
- **Flash**: dopo "Salva" la riga modificata si illumina con la stessa animazione di una serie appena aggiunta (riuso di `lastAddedSet`, che rispetta già "riduci movimento").
- **XP, avanzamento, completamento**: nessun codice aggiuntivo, derivano dalle serie. Nessun "pop" XP né animazione di badge sulle modifiche.
- **Sessione da routine e `session-to-routine`**: il riepilogo di fine sessione e la proposta di aggiornamento della routine leggono le serie rimaste, quindi usano già i valori corretti.

## Risks / Trade-offs

- **[Rischio]** Un tocco involontario sulla riga apre l'editor mentre si scorre → **Mitigazione**: l'editor si apre solo con un tocco, non cambia nulla finché non si preme "Salva", e "Annulla" lo chiude; nessun dato si perde.
- **[Rischio]** Eliminazione involontaria → **Mitigazione**: avviso di annullamento per 5 secondi; "Elimina" è visivamente separato da "Salva" e "Annulla".
- **[Rischio]** Una scrittura su Firestore che fallisce lascia lo stato locale diverso da quello salvato → **Trade-off accettato**: stesso comportamento di `completeSet` e delle altre scritture di sessione; una gestione degli errori comune è un'altra change.
- **[Trade-off]** L'annullamento dura solo finché la pagina Sessione è aperta: cambiare sezione durante i 5 secondi rende l'eliminazione definitiva (il timeout si annulla allo smontaggio e l'avviso non è conservato).
- **[Trade-off]** Il recupero non si ripristina con l'annullamento: evita timer che ripartono dopo secondi.

## Migration Plan

Solo frontend, nessuna migrazione e nessun nuovo campo. Deploy con il merge su `main`; rollback = revert.
