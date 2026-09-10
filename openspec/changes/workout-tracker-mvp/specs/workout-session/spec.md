## ADDED Requirements

### Requirement: Avvio di una sessione senza routine

Il sistema SHALL permettere di avviare una sessione di allenamento libera, senza partire da una routine, aggiungendo esercizi manualmente durante la sessione.

#### Scenario: Avvio sessione libera

- **WHEN** l'utente avvia una nuova sessione senza selezionare una routine
- **THEN** il sistema crea una sessione con `startedAt` valorizzato, `routineId`/`routineName` assenti e un elenco esercizi vuoto, modificabile durante la sessione

### Requirement: Persistenza incrementale delle serie completate

Il sistema SHALL scrivere immediatamente su Firestore ogni serie completata durante la sessione attiva, senza attendere la chiusura della sessione.

#### Scenario: Completamento di una serie

- **WHEN** l'utente registra il completamento di una serie (peso, ripetizioni) per un esercizio della sessione attiva
- **THEN** il sistema aggiorna immediatamente il documento della sessione su Firestore con la nuova serie (setNumber, weight, reps, restSeconds, completedAt)

#### Scenario: Chiusura anticipata dell'app durante una sessione

- **WHEN** l'app viene chiusa o ricaricata dopo che una o più serie sono state completate ma prima della chiusura della sessione
- **THEN** le serie già completate risultano presenti nel documento sessione su Firestore e non vengono perse

### Requirement: Aggiunta di esercizi durante la sessione attiva

Il sistema SHALL permettere di aggiungere esercizi (dalla libreria o custom) alla sessione attiva anche se non presenti nella routine di partenza.

#### Scenario: Aggiunta di un esercizio non pianificato

- **WHEN** l'utente aggiunge un esercizio alla sessione attiva che non era previsto dalla routine di partenza (o la sessione è libera)
- **THEN** il sistema include il nuovo esercizio nell'elenco `exercises` della sessione con il proprio ordine e permette di loggarne le serie

### Requirement: Chiusura della sessione

Il sistema SHALL permettere di terminare una sessione attiva, marcandola come conclusa.

#### Scenario: Terminazione della sessione

- **WHEN** l'utente termina la sessione attiva
- **THEN** il sistema aggiorna il documento sessione impostando `endedAt` e la sessione non è più modificabile come "attiva"

#### Scenario: Note opzionali alla chiusura

- **WHEN** l'utente aggiunge una nota testuale alla sessione prima o durante la chiusura
- **THEN** il sistema salva il testo nel campo `notes` del documento sessione
