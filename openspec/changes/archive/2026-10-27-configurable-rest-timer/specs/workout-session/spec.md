## ADDED Requirements

### Requirement: Modifica del tempo di recupero per esercizio nella sessione attiva
Il sistema SHALL permettere di impostare o modificare il tempo di recupero associato a ciascun esercizio della sessione attiva, indipendentemente dal fatto che provenga da una routine.

#### Scenario: Modifica del tempo di recupero durante la sessione
- **WHEN** l'utente modifica il valore del tempo di recupero mostrato per un esercizio della sessione attiva
- **THEN** il sistema usa il nuovo valore come durata del countdown per il completamento della prossima serie di quell'esercizio, e lo persiste sul documento sessione

#### Scenario: Esercizio senza target di recupero da routine
- **WHEN** l'utente aggiunge un esercizio alla sessione attiva senza un target di recupero proveniente da una routine (sessione libera, o esercizio non pianificato)
- **THEN** il sistema propone un tempo di recupero di default di 90 secondi per quell'esercizio, modificabile dall'utente prima del completamento della prima serie
