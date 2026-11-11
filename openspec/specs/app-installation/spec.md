# app-installation Specification

## Purpose
Permette di installare l'app sulla schermata Home di un telefono Android e di aprirla a tutto schermo come un'app nativa, mantenendo il funzionamento online.

## Requirements

### Requirement: App installabile
Il sistema SHALL essere riconosciuto da Chrome per Android come app installabile, con nome "Workout Tracker", nome breve "Workout", icona del manubrio verde su fondo nero e colori del tema coerenti con l'app (sfondo e barra di stato neri).

#### Scenario: Installazione da Chrome
- **WHEN** l'utente apre l'app pubblicata in Chrome per Android e sceglie "Installa app" dal menu del browser
- **THEN** l'app viene aggiunta alla schermata Home con nome "Workout" e l'icona del manubrio verde

#### Scenario: Icona adattiva
- **WHEN** il launcher di Android ritaglia le icone con una forma propria (cerchio, squircle)
- **THEN** il manubrio resta interamente visibile dentro la forma, senza bordi bianchi né parti tagliate

### Requirement: Apertura a tutto schermo
Il sistema SHALL aprirsi, quando avviato dall'icona installata, senza la barra degli indirizzi del browser, in orientamento verticale, partendo dalla pagina principale dell'app.

#### Scenario: Avvio dall'icona
- **WHEN** l'utente tocca l'icona dell'app installata
- **THEN** l'app si apre a tutto schermo, senza barra degli indirizzi, con sfondo nero durante il caricamento, e mostra la sezione Routine (o la schermata di accesso se l'utente non è autenticato)

#### Scenario: Contenuti non coperti dalla barra di stato
- **WHEN** l'app installata è aperta su un telefono con notch o barra di stato
- **THEN** l'header e la tab bar restano interamente visibili e toccabili

### Requirement: Invito all'installazione dal Profilo
Il sistema SHALL mostrare nella pagina Profilo un pulsante "Installa app" solo quando il browser consente l'installazione e l'app non è già aperta come app installata. Toccandolo SHALL aprirsi la richiesta di installazione del browser.

#### Scenario: Installazione disponibile
- **WHEN** l'utente apre il Profilo in Chrome per Android e l'app non è installata
- **THEN** vede il pulsante "Installa app" e, toccandolo, compare la richiesta di installazione del browser

#### Scenario: Installazione rifiutata
- **WHEN** l'utente annulla la richiesta di installazione
- **THEN** l'app resta utilizzabile normalmente e nessun errore viene mostrato

#### Scenario: App già installata
- **WHEN** l'utente apre il Profilo dall'app installata, oppure ha appena completato l'installazione
- **THEN** il pulsante "Installa app" non è mostrato

#### Scenario: Browser senza installazione
- **WHEN** l'utente apre il Profilo in un browser che non offre l'installazione (per esempio desktop senza supporto o Safari)
- **THEN** il pulsante "Installa app" non è mostrato e la pagina resta invariata

### Requirement: Accesso dall'app installata
Il sistema SHALL consentire l'accesso con Google anche quando l'app è avviata dall'icona installata, e mantenere la sessione di accesso tra un'apertura e l'altra.

#### Scenario: Primo accesso nell'app installata
- **WHEN** l'utente non autenticato apre l'app installata e tocca il pulsante di accesso con Google
- **THEN** completa l'accesso e torna nell'app installata, autenticato, senza restare bloccato in una scheda del browser

#### Scenario: Riapertura
- **WHEN** l'utente autenticato chiude l'app installata e la riapre dall'icona
- **THEN** è ancora autenticato e vede le sue routine

### Requirement: Solo online
Il sistema SHALL continuare a funzionare solo con connessione di rete anche quando è installato: l'installazione non introduce cache dei file dell'app né dati offline, e i nuovi rilasci sono visibili alla successiva apertura senza passaggi aggiuntivi.

#### Scenario: Nuovo rilascio
- **WHEN** viene pubblicata una nuova versione dell'app e l'utente riapre l'app installata con la rete attiva
- **THEN** vede subito la nuova versione, senza dover reinstallare o svuotare la cache
