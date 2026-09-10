## Why

Non esiste ancora alcuna app: serve costruire da zero un tracker di allenamento personale a uso singolo (owner) per registrare sessioni di palestra — esercizi, serie, ripetizioni, pesi e recuperi — con uno storico consultabile nel tempo, mantenendo l'intero stack entro il piano gratuito Firebase (Spark).

## What Changes

- Setup del progetto frontend: React + Vite + TypeScript + Tailwind CSS.
- Integrazione Firebase: Authentication (solo Google sign-in) e Firestore, nessun Cloud Functions/Cloud Storage.
- Firestore Security Rules che scopano lettura/scrittura a `users/{uid}/**` con `request.auth.uid == uid`.
- Modello dati Firestore: `routines`, `sessions` (esercizi e serie annidati, no sotto-collezioni), `customExercises`.
- Libreria di esercizi predefiniti come JSON statico, unita a runtime con gli esercizi custom dell'utente per l'autocomplete.
- UI per login Google, gestione routine (CRUD), sessione di allenamento attiva con persistenza incrementale delle serie, timer di recupero con suono/vibrazione, storico sessioni consultabile.
- Pipeline CI/CD: GitHub Actions via integrazione ufficiale Firebase (`firebase init hosting:github`) — deploy automatico su push a `main`, preview deploy per pull request.
- Repository GitHub pubblica (nessun segreto: la Firebase web config non è sensibile per design).

## Capabilities

### New Capabilities

- `auth`: login/logout tramite Google (Firebase Auth), protezione delle rotte dell'app agli utenti non autenticati.
- `routine-management`: creazione, modifica ed eliminazione di routine riutilizzabili con esercizi e target (serie/reps/recupero) ordinati.
- `workout-session`: avvio, logging in tempo reale (con o senza routine di partenza) e chiusura di una sessione di allenamento, con persistenza incrementale delle serie completate su Firestore.
- `rest-timer`: countdown visivo del tempo di recupero tra le serie, con notifica sonora e vibrazione (dove supportata) a fine countdown.
- `session-history`: elenco e dettaglio delle sessioni passate.
- `exercise-library`: libreria di esercizi predefiniti (JSON statico) con autocomplete, unita a esercizi personalizzati persistiti per l'utente.

### Modified Capabilities

(nessuna — progetto greenfield, nessuna spec esistente)

## Impact

- **Nuovo codice**: intero frontend React/Vite/TypeScript in `src/`, configurazione Firebase (`firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`), workflow GitHub Actions per deploy/preview.
- **Servizi esterni**: progetto Firebase (Spark plan) con Authentication (provider Google) e Firestore abilitati; API key Firebase ristretta su Google Cloud Console.
- **Repository**: nuova repo pubblica su GitHub collegata al progetto Firebase per il deploy automatico.
- **Nessuna dipendenza da Cloud Functions o Cloud Storage** — vincolo di piano Spark da rispettare in ogni scelta implementativa futura.
