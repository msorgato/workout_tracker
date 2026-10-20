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

### Requirement: Promemoria postura nella card esercizio
Il sistema SHALL mostrare, nella card di ogni esercizio della sessione attiva, il primo consiglio della categoria Postura (se esiste) in forma compatta, visibile senza ulteriori interazioni.

#### Scenario: Esercizio con tip di postura
- **WHEN** l'utente apre la sessione con un esercizio che ha tips di Postura
- **THEN** la card mostra il primo tip di Postura sotto il nome dell'esercizio

#### Scenario: Esercizio senza tip di postura
- **WHEN** l'esercizio non ha tips di Postura
- **THEN** la card non mostra alcun promemoria compatto

### Requirement: Pannello tips nella card esercizio
Il sistema SHALL offrire, nella card di ogni esercizio della sessione attiva, un controllo "Tips" che apre e chiude un pannello con tutti i tips dell'esercizio, senza interrompere la registrazione delle serie né il timer di recupero.

#### Scenario: Apertura del pannello
- **WHEN** l'utente tocca "Tips" nella card di un esercizio
- **THEN** il pannello si apre nella card mostrando i tips per categoria e i valori già inseriti per peso e ripetizioni restano invariati

#### Scenario: Indicazione di tips disponibili
- **WHEN** un esercizio ha almeno un tip
- **THEN** il controllo "Tips" mostra il numero di tips disponibili

#### Scenario: Durante il recupero
- **WHEN** il timer di recupero è attivo e l'utente apre il pannello tips
- **THEN** il timer continua a funzionare e resta visibile

#### Scenario: Aggiunta dalla sessione
- **WHEN** l'utente apre il pannello di un esercizio senza tips e aggiunge un tip personale
- **THEN** il tip viene salvato e compare nel pannello della card
