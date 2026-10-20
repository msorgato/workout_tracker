## Purpose

Fornisce consigli pratici su postura, movimento, carico e sicurezza per ciascun esercizio, combinando una libreria predefinita con i tips personali dell'utente, da consultare durante l'allenamento.

## ADDED Requirements

### Requirement: Libreria di tips per gli esercizi predefiniti
Il sistema SHALL fornire, per ciascun esercizio predefinito, almeno un consiglio in italiano appartenente a una delle categorie Postura, Movimento, Carico o Sicurezza, disponibile senza connessione a dati dell'utente e senza letture dal database.

#### Scenario: Esercizio predefinito
- **WHEN** l'utente consulta i tips di "Squat"
- **THEN** vede i consigli della libreria raggruppati per categoria, ciascuno come una frase breve

#### Scenario: Esercizio senza tips di libreria
- **WHEN** l'utente consulta i tips di un esercizio personalizzato o importato da CSV che non è nella libreria
- **THEN** non compaiono tips di libreria e il sistema propone di aggiungere un tip personale

### Requirement: Associazione dei tips agli esercizi per nome
Il sistema SHALL associare i tips di libreria anche a esercizi non predefiniti (ad esempio importati da CSV) quando il loro nome corrisponde a un nome noto della libreria, senza distinguere maiuscole, accenti e spazi multipli.

#### Scenario: Esercizio importato da CSV con nome descrittivo
- **WHEN** una routine importata contiene "Panca piana con bilanciere o manubri" come esercizio personalizzato
- **THEN** in sessione l'esercizio mostra i tips di libreria della panca piana

#### Scenario: Nome non riconosciuto
- **WHEN** il nome di un esercizio non corrisponde a nessun nome noto della libreria
- **THEN** l'esercizio non mostra tips di libreria ma consente quelli personali

### Requirement: Copertura degli esercizi delle schede
Il sistema SHALL includere nella libreria i tips per gli esercizi delle schede fornite nel progetto (push, pull, legs), oltre ai 17 esercizi predefiniti.

#### Scenario: Esercizi delle schede
- **WHEN** l'utente avvia una sessione da una routine importata da una delle schede push, pull o legs
- **THEN** ogni esercizio della routine mostra almeno un tip di libreria

### Requirement: Categorie dei tips
Il sistema SHALL classificare ogni tip in una sola categoria tra Postura, Movimento, Carico e Sicurezza e SHALL mostrare i tips raggruppati per categoria, nominando la categoria e omettendo le categorie vuote.

#### Scenario: Categorie con contenuto
- **WHEN** un esercizio ha due tips di Postura e uno di Carico
- **THEN** il pannello mostra le sezioni Postura e Carico e non mostra Movimento né Sicurezza

### Requirement: Tips personali per qualsiasi esercizio
Il sistema SHALL permettere all'utente di aggiungere, modificare ed eliminare propri tips per qualsiasi esercizio (predefinito, personalizzato o importato), scegliendo la categoria e scrivendo un testo non vuoto di al massimo 280 caratteri.

#### Scenario: Aggiunta di un tip
- **WHEN** l'utente aggiunge a "Panca piana" il tip "Scapole addotte e piedi ben a terra" in categoria Postura
- **THEN** il tip compare subito tra i tips di Postura dell'esercizio, contrassegnato come personale

#### Scenario: Testo vuoto
- **WHEN** l'utente tenta di salvare un tip con testo vuoto o di soli spazi
- **THEN** il salvataggio è rifiutato con un messaggio e nessun tip viene creato

#### Scenario: Testo troppo lungo
- **WHEN** l'utente inserisce un testo di più di 280 caratteri
- **THEN** il sistema impedisce il salvataggio e indica il limite

#### Scenario: Modifica ed eliminazione
- **WHEN** l'utente modifica il testo di un proprio tip o lo elimina
- **THEN** la modifica o la rimozione è visibile subito nel pannello

### Requirement: Tips di libreria non modificabili
Il sistema SHALL mostrare i tips della libreria come sola lettura, senza azioni di modifica o eliminazione, distinguendoli visivamente dai tips personali.

#### Scenario: Tip di libreria
- **WHEN** l'utente guarda un tip della libreria
- **THEN** non sono presenti azioni di modifica o eliminazione ed è evidente che non è un tip personale

### Requirement: Persistenza dei tips personali
Il sistema SHALL salvare i tips personali nell'area dati riservata all'utente autenticato e SHALL mostrarli di nuovo agli accessi successivi, su qualsiasi dispositivo, associati allo stesso esercizio.

#### Scenario: Riapertura dell'app
- **WHEN** l'utente aggiunge un tip personale, chiude l'app e la riapre
- **THEN** il tip è ancora presente per quell'esercizio

#### Scenario: Isolamento tra utenti
- **WHEN** un altro utente autenticato prova a leggere i tips personali dell'utente
- **THEN** l'accesso è negato

### Requirement: Fallimento del salvataggio
Il sistema SHALL segnalare all'utente quando il salvataggio, la modifica o l'eliminazione di un tip personale non riesce e SHALL mantenere visibile il testo inserito per consentire un nuovo tentativo.

#### Scenario: Errore di rete
- **WHEN** il salvataggio di un tip fallisce per un errore di rete
- **THEN** compare un messaggio di errore e il testo digitato resta nel campo
