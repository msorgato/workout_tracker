## Context

Motivazione e regole di gioco in proposal.md e specs/. Stato attuale rilevante:

- `ActiveSessionPage` gestisce lo stato locale della sessione (`restFor`, `extraUnlocked`, input) e usa `getSetProgress` (`src/features/session/setProgress.ts`) per l'avanzamento delle serie. `SessionExercise.targetSets` è opzionale e assente per sessioni libere, esercizi aggiunti in corso e sessioni create prima della change sulle serie target.
- La chiusura è `handleFinish`: `await finishSession()` (imposta `endedAt` e azzera `session`) poi `onDone()` → navigazione a `/history`. Dopo `finishSession` la pagina mostrerebbe lo stato vuoto "Nessuna sessione attiva".
- `listCompletedSessions(uid)` legge tutte le sessioni con `endedAt != null` (nessun limite), già usata da `HistoryPage`; `summarizeSession` (`src/features/history/sessionSummary.ts`) calcola serie e volume.
- Animazioni esistenti: token `--animate-*` e `@keyframes` in `src/index.css` (`fade-up`, `pulse-dot`) con una regola globale `prefers-reduced-motion` che azzera `animation` e riduce le transizioni.
- Vincoli del progetto: nessun nuovo dato su Firestore, nessuna libreria aggiuntiva, piano Spark.

## Goals / Non-Goals

**Goals:**
- Regole XP e livelli come funzioni pure testabili, derivate dai dati esistenti (nessuna persistenza nuova).
- Effetti brevi e leggibili, tutti spegnibili con "riduci movimento", senza dipendenze.
- Flusso di chiusura sessione robusto: la sessione si conclude sempre, anche se il calcolo del livello fallisce.

**Non-Goals:**
- Nessuna persistenza di XP o livello, serie di giorni, badge, record (livello 2).
- Nessun suono, vibrazione o confetti a schermo intero.
- Nessun ricalcolo retroattivo dei bonus per sessioni senza `targetSets`.

## Decisions

### 1. Regole in `src/features/xp/xp.ts`
Costanti esportate: `XP_PER_SET = 10`, `XP_EXERCISE_BONUS = 25`, `XP_SESSION_BONUS = 50`, `LEVEL_BASE = 100`. Funzioni pure:
- `isExerciseComplete(exercise)`: `targetSets` definito e `sets.length >= targetSets`.
- `sessionXp(session, { concluded })`: `10 × serie + 25 × esercizi completati + (concluded ? 50 : 0)`.
- `totalXp(completedSessions)`: somma con `concluded: true`.
- `levelThreshold(n) = 100 · n · (n − 1)` e `levelForXp(xp)`: formula chiusa `floor((1 + √(1 + xp/25)) / 2)` con correzione di arrotondamento verificata contro `levelThreshold` (test su 199/200/599/600).
- `levelProgress(xp) → { level, xpIntoLevel, xpForNext, fraction }`.
La curva quadratica rende i primi livelli rapidi (200, 600, 1.200 XP) e i successivi progressivamente più lunghi; le costanti sono in un solo punto, così ritoccabili senza migrazioni (nessun dato salvato dipende da esse).
**Alternativa**: salvare XP e livello su Firestore — scartata: contraddice la scelta "nessun dato aggiuntivo" e richiederebbe migrazioni a ogni cambio di regole.

### 2. Effetti in sessione guidati da eventi, non da diff dello stato
In `handleCompleteSet`, prima di chiamare `completeSet`, si calcola se la serie in arrivo completa l'esercizio (`getSetProgress` con `done + 1 === target`). Si imposta uno stato effimero `fx: { id, exerciseIndex, kind: 'set' | 'exercise' }` e `lastAddedSet: { exerciseIndex, setNumber }`. Gli effetti si rimuovono con `onAnimationEnd` più un timeout di sicurezza (~1,2 s): con "riduci movimento" l'animazione è azzerata e `animationend` non scatta mai, quindi il timeout garantisce che l'indicatore "+XP" resti leggibile per un istante e poi sparisca.
**Alternativa**: effetto `useEffect` che confronta lo stato precedente della sessione — scartata: scatterebbe anche al ricaricamento di una sessione già completata e al rollback di un salvataggio.

