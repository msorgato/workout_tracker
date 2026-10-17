## Context

Motivazione in proposal.md. Stato attuale rilevante:

- Tailwind v4 CSS-first: i token colore vivono nel blocco `@theme` di `src/index.css` (introdotti da `dark-green-theme`). Nessun componente UI condiviso: ogni file ripete stringhe di classi per pulsanti, card e input (es. `rounded-md bg-accent px-3 py-1.5 text-xs …` compare in 6+ punti).
- Shell in `src/App.tsx`: `NavBar` testuale in alto, `main` con `max-w-2xl`. `SessionContext` espone già `session` (attiva o `null`) a tutta l'app → basta per l'indicatore di sessione in corso.
- `ActiveSessionPage` tiene `restFor` come stato locale e monta `RestTimer` dentro la card dell'esercizio; la logica del timer (deadline assoluta, `visibilitychange`, suono, vibrazione) è in `RestTimer.tsx` e non va toccata.
- Peso/reps sono `<input type="number">` piccoli (`w-20/w-24`, `py-1`), con valori tenuti in `weightInputs`/`repsInputs` come stringhe.
- Test esistenti: Vitest (`tests/csvImport.real.test.ts`, script `test:unit`), nessun test di componenti né setup DOM.
- Vincoli: piano Spark, nessun CDN esterno necessario, icone/asset bundlati nel build.

## Goals / Non-Goals

**Goals:**
- Un piccolo kit di primitive UI riutilizzabili che incapsula lo stile, così che le pagine compongano componenti invece di ripetere classi.
- Estendere i token di `@theme` (font, raggi, ombre/glow, animazioni) senza cambiare i colori esistenti.
- Logica nuova (stepper, riepiloghi storico) isolata in funzioni pure testabili con Vitest.

**Non-Goals:**
- Nessuna libreria di componenti (shadcn, MUI, Headless UI) né libreria di animazioni (Framer Motion).
- Nessun test di rendering/visual regression: la verifica visiva è manuale a 375px e 1440px.
- Non si sposta lo stato del timer fuori da `ActiveSessionPage`: se l'utente cambia tab durante il recupero il timer si smonta come oggi (comportamento invariato, fuori scope).

## Decisions

### 1. Primitive UI in `src/components/ui/`
`Button` (varianti `primary | secondary | ghost | danger`, taglie `md | lg`, prop `icon`, `fullWidth`), `IconButton` (richiede `label` → `aria-label`), `Card`, `PageHeader`, `TabBar`, `EmptyState`, `Stepper`, `Icon`. Varianti via mappa oggetto → stringa di classi, niente `clsx`/`cva` (dipendenza evitabile per ~8 componenti).
**Alternativa**: classi `@apply` in CSS (`.btn-primary`) — scartata: Tailwind v4 scoraggia `@apply` estensivo e i componenti React danno anche tipizzazione e accessibilità (es. `aria-label` obbligatorio).

### 2. Icone SVG inline in un solo modulo
`Icon.tsx` contiene ~15 path stile Lucide (stroke 2, 24×24, `currentColor`), copiati come markup (licenza ISC). Selezione via `name` tipizzato.
**Alternativa**: `lucide-react` — valida e tree-shakeable, ma per ~15 icone una dipendenza in più non serve; si può migrare in futuro senza cambiare le call site.

### 3. Tipografia: Barlow Condensed (display) + Inter (testo) via `@fontsource`
`@fontsource/barlow-condensed` (pesi 600/700) e `@fontsource-variable/inter` importati in `main.tsx`; i woff2 finiscono nel bundle Vite e sono serviti da Firebase Hosting (spec: nessun CDN esterno). Token `--font-display` / `--font-sans` in `@theme` → utility `font-display`. Numeri con `tabular-nums`.
**Alternative**: Google Fonts via `<link>` — scartata (terze parti, richiesta extra); font di sistema — scartata, non dà il carattere "sportivo" richiesto.

