# Workout Tracker — Specifica di progetto

## 1. Panoramica

App web personale per tracciare sessioni di allenamento: esercizi svolti, serie, ripetizioni, pesi e tempo di recupero, con storico consultabile nel tempo. Uso singolo utente (owner), niente condivisione con altri.

## 2. Stack tecnico

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Backend-as-a-Service**: Firebase — Authentication (Google sign-in) + Firestore. Nessun Cloud Functions, nessun Cloud Storage.
- **Piano Firebase**: Spark (free tier) — l'intero progetto deve restare entro le quote gratuite (Firestore 1 GiB / 50k letture-giorno / 20k scritture-giorno; Auth fino a 50k MAU; Hosting 10 GB storage / 360 MB-giorno transfer)
- **Hosting**: Firebase Hosting, dominio di default `*.web.app` (custom domain aggiungibile in futuro gratuitamente se il progetto "prende piede")
- **Version control**: GitHub, repository **pubblica** (nessun segreto da proteggere: la Firebase web config — apiKey, authDomain, projectId ecc. — non è sensibile per design, l'autorizzazione reale è demandata alle Firestore Security Rules)
- **CI/CD**: GitHub Actions via integrazione ufficiale Firebase (`firebase init hosting:github`) — deploy automatico su push a `main`, preview deploy per ogni pull request

## 3. Scope e vincoli

- Singolo utente (solo login Google dell'owner), nessuna logica multi-tenant
- Solo online, web responsive (mobile + desktop), niente PWA/offline per questa versione
- Solo log storico consultabile: niente grafici, stima 1RM, PR automatici o suggerimenti di progressione (rimandato a una versione futura)
- Niente upload di foto/immagini utente (richiederebbe Cloud Storage for Firebase, non disponibile sul piano Spark)
- Le icone/immagini di interfaccia sono asset statici bundlati nella build, serviti da Firebase Hosting

## 4. Modello dati (Firestore)

Tutto scoped sotto `users/{uid}` per sicurezza, anche essendo mono-utente.

```
users/{uid}/routines/{routineId}
  - name: string
  - exercises: [{ exerciseId, exerciseName, targetSets, targetReps, targetRestSeconds, order }]
  - createdAt, updatedAt

users/{uid}/sessions/{sessionId}
  - startedAt, endedAt
  - routineId?: string        // riferimento opzionale alla routine usata
  - routineName?: string      // denormalizzato per evitare letture extra
  - notes?: string
  - exercises: [{
      exerciseId, exerciseName, order,
      sets: [{ setNumber, weight, reps, restSeconds, completedAt }]
    }]

users/{uid}/customExercises/{exerciseId}
  - name: string
  - muscleGroup?: string
  - createdAt
```

La libreria di esercizi predefiniti (Panca, Squat, Stacco, ecc.) è un JSON statico nel frontend, unita a runtime con `customExercises` per l'autocomplete. Esercizi e serie restano annidati nel documento sessione (niente sotto-collezioni): un solo utente e nessuna aggregazione cross-sessione richiesta, quindi meno complessità e meno letture.

## 5. Requisiti funzionali

### 5.1 Autenticazione

Il sistema DEVE permettere l'accesso solo tramite account Google (Firebase Auth).

- SCENARIO: QUANDO un utente non autenticato apre l'app ALLORA vede una schermata di login con pulsante "Accedi con Google".
- SCENARIO: QUANDO l'autenticazione ha successo ALLORA l'utente viene portato alla home.

### 5.2 Gestione routine (template riutilizzabili)

Il sistema DEVE permettere di creare, modificare ed eliminare routine riutilizzabili (es. "Push day", "Leg day").

- SCENARIO: QUANDO l'utente crea una routine ALLORA può aggiungere esercizi (dalla libreria o custom) specificando serie/reps/recupero target e il loro ordine.
- SCENARIO: QUANDO l'utente avvia una sessione da una routine ALLORA gli esercizi e i target vengono precompilati.

### 5.3 Sessione di allenamento attiva

Il sistema DEVE permettere di loggare una sessione in tempo reale, con o senza routine di partenza.

- SCENARIO: QUANDO l'utente completa una serie (peso, ripetizioni) ALLORA il dato viene scritto immediatamente su Firestore (persistenza incrementale, non solo a fine sessione — per non perdere dati se l'app si chiude a metà allenamento).
- SCENARIO: QUANDO l'utente termina la sessione ALLORA questa viene marcata come conclusa con `endedAt`.

### 5.4 Timer di recupero

Il sistema DEVE mostrare un countdown visivo del tempo di recupero tra le serie.

- SCENARIO: QUANDO il countdown arriva a zero ALLORA viene riprodotto un suono di notifica (funziona su tutti i dispositivi) e, se il dispositivo lo supporta, viene attivata la vibrazione (Android sì, iOS/Safari no per limite della piattaforma — da gestire come enhancement progressivo, non requisito bloccante).

### 5.5 Storico sessioni

Il sistema DEVE mostrare l'elenco delle sessioni passate con possibilità di consultarne il dettaglio (esercizi, serie, pesi, reps, recuperi).

### 5.6 Libreria esercizi

Il sistema DEVE fornire una libreria di esercizi predefiniti con autocomplete e permettere di aggiungerne di personalizzati, persistiti per l'utente.

## 6. Requisiti non funzionali

- **Sicurezza**: Firestore Security Rules che consentono lettura/scrittura su `users/{uid}/**` solo se `request.auth.uid == uid`. API key Firebase ristretta su Google Cloud Console alle sole API Firebase necessarie.
- **Costi**: l'intera applicazione deve rimanere nel piano Spark (gratuito); nessuna feature che richieda Blaze (Cloud Functions, Cloud Storage) in questa versione.
- **Repository**: pubblica su GitHub, deploy automatizzato via GitHub Actions.

## 7. Fuori scope (per ora, possibili versioni future)

- Multi-utente / condivisione dati
- Modalità offline / PWA installabile
- Grafici, statistiche, stima 1RM, PR automatici, suggerimenti di progressione del carico
- Upload foto/immagini utente (richiede Cloud Storage for Firebase → piano Blaze)

## 8. Note d'uso con OpenSpec

Questo documento è pensato per essere passato come contesto a `/opsx:propose` (o incollato come descrizione) per generare `proposal.md`, `specs/`, `design.md` e `tasks.md` iniziali del progetto in locale.
