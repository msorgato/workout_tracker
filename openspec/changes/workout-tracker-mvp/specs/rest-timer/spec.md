## ADDED Requirements

### Requirement: Countdown visivo del recupero

Il sistema SHALL mostrare un countdown visivo del tempo di recupero tra le serie durante una sessione attiva.

#### Scenario: Avvio del timer dopo una serie

- **WHEN** l'utente completa una serie durante la sessione attiva
- **THEN** il sistema avvia un countdown visivo basato sul tempo di recupero target (o su un valore impostato manualmente) e ne mostra il tempo residuo in tempo reale

### Requirement: Notifica sonora a fine countdown

Il sistema SHALL riprodurre un suono di notifica quando il countdown raggiunge lo zero, su qualsiasi dispositivo supportato dal browser.

#### Scenario: Countdown arrivato a zero

- **WHEN** il countdown del recupero raggiunge lo zero
- **THEN** il sistema riproduce un suono di notifica udibile, indipendentemente dal dispositivo (desktop o mobile)

### Requirement: Vibrazione come enhancement progressivo

Il sistema SHALL attivare la vibrazione del dispositivo a fine countdown quando l'API di vibrazione è supportata dal browser/dispositivo, senza che l'assenza di supporto blocchi le altre funzionalità del timer.

#### Scenario: Dispositivo con supporto vibrazione (es. Android)

- **WHEN** il countdown raggiunge lo zero su un dispositivo/browser che espone l'API di vibrazione
- **THEN** il sistema attiva la vibrazione oltre al suono di notifica

#### Scenario: Dispositivo senza supporto vibrazione (es. iOS/Safari)

- **WHEN** il countdown raggiunge lo zero su un dispositivo/browser privo di supporto per l'API di vibrazione
- **THEN** il sistema riproduce comunque il suono di notifica e non genera errori né blocca l'interfaccia per l'assenza di vibrazione

### Requirement: Controllo manuale del timer

Il sistema SHALL permettere all'utente di interrompere o saltare manualmente il countdown di recupero in corso.

#### Scenario: Salto manuale del recupero

- **WHEN** l'utente sceglie di saltare il countdown di recupero in corso
- **THEN** il sistema interrompe immediatamente il countdown senza attendere lo zero e senza riprodurre la notifica di fine countdown
