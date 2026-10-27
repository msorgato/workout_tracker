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

### Requirement: Feedback XP alla serie completata
Il sistema SHALL mostrare, subito dopo la registrazione di una serie, un indicatore "+10 XP" animato (breve, che si dissolve) e un'evidenziazione momentanea della riga della serie appena aggiunta.

#### Scenario: Serie registrata
- **WHEN** l'utente completa una serie
- **THEN** compare "+10 XP" vicino al pulsante di completamento e la nuova riga della serie viene evidenziata per un istante

#### Scenario: Movimento ridotto
- **WHEN** l'utente ha attivato la preferenza "riduci movimento"
- **THEN** nessuna animazione di spostamento o scala viene eseguita e l'indicazione XP resta comunque leggibile per un istante

### Requirement: Feedback all'esercizio completato
Il sistema SHALL segnalare con un'animazione di conferma e un indicatore "+25 XP" il momento in cui un esercizio raggiunge le serie previste.

#### Scenario: Ultima serie prevista
- **WHEN** l'utente registra la quarta serie di un esercizio che ne prevede 4
- **THEN** il badge "Completato 4/4" appare con un'animazione di conferma e compare "+25 XP"

#### Scenario: Esercizio senza serie previste
- **WHEN** l'utente registra serie su un esercizio senza serie previste
- **THEN** non compare alcuna animazione di completamento né "+25 XP"

### Requirement: XP della sessione sempre visibili
Il sistema SHALL mostrare nella testata della sessione attiva il totale degli XP guadagnati nella sessione corrente, aggiornato a ogni serie ed esercizio completato (il bonus di sessione non è incluso finché la sessione è attiva).

#### Scenario: Aggiornamento del totale
- **WHEN** l'utente registra due serie e completa un esercizio da 2 serie
- **THEN** il contatore mostra 45 XP (20 + 25)

### Requirement: Riepilogo di fine sessione
Il sistema SHALL mostrare, alla conclusione di una sessione, una schermata di riepilogo con XP guadagnati (compreso il bonus di sessione), numero di serie, volume totale e avanzamento nel livello, prima di tornare allo storico.

#### Scenario: Chiusura con riepilogo
- **WHEN** l'utente termina la sessione
- **THEN** la sessione viene conclusa e compare il riepilogo con XP, serie e volume; un pulsante di chiusura porta allo storico

#### Scenario: Conteggio animato
- **WHEN** il riepilogo viene mostrato
- **THEN** gli XP guadagnati salgono da 0 al valore finale e la barra del livello si riempie dal valore precedente a quello nuovo; con "riduci movimento" compaiono direttamente i valori finali

### Requirement: Level up
Il sistema SHALL mostrare nel riepilogo un banner "LEVEL UP" con il nuovo livello quando gli XP della sessione fanno superare una soglia di livello.

#### Scenario: Soglia superata
- **WHEN** l'utente aveva 180 XP totali e termina una sessione da 105 XP
- **THEN** il riepilogo mostra "LEVEL UP" con livello 2

#### Scenario: Soglia non superata
- **WHEN** gli XP della sessione non fanno cambiare livello
- **THEN** il riepilogo mostra la barra del livello aggiornata senza banner "LEVEL UP"

### Requirement: Riepilogo resiliente agli errori
Il sistema SHALL concludere comunque la sessione e mostrare il riepilogo con gli XP della sessione, senza livello, se lo storico non può essere letto.

#### Scenario: Storico non leggibile
- **WHEN** la lettura dello storico fallisce alla chiusura
- **THEN** la sessione è conclusa e il riepilogo mostra XP, serie e volume senza barra del livello né "LEVEL UP"

### Requirement: Avvio di una sessione senza routine

Il sistema SHALL permettere di avviare una sessione di allenamento libera, senza partire da una routine, aggiungendo esercizi manualmente durante la sessione.

#### Scenario: Avvio sessione libera

