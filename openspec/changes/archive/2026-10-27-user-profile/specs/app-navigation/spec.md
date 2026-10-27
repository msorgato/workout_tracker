## MODIFIED Requirements

### Requirement: Tab bar inferiore con icone
Il sistema SHALL mostrare, in tutte le viste autenticate, una barra di navigazione fissa in fondo allo schermo con quattro voci (Routine, Sessione, Storico, Profilo), ciascuna composta da icona ed etichetta, con la voce attiva evidenziata nel colore di accento.

#### Scenario: Navigazione da mobile
- **WHEN** l'utente autenticato apre l'app su uno schermo largo 375px
- **THEN** vede la tab bar ancorata al bordo inferiore con le quattro voci, e toccando una voce si apre la sezione corrispondente

#### Scenario: Voce attiva
- **WHEN** l'utente si trova nella sezione Storico
- **THEN** la voce Storico nella tab bar è evidenziata con il colore di accento e le altre voci sono in colore attenuato

#### Scenario: Il contenuto non viene coperto
- **WHEN** l'utente scorre fino in fondo a una lista lunga
- **THEN** l'ultimo elemento resta interamente visibile sopra la tab bar

#### Scenario: Accesso al profilo
- **WHEN** l'utente tocca la voce Profilo
- **THEN** si apre la sezione Profilo e la voce risulta evidenziata
