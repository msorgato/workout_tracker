# user-profile Specification

## Purpose
Offre all'utente una pagina personale dove consultare identità, livello ed esperienza accumulata e scegliere l'icona del proprio profilo da un set di avatar a tema palestra.

## Requirements

### Requirement: Pagina Profilo
Il sistema SHALL offrire una sezione Profilo che mostra l'avatar, il nome dell'account, il livello e gli XP totali dell'utente, con un pulsante "Modifica" in intestazione.

#### Scenario: Apertura del profilo
- **WHEN** l'utente autenticato apre la sezione Profilo
- **THEN** vede il titolo "Profilo", il proprio avatar, il nome dell'account, la pill "Livello N", gli XP totali e il pulsante "Modifica"

#### Scenario: Account senza nome
- **WHEN** l'account non ha un nome visualizzabile
- **THEN** il profilo mostra l'indirizzo email al posto del nome

### Requirement: Livello, XP e avanzamento nel profilo
Il sistema SHALL mostrare nel profilo il livello e gli XP totali calcolati dallo storico delle sessioni concluse con le regole di progressione esistenti, e una barra di avanzamento verso il livello successivo con l'indicazione "XP nel livello / XP necessari".

#### Scenario: Utente con storico
- **WHEN** l'utente ha sessioni concluse per 400 XP totali
- **THEN** il profilo mostra livello 2, 400 XP totali e una barra al 50% con "200 / 400 XP"

#### Scenario: Utente senza sessioni concluse
- **WHEN** l'utente non ha ancora concluso sessioni
- **THEN** il profilo mostra livello 1, 0 XP e la barra vuota

#### Scenario: Coerenza con il riepilogo di fine sessione
- **WHEN** l'utente conclude una sessione e poi apre il profilo
- **THEN** XP e livello del profilo includono gli XP guadagnati in quella sessione

#### Scenario: Storico non leggibile
- **WHEN** la lettura dello storico fallisce
- **THEN** il profilo mostra comunque avatar e nome, con un messaggio che indica che XP e livello non sono disponibili

### Requirement: Preset di avatar
Il sistema SHALL mettere a disposizione 16 avatar predefiniti a tema palestra (bilanciere, fulmine, calendario, corona, manubrio, fiamma, battito, kettlebell, medaglia, muscolo, shaker, scarpa, stella, cronometro, bersaglio, trofeo), ciascuno con un'etichetta testuale, mostrati come badge con icona nera su fondo verde.

#### Scenario: Avatar predefinito
- **WHEN** l'utente non ha mai scelto un avatar
- **THEN** il profilo mostra l'avatar predefinito (muscolo)

#### Scenario: Avatar non più disponibile
- **WHEN** l'avatar salvato non esiste più nel preset
- **THEN** il profilo mostra l'avatar predefinito senza errori

### Requirement: Modifica dell'avatar
Il sistema SHALL permettere di scegliere l'avatar da un selettore con la griglia dei 16 preset aperto dal pulsante "Modifica", mostrando subito la scelta nell'anteprima e applicandola solo dopo "Salva".

#### Scenario: Cambio di avatar
- **WHEN** l'utente tocca "Modifica", sceglie l'icona del trofeo e tocca "Salva"
- **THEN** il profilo mostra l'avatar trofeo e il selettore si chiude

#### Scenario: Annullamento
- **WHEN** l'utente tocca "Modifica", sceglie un'altra icona e tocca "Annulla"
- **THEN** il selettore si chiude e il profilo mantiene l'avatar precedente

#### Scenario: Avatar selezionato evidenziato
- **WHEN** il selettore è aperto
- **THEN** l'avatar attualmente scelto è evidenziato e ogni voce è selezionabile con un'area di almeno 44×44 px e un'etichetta accessibile

### Requirement: Persistenza dell'avatar
Il sistema SHALL salvare l'avatar scelto nell'area dati riservata all'utente autenticato e SHALL mostrarlo di nuovo agli accessi successivi, su qualsiasi dispositivo.

#### Scenario: Riapertura dell'app
- **WHEN** l'utente salva un avatar, chiude l'app e la riapre
- **THEN** il profilo mostra l'avatar scelto

#### Scenario: Isolamento tra utenti
- **WHEN** un altro utente autenticato prova a leggere o scrivere il profilo dell'utente
- **THEN** l'accesso è negato

### Requirement: Fallimento del salvataggio dell'avatar
Il sistema SHALL segnalare all'utente quando il salvataggio dell'avatar non riesce e SHALL mantenere aperto il selettore con la scelta fatta, senza modificare l'avatar mostrato nel profilo.

#### Scenario: Errore di rete
- **WHEN** il salvataggio fallisce per un errore di rete
- **THEN** compare un messaggio di errore, il selettore resta aperto con la selezione corrente e l'avatar del profilo non cambia
