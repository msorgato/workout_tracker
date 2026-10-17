# workout-session Specification

## Purpose
TBD - created by archiving change mobile-first-redesign. Update Purpose after archive.

## Requirements
### Requirement: Stepper per peso e ripetizioni
Il sistema SHALL offrire, per ogni esercizio della sessione attiva, controlli di incremento/decremento per peso e ripetizioni affiancati al valore modificabile. Il peso SHALL variare a passi di 2,5 kg e le ripetizioni di 1, senza mai scendere sotto zero.

#### Scenario: Incremento del peso
- **WHEN** il peso mostrato è 40 kg e l'utente tocca "+"
- **THEN** il peso diventa 42,5 kg

#### Scenario: Limite inferiore
- **WHEN** le ripetizioni sono 0 e l'utente tocca "−"
- **THEN** le ripetizioni restano 0

#### Scenario: Inserimento diretto
- **WHEN** l'utente tocca il valore del peso e digita 57,5
- **THEN** il peso registrato alla serie successiva è 57,5 kg

### Requirement: Azione di completamento serie prominente
Il sistema SHALL mostrare l'azione "Serie completata" come pulsante a tutta larghezza della card esercizio, con il numero della serie che si sta per registrare.

#### Scenario: Seconda serie
- **WHEN** l'esercizio ha già una serie registrata
- **THEN** il pulsante riporta l'indicazione della serie 2 e occupa l'intera larghezza della card

### Requirement: Serie registrate leggibili
Il sistema SHALL elencare le serie già completate di ciascun esercizio come righe distinte con numero di serie, peso e ripetizioni ben separati e leggibili a colpo d'occhio.

#### Scenario: Esercizio con tre serie
- **WHEN** un esercizio ha tre serie registrate
- **THEN** sono mostrate tre righe ordinate, ognuna con numero serie, peso in kg e ripetizioni, e l'ultima serie registrata è evidenziata
