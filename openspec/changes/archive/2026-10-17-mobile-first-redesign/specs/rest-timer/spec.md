## ADDED Requirements

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
