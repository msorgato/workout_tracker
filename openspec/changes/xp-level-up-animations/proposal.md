## Why

L'app registra bene le serie ma non dà nessuna sensazione di avanzamento: completare una serie, un esercizio o un'intera sessione ha lo stesso feedback di un campo salvato. Vogliamo richiamare il linguaggio dei giochi di ruolo (punti esperienza, livelli, "level up") per rendere l'allenamento più gratificante e l'app più accattivante, senza aggiungere dati da mantenere: gli XP e il livello si ricavano dallo storico delle sessioni già salvato.

## What Changes

- **Regole XP** (visibili all'utente): 10 XP per ogni serie completata, +25 XP per ogni esercizio completato (tutte le serie previste dalla routine registrate), +50 XP alla conclusione della sessione. Le serie extra valgono 10 XP come le altre.
- **Livelli derivati dallo storico**: il livello è funzione degli XP totali di tutte le sessioni concluse (curva crescente con soglie fisse, es. livello 2 a 200 XP). Nessun nuovo dato su Firestore: gli XP di una sessione si calcolano dalle serie registrate e da `targetSets`.
- **Feedback durante la sessione**: un "+10 XP" che sale e svanisce a ogni serie completata, un breve lampo sulla riga della serie appena registrata, un'animazione di conferma sul badge quando l'esercizio si completa ("+25 XP"), e un contatore degli XP della sessione sempre visibile in testata.
- **Schermata di fine sessione**: terminando la sessione compare un riepilogo con XP guadagnati (conteggio animato), serie e volume, barra del livello che si riempie e, se si supera una soglia, un banner "LEVEL UP" con il nuovo livello. Un pulsante chiude il riepilogo e porta allo storico (comportamento di oggi).
- **Accessibilità e prestazioni**: tutte le animazioni sono CSS/JS leggeri, brevi (la maggior parte sotto 0,8 s) e si disattivano con "riduci movimento" (i valori finali compaiono subito). Se il calcolo del livello fallisce (storico non leggibile) il riepilogo mostra comunque gli XP della sessione, senza livello.
- Nessuna modifica a modello dati, regole Firestore, routine, timer di recupero o storico.

## Capabilities

### New Capabilities
- `xp-progression`: regole di calcolo degli XP, curva dei livelli e derivazione di XP e livello dallo storico delle sessioni.

### Modified Capabilities
- `workout-session`: aggiunta di feedback XP durante la sessione (animazioni per serie ed esercizio completato, contatore XP) e del riepilogo di fine sessione con barra livello e "LEVEL UP". Il delta usa solo `ADDED`.

## Impact

- **Codice nuovo**: `src/features/xp/xp.ts` (funzioni pure: `sessionXp`, `levelForXp`, `levelProgress`, costanti), `src/features/xp/` componenti (`XpPop`, `XpBar`, `LevelUpBanner`, `SessionSummaryScreen`) e hook `useCountUp`; keyframes in `src/index.css`; test Vitest in `tests/xp.test.ts`.
- **Codice modificato**: `src/features/session/ActiveSessionPage.tsx` (effetti per serie/esercizio, contatore XP, flusso di fine sessione con riepilogo). `src/App.tsx` invariato salvo l'uso di `onDone` dopo il riepilogo.
- **Letture Firestore**: una lettura dello storico completo (già usata da `listCompletedSessions` nella pagina Storico) a ogni conclusione di sessione per calcolare il livello. Trascurabile per l'uso single-user sul piano Spark.
- **Dipendenze**: nessuna nuova (niente librerie di animazione o confetti).
- **Fuori scope (livello 2)**: progressione persistente separata, serie di giorni consecutivi, traguardi/badge, record personali, effetti sonori e vibrazione per il level up, confetti a schermo intero, ricalcolo retroattivo dei bonus esercizio per sessioni create prima di `targetSets`.
- **Nota di compatibilità**: le sessioni senza `targetSets` (libere, esercizi aggiunti in corso, precedenti alla change sulle serie target) non danno il bonus "esercizio completato"; ricevono comunque gli XP delle serie e il bonus di sessione. Il contesto del progetto escludeva statistiche e record automatici: XP e livello sono un indicatore di gioco derivato, non una statistica di progressione dei carichi; nessun suggerimento o 1RM viene introdotto.
