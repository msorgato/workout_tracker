## Why

Una sessione libera ben riuscita oggi si perde nello storico: per ripeterla bisogna ricreare a mano una routine con gli stessi esercizi, serie e carichi. Allo stesso modo, quando in una sessione da routine si alza il carico o si fa una serie in più, la routine resta ferma ai valori vecchi e va aggiornata a mano. Il momento giusto per proporre entrambe le cose è la fine della sessione, quando i dati sono freschi.

## What Changes

- **Sessione libera → routine**: nel riepilogo di fine sessione di una **sessione libera** (con almeno una serie registrata) compare la call to action "Salva come routine". Apre il modulo di creazione routine già compilato con gli esercizi della sessione nell'ordine in cui sono stati fatti; l'utente sceglie il nome, può correggere tutto e salva. Annullando si torna al riepilogo.
- **Sessione da routine → aggiornamento della routine**: nel riepilogo di una sessione avviata da una routine, se i valori effettivi differiscono dai target compare il riquadro "Aggiorna la routine «Nome»" con l'elenco delle differenze, ciascuna selezionabile (tutte selezionate di default):
  - carico, numero di serie e ripetizioni diversi dai target;
  - tempo di recupero modificato durante la sessione;
  - esercizi aggiunti durante la sessione (proposti in coda alla routine).
  "Salva nella routine" applica solo le differenze selezionate; "Lascia invariata" chiude il riquadro. Gli esercizi della routine saltati (nessuna serie) **non** vengono proposti né rimossi.
- **Regola di calcolo dei valori** (unica per entrambi i casi): per ogni esercizio con almeno una serie, serie = numero di serie fatte; carico = il carico più alto usato; ripetizioni = quelle della serie con quel carico (a parità di carico, la più alta); recupero = il recupero impostato per l'esercizio nella sessione (90 s se mai impostato). Un carico massimo di 0 kg (corpo libero) non imposta un carico target.
- Il resto del riepilogo (XP, livello, serie, volume, "Vai allo storico") resta com'è. Nessuna modifica a XP, timer o storico.

## Capabilities

### New Capabilities
Nessuna.

### Modified Capabilities
- `workout-session`: nuovi requisiti sul riepilogo di fine sessione — creazione di una routine da una sessione libera, proposta di aggiornamento della routine per le sessioni da routine, regola di calcolo dei valori.

## Impact

- **Codice nuovo**: `src/features/session/sessionToRoutine.ts` (funzioni pure: valori per esercizio, routine da sessione libera, differenze routine/sessione, applicazione delle differenze selezionate) con test `tests/sessionToRoutine.test.ts` aggiunto a `test:unit`; componenti `SaveAsRoutineCard` e `UpdateRoutineCard` nel riepilogo.
- **Codice modificato**: `src/features/xp/SessionSummaryScreen.tsx` (slot per le azioni aggiuntive sopra "Vai allo storico"), `src/features/session/ActiveSessionPage.tsx` (passa la sessione conclusa al riepilogo e gestisce il modulo routine precompilato), `src/features/routines/RoutineForm.tsx` (valori iniziali senza routine esistente, titolo personalizzabile), `src/features/routines/routinesApi.ts` (`getRoutine`).
- **Dati**: nessun nuovo campo. Si usano `createRoutine` e `updateRoutine` esistenti; una lettura della routine a fine sessione per confrontare i target attuali (se nel frattempo è stata modificata, il confronto usa la versione salvata).
- **Fuori scope**: proposta durante la sessione (dopo ogni serie), rimozione degli esercizi saltati, modifica dell'ordine degli esercizi della routine, trasformazione in routine di sessioni libere già nello storico.
