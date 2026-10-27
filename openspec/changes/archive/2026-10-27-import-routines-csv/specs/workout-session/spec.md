## ADDED Requirements

### Requirement: Precompilazione del peso dal carico target
Il sistema SHALL precompilare il campo peso di una serie con il `targetWeight` configurato per l'esercizio (dalla routine di partenza), quando presente, lasciandolo comunque modificabile dall'utente prima di confermare la serie.

#### Scenario: Esercizio con carico target da routine
- **WHEN** l'utente inizia a loggare una serie per un esercizio che ha un `targetWeight` proveniente dalla routine di partenza
- **THEN** il sistema mostra il campo peso già precompilato con quel valore, modificabile prima di confermare

#### Scenario: Esercizio senza carico target
- **WHEN** l'esercizio della sessione attiva non ha alcun `targetWeight` associato
- **THEN** il sistema mostra il campo peso vuoto, senza alterare il resto dell'interfaccia
