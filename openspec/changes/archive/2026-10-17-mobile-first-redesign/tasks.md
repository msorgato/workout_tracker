## 1. Fondamenta: token, font, meta

- [x] 1.1 Installare `@fontsource/barlow-condensed` e `@fontsource-variable/inter`, importare solo pesi/subset usati in `src/main.tsx`; verificare con `npm run build` che i `.woff2` siano in `dist/assets` e che nessun URL esterno compaia nel bundle
- [x] 1.2 Estendere `@theme` in `src/index.css` con `--font-display`, `--font-sans`, `--color-surface-raised`, `--radius-card`, `--shadow-glow`, animazioni `fade-up`/`pulse-dot` e override `prefers-reduced-motion` (design §3–4), lasciando invariati i colori esistenti; verificare con build e con DevTools (emulazione reduced-motion) che le animazioni si disattivino
- [x] 1.3 Aggiornare `index.html` (`lang="it"`, `viewport-fit=cover`, `theme-color #0a0a0a`) e ridisegnare `public/favicon.svg` con il verde di accento; verificare a vista nella tab del browser e nella barra di Chrome Android (emulazione)

## 2. Primitive UI condivise

- [x] 2.1 Creare `src/components/ui/Icon.tsx` con le icone SVG necessarie (dumbbell, play, timer, history, list, plus, pencil, trash, upload, log-out, chevron-left, check, minus, x, flame) e nome tipizzato; verificare con `tsc -b` che un nome inesistente dia errore
- [x] 2.2 Creare `Button` (varianti primary/secondary/ghost/danger, taglie md/lg, `icon`, `fullWidth`, press feedback, min-height 44px) e `IconButton` con `label` obbligatorio → `aria-label`; verificare con `npm run lint` e `tsc -b`
- [x] 2.3 Creare `Card`, `PageHeader` (titolo display, slot azioni, sticky + safe-area top) ed `EmptyState` (icona, messaggio, azione opzionale); verificare con build
- [x] 2.4 Creare `src/lib/numberInput.ts` (`parseDecimal`, `stepValue`) con test Vitest in `tests/numberInput.test.ts` (virgola/punto, stringa vuota, clamp a 0, 40 + 2,5 = 42,5) e aggiungerlo allo script `test:unit`; verificare con `npm run test:unit`
- [x] 2.5 Creare `Stepper` controllato su stringa (−/+ 44px, input `inputMode` decimal/numeric, valore in font display) basato su `numberInput`; verificare con build

## 3. Shell e navigazione

- [x] 3.1 Creare `TabBar` (tre voci icona+etichetta, voce attiva in accento, `fixed` bottom centrata `max-w-md`, blur, safe-area bottom, pallino pulsante su Sessione se `useSession().session` esiste e la route non è `/session`); verificare a 375px che tutte le voci siano toccabili e l'indicatore compaia solo con sessione attiva
- [x] 3.2 Riscrivere la shell in `src/App.tsx`: rimuovere `NavBar`, colonna `max-w-md mx-auto`, `main` con padding inferiore = tab bar + safe area + `--dock-h`; logout spostato nei `PageHeader`; verificare a 375px che l'ultimo elemento di una lista lunga non sia coperto e a 1440px che il layout resti in colonna centrata
- [x] 3.3 Restyling di `LoginPage` (wordmark display grande con accento verde, sfondo con alone verde, CTA Google `lg` a tutta larghezza, errore leggibile) e dello stato di caricamento in `RouteGuard`; verificare a vista da logout

## 4. Routine

