## Context

Motivazione in proposal.md, requisiti in specs/. Stato osservato:

- `PageHeader` (`src/components/ui/PageHeader.tsx`) è una singola riga flex: `h1` con `min-w-0 flex-1 truncate text-4xl`, poi lo slot `actions`, poi l'avatar (area 44×44).
- `ActiveSessionPage` passa a `actions` `XpChip` e il pulsante "Termina": insieme all'avatar occupano circa 230px su 288 utili a 320px, quindi al titolo restano ~40–60px e "Sessione libera" (e molti nomi di routine) vengono troncati.
- `XpChip` ha `max-[359px]:px-2` aggiunto nella change precedente solo per risparmiare spazio.
- L'header è `sticky top-0`, con sfondo sfocato; il padding superiore include la safe area.
- Il requisito attuale "Header della sessione attiva" prescrive il titolo troncato su una riga: va modificato.

## Goals / Non-Goals

**Goals:**
- Titolo della sessione leggibile per intero a 320px per "Sessione libera" e per nomi di routine di lunghezza comune.
- Contatore XP e "Termina" sempre visibili e toccabili (≥ 44px).

**Non-Goals:**
- Nascondere o comprimere l'header allo scorrimento; nessuna modifica a XP, timer, dati, tab bar.

## Decisions

### 1. Seconda riga opzionale in `PageHeader`
Nuova prop `toolbar?: ReactNode`. Il `header` diventa una colonna: riga 1 = titolo + `actions` + avatar (come oggi); riga 2 (solo se `toolbar` presente) = `toolbar` in un contenitore `flex items-center justify-between gap-2`. `ActiveSessionPage` sposta `XpChip` e "Termina" da `actions` a `toolbar` e non passa più `actions`. Header sticky e sfondo restano gli stessi (un solo elemento sticky, non due).
**Alternative**: ridurre ancora font o padding di chip e bottone (non risolve nomi lunghi, riduce i target); mettere il contatore XP sotto l'header nel flusso (non resterebbe in vista allo scorrimento, contro lo scenario di header ancorato); rimpicciolire il titolo (perde l'impatto del design, e a 320px guadagna poco).

### 2. Titolo su al massimo due righe
Nel `h1`: sostituire `truncate` con `line-clamp-2 break-words` e `leading-none` con `leading-[0.95]` (il titolo è in Barlow Condensed uppercase, quindi con interlinea stretta due righe restano compatte), mantenendo `min-w-0 flex-1`. A una riga l'aspetto è identico a oggi. Valido per tutti gli header: nomi lunghi di routine nei moduli e nel dettaglio non vengono più troncati per forza dopo una riga.
Nella riga 1 l'avatar resta allineato in alto rispetto al titolo (`items-start`) per non spostarsi quando il titolo è su due righe; l'area 44px resta invariata.

### 3. Pulizia di `XpChip`
Si rimuove `max-[359px]:px-2`: con la seconda riga lo spazio c'è e il chip torna alla spaziatura standard.

## Risks / Trade-offs

- **[Trade-off]** L'header fisso della sessione è più alto di circa una riga (~48px): meno spazio per il contenuto durante lo scorrimento. Accettato per avere titolo e azioni sempre in vista; se risultasse troppo si potrà valutare di compattare il padding verticale.
- **[Rischio]** Titoli a due righe nelle altre pagine allungano l'header → **Mitigazione**: capita solo con titoli lunghi (oggi i titoli fissi sono corti), da verificare con un nome routine lungo.
- **[Rischio]** Allineamento dell'avatar con titolo a una o due righe → **Mitigazione**: verifica visiva a 320px e 375px in entrambi i casi.

## Migration Plan

Solo frontend, nessuna migrazione. Deploy con il merge su `main`; rollback = revert.
