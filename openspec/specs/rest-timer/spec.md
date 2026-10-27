# rest-timer Specification

## Purpose
TBD - created by archiving change mobile-first-redesign. Update Purpose after archive.

## Requirements
### Requirement: Timer di recupero sempre visibile
Il sistema SHALL mostrare il timer di recupero attivo in una posizione ancorata sopra la tab bar, visibile indipendentemente dallo scorrimento della pagina della sessione, con il nome dell'esercizio a cui si riferisce e l'azione "Salta".

#### Scenario: Scorrimento durante il recupero
- **WHEN** il timer di recupero è attivo e l'utente scorre la sessione fino a un altro esercizio
- **THEN** il timer resta visibile sullo schermo con secondi rimanenti, nome dell'esercizio e azione "Salta"

#### Scenario: Fine del recupero
- **WHEN** il countdown raggiunge zero o l'utente tocca "Salta"
- **THEN** il timer ancorato scompare e il contenuto della pagina torna completamente visibile

### Requirement: Indicatore di progresso del recupero
Il sistema SHALL accompagnare i secondi rimanenti con un indicatore grafico di avanzamento proporzionale al tempo trascorso rispetto al recupero impostato.

#### Scenario: Metà recupero
- **WHEN** è trascorsa metà del tempo di recupero impostato
- **THEN** l'indicatore di progresso risulta completato per circa metà

### Requirement: Countdown visivo del recupero
Il sistema SHALL mostrare un countdown visivo del tempo di recupero tra le serie durante una sessione attiva, usando come durata di default il tempo di recupero configurato per quell'esercizio (dalla routine di partenza, se presente, oppure dal valore impostato dall'utente nella sessione corrente).

#### Scenario: Avvio del timer dopo una serie con target da routine
- **WHEN** l'utente completa una serie di un esercizio che fa parte di una routine con `targetRestSeconds` configurato
- **THEN** il sistema avvia un countdown visivo la cui durata iniziale corrisponde esattamente al `targetRestSeconds` configurato per quell'esercizio nella routine, e ne mostra il tempo residuo in tempo reale

#### Scenario: Avvio del timer dopo una serie senza target da routine
- **WHEN** l'utente completa una serie di un esercizio senza un target di recupero proveniente da una routine (sessione libera, o esercizio aggiunto durante la sessione)
- **THEN** il sistema avvia il countdown usando il tempo di recupero impostato dall'utente per quell'esercizio nella sessione corrente, oppure un default di 90 secondi se non è stato modificato

### Requirement: Notifica sonora a fine countdown

Il sistema SHALL riprodurre un suono di notifica quando il countdown raggiunge lo zero, su qualsiasi dispositivo supportato dal browser.

#### Scenario: Countdown arrivato a zero

- **WHEN** il countdown del recupero raggiunge lo zero
- **THEN** il sistema riproduce un suono di notifica udibile, indipendentemente dal dispositivo (desktop o mobile)

### Requirement: Vibrazione come enhancement progressivo
Il sistema SHALL attivare la vibrazione del dispositivo a fine countdown, con un pattern a impulsi ripetuti per una migliore percepibilità, quando l'API di vibrazione è supportata dal browser/dispositivo, senza che l'assenza di supporto blocchi le altre funzionalità del timer.

#### Scenario: Dispositivo con supporto vibrazione (es. Android)
- **WHEN** il countdown raggiunge lo zero su un dispositivo/browser che espone l'API di vibrazione
- **THEN** il sistema attiva un pattern di vibrazione a impulsi ripetuti (non un singolo impulso), oltre al suono di notifica

#### Scenario: Dispositivo senza supporto vibrazione (es. iOS/Safari)
- **WHEN** il countdown raggiunge lo zero su un dispositivo/browser privo di supporto per l'API di vibrazione
- **THEN** il sistema riproduce comunque il suono di notifica e non genera errori né blocca l'interfaccia per l'assenza di vibrazione

### Requirement: Controllo manuale del timer

Il sistema SHALL permettere all'utente di interrompere o saltare manualmente il countdown di recupero in corso.

#### Scenario: Salto manuale del recupero

- **WHEN** l'utente sceglie di saltare il countdown di recupero in corso
- **THEN** il sistema interrompe immediatamente il countdown senza attendere lo zero e senza riprodurre la notifica di fine countdown
