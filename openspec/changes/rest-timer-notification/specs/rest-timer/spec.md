## ADDED Requirements

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
