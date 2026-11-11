## 1. Manifest e icone

- [x] 1.1 Creare le sorgenti `public/icons/icon.svg` e `public/icons/icon-maskable.svg` (fondo nero pieno, manubrio entro la zona sicura dell'80%) partendo da `public/favicon.svg`, e generare una tantum `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` e `apple-touch-icon.png` (180) con un convertitore eseguito dalla cartella scratch, senza aggiungerlo a `package.json`; verificare a occhio le PNG e la maskable con una maschera circolare
- [x] 1.2 Creare `public/manifest.webmanifest` (id, name, short_name, lang, start_url, scope, display standalone, orientation portrait, colori `#0a0a0a`, icone any e maskable) e aggiungere in `index.html` i link al manifest e all'`apple-touch-icon`; verificare con `npm run build` che i file finiscano in `dist/` e, con `npm run preview`, che DevTools → Application → Manifest non mostri errori né avvisi di installabilità

## 2. Invito all'installazione

- [x] 2.1 Creare `src/features/install/useInstallPrompt.ts`: listener a livello di modulo per `beforeinstallprompt` (con `preventDefault` e conservazione dell'evento) e `appinstalled`, rilevazione di `display-mode: standalone`, hook con `useSyncExternalStore` che espone `{ canInstall, install }`, tipo `BeforeInstallPromptEvent` dichiarato localmente; importarlo in `main.tsx` per registrare i listener all'avvio; verificare con `npx tsc -b` e `npm run lint`
- [x] 2.2 Aggiungere a `ProfilePage` il pulsante "Installa app" (secondary, a tutta larghezza, prima di "Esci") visibile solo con `canInstall`; verificare con `npx tsc -b` e, su `npm run preview` in Chrome desktop, che il pulsante compaia, apra la richiesta del browser e sparisca dopo l'installazione o il rifiuto

## 3. Contesto di progetto

- [x] 3.1 Aggiornare in `openspec/config.yaml` la riga "Online-only, … No PWA/offline in this version." con "installabile come PWA su Android (solo manifest, nessuna cache del service worker, nessun offline)", lasciando invariati gli altri vincoli

## 4. Verifica

- [x] 4.1 Verificare che `npm run build`, `npm run lint` e `npm run test:unit` passino e che le modifiche siano limitate a `public/`, `index.html`, `src/features/install/`, `src/main.tsx`, `ProfilePage.tsx` e `openspec/config.yaml`
- [ ] 4.2 Prova sul telefono Android con il deploy di anteprima della PR (HTTPS): installazione dal pulsante del Profilo e dal menu di Chrome, icona adattiva senza bordi bianchi, avvio a tutto schermo su Routine con header e tab bar visibili, accesso Google dall'app installata (se non funziona: applicare il ripiego del design, punto 5, insieme all'utente), riapertura ancora autenticati, nuovo rilascio visibile alla riapertura senza reinstallare
