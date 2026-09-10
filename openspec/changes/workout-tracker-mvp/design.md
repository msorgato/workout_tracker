## Context

Progetto greenfield: nessun codice esistente. Serve stabilire l'architettura base — struttura del frontend, integrazione Firebase, modello dati Firestore, security rules e pipeline CI/CD — che tutte le capability (auth, routine-management, workout-session, rest-timer, session-history, exercise-library) andranno a usare. Vincolo dominante: intero progetto entro il piano Firebase Spark (gratuito), quindi nessun Cloud Functions/Cloud Storage.

## Goals / Non-Goals

**Goals:**

- Definire la struttura del progetto React/Vite/TypeScript e l'integrazione client-side con Firebase (Auth + Firestore).
- Definire il modello dati Firestore e le security rules che lo proteggono.
- Definire come la libreria esercizi statica si unisce ai dati custom dell'utente.
- Definire la strategia di persistenza incrementale delle sessioni (scrittura ad ogni serie completata).
- Definire la pipeline di deploy (GitHub Actions + Firebase Hosting) per `main` e per le pull request.

**Non-Goals:**

- Nessuna logica server-side (Cloud Functions): tutta la logica applicativa vive nel client.
- Nessuna gestione multi-utente/multi-tenant oltre allo scoping `users/{uid}`.
- Nessun offline/PWA, nessuna sincronizzazione conflict-resolution.
- Nessuna feature analitica (grafici, 1RM, PR automatici) in questa versione.

## Decisions

### 1. Tutta la logica applicativa nel client (nessun backend custom)

Firebase Auth gestisce l'identità, le Firestore Security Rules gestiscono l'autorizzazione (`request.auth.uid == uid`). Non serve un backend intermedio: il client scrive/legge direttamente su Firestore con l'SDK web.
**Alternative considerate**: un piccolo backend Express/Cloud Run per validazioni server-side — scartato perché aggiunge costo/infrastruttura non necessaria per un solo utente fidato, e le Security Rules coprono già l'autorizzazione. Le validazioni di forma/tipo bastano lato client (TypeScript + rules che verificano i campi minimi).

### 2. Esercizi e serie annidati nel documento sessione (no sotto-collezioni)

Un documento `sessions/{sessionId}` contiene l'intero array `exercises[].sets[]`. Evita letture multiple per ricostruire una sessione (una sola `getDoc`) e mantiene i costi di lettura entro la quota free.
**Alternative considerate**: sotto-collezioni `sessions/{id}/exercises/{id}/sets/{id}` — scartate: più letture per sessione, nessun bisogno di query cross-set/cross-exercise, complessità non giustificata per un solo utente. Rischio di dimensione documento (limite 1 MiB Firestore) accettabile: anche una sessione con 10 esercizi × 5 serie resta a poche decine di KB.

### 3. Persistenza incrementale via update parziali del documento sessione

Alla creazione della sessione si scrive subito il documento con `startedAt` e l'elenco esercizi (da routine o vuoto). Ogni serie completata aggiorna l'array `exercises[i].sets` con un `updateDoc` (sostituzione dell'intero array esercizi, dato che Firestore non supporta update atomici in profondità su elementi di array annidati arbitrari). Il client mantiene lo stato locale della sessione e lo sincronizza ad ogni set completato.
**Alternative considerate**: un documento per serie (`sessions/{id}/sets/{id}`) per update atomici granulari — scartato per coerenza con la decisione 2 (niente sotto-collezioni) e perché il volume di scritture per singola sessione resta comunque basso (poche decine), ben entro la quota di 20k scritture/giorno.

### 4. Libreria esercizi: JSON statico + merge runtime con `customExercises`

Gli esercizi predefiniti vivono come asset JSON bundlato nel frontend (nessuna lettura Firestore per ottenerli). All'avvio dell'app, il client unisce questo JSON con i documenti di `users/{uid}/customExercises` (letti una volta e cachati in memoria) per popolare l'autocomplete.
**Alternative considerate**: salvare anche gli esercizi predefiniti su Firestore — scartato: sono statici, versionati col codice, e leggerli da Firestore consumerebbe quota senza benefici (non cambiano a runtime).

### 5. Autenticazione: solo Google provider, route protette client-side

`onAuthStateChanged` determina lo stato globale; un route guard reindirizza alla schermata di login se `user == null`. Nessun ruolo/permesso oltre "autenticato o no": chiunque acceda con qualunque account Google può leggere/scrivere solo i propri dati (`users/{uid}`), ma l'app non impone whitelist dell'owner a livello di rules — è una scelta esplicita di semplicità mono-utente. Se necessario in futuro, si potrà aggiungere un check `request.auth.token.email == '<owner-email>'` nelle rules senza cambi architetturali.
**Alternative considerate**: restringere le rules a una singola email owner fin da subito — valutato ma rimandato: aggiunge un accoppiamento hardcoded nelle rules pubblicate su repo pubblica (email comunque non segreta, ma preferibile tenerlo come miglioramento futuro esplicito se emerge un rischio concreto).

### 6. CI/CD: GitHub Actions ufficiali Firebase

Uso di `firebase init hosting:github` per generare i due workflow standard: deploy su merge/push a `main`, preview deploy per ogni PR. Nessuna pipeline custom.
**Alternative considerate**: pipeline custom con build manuale e `firebase deploy` — scartata, l'integrazione ufficiale copre già preview + deploy con gestione automatica dei secrets del service account.

## Risks / Trade-offs

- **[Rischio]** Documento sessione troppo grande per allenamenti molto lunghi (molti esercizi/serie) → **Mitigazione**: limite pratico ben sotto 1 MiB per un log di allenamento reale; nessuna azione richiesta ora, da monitorare se emergono sessioni anomale.
- **[Rischio]** Update dell'intero array `exercises` ad ogni serie può causare race condition se l'utente ha due tab aperte → **Mitigazione**: scenario improbabile per uso singolo-utente/singolo-dispositivo per sessione; non gestito in questa versione.
- **[Rischio]** Nessuna whitelist owner nelle Security Rules: chiunque con un account Google può autenticarsi e creare il proprio spazio `users/{uid}` (non può leggere quello altrui, ma consuma comunque quota Spark) → **Mitigazione**: rischio basso (repo/app non pubblicizzata), accettato per ora; restrizione email owner disponibile come hardening futuro a costo zero.
- **[Rischio]** Vibrazione non supportata su iOS/Safari → **Mitigazione**: già previsto come enhancement progressivo, non blocca il requisito core del suono di notifica.
