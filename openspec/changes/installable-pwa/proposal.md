## Why

Oggi l'app si apre solo dal browser: in palestra bisogna cercare la scheda o il segnalibro, e l'interfaccia perde spazio sotto la barra degli indirizzi. Renderla una PWA installabile permette di aprirla con un tocco dalla schermata Home di Android, a tutto schermo, come un'app nativa. È anche il primo passo verso la notifica di fine recupero in background, che verrà affrontata in una change successiva.

## What Changes

- **App installabile su Android (Chrome)**: manifest web con nome, nome breve, colori del tema nero/verde, apertura a tutto schermo (`standalone`) e orientamento verticale; icone PNG 192 e 512 px, più una versione "maskable" per le icone adattive di Android, derivate dal manubrio verde di `favicon.svg`.
- **Collegamento nel documento HTML**: link al manifest e all'icona per iOS (`apple-touch-icon`) in `index.html`; il `theme-color` esistente resta.
- **Pulsante "Installa app" nel Profilo**: compare solo quando il browser offre l'installazione e l'app non è già installata; toccandolo si apre la richiesta di installazione del browser. Dopo l'installazione, o se l'app è già aperta come app installata, il pulsante non c'è.
- **Accesso con Google nell'app installata**: l'accesso deve funzionare anche avviando l'app dall'icona; se il popup non funziona in modalità installata, si passa al redirect solo in quella modalità.
- **Nessun funzionamento offline**: niente cache dei file dell'app e nessun service worker in questa change. Senza rete l'app installata mostra l'errore del browser, come oggi.
- **Aggiornamento del contesto di progetto**: `openspec/config.yaml` dice "No PWA/offline in this version". Va aggiornato in "PWA installabile, online-only (nessun offline)".
- Nessuna modifica a dati, regole Firestore, timer di recupero o sessioni.

## Capabilities

### New Capabilities
- `app-installation`: installabilità dell'app come PWA (manifest, icone, apertura a tutto schermo), invito all'installazione dal Profilo e accesso funzionante dall'app installata.

### Modified Capabilities
Nessuna. La notifica di fine recupero (`rest-timer`) resta invariata in questa change.

## Impact

- **File nuovi**: `public/manifest.webmanifest`, icone in `public/icons/` (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`), `src/features/install/useInstallPrompt.ts`.
- **File modificati**: `index.html` (link al manifest e all'icona iOS), `src/features/profile/ProfilePage.tsx` (pulsante "Installa app"), eventualmente `src/features/auth/AuthContext.tsx` (redirect in modalità installata), `openspec/config.yaml` (contesto di progetto).
- **Dipendenze**: nessuna dipendenza di runtime. Le icone PNG si generano una volta dall'SVG e si salvano nel repository.
- **Hosting**: Firebase Hosting serve già in HTTPS, requisito per installare una PWA; nessuna modifica a `firebase.json`.
- **Piano Firebase**: resta Spark.
- **Rischio principale**: l'accesso Google con `signInWithPopup` dentro l'app installata. Va provato sul telefono, con il redirect come ripiego.
- **Fuori scope**: notifica di fine recupero in background (change successiva, che richiederà un service worker e una scelta sul piano Firebase), funzionamento offline, supporto specifico per iPhone, scorciatoie e schermate dello store nel manifest.
