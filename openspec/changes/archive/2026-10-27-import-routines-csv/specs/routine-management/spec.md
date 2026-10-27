## ADDED Requirements

### Requirement: Carico target opzionale per esercizio
Il sistema SHALL permettere di associare un carico target opzionale (in kg) a ciascun esercizio di una routine.

#### Scenario: Impostazione del carico target nel form routine
- **WHEN** l'utente imposta un valore di carico target per un esercizio nel form di creazione/modifica routine
- **THEN** il sistema salva il valore come `targetWeight` dell'esercizio insieme agli altri target (serie/reps/recupero)

#### Scenario: Routine senza carico target (compatibilità)
- **WHEN** una routine esistente non ha un carico target impostato per i propri esercizi (creata prima dell'introduzione di questo campo)
- **THEN** il sistema la gestisce normalmente, senza richiedere alcuna migrazione dei dati
