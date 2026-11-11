## Context

Motivazione in proposal.md, requisiti in specs/. Stato osservato:

- `index.html` ha già `viewport-fit=cover`, `theme-color` `#0a0a0a`, `lang="it"` e la favicon `public/favicon.svg` (manubrio verde `#39d353`/`#2aa83f` su squircle nero, viewBox 24). Non c'è manifest, non ci sono icone PNG, non c'è un service worker.
- `vite.config.ts` usa solo `react()` e `tailwindcss()`; tutto ciò che sta in `public/` viene copiato così com'è in `dist/`.
- `firebase.json`: Hosting serve `dist` in HTTPS con rewrite `** → /index.html`. I file statici esistenti hanno la precedenza sul rewrite, quindi `/manifest.webmanifest` e `/icons/*` vengono serviti direttamente.
- Header e tab bar usano già `env(safe-area-inset-*)`.
- Accesso: `AuthContext` usa `signInWithPopup(auth, googleProvider)`.
- `openspec/config.yaml` dichiara "Online-only, … No PWA/offline in this version" e "No Cloud Functions", su piano Spark.
- Utente e dispositivo: un solo utente, Android con Chrome. Scelte confermate dall'utente: nessun offline, notifica in background rimandata a una change successiva.

## Goals / Non-Goals

**Goals:**
- Installabilità su Chrome per Android, con icona adattiva corretta e apertura a tutto schermo.
- Pulsante "Installa app" nel Profilo quando l'installazione è disponibile.
- Accesso Google funzionante dall'app installata.
- Nessuna cache: ogni apertura carica l'ultima versione pubblicata.

**Non-Goals:**
- Service worker, cache offline, Firestore offline.
- Notifiche (locali o push) e qualsiasi modifica al timer di recupero.
- Ottimizzazioni specifiche per iOS oltre all'`apple-touch-icon`.

## Decisions

### 1. Manifest statico in `public/`, senza plugin
`public/manifest.webmanifest` scritto a mano: `id: "/"`, `name: "Workout Tracker"`, `short_name: "Workout"`, `lang: "it"`, `start_url: "/"`, `scope: "/"`, `display: "standalone"`, `orientation: "portrait"`, `background_color` e `theme_color` `#0a0a0a`, `icons` con 192 e 512 (`purpose: "any"`) e 512 maskable (`purpose: "maskable"`). In `index.html`: `<link rel="manifest" href="/manifest.webmanifest">` e `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`.
**Alternativa**: `vite-plugin-pwa` — scartata: il suo valore è generare il service worker con la precache dei file, cioè proprio l'offline che non vogliamo, e aggiunge una dipendenza e un ciclo di aggiornamento della cache da gestire.

### 2. Nessun service worker
Chrome per Android non richiede più un service worker con gestore `fetch` per considerare un'app installabile: bastano HTTPS, un manifest valido con icone 192/512, `start_url` e `display` non `browser`. Senza service worker non c'è cache, quindi ogni apertura scarica l'ultimo `index.html` (requisito "Solo online") e non c'è rischio di versioni vecchie rimaste in cache.
**Ripiego** (solo se sul telefono l'installazione non viene proposta): aggiungere un service worker minimo `public/sw.js` con soli eventi `install`/`activate` e nessun gestore `fetch` né cache, registrato in `main.tsx` solo in produzione. Il requisito "Solo online" resta valido. Sarà comunque la base per la change della notifica push.

### 3. Icone generate una volta dall'SVG
Sorgenti in `public/icons/`: `icon.svg` (il disegno della favicon su fondo nero quadrato con angoli arrotondati) e `icon-maskable.svg` (fondo nero pieno a tutto quadrato, manubrio ridotto a circa il 60% e centrato, così resta dentro la zona sicura dell'80% richiesta per le icone maskable). PNG generati una tantum con uno strumento usato solo per la conversione e non aggiunto a `package.json` (per esempio `npx` di un convertitore SVG→PNG, eseguito dalla cartella scratch): `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` (180, fondo pieno). I PNG si salvano nel repository.
**Alternativa**: icone SVG nel manifest — scartata: Android usa le PNG per l'icona installata e il supporto SVG nel manifest non è affidabile.

### 4. `useInstallPrompt`: cattura precoce di `beforeinstallprompt`
Chrome emette `beforeinstallprompt` una sola volta, spesso subito dopo il caricamento, prima che l'utente apra il Profilo. Per questo `src/features/install/useInstallPrompt.ts` registra i listener a livello di modulo (importato in `main.tsx` per effetto collaterale): su `beforeinstallprompt` chiama `preventDefault()` e conserva l'evento; su `appinstalled` lo scarta. Il hook espone `{ canInstall, install }` tramite `useSyncExternalStore`. `canInstall` è `false` se `matchMedia('(display-mode: standalone)')` è vero. `install()` chiama `prompt()`, attende `userChoice` e poi scarta l'evento, che non è riutilizzabile, sia in caso di accettazione sia di rifiuto. Il tipo `BeforeInstallPromptEvent` non è in `lib.dom` e si dichiara localmente.
Nel Profilo il pulsante "Installa app" (secondary, icona `upload` già esistente o una nuova icona `download`, a tutta larghezza) sta prima di "Esci" e compare solo se `canInstall`.

### 5. Accesso Google in modalità installata
Si prova prima l'app installata con `signInWithPopup` invariato. Su Android il popup apre una scheda del browser (Custom Tab) e di solito l'accesso funziona. Se sul telefono non funziona, cioè il popup non torna o resta bloccato:
- in modalità `standalone` si usa `signInWithRedirect` e, al ritorno, si gestisce `getRedirectResult`;
- perché il redirect funzioni con il partizionamento dello storage di Chrome, `authDomain` deve coincidere con il dominio dell'app (`<progetto>.web.app` invece di `<progetto>.firebaseapp.com`), aggiungendo `https://<progetto>.web.app/__/auth/handler` agli URI di reindirizzamento autorizzati del client OAuth.
Questo ripiego tocca la configurazione Firebase/Google Cloud e va fatto con l'utente: se serve, si aggiunge come task durante l'implementazione.

### 6. Contesto di progetto
In `openspec/config.yaml` la riga "Online-only, … No PWA/offline in this version." diventa "Online-only, responsive web (mobile + desktop), installable as a PWA on Android (manifest only, no service worker cache, no offline)." Il resto dei vincoli (Spark, niente Cloud Functions) resta invariato finché la change della notifica non deciderà diversamente.

## Risks / Trade-offs

- **[Rischio]** Accesso Google nell'app installata → **Mitigazione**: prova sul telefono; ripiego del punto 5.
- **[Rischio]** Installazione non proposta senza service worker su una versione specifica di Chrome → **Mitigazione**: ripiego del punto 2, che non introduce cache.
- **[Rischio]** L'installabilità si verifica solo in HTTPS o su `localhost` → **Mitigazione**: controllo del manifest con DevTools su `npm run preview` (localhost), prova reale sul canale di anteprima di Firebase Hosting della PR.
- **[Trade-off]** Senza rete l'app installata non si apre: è la scelta "nessun offline" dell'utente.
- **[Trade-off]** La notifica di fine recupero in background non migliora con questa change: a schermo bloccato servirà il push da server (piano Blaze), da decidere nella change successiva.

## Migration Plan

Solo file statici e frontend: nessuna migrazione dati. Deploy con il merge su `main`. Rollback = revert. Un'app già installata resta sulla Home ma si comporta come un collegamento al sito, finché l'utente non la rimuove.
