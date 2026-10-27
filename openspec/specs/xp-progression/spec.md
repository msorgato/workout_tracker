# xp-progression Specification

## Purpose
Definisce come si guadagnano punti esperienza (XP) allenandosi e come il livello dell'utente deriva dagli XP totali delle sessioni concluse, senza dati aggiuntivi da mantenere.

## Requirements
### Requirement: XP per ogni serie completata
Il sistema SHALL assegnare 10 XP a ogni serie registrata, comprese le serie extra oltre quelle previste.

#### Scenario: Tre serie registrate
- **WHEN** in una sessione sono registrate 3 serie su un esercizio
- **THEN** quelle serie valgono 30 XP

#### Scenario: Serie extra
- **WHEN** l'utente registra una quinta serie su un esercizio che ne prevedeva 4
- **THEN** la serie extra vale 10 XP come le altre

### Requirement: Bonus per esercizio completato
Il sistema SHALL assegnare 25 XP di bonus per ogni esercizio che ha registrato almeno tutte le serie previste dalla routine; gli esercizi senza serie previste NON ricevono il bonus.

#### Scenario: Esercizio completato
- **WHEN** un esercizio con 3 serie previste ne ha 3 registrate
- **THEN** l'esercizio vale 30 XP di serie più 25 XP di bonus

#### Scenario: Esercizio senza serie previste
- **WHEN** un esercizio di una sessione libera ha 3 serie registrate
- **THEN** vale solo i 30 XP delle serie, senza bonus

#### Scenario: Esercizio incompleto
- **WHEN** un esercizio con 4 serie previste ne ha 2 registrate
- **THEN** non riceve il bonus

### Requirement: Bonus di sessione conclusa
Il sistema SHALL assegnare 50 XP di bonus a ogni sessione conclusa.

#### Scenario: Sessione conclusa
- **WHEN** una sessione con un esercizio completato di 3 serie su 3 viene conclusa
- **THEN** la sessione vale 105 XP (30 + 25 + 50)

#### Scenario: Sessione ancora attiva
- **WHEN** una sessione non è conclusa
- **THEN** il bonus di sessione non è incluso negli XP totali dello storico

### Requirement: Livello derivato dagli XP totali
Il sistema SHALL calcolare il livello dell'utente dalla somma degli XP di tutte le sessioni concluse, con livello 1 da 0 XP e la soglia del livello N pari a 100 × N × (N − 1) XP (livello 2 a 200 XP, livello 3 a 600, livello 4 a 1.200).

#### Scenario: Prime soglie
- **WHEN** gli XP totali sono 199
- **THEN** il livello è 1
- **WHEN** gli XP totali sono 200
- **THEN** il livello è 2

#### Scenario: Avanzamento verso il livello successivo
- **WHEN** gli XP totali sono 400 (livello 2, che va da 200 a 600)
- **THEN** l'avanzamento verso il livello 3 è del 50%

#### Scenario: Nessuna sessione conclusa
- **WHEN** l'utente non ha sessioni concluse
- **THEN** il livello è 1 con 0 XP

### Requirement: Nessun dato aggiuntivo salvato
Il sistema SHALL ricavare XP e livello esclusivamente dalle sessioni già salvate, senza memorizzare contatori o livelli separati.

#### Scenario: Modifica delle regole
- **WHEN** le costanti di XP o la curva vengono cambiate in una versione successiva
- **THEN** XP e livello mostrati si aggiornano per tutte le sessioni passate senza migrazioni
