## 1. Setup progetto e tooling

- [x] 1.1 Inizializzare progetto Vite con template React + TypeScript
- [x] 1.2 Installare e configurare Tailwind CSS
- [x] 1.3 Configurare ESLint/Prettier (o equivalente) per convenzioni di codice coerenti
- [x] 1.4 Impostare struttura cartelle base (`src/features`, `src/lib`, `src/components`, `src/data`)
- [x] 1.5 Creare repository GitHub pubblica e collegarla al progetto locale

## 2. Setup Firebase

- [ ] 2.1 Creare progetto Firebase (piano Spark) e abilitare Authentication (provider Google) e Firestore — **richiede azione manuale utente**, vedi nota sotto
- [x] 2.2 Configurare l'SDK Firebase web nel frontend (`firebase.ts` con inizializzazione app/auth/firestore)
- [ ] 2.3 Restringere l'API key Firebase su Google Cloud Console alle sole API Firebase necessarie — **richiede azione manuale utente**, dipende da 2.1
- [x] 2.4 Scrivere le Firestore Security Rules: lettura/scrittura su `users/{uid}/**` consentita solo se `request.auth.uid == uid`
- [x] 2.5 Verificare le security rules con l'emulatore Firestore o i test delle regole

> **Nota**: 2.1 e 2.3 richiedono di creare/configurare risorse reali su un account Google (Firebase console / Google Cloud Console) e sono state saltate su richiesta esplicita per procedere con il resto dell'implementazione. Il codice (`src/lib/firebase.ts`, `.env.example`) è già pronto per ricevere i valori di config reali una volta creato il progetto.

## 3. Autenticazione (capability: auth)

- [x] 3.1 Implementare schermata di login con pulsante "Accedi con Google"
- [x] 3.2 Implementare listener `onAuthStateChanged` e stato globale utente autenticato
- [x] 3.3 Implementare route guard che reindirizza al login gli utenti non autenticati
- [x] 3.4 Implementare azione di logout

## 4. Libreria esercizi (capability: exercise-library)

- [x] 4.1 Creare il JSON statico degli esercizi predefiniti (nome, gruppo muscolare)
- [x] 4.2 Implementare lettura/scrittura di `users/{uid}/customExercises` (creazione esercizio personalizzato)
- [x] 4.3 Implementare merge runtime tra libreria predefinita e `customExercises`, con cache in memoria per la sessione dell'app
- [x] 4.4 Implementare componente autocomplete riutilizzabile per la selezione esercizio

## 5. Gestione routine (capability: routine-management)

- [x] 5.1 Implementare modello dati e funzioni CRUD per `users/{uid}/routines`
- [x] 5.2 Implementare form di creazione/modifica routine: nome, elenco esercizi con target (serie/reps/recupero) e ordine, con validazione nome obbligatorio
- [x] 5.3 Implementare drag-and-drop o controlli di riordino per gli esercizi della routine
- [x] 5.4 Implementare eliminazione routine con conferma
- [x] 5.5 Implementare vista elenco routine dell'utente
- [x] 5.6 Implementare funzione di avvio sessione da routine (precompilazione esercizi/target)

## 6. Sessione di allenamento attiva (capability: workout-session)

- [x] 6.1 Implementare creazione sessione (da routine o libera) con scrittura immediata su Firestore di `startedAt` ed elenco esercizi iniziale
- [x] 6.2 Implementare UI di logging serie (peso, ripetizioni) per esercizio corrente
- [x] 6.3 Implementare persistenza incrementale: `updateDoc` della sessione ad ogni serie completata
- [x] 6.4 Implementare aggiunta di esercizi non pianificati durante la sessione attiva
- [x] 6.5 Implementare campo note testuali sulla sessione
- [x] 6.6 Implementare chiusura sessione con scrittura di `endedAt`
- [x] 6.7 Implementare recupero/ripristino di una sessione attiva non ancora conclusa (es. dopo ricarica pagina)

## 7. Timer di recupero (capability: rest-timer)

- [x] 7.1 Implementare componente countdown visivo configurabile sul tempo di recupero target
- [x] 7.2 Avviare automaticamente il countdown al completamento di una serie
- [x] 7.3 Implementare riproduzione suono di notifica a fine countdown (asset audio bundlato)
- [x] 7.4 Implementare attivazione vibrazione a fine countdown con feature detection (Vibration API), no-op silenzioso se non supportata
- [x] 7.5 Implementare controllo per saltare/interrompere manualmente il countdown

## 8. Storico sessioni (capability: session-history)

- [x] 8.1 Implementare query e vista elenco sessioni concluse (ordinate per data decrescente) da `users/{uid}/sessions`
- [x] 8.2 Implementare stato vuoto per assenza di sessioni registrate
- [x] 8.3 Implementare vista dettaglio sessione (routine, date, note, esercizi e serie)

## 9. CI/CD e deploy

- [ ] 9.1 Eseguire `firebase init hosting:github` per generare i workflow GitHub Actions — **richiede azione manuale utente**, dipende da 2.1 (progetto Firebase reale) e da autenticazione GitHub interattiva
- [ ] 9.2 Verificare il workflow di deploy automatico su push a `main` — dipende da 9.1
- [ ] 9.3 Verificare il workflow di preview deploy sulle pull request — dipende da 9.1
- [x] 9.4 Documentare nel README il processo di setup locale e deploy

## 10. Verifica finale

- [ ] 10.1 Percorrere manualmente lo scenario end-to-end: login → creazione routine → avvio sessione da routine → logging serie con timer → chiusura sessione → consultazione storico — **richiede progetto Firebase reale** (dipende da 2.1)
- [ ] 10.2 Percorrere manualmente lo scenario sessione libera senza routine con aggiunta esercizio custom — dipende da 2.1
- [x] 10.3 Verificare che nessuna funzionalità richieda Cloud Functions o Cloud Storage (compatibilità piano Spark)
- [ ] 10.4 Verificare il comportamento su un dispositivo mobile reale (responsive, suono/vibrazione del timer) — richiede dispositivo fisico