### 4. Token aggiuntivi e glow
In `@theme`: `--radius-card: 1.25rem`, `--shadow-glow: 0 0 24px -4px color-mix(in oklab, var(--color-accent) 55%, transparent)`, `--color-surface-raised` (#1c1c1c) per card sovrapposte, gradiente accento (`from-accent to-accent-pressed`) per CTA hero. Glow riservato a: CTA primaria della vista, card sessione attiva, timer. Animazioni `@keyframes fade-up` e `pulse-dot` dichiarate in `@theme` (`--animate-*`) e neutralizzate con `@media (prefers-reduced-motion: reduce)`. Press feedback: `active:scale-[0.97] transition` sul `Button`, in `motion-reduce:` sostituito da cambio di tono.

### 5. Shell: header + contenuto scrollabile + tab bar `fixed`
`App.tsx`: colonna `max-w-md mx-auto`; `TabBar` `fixed bottom-0` centrata con la stessa larghezza, sfondo `bg/85` + `backdrop-blur`, `padding-bottom: env(safe-area-inset-bottom)`. `main` con `padding-bottom` = altezza tab bar + safe area (+ altezza timer quando presente, via variabile CSS `--dock-h` impostata dalla pagina sessione). `index.html`: `viewport-fit=cover`, `<meta name="theme-color" content="#0a0a0a">`, `lang="it"`. `PageHeader` per pagina (titolo display grande + slot azioni, logout come `IconButton`), `sticky top-0` con `padding-top: env(safe-area-inset-top)`.
Indicatore sessione: `TabBar` legge `useSession().session` e mostra un pallino verde pulsante sulla voce Sessione quando non è la route attiva.
**Alternativa**: tab bar solo sotto un breakpoint e sidebar su desktop — scartata: per un'app mono-utente da palestra la colonna "app-like" anche su desktop è più semplice e coerente (spec "Layout su schermi larghi").

### 6. Timer ancorato
`ActiveSessionPage` renderizza il `RestTimer` una sola volta fuori dalla lista, in un contenitore `fixed` sopra la tab bar (`bottom: calc(tabbar + safe-area)`), passandogli anche `exerciseName`. `RestTimer` mantiene tutta la logica attuale; cambia solo il markup: anello SVG (`stroke-dasharray` calcolato da `remaining / targetSeconds`), secondi in font display, pulsante "Salta". La `key` resta legata al conteggio serie per resettare il timer a ogni nuova serie.

### 7. Stepper e input numerici
`Stepper` controllato su stringa (compatibile con `weightInputs`/`repsInputs` esistenti): pulsanti −/+ 44px, input `type="text" inputMode="decimal"` (reps: `inputMode="numeric"`) per accettare la virgola italiana. Funzioni pure in `src/lib/numberInput.ts`: `parseDecimal("57,5") → 57.5`, `stepValue(value, step, min=0)` con arrotondamento a 2 decimali. `handleCompleteSet` usa `parseDecimal` al posto di `Number(...)` (oggi `Number("57,5")` darebbe `NaN`).
**Alternativa**: mantenere `type="number"` — scartata: comportamento della virgola incoerente tra browser/locale e frecce native minuscole.

### 8. Riepiloghi storico come funzioni pure
`src/features/history/sessionSummary.ts`: `summarizeSession(session) → { durationMinutes | null, exerciseCount, setCount, volumeKg }` e `groupSessionsByDay(sessions) → { dayKey, label, sessions }[]` (etichette "Oggi", "Ieri", altrimenti data estesa `it-IT`). Nessuna nuova query: lavorano sull'array già restituito da `listCompletedSessions`. Volume formattato con `toLocaleString('it-IT')`.

### 9. Routine card e azioni secondarie
Card routine: nome in display, "N esercizi", anteprima dei primi 3 nomi esercizio, CTA "Avvia" primaria con icona play. Modifica/elimina come `IconButton` ghost nell'angolo; la conferma di eliminazione resta a due tocchi (stato `pendingDeleteId` esistente) ma mostrata come riga inline di conferma nella card. "Nuova routine" diventa pulsante primario nell'header; "Sessione libera" e "Importa CSV" diventano azioni secondarie sotto l'header.

## Risks / Trade-offs

- **[Rischio]** `position: fixed` + tastiera virtuale su iOS può spostare tab bar/timer sopra la tastiera durante l'inserimento → **Mitigazione**: verifica su Safari iOS; se disturba, nascondere tab bar e timer quando un input ha il focus (`:has(input:focus)` sul contenitore).
- **[Rischio]** Il pacchetto font aumenta il bundle → **Mitigazione**: importare solo i pesi usati e il subset `latin`; peso atteso < 100 KB complessivi, irrilevante per la quota Hosting.
- **[Rischio]** `color-mix()` non supportato su browser molto vecchi → **Trade-off accettato**: degrada a nessun glow, palette intatta.
- **[Trade-off]** Il timer resta legato alla pagina sessione: cambiare tab durante il recupero lo interrompe (come oggi). Spostarlo in `SessionContext` è una change separata.
- **[Rischio]** Molti file toccati in un'unica change → **Mitigazione**: tasks ordinati per vista, build + verifica visiva a ogni gruppo.

## Migration Plan

Solo frontend: deploy automatico con il merge su `main` (preview channel sulla PR per verifica da telefono). Rollback = revert del merge. Nessun dato da migrare.
