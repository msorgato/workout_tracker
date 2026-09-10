## ADDED Requirements

### Requirement: Libreria di esercizi predefiniti

Il sistema SHALL fornire una libreria di esercizi predefiniti (es. Panca, Squat, Stacco) disponibile come dato statico bundlato nel frontend, senza richiedere letture da Firestore.

#### Scenario: Consultazione della libreria predefinita

- **WHEN** l'utente cerca un esercizio tramite l'autocomplete durante la creazione di una routine o di una sessione
- **THEN** il sistema propone corrispondenze dalla libreria predefinita senza effettuare letture aggiuntive su Firestore per ottenerla

### Requirement: Esercizi personalizzati persistiti per l'utente

Il sistema SHALL permettere all'utente di aggiungere esercizi personalizzati, persistiti in `users/{uid}/customExercises` e disponibili nelle sessioni successive.

#### Scenario: Aggiunta di un esercizio personalizzato

- **WHEN** l'utente crea un nuovo esercizio non presente nella libreria predefinita, specificandone il nome (e opzionalmente il gruppo muscolare)
- **THEN** il sistema salva l'esercizio in `users/{uid}/customExercises` con un timestamp di creazione

#### Scenario: Riutilizzo di un esercizio personalizzato

- **WHEN** l'utente riapre l'autocomplete esercizi in una routine o sessione successiva
- **THEN** il sistema propone anche gli esercizi personalizzati precedentemente salvati, insieme a quelli della libreria predefinita

### Requirement: Autocomplete unificato

Il sistema SHALL unire a runtime la libreria predefinita e gli esercizi personalizzati dell'utente in un'unica lista di ricerca per l'autocomplete.

#### Scenario: Ricerca con corrispondenze in entrambe le fonti

- **WHEN** l'utente digita una query che corrisponde sia a un esercizio predefinito sia a un esercizio personalizzato
- **THEN** il sistema mostra entrambe le corrispondenze nell'elenco dei suggerimenti
