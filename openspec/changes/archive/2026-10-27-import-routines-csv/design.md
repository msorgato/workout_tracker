## Context

I CSV reali da importare (vedi cartella `workouts/`) sono stati standardizzati dall'utente a un formato pulito, un esercizio per riga, tutti i valori numerici singoli (nessun range, nessuna riga cardio, nessun carattere da escapare):

```
Esercizio,Serie,Ripetizioni,Carico Ipotetico (kg),Recupero
Panca piana con bilanciere o manubri,4,8,40,120
Spinta su panca inclinata con manubri,3,8,20,90
```

Il nome della routine non è nel file: va chiesto/proposto all'utente (es. dal nome del file). Il modello `RoutineExercise` attuale (`targetSets`, `targetReps`, `targetRestSeconds`) non ha un campo per il carico target: va aggiunto.

## Goals / Non-Goals

**Goals:**
- Parsing CSV diretto: ogni colonna numerica mappa 1:1 su un campo numerico della routine.
- Il carico target ("Carico Ipotetico") diventa un vero campo `targetWeight?: number`, utile anche oltre l'import (precompilazione durante il logging).
- Anteprima editabile prima del salvataggio: l'utente vede cosa verrà creato e può correggere eventuali errori di battitura nel CSV originale.
- Riuso del meccanismo esistente per gli esercizi personalizzati (nessuna nuova collezione Firestore).

**Non-Goals:**
- Nessuna gestione di range, testo libero o righe non numeriche nelle colonne Serie/Ripetizioni/Carico/Recupero: se una cella non è un numero intero valido, la riga viene segnalata come errore in anteprima (nessuna interpretazione "best-effort").
- Nessun import automatico in blocco di più file contemporaneamente in questa versione: un CSV alla volta, ripetibile.
- Nessuna modifica al formato di export/import per le routine esistenti (no round-trip export-to-CSV): è un'importazione one-way.

## Decisions

### 1. Parsing CSV con `papaparse`
Uso della libreria `papaparse` (client-side, ~20KB gzip, nessuna dipendenza server) invece di uno split manuale su virgola, per robustezza anche se il formato attuale è semplice (es. un nome esercizio futuro con una virgola non romperebbe il parsing).
**Alternative considerate**: split manuale su `,` — scartato: anche con CSV "puliti" oggi, un parser dedicato costa pochissimo ed evita futuri bug di edge-case (nomi esercizio con virgole, differenze di a-capo tra OS, ecc.).

### 2. Colonne mappate 1:1 su campi numerici, validazione per riga
Ogni riga del CSV mappa direttamente su:
- `targetSets` ← `Serie` (intero)
- `targetReps` ← `Ripetizioni` (intero)
- `targetWeight` ← `Carico Ipotetico (kg)` (intero/decimale, opzionale: riga valida anche se vuoto)
- `targetRestSeconds` ← `Recupero` (intero)

Se `Serie`, `Ripetizioni` o `Recupero` non sono numeri validi, la riga viene segnalata come errore nell'anteprima (bloccando la singola riga, non l'intero import) così l'utente può correggere il CSV o il valore direttamente in anteprima prima di confermare.
**Alternative considerate**: interpretazione "best-effort" di range/testo (approccio scartato nella versione precedente di questo design, quando i CSV sorgente contenevano ancora range) — non più necessaria ora che la sorgente dati è a valori singoli; mantenerla aggiungerebbe complessità senza un caso d'uso reale.

### 3. Match esercizi per nome, fallback a esercizio personalizzato
Per ogni riga, il nome in `Esercizio` viene cercato (case-insensitive, match esatto) nella libreria predefinita e in `customExercises` già esistenti. Se non trovato, viene creato un nuovo esercizio personalizzato con quel nome esatto (stesso meccanismo già usato da `ExerciseAutocomplete` → `createCustomExercise`).
**Alternative considerate**: fuzzy matching — scartato per rischio di falsi positivi (unire per errore esercizi diversi); meglio creare un nuovo esercizio esplicito che l'utente può eventualmente rinominare/unire manualmente in futuro.

### 4. Flusso UI: upload → anteprima editabile → conferma
Nuovo componente in `src/features/routines/` che: (1) accetta un file CSV, (2) lo parsa e mostra un'anteprima nello stesso stile del `RoutineForm` esistente (nome routine proposto dal nome file, elenco esercizi con i valori letti, editabili con gli stessi controlli già presenti nel form, righe non valide evidenziate), (3) alla conferma, riusa `createRoutine` (e `createCustomExercise` per gli esercizi mancanti) per salvare.
**Alternative considerate**: import "diretto" senza anteprima — scartato: anche con un CSV pulito, un refuso nel file originale (es. un "4O" invece di "40") deve poter essere corretto prima del salvataggio definitivo.

### 5. Campo opzionale `targetWeight` su `RoutineExercise`, propagato a `SessionExercise` e usato per precompilare il peso in sessione
`targetWeight?: number` aggiunto a entrambi i tipi. Quando si avvia una sessione da routine, `targetWeight` viene copiato come già avviene per `targetRestSeconds`. In `ActiveSessionPage`, il campo peso di un esercizio viene precompilato con `targetWeight` (se presente) invece di partire vuoto, restando comunque modificabile prima di confermare la serie.
**Alternative considerate**: mostrare `targetWeight` solo come testo informativo non editabile (come inizialmente previsto con un campo note) — la precompilazione diretta del campo peso è più utile: l'utente spesso userà esattamente quel valore e può limitarsi a confermare o correggere al volo.

## Risks / Trade-offs

- **[Rischio]** Creazione di esercizi personalizzati duplicati se lo stesso esercizio compare con nomi leggermente diversi in CSV differenti → **Mitigazione**: accettato per questa versione (match case-insensitive esatto); l'utente può gestire eventuali duplicati manualmente, nessun impatto sui costi (singolo utente, scritture minime).
- **[Rischio]** File CSV con intestazioni diverse da quelle attese, o con celle numeriche non valide → **Mitigazione**: validazione esplicita per colonna/riga con messaggio di errore chiaro in anteprima; nessun salvataggio finché tutte le righe non sono valide o rimosse dall'utente.