- **WHEN** l'utente avvia una nuova sessione senza selezionare una routine
- **THEN** il sistema crea una sessione con `startedAt` valorizzato, `routineId`/`routineName` assenti e un elenco esercizi vuoto, modificabile durante la sessione

### Requirement: Persistenza incrementale delle serie completate

Il sistema SHALL scrivere immediatamente su Firestore ogni serie completata durante la sessione attiva, senza attendere la chiusura della sessione.

#### Scenario: Completamento di una serie

- **WHEN** l'utente registra il completamento di una serie (peso, ripetizioni) per un esercizio della sessione attiva
- **THEN** il sistema aggiorna immediatamente il documento della sessione su Firestore con la nuova serie (setNumber, weight, reps, restSeconds, completedAt)

#### Scenario: Chiusura anticipata dell'app durante una sessione

- **WHEN** l'app viene chiusa o ricaricata dopo che una o più serie sono state completate ma prima della chiusura della sessione
- **THEN** le serie già completate risultano presenti nel documento sessione su Firestore e non vengono perse

### Requirement: Aggiunta di esercizi durante la sessione attiva

Il sistema SHALL permettere di aggiungere esercizi (dalla libreria o custom) alla sessione attiva anche se non presenti nella routine di partenza.

#### Scenario: Aggiunta di un esercizio non pianificato

- **WHEN** l'utente aggiunge un esercizio alla sessione attiva che non era previsto dalla routine di partenza (o la sessione è libera)
- **THEN** il sistema include il nuovo esercizio nell'elenco `exercises` della sessione con il proprio ordine e permette di loggarne le serie

### Requirement: Chiusura della sessione

Il sistema SHALL permettere di terminare una sessione attiva, marcandola come conclusa.

#### Scenario: Terminazione della sessione

- **WHEN** l'utente termina la sessione attiva
- **THEN** il sistema aggiorna il documento sessione impostando `endedAt` e la sessione non è più modificabile come "attiva"

#### Scenario: Note opzionali alla chiusura

- **WHEN** l'utente aggiunge una nota testuale alla sessione prima o durante la chiusura
- **THEN** il sistema salva il testo nel campo `notes` del documento sessione

### Requirement: Modifica del tempo di recupero per esercizio nella sessione attiva
Il sistema SHALL permettere di impostare o modificare il tempo di recupero associato a ciascun esercizio della sessione attiva, indipendentemente dal fatto che provenga da una routine.

#### Scenario: Modifica del tempo di recupero durante la sessione
- **WHEN** l'utente modifica il valore del tempo di recupero mostrato per un esercizio della sessione attiva
- **THEN** il sistema usa il nuovo valore come durata del countdown per il completamento della prossima serie di quell'esercizio, e lo persiste sul documento sessione

#### Scenario: Esercizio senza target di recupero da routine
- **WHEN** l'utente aggiunge un esercizio alla sessione attiva senza un target di recupero proveniente da una routine (sessione libera, o esercizio non pianificato)
- **THEN** il sistema propone un tempo di recupero di default di 90 secondi per quell'esercizio, modificabile dall'utente prima del completamento della prima serie

### Requirement: Precompilazione del peso dal carico target
Il sistema SHALL precompilare il campo peso di una serie con il `targetWeight` configurato per l'esercizio (dalla routine di partenza), quando presente, lasciandolo comunque modificabile dall'utente prima di confermare la serie.

#### Scenario: Esercizio con carico target da routine
- **WHEN** l'utente inizia a loggare una serie per un esercizio che ha un `targetWeight` proveniente dalla routine di partenza
- **THEN** il sistema mostra il campo peso già precompilato con quel valore, modificabile prima di confermare

#### Scenario: Esercizio senza carico target
- **WHEN** l'esercizio della sessione attiva non ha alcun `targetWeight` associato
- **THEN** il sistema mostra il campo peso vuoto, senza alterare il resto dell'interfaccia
