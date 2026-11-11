## ADDED Requirements

### Requirement: Valori di routine ricavati da una sessione
Il sistema SHALL ricavare i valori di routine di un esercizio con almeno una serie registrata così: serie = serie registrate; carico = carico più alto usato; ripetizioni = quelle della serie con il carico più alto (a parità, il valore più alto); recupero = recupero impostato per l'esercizio nella sessione, o 90 secondi.

#### Scenario: Esercizio senza serie
- **WHEN** un esercizio della sessione non ha serie registrate
- **THEN** non produce valori di routine

#### Scenario: Recupero mai impostato
- **WHEN** l'utente non ha mai cambiato il recupero di un esercizio aggiunto in una sessione libera
- **THEN** il recupero ricavato è 90 secondi

#### Scenario: Carichi diversi tra le serie
- **WHEN** un esercizio ha le serie 60 kg × 10, 62,5 kg × 8 e 62,5 kg × 9
- **THEN** i valori ricavati sono 3 serie, carico 62,5 kg e 9 ripetizioni

#### Scenario: Esercizio a corpo libero
- **WHEN** tutte le serie di un esercizio sono registrate con carico 0
- **THEN** i valori ricavati non contengono un carico target e le ripetizioni sono le più alte registrate

### Requirement: Salvataggio di una sessione libera come routine
Il sistema SHALL offrire, nel riepilogo di fine sessione di una sessione libera con almeno una serie registrata, l'azione "Salva come routine". L'azione SHALL aprire il modulo di creazione routine già compilato con gli esercizi che hanno almeno una serie, nell'ordine della sessione e con i valori ricavati dalla sessione; il nome è da inserire. L'utente SHALL poter modificare tutti i campi prima di salvare. L'azione SHALL NOT comparire nel riepilogo di una sessione avviata da una routine.

#### Scenario: Creazione della routine
- **WHEN** l'utente termina una sessione libera con due esercizi registrati, tocca "Salva come routine", inserisce il nome "Gambe" e salva
- **THEN** viene creata la routine "Gambe" con i due esercizi e i valori ricavati dalla sessione, e l'utente vede l'elenco delle routine con la nuova routine

#### Scenario: Esercizi senza serie esclusi
- **WHEN** la sessione libera contiene un esercizio aggiunto ma senza serie registrate
- **THEN** quell'esercizio non compare nel modulo precompilato

#### Scenario: Annullamento
- **WHEN** l'utente apre il modulo precompilato e tocca "Annulla"
- **THEN** torna al riepilogo di fine sessione e nessuna routine viene creata

#### Scenario: Sessione libera vuota
- **WHEN** l'utente termina una sessione libera senza nessuna serie registrata
- **THEN** il riepilogo non mostra l'azione "Salva come routine"

#### Scenario: Sessione da routine
- **WHEN** l'utente termina una sessione avviata da una routine
- **THEN** il riepilogo non mostra l'azione "Salva come routine"

#### Scenario: Salvataggio non riuscito
- **WHEN** la creazione della routine fallisce
- **THEN** il modulo resta aperto con i dati inseriti e mostra un messaggio di errore

### Requirement: Proposta di aggiornamento della routine a fine sessione
Il sistema SHALL confrontare, alla fine di una sessione avviata da una routine, i valori ricavati dalla sessione con i target della routine salvata e, se ci sono differenze, mostrare nel riepilogo il riquadro "Aggiorna la routine" con l'elenco delle differenze. Sono differenze: carico, serie, ripetizioni o recupero diversi dal target, ed esercizi aggiunti in sessione con almeno una serie.

#### Scenario: Carico aumentato
- **WHEN** la routine prevede panca piana 3 × 10 a 60 kg e nella sessione l'utente fa 3 serie da 10 a 62,5 kg
- **THEN** il riquadro propone "Panca piana: carico 60 → 62,5 kg" e, salvando, la routine riporta 62,5 kg per la panca piana

#### Scenario: Serie in più e recupero cambiato
- **WHEN** l'utente fa una serie extra rispetto alle 3 previste e cambia il recupero da 90 a 120 secondi
- **THEN** il riquadro propone separatamente "serie 3 → 4" e "recupero 90 → 120 s"

#### Scenario: Esercizio aggiunto
- **WHEN** durante la sessione l'utente aggiunge un esercizio non previsto e registra 3 serie
- **THEN** il riquadro propone di aggiungerlo alla routine con i valori ricavati e, salvando, l'esercizio compare in coda

#### Scenario: Esercizio saltato
- **WHEN** un esercizio della routine non ha nessuna serie registrata
- **THEN** il riquadro non propone modifiche per quell'esercizio e la routine lo mantiene invariato

#### Scenario: Nessuna differenza
- **WHEN** i valori ricavati coincidono con tutti i target della routine e non ci sono esercizi aggiunti
- **THEN** il riepilogo non mostra il riquadro

#### Scenario: Routine non più disponibile
- **WHEN** la routine di partenza è stata eliminata o non si riesce a leggerla
- **THEN** il riepilogo non mostra il riquadro e resta utilizzabile

### Requirement: Applicazione selettiva delle differenze alla routine
Il sistema SHALL rendere ogni differenza del riquadro "Aggiorna la routine" selezionabile singolarmente, selezionata di default. "Salva nella routine" SHALL applicare solo le differenze selezionate, accodando gli esercizi aggiunti, e lasciare invariato tutto il resto della routine.

#### Scenario: Selezione parziale
- **WHEN** il riquadro propone il nuovo carico e la serie in più e l'utente deseleziona la serie in più prima di salvare
- **THEN** la routine aggiorna solo il carico e mantiene il numero di serie previsto

#### Scenario: Routine lasciata invariata
- **WHEN** l'utente tocca "Lascia invariata"
- **THEN** il riquadro si chiude e la routine non viene modificata

#### Scenario: Conferma del salvataggio
- **WHEN** l'aggiornamento della routine riesce
- **THEN** il riquadro mostra la conferma "Routine aggiornata" al posto dell'elenco

#### Scenario: Aggiornamento non riuscito
- **WHEN** il salvataggio nella routine fallisce
- **THEN** il riquadro resta aperto con le selezioni e mostra un messaggio di errore
