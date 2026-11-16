## ADDED Requirements

### Requirement: Modifica di una serie registrata
Il sistema SHALL permettere di modificare peso e ripetizioni di una serie già registrata nella sessione attiva, libera o avviata da una routine. Toccando la riga della serie, la riga SHALL diventare un editor con i valori attuali, inseribili con gli stessi stepper della registrazione, e le azioni "Salva", "Annulla" ed "Elimina". Salvando, la serie SHALL cambiare peso e ripetizioni mantenendo numero, recupero e orario di completamento.

#### Scenario: Correzione del peso
- **WHEN** l'utente tocca la serie 2 registrata a 60 kg × 10, porta il peso a 62,5 e salva
- **THEN** la riga mostra 62,5 kg × 10, il volume della sessione si aggiorna e il numero della serie resta 2

#### Scenario: Correzione delle ripetizioni
- **WHEN** l'utente modifica le ripetizioni di una serie da 10 a 8 e salva
- **THEN** la riga mostra le nuove ripetizioni e gli XP della sessione non cambiano

#### Scenario: Valori non validi
- **WHEN** l'utente porta le ripetizioni a 0 o svuota il campo nell'editor
- **THEN** il pulsante "Salva" non è utilizzabile e la serie resta com'era

#### Scenario: Valori ammessi
- **WHEN** l'utente imposta ripetizioni intere maggiori di zero e un peso uguale o maggiore di zero (0 kg per il corpo libero)
- **THEN** il pulsante "Salva" è utilizzabile

#### Scenario: Annullamento della modifica
- **WHEN** l'utente cambia i valori nell'editor e tocca "Annulla"
- **THEN** l'editor si chiude e la serie mantiene i valori precedenti

#### Scenario: Una sola modifica alla volta
- **WHEN** l'editor di una serie è aperto e l'utente tocca un'altra serie
- **THEN** l'editor della prima si chiude senza salvare e si apre quello della seconda

#### Scenario: Modifica persistente
- **WHEN** l'utente salva una serie modificata e poi ricarica l'app durante la stessa sessione
- **THEN** la serie mostra i valori modificati

#### Scenario: Sessione da routine
- **WHEN** l'utente è in una sessione avviata da una routine e tocca una serie registrata
- **THEN** può modificarla ed eliminarla come in una sessione libera

#### Scenario: Sessione conclusa
- **WHEN** l'utente consulta una sessione conclusa nello storico
- **THEN** le serie non offrono modifica né eliminazione

### Requirement: Eliminazione di una serie registrata
Il sistema SHALL permettere di eliminare una serie registrata dall'editor con l'azione "Elimina". Le serie successive SHALL essere rinumerate in modo continuo a partire da 1, e volume, XP, indicatore di avanzamento e stato "Completato" dell'esercizio SHALL essere ricalcolati dalle serie rimaste.

#### Scenario: Eliminazione di una serie intermedia
- **WHEN** un esercizio ha tre serie e l'utente elimina la seconda
- **THEN** restano due serie numerate 1 e 2, con i valori delle serie 1 e 3 originali

#### Scenario: Esercizio che non è più completato
- **WHEN** un esercizio con 3 serie previste e 3 registrate perde una serie
- **THEN** l'indicatore passa da "Completato 3/3" a "Serie 2/3", il contatore XP scende di 35 (10 della serie e 25 del bonus esercizio) e compare di nuovo il pulsante per registrare la serie successiva

#### Scenario: Serie extra eliminata
- **WHEN** l'utente elimina una serie extra oltre il target
- **THEN** il contatore XP scende di 10 e l'esercizio resta completato

#### Scenario: Eliminazione persistente
- **WHEN** l'utente elimina una serie e poi ricarica l'app durante la stessa sessione
- **THEN** la serie non compare più e le altre sono rinumerate

#### Scenario: Ultima serie con recupero in corso
- **WHEN** il recupero di un esercizio è in corso e l'utente elimina l'ultima serie di quell'esercizio
- **THEN** il timer di recupero si interrompe

#### Scenario: Esercizio senza serie
- **WHEN** l'utente elimina l'unica serie di un esercizio
- **THEN** l'esercizio resta nella sessione senza serie e l'utente può registrarne di nuove

### Requirement: Annullamento dell'eliminazione di una serie
Il sistema SHALL mostrare, dopo l'eliminazione di una serie, un avviso "Serie N eliminata" con l'azione "Annulla" nella card dell'esercizio per circa 5 secondi. Toccando "Annulla" la serie SHALL tornare nella posizione originale con peso, ripetizioni, recupero e orario originali, e le serie successive SHALL essere rinumerate di conseguenza. Scaduto il tempo, o dopo una nuova eliminazione, l'eliminazione precedente SHALL diventare definitiva.

#### Scenario: Annulla entro 5 secondi
- **WHEN** l'utente elimina la serie 2 e tocca "Annulla" entro 5 secondi
- **THEN** la serie 2 torna con i valori originali, le serie dopo di lei riprendono i numeri originali e il contatore XP risale

#### Scenario: Eliminazione definitiva
- **WHEN** l'utente elimina una serie e non tocca "Annulla" per 5 secondi
- **THEN** l'avviso scompare e la serie non è più recuperabile

#### Scenario: Nuova eliminazione
- **WHEN** l'utente elimina una serie e, prima dello scadere dell'avviso, ne elimina un'altra
- **THEN** l'avviso mostra l'ultima eliminazione e la precedente diventa definitiva

#### Scenario: Annullamento persistente
- **WHEN** l'utente annulla un'eliminazione e poi ricarica l'app durante la stessa sessione
- **THEN** la serie ripristinata è presente
