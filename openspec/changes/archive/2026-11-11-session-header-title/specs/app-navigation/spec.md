## MODIFIED Requirements

### Requirement: Header di pagina
Il sistema SHALL mostrare in cima a ogni sezione un header con il titolo della sezione in evidenza e, in alto a destra, l'avatar del profilo come accesso al Profilo. L'header non contiene l'azione di logout. Un titolo che non sta su una riga SHALL andare a capo fino a un massimo di due righe, oltre le quali viene troncato con i puntini.

#### Scenario: Header con titolo e avatar
- **WHEN** l'utente apre una sezione qualsiasi
- **THEN** l'header mostra il titolo della sezione e, a destra, l'avatar del profilo

#### Scenario: Logout dall'header
- **WHEN** l'utente cerca l'azione di logout nell'header di una qualsiasi sezione
- **THEN** non la trova: il logout si esegue dalla pagina Profilo

#### Scenario: Titolo lungo
- **WHEN** il titolo di una pagina è più largo dello spazio disponibile accanto all'avatar
- **THEN** il titolo va a capo su una seconda riga senza sovrapporsi all'avatar, e solo oltre le due righe viene troncato con i puntini

### Requirement: Header della sessione attiva
Il sistema SHALL mostrare nell'header della sessione attiva il titolo della sessione (il nome della routine oppure "Sessione libera") e l'avatar sulla prima riga, e il contatore XP e il pulsante "Termina" su una seconda riga, così che il titolo non condivida la riga con le azioni. Il titolo SHALL essere leggibile per intero, per i nomi comuni, su schermi larghi fino a 320px.

#### Scenario: Sessione su schermo stretto
- **WHEN** l'utente è in una sessione libera su uno schermo largo 320px
- **THEN** il titolo "Sessione libera" è mostrato per intero, senza puntini, e l'avatar è alla sua destra, con contatore XP e "Termina" sulla riga sotto senza uscire dallo schermo

#### Scenario: Sessione da routine
- **WHEN** l'utente è in una sessione avviata da una routine con un nome lungo
- **THEN** il nome va a capo su al massimo due righe senza sovrapporsi all'avatar

#### Scenario: Azioni sulla seconda riga
- **WHEN** l'utente è in una sessione attiva
- **THEN** il contatore XP è a sinistra e il pulsante "Termina" a destra della riga sotto il titolo, entrambi con area toccabile di almeno 44px e senza scroll orizzontale a 320px

#### Scenario: Header che resta in vista
- **WHEN** l'utente scorre gli esercizi della sessione
- **THEN** l'header con titolo, avatar, contatore XP e "Termina" resta ancorato in alto
