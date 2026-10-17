## Why

Il reskin `dark-green-theme` ha sistemato i colori, ma l'app resta visivamente scarna: liste di card piatte e uguali tra loro, navigazione testuale in alto pensata per desktop, nessuna icona, nessuna gerarchia tipografica, pulsanti piccoli e input minuscoli nella schermata di sessione, che è proprio quella usata in palestra con il telefono in mano. L'obiettivo è un'interfaccia mobile-first, d'impatto e "da app sportiva", mantenendo la palette nero + verde brillante.

## What Changes

- **Shell mobile-first**: la barra di navigazione testuale in alto viene sostituita da una **tab bar fissa in basso** con icone (Routine, Sessione, Storico), rispetto delle safe-area iOS/Android, e un header compatto per pagina con titolo grande. Il logout si sposta nell'header. Su desktop l'app resta centrata in una colonna stretta (stile app).
- **Identità visiva più forte** (stessa palette): font display condensato per titoli e numeri, gerarchia tipografica chiara, icone SVG coerenti, card con angoli più arrotondati e leggera profondità, accento verde usato anche come "glow"/gradiente su elementi chiave (CTA principale, timer, sessione attiva), micro-animazioni (press feedback, comparsa elementi) che rispettano `prefers-reduced-motion`.
- **Schermata Routine**: card routine più ricche (numero esercizi, anteprima nomi esercizi), CTA "Avvia" grande e immediata, azioni secondarie (modifica/elimina) raccolte senza affollare la card, pulsante flottante/prominente per "Nuova routine", stati vuoti illustrati.
- **Schermata Sessione** (focus d'uso in palestra): card esercizio con serie mostrate come righe/chip leggibili, **stepper +/-** grandi per peso e ripetizioni oltre all'input numerico, pulsante "Serie completata" a tutta larghezza, **timer di recupero visibile in modo persistente** (ancorato sopra la tab bar) con indicatore di progresso circolare, banner/indicatore di "sessione in corso" visibile anche dalle altre tab.
- **Schermata Storico**: elenco raggruppato per data con card riassuntive (durata, esercizi, serie totali, volume) e dettaglio sessione più leggibile. I riassunti sono calcolati dai dati già presenti nella sessione, senza nuove letture né modifiche al modello dati.
- **Login**: schermata d'ingresso "hero" con logo/wordmark, sfondo con accento verde e CTA Google prominente.
- Form (routine, import CSV) adattati a mobile: campi a tutta larghezza, input numerici con tastiera numerica, target touch ≥ 44px.
- Favicon e `theme-color` allineati alla palette nero/verde (oggi il favicon è blu).

Nessun cambiamento a logica, modello dati, Firestore o regole di sicurezza: è un redesign di presentazione e layout.

## Capabilities

### New Capabilities
- `app-navigation`: struttura di navigazione dell'app (tab bar inferiore, header di pagina, indicatore di sessione in corso, accesso al logout), con comportamento mobile-first e adattamento desktop.

### Modified Capabilities
- `ui-theme`: aggiunta di requisiti sull'identità visiva oltre alla palette (tipografia display, iconografia, profondità/glow, animazioni con `prefers-reduced-motion`, stati vuoti, target touch minimi). La palette nero/verde e le regole sull'accento unico e sul colore di pericolo restano invariate. (Capability introdotta dalla change `dark-green-theme`, non ancora archiviata: qui solo requisiti aggiunti.)
- `workout-session`: aggiunta di requisiti di ergonomia della schermata di sessione (stepper peso/reps, CTA serie a tutta larghezza, serie registrate leggibili). La logica di registrazione serie non cambia.
- `rest-timer`: aggiunta di requisiti di presentazione (timer ancorato e sempre visibile durante il recupero, indicatore di progresso). Countdown, suono, vibrazione e "Salta" restano invariati.
- `session-history`: aggiunta di un riepilogo per sessione nell'elenco (durata, esercizi, serie, volume) e raggruppamento per giorno, calcolati dai dati già letti.

Nota: `ui-theme`, `workout-session`, `rest-timer` e `session-history` sono definite in change non ancora archiviate (`openspec/specs/` è vuota): i delta usano solo `ADDED` per non dipendere dall'ordine di archiviazione.

## Impact

- **Codice modificato**: `src/index.css` (token aggiuntivi: font, raggi, ombre/glow, animazioni), `index.html` (viewport-fit, theme-color, font), `public/favicon.svg`, `src/App.tsx` (nuova shell), tutti i componenti di presentazione in `src/features/**` e `src/components/`. Nuovi componenti UI condivisi in `src/components/ui/` (es. `Button`, `Card`, `Icon`, `Stepper`, `PageHeader`, `TabBar`, `EmptyState`).
- **Dipendenze**: un font self-hosted via pacchetto `@fontsource` (bundlato nel build, servito da Firebase Hosting, nessuna richiesta a CDN esterni). Icone come SVG inline nel codice, nessuna libreria aggiuntiva.
- **Costi/piano Spark**: impatto nullo su Firestore; aumento trascurabile del bundle (font woff2 ~20–40 KB per peso).
- **Fuori scope**: tema chiaro/toggle, PWA/installabilità, grafici o statistiche oltre ai semplici totali per sessione, gesture complesse (swipe-to-delete), riordino drag & drop.
