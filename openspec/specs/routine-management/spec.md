# routine-management Specification

## Purpose
TBD - created by archiving change workout-tracker-mvp. Update Purpose after archive.

## Requirements
### Requirement: Creazione di una routine

Il sistema SHALL permettere all'utente autenticato di creare una routine riutilizzabile con un nome e un elenco ordinato di esercizi, ciascuno con serie/ripetizioni/recupero target.

#### Scenario: Creazione di una nuova routine

- **WHEN** l'utente crea una routine specificando un nome e aggiunge uno o più esercizi (dalla libreria predefinita o custom) con targetSets, targetReps, targetRestSeconds e il loro ordine
- **THEN** il sistema salva la routine in `users/{uid}/routines` e la rende disponibile nell'elenco delle routine dell'utente

#### Scenario: Tentativo di salvare una routine senza nome

- **WHEN** l'utente tenta di salvare una routine senza specificare un nome
- **THEN** il sistema impedisce il salvataggio e segnala che il nome è obbligatorio

### Requirement: Modifica di una routine esistente

Il sistema SHALL permettere di modificare nome, esercizi, target e ordine di una routine esistente.

#### Scenario: Modifica degli esercizi di una routine

- **WHEN** l'utente modifica gli esercizi, i target o l'ordine di una routine esistente e salva
- **THEN** il sistema aggiorna il documento della routine in Firestore con i nuovi valori e aggiorna `updatedAt`

### Requirement: Eliminazione di una routine

Il sistema SHALL permettere di eliminare una routine esistente.

#### Scenario: Eliminazione di una routine

- **WHEN** l'utente elimina una routine
- **THEN** il sistema rimuove il documento corrispondente da `users/{uid}/routines` e la routine non compare più nell'elenco

#### Scenario: Eliminazione di una routine non impatta le sessioni passate

- **WHEN** l'utente elimina una routine che è stata usata in sessioni passate
- **THEN** le sessioni storiche restano invariate, poiché il nome della routine è denormalizzato in `routineName` sul documento sessione

### Requirement: Avvio di una sessione da routine

Il sistema SHALL permettere di avviare una nuova sessione di allenamento a partire da una routine esistente, precompilando esercizi e target.

#### Scenario: Avvio sessione da routine

- **WHEN** l'utente sceglie di avviare una sessione a partire da una routine
- **THEN** il sistema crea una nuova sessione con `routineId` e `routineName` valorizzati e l'elenco esercizi precompilato con i target della routine (serie/reps/recupero), pronti per essere loggati

### Requirement: Carico target opzionale per esercizio
Il sistema SHALL permettere di associare un carico target opzionale (in kg) a ciascun esercizio di una routine.

#### Scenario: Impostazione del carico target nel form routine
- **WHEN** l'utente imposta un valore di carico target per un esercizio nel form di creazione/modifica routine
- **THEN** il sistema salva il valore come `targetWeight` dell'esercizio insieme agli altri target (serie/reps/recupero)

#### Scenario: Routine senza carico target (compatibilità)
- **WHEN** una routine esistente non ha un carico target impostato per i propri esercizi (creata prima dell'introduzione di questo campo)
- **THEN** il sistema la gestisce normalmente, senza richiedere alcuna migrazione dei dati
