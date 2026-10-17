## Context

L'app usa Tailwind CSS v4 (config CSS-first via `@theme`, nessun `tailwind.config.js`), con `src/index.css` che oggi contiene solo `@import 'tailwindcss';`. Ogni componente usa classi Tailwind "di default" sparse e incoerenti: `bg-white`/`bg-gray-50` per gli sfondi, `text-gray-900/700/600/500` per i testi, `blue-600` per alcune azioni primarie (login, salva routine) e `green-600` per altre (serie completata, avvia sessione), `red-600`/`red-300` per le azioni distruttive. Nessun sistema di colori condiviso: cambiare la palette oggi richiederebbe modifiche sparse in ~10 file senza un punto di coordinamento.

## Goals / Non-Goals

**Goals:**
- Un set di design token (variabili CSS) che definisce l'intera palette in un solo posto (`src/index.css`), così da poter ritoccare i colori in futuro senza toccare i componenti.
- Applicazione coerente dei token a tutti i componenti esistenti, eliminando i colori Tailwind hardcoded.
- Un solo colore di accento (verde brillante) per tutte le azioni primarie, oggi divise incoerentemente tra blu e verde.
- Contrasto sufficiente testo/sfondo su base scura (nessun testo grigio chiaro su sfondo chiaro dimenticato).

**Non-Goals:**
- Nessun toggle chiaro/scuro: l'app ha un solo tema in questa versione (vedi proposal.md).
- Nessuna libreria di componenti UI esterna: restiamo su Tailwind utility classes dirette, coerente con l'approccio attuale.
- Nessuna modifica a layout/struttura dei componenti, solo ai colori (dimensioni, spaziatura, tipografia restano invariate salvo piccoli adattamenti di contrasto).
- Nessun rebrand del favicon o del nome app.

## Decisions

### 1. Token di colore via `@theme` di Tailwind v4 (non `tailwind.config.js`)
Definiamo i colori come variabili CSS dentro un blocco `@theme` in `src/index.css`. Tailwind v4 genera automaticamente le utility corrispondenti (`--color-accent` → classi `bg-accent`, `text-accent`, `border-accent`, ecc.), quindi non serve introdurre un file di configurazione JS né una libreria aggiuntiva.

Palette proposta (valori di partenza, facilmente ritoccabili essendo variabili):

| Token | Valore | Uso |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Sfondo pagina |
| `--color-surface` | `#161616` | Card, liste, pannelli |
| `--color-surface-hover` | `#1f1f1f` | Hover su superfici, pulsanti secondari |
| `--color-border` | `#2a2a2a` | Bordi sottili |
| `--color-text` | `#f2f2f2` | Testo principale |
| `--color-text-muted` | `#999999` | Testo secondario, timestamp, hint |
| `--color-accent` | `#39d353` | Accento primario (verde brillante) |
| `--color-accent-hover` | `#5ee37a` | Hover su elementi accent |
| `--color-accent-pressed` | `#2aa83f` | Stato attivo/pressed |
| `--color-accent-contrast` | `#06240f` | Testo sopra sfondo accent (verde è chiaro, serve testo scuro) |
| `--color-danger` | `#f05252` | Azioni distruttive (elimina) |
| `--color-danger-hover` | `#d64545` | Hover su azioni distruttive |

**Alternative considerate**: continuare a usare le palette Tailwind standard (`gray-900`, `green-600`, ecc.) scegliendole con più attenzione — scartato perché non risolve il problema di fondo (incoerenza tra componenti, nessun punto unico di modifica) e un progetto con palette custom trae beneficio da token nominati per ruolo (`accent`, `surface`) invece che da scale numeriche (`gray-800` vs `gray-900`) che non comunicano l'intento.

### 2. Consolidamento su un solo accento: verde ovunque sostituisce il blu
Tutte le azioni primarie (login, salva routine, conferma import, avvia sessione, serie completata) usano `bg-accent text-accent-contrast hover:bg-accent-hover`. Le azioni distruttive (elimina routine/esercizio) restano sul rosso (`danger`), adattato per leggibilità su sfondo scuro. Le azioni secondarie/neutre (annulla, esci, rimuovi riga non distruttiva) usano uno stile outline su `surface`/`border` senza colore acceso.
**Alternative considerate**: mantenere blu per "azioni di navigazione/salvataggio" e verde solo per "conferme in sessione" — scartato: la richiesta esplicita è una palette con un solo accento verde brillante; due accenti indebolirebbero l'identità visiva cercata.

### 3. Migrazione component-per-component, nessuna classe "di compatibilità"
Ogni file con classi Tailwind di colore viene aggiornato direttamente (niente wrapper o classi ponte temporanee), poiché il numero di componenti è piccolo (~12 file) e l'intera superficie è coperta dai task di questa change. Ordine: prima i token base (`index.css`), poi i componenti di layout/navigazione (`App.tsx`), poi feature per feature.
**Alternative considerate**: introdurre classi di utilità "legacy" temporanee per una migrazione graduale — scartato, overengineering per una codebase di queste dimensioni con un solo sviluppatore.

### 4. `color-scheme: dark` sulla root
Impostare `color-scheme: dark` su `:root` così i controlli nativi del browser (scrollbar, outline di default, calendar picker se mai usato) seguono il tema scuro invece di restare chiari per default.

## Risks / Trade-offs

- **[Rischio]** Contrasto insufficiente in alcuni abbinamenti testo/sfondo scelti a tavolino senza verifica strumentale → **Mitigazione**: valori scelti con margine (testo `#f2f2f2` su `#0a0a0a`/`#161616` supera ampiamente WCAG AA; verde `#39d353` ha luminanza alta, usato con testo scuro sopra per contrasto, non come testo su sfondo scuro per paragrafi lunghi). Essendo variabili CSS, un ritocco successivo è a basso costo.
- **[Rischio]** Superficie di modifica ampia (molti file) aumenta la probabilità di dimenticare qualche classe hardcoded → **Mitigazione**: verifica finale con build + screenshot di ogni vista principale (login, routine, sessione, storico) per controllo visivo completo.
