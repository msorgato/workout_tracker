## ADDED Requirements

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
