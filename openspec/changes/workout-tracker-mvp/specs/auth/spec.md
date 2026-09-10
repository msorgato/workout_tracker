## ADDED Requirements

### Requirement: Login tramite Google

Il sistema SHALL permettere l'accesso all'app esclusivamente tramite account Google (Firebase Authentication). Nessun altro provider di autenticazione SHALL essere disponibile.

#### Scenario: Utente non autenticato apre l'app

- **WHEN** un utente non autenticato apre l'app
- **THEN** il sistema mostra una schermata di login con un pulsante "Accedi con Google" e nessun altro contenuto dell'app

#### Scenario: Login con successo

- **WHEN** l'utente completa il flusso di autenticazione Google con successo
- **THEN** il sistema porta l'utente alla home dell'app e rende disponibili le sue funzionalità

#### Scenario: Login annullato o fallito

- **WHEN** il flusso di autenticazione Google viene annullato o fallisce
- **THEN** il sistema rimane sulla schermata di login e non concede accesso ai dati dell'app

### Requirement: Protezione delle rotte autenticate

Il sistema SHALL impedire l'accesso a qualsiasi vista o dato dell'app (routine, sessioni, storico, libreria esercizi) a utenti non autenticati.

#### Scenario: Accesso diretto a una rotta protetta senza sessione attiva

- **WHEN** un utente non autenticato tenta di raggiungere una vista dell'app diversa dal login (es. tramite URL diretto)
- **THEN** il sistema reindirizza alla schermata di login

### Requirement: Logout

Il sistema SHALL permettere all'utente autenticato di terminare la propria sessione.

#### Scenario: Utente effettua il logout

- **WHEN** l'utente autenticato sceglie di disconnettersi
- **THEN** il sistema termina la sessione Firebase Auth e riporta l'utente alla schermata di login
