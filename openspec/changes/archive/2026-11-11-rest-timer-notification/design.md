## Context

Motivazione in proposal.md, requisiti in specs/. Stato osservato:

- `RestTimer` (montato solo dalla pagina Sessione) calcola il tempo da una `deadline` assoluta; alla scadenza, o al rientro in primo piano (`visibilitychange`), riproduce un suono e fa vibrare, poi chiama `onFinish`. Se alla creazione la scadenza è già passata si chiude in silenzio.
- La scadenza vive in `useSessionDraft` (`restFor: { exerciseIndex, seconds, deadline }`), esposta da `SessionContext` e quindi disponibile anche quando la pagina Sessione è smontata. `restFor` si azzera con "Salta", a scadenza (via `onFinish`) e alla fine della sessione.
- Non c'è un service worker. Con `installable-pwa` l'app è installabile come PWA senza service worker; la sua spec dice che l'app resta online-only e senza cache.
- Su Chrome per Android `new Notification()` non è disponibile: le notifiche si mostrano con `ServiceWorkerRegistration.showNotification()`. Le Notification Triggers (notifiche programmate nel futuro dal browser) non esistono più in Chrome: la notifica deve essere emessa da JavaScript al momento della scadenza, quindi solo se la pagina è ancora viva.
- Hosting Firebase serve `dist/` con regole di cache predefinite.

## Goals / Non-Goals

**Goals:**
- Notifica "Recupero finito" con app in secondo piano, senza server né piano Blaze.
- Programmazione indipendente dalla pagina Sessione, così funziona anche dopo un cambio di sezione.
- Nessuna cache di file: l'app resta online-only.

**Non-Goals:**
- Garantire la consegna con schermo spento e pagina sospesa dal sistema (impossibile senza push da server).
- Push da server, iPhone, altre notifiche, offline.

## Decisions

### 1. Service worker minimo, senza cache e senza `fetch`
`public/sw.js` con tre soli gestori: `install` (`skipWaiting`), `activate` (`clients.claim`) e `notificationclick` (chiude la notifica, cerca una finestra dell'app con `clients.matchAll({ type: 'window', includeUncontrolled: true })`, la porta in primo piano con `focus()` e le invia `postMessage({ type: 'navigate', url: '/session' })`, che `App.tsx` traduce in una navigazione interna senza ricaricare la pagina e quindi senza perdere lo stato della sessione; se non c'è nessuna finestra, `clients.openWindow('/session')`). Niente gestore `fetch` né `caches`, quindi nessun file viene mai servito dalla cache e ogni nuovo rilascio è visibile alla successiva apertura. Registrato in `main.tsx` solo se `import.meta.env.PROD` e `'serviceWorker' in navigator`, dopo il `load`. In `firebase.json` si aggiunge per `/sw.js` l'intestazione `Cache-Control: no-cache`, così gli aggiornamenti del service worker arrivano subito.
**Alternativa**: `vite-plugin-pwa` — scartata come per `installable-pwa`: genera precache e cicli di aggiornamento che non servono.

### 2. Supporto, permesso e preferenza in `restNotifications.ts`
Funzioni pure o quasi: `notificationsSupported()` (`'serviceWorker' in navigator && 'Notification' in window`), `getPermission()`, `isEnabled()` (preferenza in `localStorage` chiave `restNotificationsEnabled` **e** permesso `granted`: se il permesso è stato revocato la preferenza è ignorata e risulta spenta), `enable(): Promise<'enabled' | 'denied' | 'blocked'>` (se il permesso è `denied` restituisce `'blocked'` senza chiedere; altrimenti chiama `Notification.requestPermission()` e salva la preferenza solo se `granted`), `disable()`, `showRestFinished(exerciseName)` (usa `navigator.serviceWorker.ready` e `registration.showNotification('Recupero finito', { body: exerciseName, tag: 'rest-timer', renotify: true, vibrate: [300, 100, 300], icon: '/icons/icon-192.png', badge: '/icons/icon-192.png' })`). Ogni accesso a `localStorage` è protetto con try/catch (può lanciare in finestre private); senza storage la preferenza vale solo per la sessione di navigazione. La parte di logica testabile (decidere se mostrare la notifica) sta in una funzione pura `shouldNotify({ enabled, visibility, now, deadline })` coperta da test.

