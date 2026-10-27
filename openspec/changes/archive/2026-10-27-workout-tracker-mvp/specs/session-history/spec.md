## ADDED Requirements

### Requirement: Elenco delle sessioni passate

Il sistema SHALL mostrare l'elenco delle sessioni di allenamento concluse dall'utente, ordinate dalla più recente alla meno recente.

#### Scenario: Visualizzazione dello storico

- **WHEN** l'utente autenticato apre la sezione storico
- **THEN** il sistema mostra l'elenco delle sessioni concluse (con `endedAt` valorizzato) recuperate da `users/{uid}/sessions`, ordinate per data decrescente

#### Scenario: Nessuna sessione registrata

- **WHEN** l'utente autenticato apre la sezione storico e non ha ancora concluso alcuna sessione
- **THEN** il sistema mostra un elenco vuoto con un'indicazione che non ci sono ancora sessioni registrate

### Requirement: Dettaglio di una sessione passata

Il sistema SHALL permettere di consultare il dettaglio completo di una sessione passata, inclusi esercizi svolti, serie, pesi, ripetizioni e recuperi.

#### Scenario: Apertura del dettaglio sessione

- **WHEN** l'utente seleziona una sessione dall'elenco storico
- **THEN** il sistema mostra il dettaglio della sessione: nome routine (se presente), data/ora di inizio e fine, note, ed elenco esercizi con relative serie (peso, ripetizioni, recupero) nell'ordine registrato
