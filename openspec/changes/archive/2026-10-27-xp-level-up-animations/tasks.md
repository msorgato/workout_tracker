## 1. Regole XP e livelli

- [x] 1.1 Creare `src/features/xp/xp.ts` con costanti, `isExerciseComplete`, `sessionXp`, `totalXp`, `levelThreshold`, `levelForXp` e `levelProgress` (design §1), e i test in `tests/xp.test.ts`: 3 serie = 30 XP, esercizio 3/3 = 55, sessione conclusa 105, esercizio senza target senza bonus, esercizio incompleto senza bonus, livelli a 0/199/200/599/600/1199/1200, avanzamento del 50% a 400 XP, storico vuoto → livello 1; aggiungere il file a `test:unit` e verificare con `npm run test:unit`

## 2. Primitive di animazione

- [x] 2.1 Aggiungere in `src/index.css` token e `@keyframes` `xp-float`, `row-flash`, `badge-pop`, `level-up`, `xp-bump` accanto a quelli esistenti; verificare con `npm run build` e in DevTools che con l'emulazione "prefers-reduced-motion: reduce" nessuna animazione venga eseguita
- [x] 2.2 Creare `src/features/xp/useCountUp.ts` (rAF con ease-out, valore finale immediato con "riduci movimento") e `XpPop` (etichetta "+N XP" con `aria-live="polite"`, rimozione con `onAnimationEnd` e timeout di sicurezza ~1,2 s); verificare con `npx tsc -b` e `npm run lint`

## 3. Feedback durante la sessione

- [x] 3.1 Creare `XpChip` e mostrarlo nella testata di `ActiveSessionPage` con `sessionXp(session, { concluded: false })`, con `xp-bump` a ogni variazione; verificare che dopo 2 serie e un esercizio completato da 2 serie mostri 45 XP
- [x] 3.2 In `handleCompleteSet` calcolare se la serie completa l'esercizio, mostrare `XpPop` "+10 XP" (e "+25 XP" al completamento), evidenziare la riga della serie appena aggiunta (`row-flash`) e animare il badge "Completato" con `badge-pop`; verificare con una routine da 2 serie che gli effetti compaiano alla serie 1 e alla serie 2 e che con "riduci movimento" restino solo le etichette senza movimento
- [ ] 3.3 Verificare i casi limite: nessun effetto di completamento in esercizi senza `targetSets`, nessun effetto al ricaricamento di una sessione già completata, effetti rimossi dal DOM dopo l'uso, timer di recupero e pannello tips ancora funzionanti

## 4. Riepilogo di fine sessione

- [x] 4.1 Creare `XpBar`, `LevelUpBanner` e `SessionSummaryScreen` (XP con `useCountUp`, serie e volume via `summarizeSession`, barra del livello con stage di riempimento, banner "LEVEL UP" con nuovo livello, pulsante "Vai allo storico"); verificare a 375px con dati simulati che i casi "stesso livello" e "level up" (180 XP + sessione da 105 XP → livello 2) mostrino il risultato atteso
- [x] 4.2 Integrare il flusso in `handleFinish` (snapshot, lettura dello storico prima di `finishSession`, fallback senza livello se la lettura fallisce, stato `summary` con priorità sul ramo `!session`, `onDone` dal pulsante); verificare terminando una sessione reale che compaia il riepilogo e che il pulsante porti allo storico, e con rete bloccata che la sessione risulti comunque conclusa con riepilogo senza livello

## 5. Verifica d'insieme

- [x] 5.1 Verificare che `npm run build`, `npm run lint` e `npm run test:unit` passino e che le modifiche siano limitate a `src/features/xp/`, `src/index.css`, `src/features/session/ActiveSessionPage.tsx`, `package.json` e `tests/`
- [ ] 5.2 Prova manuale a 375px: sessione completa da una routine importata (serie, esercizio completato, fine sessione, riepilogo, level up se possibile), ripetuta con "riduci movimento" attivo e controllando la fluidità degli effetti su un telefono reale

## Workflow follow-up

- Archiviare la change dopo la verifica manuale.
