## ADDED Requirements

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
