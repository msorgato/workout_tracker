# app-navigation Specification

## Purpose
Definisce come l'utente si muove tra le sezioni principali dell'app (Routine, Sessione, Storico) con una navigazione mobile-first, sempre raggiungibile con il pollice e adattata anche a schermi desktop.

## Requirements
### Requirement: Tab bar inferiore con icone
Il sistema SHALL mostrare, in tutte le viste autenticate, una barra di navigazione fissa in fondo allo schermo con tre voci (Routine, Sessione, Storico), ciascuna composta da icona ed etichetta, con la voce attiva evidenziata nel colore di accento.

#### Scenario: Navigazione da mobile
- **WHEN** l'utente autenticato apre l'app su uno schermo largo 375px
- **THEN** vede la tab bar ancorata al bordo inferiore con le tre voci, e toccando una voce si apre la sezione corrispondente

#### Scenario: Voce attiva
- **WHEN** l'utente si trova nella sezione Storico
- **THEN** la voce Storico nella tab bar è evidenziata con il colore di accento e le altre voci sono in colore attenuato

#### Scenario: Il contenuto non viene coperto
- **WHEN** l'utente scorre fino in fondo a una lista lunga
- **THEN** l'ultimo elemento resta interamente visibile sopra la tab bar

### Requirement: Rispetto delle safe area del dispositivo
Il sistema SHALL posizionare tab bar e header in modo che non siano coperti da notch, home indicator o barre di sistema dei dispositivi mobili.

#### Scenario: iPhone con home indicator
- **WHEN** l'app è aperta su un dispositivo con home indicator in basso
- **THEN** le voci della tab bar sono sopra l'home indicator e completamente toccabili

### Requirement: Header di pagina
Il sistema SHALL mostrare in cima a ogni sezione un header con il titolo della sezione in evidenza e l'accesso all'azione di logout.

#### Scenario: Logout dall'header
- **WHEN** l'utente tocca l'azione di logout nell'header
- **THEN** viene disconnesso e riportato alla schermata di accesso

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
