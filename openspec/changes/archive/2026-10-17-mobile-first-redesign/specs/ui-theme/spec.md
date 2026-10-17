## ADDED Requirements

### Requirement: Gerarchia tipografica con font display
Il sistema SHALL usare un font display (condensato, ad alto impatto) per titoli di pagina, nomi in evidenza e valori numerici chiave (timer, peso, ripetizioni, totali), e un font di testo leggibile per il resto. I font MUST essere serviti dal build dell'app, senza richieste a CDN esterni.

#### Scenario: Titolo di pagina e numeri
- **WHEN** l'utente apre la sezione Sessione con un timer di recupero attivo
- **THEN** il titolo della pagina e i secondi del timer sono resi con il font display, mentre etichette e descrizioni usano il font di testo

#### Scenario: Nessuna dipendenza di rete esterna per i font
- **WHEN** l'app viene caricata
- **THEN** i file dei font sono richiesti solo all'origine dell'app, non a domini di terze parti

### Requirement: Iconografia coerente
Il sistema SHALL accompagnare navigazione e azioni principali (avvia, modifica, elimina, aggiungi, importa, logout, indietro) con icone di uno stesso stile, e ogni pulsante composto solo da icona MUST avere un'etichetta accessibile.

#### Scenario: Pulsante solo icona
- **WHEN** uno screen reader legge un pulsante che mostra solo un'icona (es. elimina)
- **THEN** viene annunciata un'etichetta testuale che descrive l'azione

### Requirement: Profondità e accento luminoso
Il sistema SHALL distinguere gli elementi chiave (azione primaria della vista, sessione attiva, timer di recupero) con un trattamento luminoso basato sul colore di accento verde (alone o gradiente), mantenendo gli altri elementi su superfici scure sobrie. La palette nero/verde e il colore di pericolo esistenti restano invariati.

#### Scenario: Azione primaria in evidenza
- **WHEN** l'utente visualizza la lista delle routine
- **THEN** l'azione di avvio sessione risalta con il trattamento luminoso verde, mentre le azioni secondarie restano neutre

### Requirement: Feedback al tocco e animazioni rispettose
Il sistema SHALL fornire un feedback visivo immediato al tocco sui controlli interattivi e brevi animazioni di comparsa per elementi nuovi. Quando l'utente ha attivato la preferenza di movimento ridotto, le animazioni MUST essere disattivate o ridotte a semplici dissolvenze.

#### Scenario: Pressione di un pulsante
- **WHEN** l'utente preme un pulsante
- **THEN** il pulsante mostra uno stato premuto visibile (es. leggera riduzione di scala o cambio di tono) entro il tocco

#### Scenario: Movimento ridotto
- **WHEN** il sistema operativo dell'utente ha attiva la preferenza "riduci movimento"
- **THEN** non vengono eseguite animazioni di spostamento o scala

### Requirement: Target touch minimi
Il sistema SHALL garantire che ogni controllo interattivo abbia un'area toccabile di almeno 44×44 px, e che i campi numerici aprano la tastiera numerica sui dispositivi mobili.

#### Scenario: Pulsanti in una card
- **WHEN** l'utente usa l'app su uno smartphone
- **THEN** ogni pulsante, voce di tab bar e controllo di stepper ha un'area toccabile di almeno 44×44 px

#### Scenario: Inserimento peso
- **WHEN** l'utente tocca il campo peso
- **THEN** il dispositivo mostra una tastiera numerica con separatore decimale

### Requirement: Stati vuoti illustrati
Il sistema SHALL mostrare, quando una lista è vuota (routine, storico) o non c'è una sessione attiva, uno stato vuoto con icona, messaggio e, dove applicabile, l'azione per iniziare.

#### Scenario: Nessuna routine
- **WHEN** l'utente non ha ancora creato routine
- **THEN** vede uno stato vuoto con icona, un messaggio e il pulsante per creare la prima routine

#### Scenario: Nessuna sessione attiva
- **WHEN** l'utente apre la sezione Sessione senza una sessione attiva
- **THEN** vede uno stato vuoto con l'azione per avviare una sessione libera e il rimando alle routine

### Requirement: Identità della schermata di accesso e del browser
Il sistema SHALL presentare la schermata di accesso con logo/nome dell'app in evidenza e l'azione di accesso Google prominente, e SHALL usare favicon e colore della barra del browser coerenti con la palette nero/verde.

#### Scenario: Primo accesso
- **WHEN** un utente non autenticato apre l'app
- **THEN** vede il nome dell'app in grande con accento verde e un pulsante "Accedi con Google" a tutta larghezza

#### Scenario: Barra del browser mobile
- **WHEN** l'app è aperta in un browser mobile che supporta il colore del tema
- **THEN** la barra del browser assume il colore di sfondo scuro dell'app e il favicon usa il verde di accento
