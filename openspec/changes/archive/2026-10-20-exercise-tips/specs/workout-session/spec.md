## ADDED Requirements

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
