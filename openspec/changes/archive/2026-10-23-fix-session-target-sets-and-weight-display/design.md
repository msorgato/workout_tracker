## Context

Motivazione e causa dei due difetti in proposal.md. Stato osservato nel codice:

- `Routine.exercises[].targetSets` esiste (form routine, import CSV), ma `createSessionFromRoutine` in `src/features/session/sessionsApi.ts` copia solo `exerciseId`, `exerciseName`, `order`, `targetRestSeconds`, `targetWeight`. `SessionExercise` non ha `targetSets`. In `ActiveSessionPage` il pulsante "Serie N completata" è sempre mostrato.
- Le sessioni sono documenti Firestore con `exercises[]` annidati: aggiungere un campo opzionale non richiede migrazioni; le sessioni già create non lo avranno.
- `Stepper` (`src/components/ui/Stepper.tsx`): riga `[−] input [+]` con pulsanti `size-11` e input `w-full min-w-0 text-4xl`; in `ActiveSessionPage` due Stepper affiancati (`flex gap-3`) dentro una `Card` con `max-w-md`. A 320–375px l'input resta largo circa 50–60px, meno del testo di "42.5" in `font-display text-4xl`: il testo è centrato e il campo ha overflow nascosto, quindi si vede "42." (`stepValue` produce correttamente `'42.5'`, coperto da `tests/numberInput.test.ts`).
- `ActiveSessionPage` è stata modificata di recente anche dalla change `exercise-tips` (pannello `TipsPanel` sotto il titolo): le modifiche qui devono convivere con quel markup.

## Goals / Non-Goals

**Goals:**
- Stato di avanzamento delle serie derivato da dati persistiti (sopravvive al ricaricamento), come funzione pura testabile.
- Layout degli stepper che non tronca mai il valore a 320px.

**Non-Goals:**
- Nessuna modifica del numero di serie target durante la sessione né avanzamento automatico all'esercizio successivo.
- Nessuna migrazione o riscrittura delle sessioni esistenti.
- Nessun cambiamento al timer di recupero (parte dopo ogni serie, compresa l'ultima).

## Decisions

### 1. `targetSets?: number` in `SessionExercise`, copiato alla creazione da routine
Campo opzionale: assente per sessione libera, esercizi aggiunti in sessione e sessioni preesistenti → nessun limite (comportamento di oggi). Non si deriva dalla routine a runtime (`routineId` può puntare a una routine poi modificata o eliminata): la sessione conserva il proprio snapshot, come già fa per `targetRestSeconds` e `targetWeight`.
**Alternativa**: leggere `targetSets` dalla routine al volo — scartata per la dipendenza da una routine che può cambiare o sparire.

### 2. Logica in `src/features/session/setProgress.ts`
`getSetProgress(exercise: SessionExercise, extraUnlocked: boolean)` restituisce `{ done, target, isComplete, canLogSet, nextSetNumber, extraCount }`:
- senza `targetSets`: `canLogSet = true`, `isComplete = false`, nessun indicatore;
- con target: `isComplete = done >= target`; `canLogSet = !isComplete || extraUnlocked || done > target`; `extraCount = max(0, done - target)`.
La condizione `done > target` rende persistente lo sblocco una volta registrata una serie extra (nessuno stato locale da ripristinare dopo un ricaricamento); lo stato locale `extraUnlocked` copre solo il momento tra il tocco su "Aggiungi serie extra" e la prima serie extra. Test in `tests/setProgress.test.ts` per: nessun target, 1/4, 4/4, 4/4 con sblocco, 5/4, sessione preesistente.
**Alternativa**: bloccare del tutto dopo l'ultima serie — scartata (scelta dell'utente: completato + serie extra opzionale).

### 3. UI della card
Intestazione card: nome esercizio e, se c'è un target, badge "Serie 1/4" (diventa "Completato 4/4" con icona check e accento; "5/4 · extra" oltre il target). Se `canLogSet` è vero, i due stepper e la CTA come oggi; se `isComplete && !canLogSet` al loro posto compare il riepilogo "Completato" e il pulsante secondario `Button` "Aggiungi serie extra" che imposta `extraUnlocked` per quell'esercizio. Nella lista delle serie registrate, le righe oltre il target sono marcate "extra". L'avvio del timer in `handleCompleteSet` resta invariato.

### 4. Stepper su righe a tutta larghezza
In `ActiveSessionPage` Peso e Reps non sono più affiancati ma impilati; ogni `Stepper` occupa l'intera larghezza della card (≈ 280px a 320px di viewport: pulsanti 2×44 + gap leave ~180px per il valore, sufficienti per "142,5" a `text-4xl`). Nello `Stepper` il campo valore ottiene `min-w-[6ch]` e `text-ellipsis`/overflow visibile disattivati per non troncare mai: se lo spazio non basta, la dimensione del testo scala (`text-3xl` sotto 360px via classe responsive) invece di tagliare. Nessuna modifica di `stepValue`/`parseDecimal`.
**Alternativa**: ridurre solo il font — scartata: non risolve a 320px con tre cifre più decimale; impilare libera spazio senza perdere leggibilità.

## Risks / Trade-offs

- **[Rischio]** Card più alte (stepper impilati) su un'app usata durante l'allenamento → **Mitigazione**: etichette compatte e riga unica per stepper; con esercizio completato la card si accorcia (niente stepper); verifica a 375px.
- **[Rischio]** Causa del troncamento non confermata (ipotesi di layout) → **Mitigazione**: primo task di verifica riproduce il difetto a 320px prima di cambiare il layout; se la causa fosse diversa si ferma il lavoro e si aggiorna questo design.
- **[Trade-off]** Le sessioni già in corso non hanno `targetSets`: per quelle il limite non c'è finché non si avvia una nuova sessione da routine. Accettato, nessuna migrazione.
- **[Rischio]** Conflitti di merge con la change `exercise-tips` su `ActiveSessionPage.tsx` → **Mitigazione**: modifiche circoscritte alla zona serie/stepper, lasciando intatto `TipsPanel`.

## Migration Plan

Solo frontend, nessuna migrazione dati né modifica alle regole. Deploy con il merge su `main`; rollback = revert (il campo `targetSets` nei documenti già scritti resta innocuo).
