## Why

Creare manualmente una routine esercizio per esercizio (nome, serie, reps, carico, recupero) è lento quando si parte da una scheda di allenamento già scritta altrove (es. da un personal trainer), in formato CSV. Serve un modo per importare direttamente un file CSV e ottenere una routine pronta all'uso, senza reinserire a mano ogni riga.

## What Changes

- Nuova funzionalità di importazione: dalla pagina Routine, l'utente può caricare un file CSV con colonne `Esercizio, Serie, Ripetizioni, Carico Ipotetico (kg), Recupero` (un valore numerico per cella, un esercizio per riga) e ottenere in anteprima la routine risultante prima di salvarla.
- Il modello `RoutineExercise` guadagna un campo opzionale `targetWeight?: number` (carico target in kg), popolato dalla colonna "Carico Ipotetico" del CSV e comunque modificabile/impostabile anche creando o modificando una routine manualmente.
- Gli esercizi del CSV che non corrispondono (per nome, case-insensitive) a nessun esercizio della libreria predefinita o personalizzata vengono creati automaticamente come esercizi personalizzati (`customExercises`), riutilizzando il meccanismo già esistente.
- Prima del salvataggio definitivo, l'utente vede un'anteprima editabile (nome routine proposto dal nome file, elenco esercizi con i valori letti dal CSV) e può correggere eventuali valori prima di confermare.
- Durante la sessione attiva, se l'esercizio ha un `targetWeight` configurato, il campo peso della serie viene precompilato con quel valore (resta comunque modificabile prima di confermare la serie).

## Capabilities

### New Capabilities
- `routine-csv-import`: caricamento di un file CSV con una scheda di allenamento (un esercizio per riga, valori numerici diretti), anteprima editabile, creazione della routine risultante (creando automaticamente eventuali esercizi personalizzati mancanti).

### Modified Capabilities
- `routine-management`: `RoutineExercise` guadagna un campo opzionale `targetWeight` (carico target in kg), impostabile/modificabile nel form di creazione/modifica routine.
- `workout-session`: durante la sessione attiva, se l'esercizio ha un `targetWeight` configurato, il campo peso della serie viene precompilato con quel valore.

## Impact

- **Codice nuovo**: parsing CSV (libreria client-side `papaparse`, zero dipendenze server, compatibile col piano Spark), UI di upload/anteprima/conferma import in `src/features/routines/`.
- **Codice modificato**: `src/lib/types.ts` (campo `targetWeight?` su `RoutineExercise` e `SessionExercise`), `RoutineForm.tsx` (editing del carico target), `ActiveSessionPage.tsx` (precompilazione del peso), `RoutinesPage.tsx` (punto di ingresso "Importa da CSV").
- **Nessuna modifica al modello Firestore esistente oltre al nuovo campo opzionale**: nessuna migrazione necessaria, le routine esistenti restano valide (campo assente = nessun carico target precompilato).
- **Nessun impatto sui costi/piano Spark**: parsing interamente client-side, la creazione della routine risultante usa le stesse scritture Firestore già previste per `createRoutine`/`createCustomExercise`.
