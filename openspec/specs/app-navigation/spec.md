# app-navigation Specification

## Purpose
Definisce come l'utente si muove tra le sezioni principali dell'app (Routine, Sessione, Storico) con una navigazione mobile-first, sempre raggiungibile con il pollice e adattata anche a schermi desktop.

## Requirements

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

### Requirement: Rispetto delle safe area del dispositivo
Il sistema SHALL posizionare tab bar e header in modo che non siano coperti da notch, home indicator o barre di sistema dei dispositivi mobili.

#### Scenario: iPhone con home indicator
- **WHEN** l'app è aperta su un dispositivo con home indicator in basso
- **THEN** le voci della tab bar sono sopra l'home indicator e completamente toccabili

### Requirement: Header di pagina
Il sistema SHALL mostrare in cima a ogni sezione un header con il titolo della sezione in evidenza e, in alto a destra, l'avatar del profilo come accesso al Profilo. L'header non contiene l'azione di logout.

#### Scenario: Header con titolo e avatar
- **WHEN** l'utente apre una sezione qualsiasi
- **THEN** l'header mostra il titolo della sezione e, a destra, l'avatar del profilo

#### Scenario: Logout dall'header
- **WHEN** l'utente cerca l'azione di logout nell'header di una qualsiasi sezione
- **THEN** non la trova: il logout si esegue dalla pagina Profilo

### Requirement: Indicatore di sessione in corso
Il sistema SHALL segnalare la presenza di una sessione attiva quando l'utente si trova in una sezione diversa da Sessione, permettendo di tornarci con un tocco.

#### Scenario: Sessione attiva, utente nello Storico
- **WHEN** esiste una sessione attiva e l'utente apre lo Storico
- **THEN** la voce Sessione della tab bar mostra un indicatore di attività e toccandola si torna alla sessione in corso

#### Scenario: Nessuna sessione attiva
- **WHEN** non esiste alcuna sessione attiva
- **THEN** la voce Sessione non mostra l'indicatore di attività

### Requirement: Layout su schermi larghi
Il sistema SHALL mantenere, su schermi desktop, il contenuto e la tab bar all'interno di una colonna centrata di larghezza limitata, senza allungare elementi a tutta larghezza dello schermo.

#### Scenario: Finestra desktop larga
- **WHEN** l'utente apre l'app in una finestra larga 1440px
- **THEN** contenuto e tab bar occupano una colonna centrata e lo spazio laterale mostra solo lo sfondo

### Requirement: Avatar del profilo sempre visibile
Il sistema SHALL mostrare l'avatar del profilo nell'header di ogni vista autenticata, comprese la sessione attiva e le pagine di dettaglio o modulo, tranne la pagina Profilo, dove l'avatar è già mostrato nel contenuto. Toccando l'avatar l'utente SHALL aprire la sezione Profilo. L'area toccabile SHALL misurare almeno 44px anche se il badge è più piccolo.

#### Scenario: Avatar presente in ogni sezione
- **WHEN** l'utente apre Routine, Sessione, Storico o il dettaglio di una sessione conclusa
- **THEN** vede il proprio avatar nell'header

#### Scenario: Accesso al Profilo dall'avatar
- **WHEN** l'utente tocca l'avatar nell'header
- **THEN** si apre la sezione Profilo e la voce Profilo della tab bar risulta evidenziata

#### Scenario: Avatar visibile durante lo scorrimento
- **WHEN** l'utente scorre una lista lunga
- **THEN** l'header con l'avatar resta ancorato in alto e l'avatar resta visibile

#### Scenario: Nessuna scelta salvata
- **WHEN** l'utente non ha mai scelto un avatar
- **THEN** l'header mostra l'avatar predefinito

#### Scenario: Pagina Profilo
- **WHEN** l'utente si trova nella sezione Profilo
- **THEN** l'header non mostra l'avatar, che resta visibile in grande nel contenuto della pagina

#### Scenario: Cambio avatar
- **WHEN** l'utente salva un nuovo avatar dal Profilo e poi apre un'altra sezione
- **THEN** l'header mostra subito il nuovo avatar, senza ricaricare l'app

#### Scenario: Profilo non caricabile
- **WHEN** la lettura del profilo non riesce
- **THEN** l'header mostra comunque l'avatar predefinito e l'app resta utilizzabile

### Requirement: Header della sessione attiva
Il sistema SHALL mantenere nell'header della sessione attiva il contatore XP e il pulsante "Termina" accanto all'avatar, troncando il titolo se lo spazio non basta, su schermi larghi fino a 320px.

#### Scenario: Sessione su schermo stretto
- **WHEN** l'utente è in una sessione attiva su uno schermo largo 320px
- **THEN** l'header mostra contatore XP, pulsante "Termina" e avatar senza uscire dallo schermo e senza scroll orizzontale, e il titolo è troncato con i puntini

### Requirement: Logout dal Profilo
Il sistema SHALL offrire l'azione "Esci" nella pagina Profilo, con area toccabile di almeno 44px, e non in altre sezioni.

#### Scenario: Logout dal Profilo
- **WHEN** l'utente tocca "Esci" nella pagina Profilo
- **THEN** viene disconnesso e riportato alla schermata di accesso

#### Scenario: Logout raggiungibile
- **WHEN** l'utente si trova in una qualsiasi sezione
- **THEN** può raggiungere il logout con due tocchi: avatar (o voce Profilo) e poi "Esci"
