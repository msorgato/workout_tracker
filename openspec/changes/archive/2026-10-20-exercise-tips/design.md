## Context

Motivazione in proposal.md, requisiti in specs/. Stato attuale rilevante:

- Gli esercizi predefiniti vivono in `src/data/predefinedExercises.json` (17 voci con `id`, `name`, `muscleGroup`); gli esercizi custom o importati da CSV hanno id generati da Firestore. Le card della sessione conoscono già `exerciseId` (`SessionExercise.exerciseId`), quindi non serve alcuna migrazione dei dati di sessione.
- Pattern esistente da seguire: `useExerciseLibrary` + `customExercises.ts` (API Firestore separata dall'hook, cache in memoria a livello di modulo).
- Le regole Firestore consentono già tutto sotto `users/{uid}/**` al solo proprietario: la nuova collezione è coperta, ma va aggiunto un test che lo confermi (`tests/firestore.rules.test.ts` usa l'emulatore).
- `ActiveSessionPage` renderizza una `Card` per esercizio con primitive in `src/components/ui/`. Il pannello deve convivere con stepper, CTA "Serie completata" e timer ancorato.
- Piano Spark: letture/scritture da contenere; nessun Cloud Storage.

## Goals / Non-Goals

**Goals:**
- Unione statico + personale come funzione pura, testabile senza Firebase.
- Un solo caricamento dei tips personali per sessione, non uno per esercizio.
- Contenuti di libreria verificabili da test di coerenza (copertura dei 17 esercizi, categorie valide, lunghezza).

**Non-Goals:**
- Nessuna modifica dei tips di libreria da UI.
- Nessun supporto offline o sincronizzazione in tempo reale (`onSnapshot`): lettura una tantum con aggiornamento locale ottimistico.
- Nessuna integrazione nella form routine o nell'autocomplete (fuori scope in proposal).

## Decisions

### 1. Libreria statica in `src/data/exerciseTips.json`, indicizzata per `exerciseId`
Forma: `{ "squat": [{ "category": "postura", "text": "…" }, …], … }`. Importata come il JSON degli esercizi, bundlata nel build (zero letture). Gli id dei tip di libreria sono derivati (`lib:<exerciseId>:<indice>`) e non persistiti. Categorie come union type `'postura' | 'movimento' | 'carico' | 'sicurezza'` in `src/lib/types.ts`, con mappa etichette italiane e ordine di visualizzazione.
**Associazione per nome (aggiunta dopo la prima implementazione)**: gli esercizi importati da CSV hanno nomi descrittivi (es. "Panca piana con bilanciere o manubri") che non coincidono con quelli predefiniti e quindi ricevono un id Firestore. La libreria è perciò risolta prima per id e poi per nome tramite `src/data/exerciseTipAliases.json` (nome normalizzato → chiave della libreria; normalizzazione = minuscolo, senza accenti, spazi compattati, funzione pura `resolveLibraryKey`). La libreria contiene anche 8 voci extra per gli esercizi delle schede in `workouts/` non presenti tra i predefiniti (pushdown, rematore con manubrio, pulley, face pull, curl alternato, leg curl, calf raise, crunch al cavo). Un test verifica che ogni esercizio dei CSV in `workouts/` abbia tips.
**Alternativa scelta contro**: riassegnare gli esercizi già importati agli id predefiniti — scartata: richiederebbe riscrivere routine e sessioni esistenti.

**Alternativa**: tips dentro `predefinedExercises.json` — scartata: mescola due responsabilità e appesantisce il caricamento dell'autocomplete; un file separato si modifica senza toccare la libreria esercizi.

### 2. Tips personali: un documento per esercizio
`users/{uid}/exerciseTips/{exerciseId}` → `{ tips: [{ id, category, text }], updatedAt }`. Scrittura con `setDoc` dell'intero array (utente singolo, nessuna concorrenza rilevante); se l'array diventa vuoto il documento viene eliminato. `id` del tip generato lato client (`crypto.randomUUID()`).
**Alternative**: un documento per tip (più letture e scritture, nessun beneficio con pochi tips per esercizio); un solo documento con tutti gli esercizi (un tip modificato riscrive tutto e il limite di 1 MiB per documento diventa un rischio a lungo termine).

### 3. Caricamento: una query sulla collezione all'avvio della sessione
`exerciseTipsApi.listAll(uid)` legge la collezione una volta (costo = numero di documenti con tips, non di esercizi in sessione) e `useExerciseTips(uid)` espone `Map<exerciseId, PersonalTip[]>` più `addTip`, `updateTip`, `deleteTip`. Cache a livello di modulo come `customOptionsCache`, aggiornata dalle mutazioni, così riaprire la sessione non rilegge. Chiamato una sola volta in `ActiveSessionPage` e passato alle card, per evitare istanze con stato divergente.
**Alternativa**: lettura per singolo esercizio all'apertura del pannello — scartata: il promemoria postura compatto richiede i dati già a card chiusa.

### 4. Mutazioni ottimistiche con rollback
`add/update/delete` aggiornano subito stato e cache e poi scrivono su Firestore; se la scrittura fallisce, lo stato torna al valore precedente e l'errore è esposto all'UI (messaggio nel pannello, testo dell'editor mantenuto) — requisito "Fallimento del salvataggio".

### 5. Logica pura in `src/features/exercise-tips/tips.ts`
- `mergeTips(libraryTips, personalTips) → Tip[]` (ciascuno con `source: 'library' | 'personal'`, libreria prima).
- `groupByCategory(tips) → { category, tips }[]` in ordine fisso, categorie vuote omesse.
- `firstPostureTip(tips)`.
- `validateTipText(text)` → trim, non vuoto, ≤ 280 caratteri (costante condivisa con la UI).

Test Vitest in `tests/exerciseTips.test.ts`, più un test di coerenza sul JSON (ogni esercizio predefinito ha ≥ 1 tip, categorie valide, testi non vuoti ≤ 280).

### 6. UI: `TipsPanel` dentro la card esercizio
Sotto il nome dell'esercizio: riga compatta con icona e primo tip di Postura (se esiste) e pulsante `Tips (n)` (`Button` ghost, 44px). Il pannello è una sezione comprimibile (`aria-expanded`/`aria-controls`) nella stessa `Card`, non un modale né una pagina: non toglie il focus dai campi e il timer ancorato resta visibile. Dentro: sezioni per categoria; tips di libreria con icona neutra, tips personali con badge "Personale" e `IconButton` modifica/elimina; in fondo "Aggiungi tip" che apre un editor inline (selezione categoria + `textarea` con contatore) con stato di errore. Nuove icone (`info`, `lightbulb`) in `Icon.tsx`. Eliminazione con conferma a due tocchi, come per le routine.
**Alternativa**: bottom sheet modale — scartata: copre il timer e i campi peso/reps, proprio ciò che serve durante la serie.

### 7. Contenuti
17 esercizi × 3–5 tips, scritti in italiano come indicazioni generali di tecnica. Distribuzione indicativa: almeno un tip di Postura e uno di Carico/Movimento per esercizio, Sicurezza dove rilevante (stacco, squat, military press, dip). Nel pannello compare una nota discreta "Indicazioni generali, non sostituiscono un istruttore". I contenuti vanno sottoposti a revisione dell'utente prima del merge (task dedicato).

## Risks / Trade-offs

- **[Rischio]** Consigli tecnici errati o troppo assoluti → **Mitigazione**: formulazioni prudenti e generali, nota nel pannello, revisione dell'utente come task esplicito.
- **[Rischio]** Card già dense (stepper, serie, CTA) che diventano troppo alte → **Mitigazione**: pannello chiuso di default, promemoria compatto su una riga con troncamento; verifica a 375px.
- **[Rischio]** Perdita di un aggiornamento se l'app è aperta su due dispositivi (scrittura dell'intero array) → **Trade-off accettato**: utente singolo; l'ultima scrittura vince.
- **[Trade-off]** Cache di modulo non invalidata da altri dispositivi nella stessa sessione di navigazione → si aggiorna al ricaricamento dell'app.

## Migration Plan

Solo frontend e una nuova collezione creata alla prima scrittura: nessuna migrazione, nessuna modifica alle regole (solo un test che ne confermi la copertura). Deploy con il merge su `main`; rollback = revert, i documenti `exerciseTips` restano innocui in Firestore.

## Open Questions

- Quantità e tono dei tips di libreria (verbosi o telegrafici?): decisibile in revisione dei contenuti senza cambiare approccio.