### 3. Animazioni in `src/index.css`
Nuovi token e `@keyframes` accanto a quelli esistenti: `xp-float` (sale di ~28px e svanisce, 0,9 s), `row-flash` (sfondo accento che rientra, 0,7 s), `badge-pop` (scala 0,8 → 1,15 → 1, 0,5 s), `level-up` (ingresso del banner con scala e alone), `xp-bump` (rimbalzo del contatore). Nessun lampeggio rapido o ripetuto (max un impulso per evento) per evitare problemi fotosensibili. La regola `prefers-reduced-motion` globale esistente le copre senza codice aggiuntivo.

### 4. Componenti in `src/features/xp/`
`XpPop` (etichetta "+N XP" posizionata sopra il pulsante, `aria-live="polite"` e testo, quindi anche gli screen reader ricevono l'informazione), `XpChip` (contatore in testata con `xp-bump` alla variazione), `XpBar` (barra segmentata con transizione di larghezza), `LevelUpBanner`, `SessionSummaryScreen`. `useCountUp(target, ms)` con `requestAnimationFrame` e `ease-out`; se `matchMedia('(prefers-reduced-motion: reduce)')` è vero restituisce subito `target`.

### 5. Flusso di chiusura con riepilogo
`handleFinish`:
1. Copia della sessione corrente (snapshot).
2. `listCompletedSessions(uid)` **prima** di `finishSession()`: la sessione attiva non è ancora conclusa e quindi non è inclusa; si ottiene `xpBefore = totalXp(history)`. Se la lettura fallisce, `xpBefore = null` (riepilogo senza livello).
3. `await finishSession()` (la sessione si conclude comunque).
4. Stato locale `summary = { xpGained: sessionXp(snapshot, concluded), sets, volumeKg, before, after }` e rendering di `SessionSummaryScreen` con priorità sul ramo `!session`. Il pulsante "Vai allo storico" chiama `onDone()`.
Il riepilogo vive nello stato di `ActiveSessionPage`: se l'utente cambia tab lo perde, accettato (è un momento celebrativo, i dati restano nello storico).
**Alternativa**: route dedicata `/session/summary` con dati in `location.state` — scartata: più codice e ricaricamento della pagina inconsistente per un beneficio minimo.

### 6. Animazione della barra e level up
Stati `stage` della barra: da `fraction(before)` verso `fraction(after)` se stesso livello; se sale di livello: prima riempimento a 100% (700 ms), poi comparsa di `LevelUpBanner`, reset senza transizione a 0 e riempimento fino alla frazione del nuovo livello. Più salti di livello in una sola sessione mostrano il livello finale (caso raro, la curva rende improbabile saltarne due). Con "riduci movimento" si mostra subito lo stato finale.

## Risks / Trade-offs

- **[Rischio]** Effetti ripetitivi o invadenti durante le serie → **Mitigazione**: durata sotto 1 s, un solo effetto per evento, animazioni più ricche solo a fine esercizio e fine sessione.
- **[Rischio]** Una lettura aggiuntiva dello storico a fine sessione cresce con il numero di sessioni → **Mitigazione**: accettabile single-user (stessa query della pagina Storico); se diventasse un problema si potrà salvare un totale incrementale (livello 2).
- **[Trade-off]** Le sessioni senza `targetSets` non danno il bonus esercizio, quindi il livello di chi ha storico "libero" è più basso del potenziale: documentato, nessun ricalcolo.
- **[Rischio]** Modificare le costanti cambia retroattivamente livello e XP mostrati → **Trade-off voluto** (nessun dato salvato), ma il livello può anche scendere dopo un ritocco; nota nel README o commenti accanto alle costanti.
- **[Rischio]** `ActiveSessionPage` già complessa (tips, serie target, timer) → **Mitigazione**: effetti isolati in componenti piccoli e logica in `xp.ts`; modifiche circoscritte alla gestione serie e alla chiusura.

## Migration Plan

Solo frontend, nessuna migrazione dati né modifiche alle regole Firestore. Deploy con il merge su `main`; rollback = revert (nessun dato scritto).
