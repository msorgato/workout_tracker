## ADDED Requirements

### Requirement: Palette scura con accento verde
Il sistema SHALL presentare tutte le viste dell'app (login, routine, sessione, storico) con una palette scura (sfondi neri/grigio scuro, testo chiaro) e un unico colore di accento verde brillante per le azioni primarie.

#### Scenario: Qualunque vista dell'app
- **WHEN** un utente autenticato o non autenticato visualizza una qualsiasi schermata dell'app
- **THEN** lo sfondo e le superfici (card, pannelli, liste) usano i token scuri definiti nel design, il testo principale è chiaro e leggibile, e non compaiono residui della palette chiara precedente (sfondi bianchi, testo grigio chiaro su sfondo chiaro)

### Requirement: Colore di accento unico per le azioni primarie
Il sistema SHALL usare lo stesso colore di accento verde per tutte le azioni primarie dell'interfaccia (login, salvataggio, conferma, avvio sessione, completamento serie), senza mischiare altri colori per lo stesso ruolo.

#### Scenario: Azione primaria in viste diverse
- **WHEN** l'utente interagisce con un pulsante di azione primaria in due viste diverse (es. "Salva routine" e "Serie completata")
- **THEN** entrambi i pulsanti usano lo stesso colore di accento verde, non colori diversi per lo stesso ruolo

### Requirement: Azioni distruttive visivamente distinte
Il sistema SHALL mantenere le azioni distruttive (es. eliminazione) visivamente distinte dall'accento primario, usando un colore di pericolo coerente e leggibile sulla palette scura.

#### Scenario: Pulsante di eliminazione
- **WHEN** l'utente vede un pulsante di eliminazione (routine, esercizio, ecc.)
- **THEN** il pulsante usa il colore di pericolo definito dal tema, distinguibile dal verde di accento e leggibile sullo sfondo scuro