- [x] 4.1 `RoutinesPage`: `PageHeader` "Routine" con "Nuova routine" primaria e logout; "Sessione libera" e "Importa CSV" come azioni secondarie con icona; verificare che tutte le azioni funzionino come prima
- [x] 4.2 `RoutineList`: card con nome display, conteggio e anteprima primi 3 esercizi, CTA "Avvia" con glow, modifica/elimina come `IconButton`, conferma eliminazione inline a due tocchi, `EmptyState` per lista vuota, animazione `fade-up`; verificare avvio, modifica, elimina (con conferma) e stato vuoto
- [x] 4.3 `RoutineForm`, `RoutineCsvImport`, `ExerciseAutocomplete`: campi a tutta larghezza, righe esercizio come card impilate con campi numerici in griglia 2×2 (`inputMode` numerico), azioni riordino/rimozione come `IconButton`, bottoni Salva/Annulla `lg`; verificare creazione, modifica e import CSV da telefono (emulazione 375px) e `npm run test:unit`

## 5. Sessione attiva e timer

- [x] 5.1 `ActiveSessionPage`: `PageHeader` con nome sessione e "Termina", card esercizio con serie come righe (numero, kg, reps; ultima evidenziata), due `Stepper` per peso (passo 2,5) e reps (passo 1), recupero modificabile compatto, CTA "Serie N completata" a tutta larghezza; `handleCompleteSet` usa `parseDecimal`; `EmptyState` senza sessione con azione "Sessione libera" e link alle routine; verificare registrazione di serie con valori decimali con virgola (es. 57,5) e che la precompilazione del peso target resti attiva
- [x] 5.2 `RestTimer`: nuovo markup con anello di progresso SVG, secondi in font display, nome esercizio, "Salta", glow — senza modificare logica di deadline, suono, vibrazione e `visibilitychange`; verificare con un recupero di 10s che l'anello avanzi, suono/vibrazione partano a fine countdown e "Salta" chiuda il timer
- [x] 5.3 Ancorare il timer: renderizzarlo una sola volta fuori dalla lista in un contenitore `fixed` sopra la tab bar e impostare `--dock-h` mentre è visibile; verificare a 375px che durante il recupero lo scroll non nasconda il timer e che, a timer chiuso, il contenuto torni completamente visibile

## 6. Storico

- [x] 6.1 Creare `src/features/history/sessionSummary.ts` (`summarizeSession`, `groupSessionsByDay`) con test Vitest in `tests/sessionSummary.test.ts` (esempio della spec: 52 min, 2 esercizi, 5 serie, 2.280 kg; sessione senza `endedAt`; due sessioni stesso giorno + una del giorno prima) e aggiungerlo a `test:unit`; verificare con `npm run test:unit`
- [x] 6.2 `HistoryPage`: `PageHeader` "Storico", gruppi per giorno con intestazione ("Oggi"/"Ieri"/data), card con durata/esercizi/serie/volume in font display, `EmptyState`; verificare a vista con dati reali
- [x] 6.3 `SessionDetail`: header con indietro (`IconButton`), statistiche riassuntive in alto, esercizi come card con righe serie leggibili; verificare navigazione storico → dettaglio → indietro

## 7. Verifica d'insieme

- [x] 7.1 Cercare residui di classi di stile ad hoc duplicate o pulsanti senza primitive (`grep -rn "rounded-md bg-accent" src`) e target < 44px; verificare che `npm run build`, `npm run lint`, `npm run format:check` e `npm run test:unit` passino
- [ ] 7.2 Verifica manuale end-to-end a 375px (emulazione iPhone) e 1440px: login → crea routine → avvia sessione → registra serie con stepper → recupero ancorato → cambia tab e controlla indicatore sessione → termina → storico con riepilogo; controllare anche con "riduci movimento" attivo
- [ ] 7.3 Verifica su telefono reale tramite il preview channel della PR (tab bar sopra l'home indicator, tastiera numerica sui campi peso/reps, comportamento di tab bar/timer con tastiera aperta — applicare la mitigazione `:has(input:focus)` del design se necessario)

## Workflow follow-up

- Archiviare `dark-green-theme` prima di questa change (i requisiti `ui-theme` qui aggiunti presuppongono quelli della palette).
- Archiviare la change dopo merge e verifica sul deploy di produzione.