### 3. Programmazione a livello di sessione: `useRestNotification`
Hook chiamato da `SessionProvider` (dove già vive `restFor`) con la `deadline` e il nome dell'esercizio in recupero. Se le notifiche sono attive e c'è una `deadline`, programma un `setTimeout` alla scadenza. Alla scadenza, se `document.visibilityState === 'hidden'` e la scadenza è appena trascorsa (`shouldNotify`), chiama `showRestFinished(nome esercizio)`; se l'app è visibile non fa nulla (bastano suono e vibrazione di `RestTimer`). La cleanup dell'effetto cancella il timeout: "Salta", fine sessione o un nuovo recupero (altra `deadline`) annullano la programmazione, così non esiste una notifica per un recupero non più valido. Se invece il timer della pagina azzera `restFor` per scadenza un istante prima del nostro timeout (può succedere in background), la cleanup, trovando la scadenza già raggiunta, esegue la stessa verifica e notifica: nessun recupero scaduto va perso e nessuno viene notificato due volte (c'è anche il tag fisso `rest-timer` con `renotify`). Una pagina sospesa e ripresa dopo la scadenza è visibile al momento in cui il timeout scatta, quindi non genera notifiche in ritardo; `RestTimer`, se montato, gestisce suono e vibrazione al rientro.
**Alternativa**: programmare nel `RestTimer` — scartata: si smonta cambiando sezione e la notifica andrebbe persa. **Alternativa**: far contare il service worker — scartata: il browser lo termina dopo pochi secondi di inattività, quindi non è più affidabile del timer della pagina.

### 4. Interruttore nel Profilo
Componente `RestNotificationsToggle` (switch accessibile `role="switch"` con `aria-checked`, area ≥ 44px, etichetta "Notifiche di fine recupero" e riga di spiegazione) in `ProfilePage`, in una `Card` sopra "Installa app". Non è mostrato se `!notificationsSupported()`. Al tocco in accensione chiama `enable()` e mostra il messaggio d'errore corrispondente ("Notifiche non autorizzate" / "Notifiche bloccate: riattivale dalle impostazioni del sito"); al tocco in spegnimento chiama `disable()`. Lo stato iniziale legge `isEnabled()`.

### 5. Verifica a mano
Non si può simulare lo spegnimento dello schermo in un test: la prova sul telefono verifica recuperi da 60, 90 e 180 secondi con app in secondo piano e schermo acceso, schermo spento e risparmio energetico attivo/disattivo; il risultato si riporta in 4.x e, se la consegna con schermo spento risultasse insufficiente, si valuta la push da server in una change successiva.

## Risks / Trade-offs

- **[Rischio]** Con schermo spento Android può congelare la pagina e la notifica non parte → **Mitigazione**: limite dichiarato nella proposta; l'avviso arriva comunque alla riapertura; prova sul telefono per misurarne l'affidabilità.
- **[Rischio]** Il permesso di notifica può essere bloccato automaticamente da Chrome se richiesto senza gesto dell'utente → **Mitigazione**: la richiesta parte solo dal tocco sull'interruttore.
- **[Rischio]** Un service worker difettoso può servire pagine vecchie → **Mitigazione**: nessuna cache e nessun `fetch`; `no-cache` su `sw.js`.
- **[Trade-off]** La preferenza è per dispositivo e non segue l'utente su altri telefoni: scelta per semplicità e perché il permesso è comunque per dispositivo.
- **[Trade-off]** Nessuna notifica con l'app in primo piano: evita duplicati con suono e vibrazione.

## Migration Plan

Solo frontend e un file statico; nessuna migrazione. Il service worker si installa al primo caricamento dopo il deploy. Rollback = revert; un service worker già registrato resta ma senza gestori di rete non altera il comportamento (si può rimuovere con una versione di `sw.js` che si auto-deregistra se serve).
