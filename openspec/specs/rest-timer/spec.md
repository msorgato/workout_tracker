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

### Requirement: Notifica di sistema a fine recupero
Il sistema SHALL mostrare una notifica di sistema "Recupero finito", con il nome dell'esercizio e la vibrazione del dispositivo, quando il countdown di recupero raggiunge lo zero mentre l'app non è in primo piano, se l'utente ha attivato le notifiche e il permesso è stato concesso. Toccando la notifica l'app SHALL aprirsi sulla sessione in corso.

#### Scenario: Recupero finito con l'app in secondo piano
- **WHEN** l'utente completa una serie con recupero di 90 secondi, passa a un'altra app e il countdown arriva a zero mentre il browser mantiene attiva l'app
- **THEN** compare la notifica "Recupero finito" con il nome dell'esercizio e il telefono vibra

#### Scenario: Tocco sulla notifica
- **WHEN** l'utente tocca la notifica
- **THEN** l'app si apre (o torna in primo piano) sulla sessione in corso

#### Scenario: App in primo piano
- **WHEN** il countdown arriva a zero con l'app aperta in primo piano
- **THEN** non compare alcuna notifica di sistema e restano il suono e la vibrazione già previsti

#### Scenario: Recupero saltato
- **WHEN** l'utente tocca "Salta" prima che il countdown finisca
- **THEN** non viene mostrata alcuna notifica per quel recupero

#### Scenario: Sessione terminata prima della scadenza
- **WHEN** l'utente termina la sessione mentre un recupero è in corso
- **THEN** non viene mostrata alcuna notifica

#### Scenario: Cambio di sezione dell'app
- **WHEN** l'utente completa una serie, apre il Profilo e poi mette l'app in secondo piano prima della scadenza
- **THEN** la notifica compare comunque alla scadenza del recupero

#### Scenario: Una sola notifica per recupero
- **WHEN** il recupero scade e più meccanismi rilevano la scadenza
- **THEN** l'utente vede una sola notifica, che sostituisce l'eventuale precedente "Recupero finito"

#### Scenario: Pagina sospesa dal sistema
- **WHEN** il sistema sospende l'app per tutta la durata del recupero e l'utente la riapre dopo la scadenza, trovandosi sulla pagina Sessione
- **THEN** alla riapertura l'utente riceve suono e vibrazione come oggi, e non compare una notifica di sistema in ritardo

### Requirement: Attivazione delle notifiche di fine recupero
Il sistema SHALL offrire nella pagina Profilo un interruttore "Notifiche di fine recupero", spento di default, la cui attivazione richiede il permesso di notifica del browser. La scelta SHALL valere per il dispositivo e restare dopo la chiusura dell'app. L'interruttore SHALL NOT essere mostrato se il browser non supporta le notifiche tramite service worker.

#### Scenario: Prima attivazione
- **WHEN** l'utente accende l'interruttore e il permesso non è ancora stato deciso
- **THEN** compare la richiesta di permesso del browser e, se l'utente accetta, l'interruttore resta acceso

#### Scenario: Permesso negato alla richiesta
- **WHEN** l'utente rifiuta la richiesta di permesso
- **THEN** l'interruttore torna spento e un messaggio spiega che le notifiche non sono state autorizzate

#### Scenario: Permesso già bloccato nelle impostazioni
- **WHEN** il permesso di notifica per l'app è bloccato nelle impostazioni del browser e l'utente tocca l'interruttore
- **THEN** l'interruttore resta spento e un messaggio spiega che va riattivato dalle impostazioni del sito

#### Scenario: Disattivazione
- **WHEN** l'utente spegne l'interruttore
- **THEN** da quel momento nessun recupero genera notifiche di sistema

#### Scenario: Preferenza conservata
- **WHEN** l'utente attiva le notifiche, chiude l'app e la riapre
- **THEN** l'interruttore risulta ancora acceso

#### Scenario: Permesso revocato dopo l'attivazione
- **WHEN** l'utente ha attivato l'interruttore ma poi ha revocato il permesso dalle impostazioni del browser
- **THEN** l'interruttore risulta spento alla riapertura del Profilo e nessuna notifica viene mostrata

#### Scenario: Browser senza supporto
- **WHEN** l'utente apre il Profilo in un browser che non supporta le notifiche tramite service worker
- **THEN** l'interruttore non è mostrato e il resto della pagina è invariato
