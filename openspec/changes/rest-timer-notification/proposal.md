## Why

Il timer di recupero avvisa solo con suono e vibrazione quando l'app è aperta in primo piano. Se tra una serie e l'altra si passa a un'altra app o si spegne lo schermo, a fine recupero non succede nulla finché non si riapre l'app. Una notifica di sistema "Recupero finito" risolve il caso, e si può fare senza server: l'app, installata come PWA, la mostra da sé tramite un service worker.

## What Changes

- **Notifica di fine recupero**: quando il countdown arriva a zero e l'app non è in primo piano, il sistema mostra una notifica "Recupero finito" con il nome dell'esercizio, con vibrazione. Toccandola si riapre l'app sulla sessione. Con l'app in primo piano non compare nulla di nuovo: bastano suono e vibrazione già esistenti.
- **Attivazione dal Profilo**: un interruttore "Notifiche di fine recupero", spento di default, che alla prima attivazione chiede il permesso del browser. Se il permesso è negato l'interruttore resta spento con un messaggio che spiega come riattivarlo. La scelta vale per il dispositivo.
- **Service worker minimo**: un `sw.js` senza cache e senza gestione delle richieste di rete, usato solo per mostrare la notifica (su Android Chrome una notifica si può mostrare solo tramite service worker) e per riaprire l'app al tocco. L'app resta online-only, come stabilito in `app-installation`.
- **Avviso programmato a livello di sessione**: la scadenza del recupero è tenuta nel contesto della sessione (esiste già come `deadline`), quindi la notifica parte anche se nel frattempo si è cambiata sezione dell'app.
- **Limite dichiarato**: senza server la notifica è "al meglio": parte se il browser tiene attiva la pagina. Con lo schermo spento per tutta la durata del recupero Android può sospenderla (specialmente con il risparmio energetico) e l'avviso arriva solo alla riapertura, con suono e vibrazione come oggi. Con recuperi tipici di 60-180 secondi in movimento dovrebbe funzionare nella maggior parte dei casi; si verifica sul telefono.
- Nessuna modifica a dati, regole Firestore, calcolo del timer, suono e vibrazione in primo piano.

## Capabilities

### New Capabilities
Nessuna.

### Modified Capabilities
- `rest-timer`: nuovi requisiti per la notifica di sistema a fine recupero e per la sua attivazione dal Profilo.

## Impact

- **File nuovi**: `public/sw.js`, `src/features/rest-timer/restNotifications.ts` (supporto, permesso, preferenza, mostra notifica), `src/features/rest-timer/useRestNotification.ts` (programmazione a livello di sessione) e il componente dell'interruttore nel Profilo.
- **File modificati**: `src/main.tsx` (registrazione del service worker, solo in produzione), `src/features/session/SessionContext.tsx` (avvia la programmazione), `src/features/profile/ProfilePage.tsx` (interruttore), `firebase.json` (intestazione `no-cache` per `sw.js`), eventualmente `Icon.tsx` (icona campanella).
- **Dati**: nessuna modifica a Firestore. La preferenza sta in `localStorage` del dispositivo.
- **Piano Firebase**: resta Spark; nessuna Cloud Function.
- **Dipendenze tra change**: richiede `installable-pwa` (app installata, manifest) e va archiviata dopo di essa. Non modifica requisiti di `app-installation`.
- **Fuori scope**: notifiche push da server (richiederebbero Cloud Functions e piano Blaze), iPhone, notifiche per eventi diversi dal fine recupero, suono personalizzato della notifica, funzionamento offline.
- **Assunzioni**: interruttore spento di default e nel Profilo (non una richiesta di permesso automatica), preferenza per dispositivo.
