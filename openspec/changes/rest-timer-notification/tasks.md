## 1. Service worker

- [x] 1.1 Creare `public/sw.js` (solo `install` con `skipWaiting`, `activate` con `clients.claim` e `notificationclick` che porta in primo piano una finestra dell'app navigandola a `/session`, oppure apre `/session`; niente `fetch` né cache), registrarlo in `src/main.tsx` solo in produzione e con `serviceWorker` disponibile, e aggiungere in `firebase.json` l'intestazione `Cache-Control: no-cache` per `/sw.js`; verificare con `npm run build` (il file finisce in `dist/`) e con `npx tsc -b`

## 2. Logica delle notifiche

- [x] 2.1 Creare `src/features/rest-timer/restNotifications.ts`: `notificationsSupported`, `isEnabled` (preferenza in `localStorage` con try/catch e permesso `granted`), `enable` (esiti `enabled`/`denied`/`blocked`, preferenza salvata solo se concesso), `disable`, `showRestFinished` (tramite `registration.showNotification` con tag `rest-timer`, `renotify`, vibrazione e icona) e la funzione pura `shouldNotify` con test in `tests/restNotifications.test.ts` (aggiunto a `test:unit`: app visibile → no; nascosta e scadenza raggiunta → sì; preferenza spenta → no; scadenza futura → no); verificare con `npm run test:unit` (da `C:\`) e `npx tsc -b`
- [x] 2.2 Creare `src/features/rest-timer/useRestNotification.ts` e montarlo in `SessionProvider`: programma un timeout alla `deadline` di `restFor` e mostra la notifica solo se la pagina è nascosta e la scadenza è appena trascorsa (stessa verifica anche alla pulizia dell'effetto, se `restFor` è stato azzerato per scadenza); Salta, fine sessione e nuovo recupero non notificano; verificare con `npx tsc -b` e `npm run lint`

## 3. Interruttore nel Profilo

- [x] 3.1 Creare `RestNotificationsToggle` (switch `role="switch"` ≥ 44px, etichetta e spiegazione, messaggi per permesso negato o bloccato, nascosto se non supportato), aggiungere l'icona `bell` a `Icon.tsx` se serve e inserirlo in `ProfilePage` prima di "Installa app"; verificare con `npx tsc -b`, `npm run lint` e `npm run build`

## 4. Verifica

- [x] 4.1 Verificare che `npm run build`, `npm run lint` e `npm run test:unit` passino (dal percorso `C:\`) e che le modifiche siano limitate a `public/sw.js`, `firebase.json`, `src/main.tsx`, ai file di `rest-timer`, `SessionContext.tsx`, `ProfilePage.tsx`, `Icon.tsx`, `package.json` e ai test
- [ ] 4.2 Prova sul telefono Android con l'app installata, dopo il deploy: attivare l'interruttore (richiesta del permesso), poi con recuperi da 60, 90 e 180 secondi provare app in secondo piano con schermo acceso, schermo spento con e senza risparmio energetico, cambio di sezione prima di uscire dall'app, "Salta" e fine sessione (nessuna notifica), tocco sulla notifica (si riapre su Sessione), permesso negato e poi riattivato dalle impostazioni del sito; annotare per ogni caso se la notifica è arrivata
