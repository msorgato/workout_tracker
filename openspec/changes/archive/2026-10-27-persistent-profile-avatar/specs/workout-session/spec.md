## ADDED Requirements

### Requirement: Stato della sessione conservato durante la navigazione
Il sistema SHALL conservare lo stato a video della sessione attiva quando l'utente passa a un'altra sezione e torna alla Sessione: timer di recupero in corso, valori di peso e ripetizioni digitati e non ancora confermati, serie extra sbloccate. Il countdown del recupero SHALL proseguire in tempo reale anche mentre l'utente è in un'altra sezione. Lo stato SHALL essere azzerato alla chiusura della sessione.

#### Scenario: Valori digitati conservati
- **WHEN** l'utente digita peso e ripetizioni di un esercizio senza confermare la serie, apre il Profilo e torna alla Sessione
- **THEN** i campi mostrano ancora i valori digitati

#### Scenario: Recupero in corso conservato
- **WHEN** l'utente completa una serie con recupero di 90 secondi, apre il Profilo dopo 20 secondi e torna alla Sessione dopo 30 secondi
- **THEN** il timer di recupero è visibile e mostra circa 40 secondi rimanenti, senza ripartire da 90

#### Scenario: Recupero scaduto durante l'assenza
- **WHEN** il recupero scade mentre l'utente è in un'altra sezione e poi torna alla Sessione
- **THEN** il timer non è più mostrato e la sessione resta utilizzabile, senza suono né vibrazione ritardati

#### Scenario: Serie extra sbloccata conservata
- **WHEN** l'utente tocca "Aggiungi serie extra" su un esercizio completato, naviga altrove e torna alla Sessione
- **THEN** l'esercizio consente ancora di registrare la serie extra

#### Scenario: Stato azzerato alla chiusura
- **WHEN** l'utente termina la sessione e ne avvia una nuova
- **THEN** la nuova sessione parte senza timer, valori digitati o serie extra sbloccate della precedente
