# workout-session Specification

## Purpose
TBD - created by archiving change mobile-first-redesign. Update Purpose after archive.

## Requirements
### Requirement: Stepper per peso e ripetizioni
Il sistema SHALL offrire, per ogni esercizio della sessione attiva, controlli di incremento/decremento per peso e ripetizioni affiancati al valore modificabile. Il peso SHALL variare a passi di 2,5 kg e le ripetizioni di 1, senza mai scendere sotto zero.

#### Scenario: Incremento del peso
- **WHEN** il peso mostrato è 40 kg e l'utente tocca "+"
- **THEN** il peso diventa 42,5 kg

#### Scenario: Limite inferiore
- **WHEN** le ripetizioni sono 0 e l'utente tocca "−"
- **THEN** le ripetizioni restano 0

#### Scenario: Inserimento diretto
- **WHEN** l'utente tocca il valore del peso e digita 57,5
- **THEN** il peso registrato alla serie successiva è 57,5 kg

### Requirement: Azione di completamento serie prominente
Il sistema SHALL mostrare l'azione "Serie completata" come pulsante a tutta larghezza della card esercizio, con il numero della serie che si sta per registrare.

#### Scenario: Seconda serie
- **WHEN** l'esercizio ha già una serie registrata
- **THEN** il pulsante riporta l'indicazione della serie 2 e occupa l'intera larghezza della card

### Requirement: Serie registrate leggibili
Il sistema SHALL elencare le serie già completate di ciascun esercizio come righe distinte con numero di serie, peso e ripetizioni ben separati e leggibili a colpo d'occhio.

#### Scenario: Esercizio con tre serie
- **WHEN** un esercizio ha tre serie registrate
- **THEN** sono mostrate tre righe ordinate, ognuna con numero serie, peso in kg e ripetizioni, e l'ultima serie registrata è evidenziata

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

### Requirement: Serie target ereditate dalla routine
Il sistema SHALL copiare nella sessione, per ogni esercizio di una sessione avviata da routine, il numero di serie previste dalla routine; gli esercizi senza serie previste (sessione libera, esercizi aggiunti in corso, sessioni già in corso senza questo dato) SHALL restare senza limite.

#### Scenario: Avvio da routine
- **WHEN** l'utente avvia una sessione da una routine in cui "Panca piana" prevede 4 serie
- **THEN** l'esercizio nella sessione ha 4 serie previste

#### Scenario: Sessione libera
- **WHEN** l'utente avvia una sessione libera e aggiunge un esercizio
- **THEN** l'esercizio non ha serie previste e non mostra alcun limite

#### Scenario: Sessione già in corso senza serie previste
- **WHEN** l'utente riapre una sessione creata prima dell'introduzione delle serie previste
- **THEN** gli esercizi funzionano come prima, senza limite e senza indicatore di avanzamento

### Requirement: Indicatore di avanzamento delle serie
Il sistema SHALL mostrare nella card di un esercizio con serie previste il numero di serie completate rispetto a quelle previste.

#### Scenario: Seconda serie di quattro
- **WHEN** l'esercizio prevede 4 serie e ne ha una completata
- **THEN** la card mostra l'avanzamento 1/4 e il pulsante "Serie 2 completata"

### Requirement: Esercizio completato al raggiungimento delle serie previste
Il sistema SHALL considerare completato un esercizio quando il numero di serie registrate raggiunge quello previsto, mostrando lo stato "Completato" e nascondendo il pulsante principale di completamento serie.

#### Scenario: Ultima serie registrata
- **WHEN** l'utente registra la quarta serie di un esercizio che ne prevede 4
- **THEN** la card mostra "Completato 4/4" e non offre più il pulsante "Serie 5 completata"

#### Scenario: Completamento dopo ricaricamento
- **WHEN** l'utente ricarica l'app durante una sessione in cui un esercizio ha già tutte le serie previste
- **THEN** l'esercizio risulta ancora completato

### Requirement: Serie extra volontarie
Il sistema SHALL consentire di registrare serie oltre quelle previste solo dopo che l'utente ha scelto esplicitamente "Aggiungi serie extra", e SHALL indicare le serie oltre il target come extra.

#### Scenario: Aggiunta di una serie extra
- **WHEN** l'esercizio è completato e l'utente tocca "Aggiungi serie extra"
- **THEN** compare di nuovo il pulsante di completamento serie e, dopo averlo usato, la card mostra 5/4 con la serie indicata come extra

#### Scenario: Nessuna serie involontaria
- **WHEN** l'esercizio è completato e l'utente non tocca "Aggiungi serie extra"
- **THEN** non è possibile registrare altre serie su quell'esercizio

### Requirement: Valori di peso e ripetizioni sempre leggibili
Il sistema SHALL mostrare il valore di peso e di ripetizioni per intero, comprese le cifre decimali (es. "142,5" o "42.5"), senza troncarlo, con una larghezza di schermo a partire da 320px.

#### Scenario: Peso con decimali su schermo stretto
- **WHEN** il peso è 142.5 kg su uno schermo largo 320px
- **THEN** il campo peso mostra tutte le cifre, incluso il decimale

#### Scenario: Incremento di 2,5 kg
- **WHEN** il peso mostrato è 40 e l'utente tocca "+"
- **THEN** il campo mostra 42.5 per intero, non "42."
