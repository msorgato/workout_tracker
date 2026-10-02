## MODIFIED Requirements

### Requirement: Countdown visivo del recupero
Il sistema SHALL mostrare un countdown visivo del tempo di recupero tra le serie durante una sessione attiva, usando come durata di default il tempo di recupero configurato per quell'esercizio (dalla routine di partenza, se presente, oppure dal valore impostato dall'utente nella sessione corrente).

#### Scenario: Avvio del timer dopo una serie con target da routine
- **WHEN** l'utente completa una serie di un esercizio che fa parte di una routine con `targetRestSeconds` configurato
- **THEN** il sistema avvia un countdown visivo la cui durata iniziale corrisponde esattamente al `targetRestSeconds` configurato per quell'esercizio nella routine, e ne mostra il tempo residuo in tempo reale

#### Scenario: Avvio del timer dopo una serie senza target da routine
- **WHEN** l'utente completa una serie di un esercizio senza un target di recupero proveniente da una routine (sessione libera, o esercizio aggiunto durante la sessione)
- **THEN** il sistema avvia il countdown usando il tempo di recupero impostato dall'utente per quell'esercizio nella sessione corrente, oppure un default di 90 secondi se non è stato modificato

### Requirement: Vibrazione come enhancement progressivo
Il sistema SHALL attivare la vibrazione del dispositivo a fine countdown, con un pattern a impulsi ripetuti per una migliore percepibilità, quando l'API di vibrazione è supportata dal browser/dispositivo, senza che l'assenza di supporto blocchi le altre funzionalità del timer.

#### Scenario: Dispositivo con supporto vibrazione (es. Android)
- **WHEN** il countdown raggiunge lo zero su un dispositivo/browser che espone l'API di vibrazione
- **THEN** il sistema attiva un pattern di vibrazione a impulsi ripetuti (non un singolo impulso), oltre al suono di notifica

#### Scenario: Dispositivo senza supporto vibrazione (es. iOS/Safari)
- **WHEN** il countdown raggiunge lo zero su un dispositivo/browser privo di supporto per l'API di vibrazione
- **THEN** il sistema riproduce comunque il suono di notifica e non genera errori né blocca l'interfaccia per l'assenza di vibrazione
