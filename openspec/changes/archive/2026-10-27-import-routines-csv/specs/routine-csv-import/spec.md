## ADDED Requirements

### Requirement: Caricamento di un file CSV
Il sistema SHALL permettere di caricare un file CSV con colonne `Esercizio, Serie, Ripetizioni, Carico Ipotetico (kg), Recupero` dalla pagina di gestione routine.

#### Scenario: Caricamento di un CSV valido
- **WHEN** l'utente seleziona un file CSV con le colonne attese e valori numerici validi
- **THEN** il sistema esegue il parsing del file e mostra un'anteprima della routine risultante, senza ancora salvare nulla

#### Scenario: Caricamento di un file con colonne mancanti o non riconosciute
- **WHEN** l'utente seleziona un file che non contiene le colonne attese
- **THEN** il sistema mostra un messaggio di errore chiaro e non genera alcuna anteprima né scrittura

### Requirement: Interpretazione diretta dei valori numerici per riga
Il sistema SHALL mappare direttamente ogni riga del CSV sui campi `targetSets` (da Serie), `targetReps` (da Ripetizioni), `targetWeight` (da Carico Ipotetico, opzionale) e `targetRestSeconds` (da Recupero) dell'esercizio, e SHALL segnalare come non valida qualunque riga in cui Serie, Ripetizioni o Recupero non siano numeri interi validi.

#### Scenario: Riga con valori numerici validi
- **WHEN** una riga ha `Serie=4`, `Ripetizioni=8`, `Carico Ipotetico=40`, `Recupero=120`
- **THEN** il sistema propone `targetSets=4`, `targetReps=8`, `targetWeight=40`, `targetRestSeconds=120` per quell'esercizio

#### Scenario: Riga con un valore non numerico in un campo obbligatorio
- **WHEN** una riga ha un valore non numerico in `Serie`, `Ripetizioni` o `Recupero`
- **THEN** il sistema segnala quella riga come non valida nell'anteprima, senza bloccare l'elaborazione delle altre righe

#### Scenario: Carico Ipotetico assente
- **WHEN** una riga non ha un valore in `Carico Ipotetico (kg)`
- **THEN** il sistema propone l'esercizio senza `targetWeight` impostato, senza considerare la riga non valida

### Requirement: Anteprima editabile prima del salvataggio
Il sistema SHALL mostrare un'anteprima della routine risultante dal CSV, con nome routine proposto ed elenco esercizi con i valori letti, permettendo di correggerli (o rimuovere righe non valide) prima di confermare il salvataggio.

#### Scenario: Correzione di un valore o di una riga non valida
- **WHEN** l'utente modifica un valore numerico, il nome della routine, o corregge una riga segnalata come non valida nell'anteprima prima di confermare
- **THEN** il sistema usa i valori corretti dall'utente al momento del salvataggio, non quelli originariamente letti dal CSV

#### Scenario: Conferma del salvataggio
- **WHEN** l'utente conferma l'anteprima e tutte le righe risultano valide
- **THEN** il sistema crea una nuova routine in `users/{uid}/routines` con gli esercizi e i target mostrati nell'anteprima

### Requirement: Creazione automatica di esercizi personalizzati mancanti
Il sistema SHALL creare automaticamente un esercizio personalizzato per ogni nome esercizio del CSV che non corrisponde (case-insensitive, confronto esatto) a nessun esercizio già presente nella libreria predefinita o tra gli esercizi personalizzati dell'utente.

#### Scenario: Esercizio del CSV non presente in libreria
- **WHEN** il CSV contiene un esercizio il cui nome non corrisponde a nessun esercizio esistente
- **THEN** il sistema crea un nuovo esercizio personalizzato con quel nome in `users/{uid}/customExercises`, riutilizzabile anche in futuro dall'autocomplete

#### Scenario: Esercizio del CSV già esistente
- **WHEN** il CSV contiene un esercizio il cui nome corrisponde (case-insensitive) a un esercizio già esistente (predefinito o personalizzato)
- **THEN** il sistema riusa l'esercizio esistente senza crearne uno duplicato
