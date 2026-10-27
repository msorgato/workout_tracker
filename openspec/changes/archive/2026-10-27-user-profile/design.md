## Context

Motivazione in proposal.md, requisiti in specs/. Stato osservato:

- XP e livello si derivano da `totalXp(sessioni concluse)` + `levelProgress(xp)` in `src/features/xp/xp.ts`; lo storico si legge con `listCompletedSessions(uid)` (già usata da `HistoryPage` e da `ActiveSessionPage` alla chiusura). Non c'è nulla da salvare per XP e livello.
- Navigazione: `TabBar` (`src/components/ui/TabBar.tsx`) con tre voci in un array `TABS` e route in `AppRoutes` (`src/App.tsx`); `PageHeader` accetta `actions` e mostra il logout di default.
- Utente: `useAuth().user` è un Firebase `User` (`displayName`, `email`). L'app non ha il concetto di username.
- Dati utente su Firestore: collezioni sotto `users/{uid}/…`; la regola `match /users/{uid}/{document=**}` consente lettura/scrittura al solo proprietario, quindi un nuovo documento sotto `users/{uid}/profile/` è già coperto.
- Pattern esistenti da seguire: API Firestore separata dall'hook (`customExercises.ts` + `useExerciseLibrary`, `exerciseTipsApi.ts` + `useExerciseTips`) con cache di modulo e aggiornamenti ottimistici con rollback.
- Asset: `gym-profile-icons/gym-profile-icons/svg/badge/*.svg` (16 file, 128×128, squircle `#39d353` con icona nera a tratto 5) e `…/svg/outline/*.svg`; il README raccomanda badge ≥ 40 px. L'esempio `gym-profile-icons/profilo.html` usa `<symbol>` inline, tratto via CSS, palette blu-grigio e Montserrat da Google Fonts.
- `tsconfig.app.json` include `vite/client`, quindi gli import di asset (`?url`, `import.meta.glob`) sono tipizzati.

## Goals / Non-Goals

**Goals:**
- Pagina Profilo fedele al layout dell'esempio ma costruita con i token, i font e le primitive UI dell'app.
- Registro degli avatar come unica fonte di verità (id stabile, etichetta, url), usato da profilo e selettore.
- Salvataggio dell'avatar robusto: ottimistico per l'anteprima ma applicato al profilo solo a salvataggio riuscito (vedi requisito di fallimento).

**Non-Goals:**
- Nessun badge/achievement, streak, record o ultimi allenamenti (esplicitamente rimandati).
- Nessun nome utente o handle modificabile, nessun upload di immagini.
- Nessuna persistenza di XP/livello: restano derivati.

## Decisions

### 1. Avatar come file SVG negli asset del build, registro in `avatars.ts`
Si copiano i 16 SVG `badge` in `src/assets/profile-icons/<id>.svg` e `src/features/profile/avatars.ts` li registra con `import.meta.glob('../../assets/profile-icons/*.svg', { eager: true, query: '?url', import: 'default' })`, ricavando l'id dal nome file e associando un'etichetta italiana (`barbell → Bilanciere`, `bolt → Fulmine`, `calendar → Calendario`, `crown → Corona`, `dumbbell → Manubrio`, `flame → Fiamma`, `heartbeat → Battito`, `kettlebell → Kettlebell`, `medal → Medaglia`, `muscle → Muscolo`, `shaker → Shaker`, `sneaker → Scarpa`, `star → Stella`, `stopwatch → Cronometro`, `target → Bersaglio`, `trophy → Trofeo`). Esporta `AVATARS`, `DEFAULT_AVATAR_ID = 'muscle'`, `getAvatar(id)` (id sconosciuto → default). I badge sono già con sfondo verde e icona nera, quindi si mostrano con `<img>` senza ricolorazione (coerente con l'accento dell'app). Gli id nel documento Firestore sono i nomi file: stabili e indipendenti dall'ordine.
**Alternative**: sprite `<symbol>` inline come nell'esempio (richiede di duplicare i path nel codice e stile del tratto via CSS, utile solo se servisse ricolorare); PNG (più pesanti e non scalabili). Si usano gli SVG `badge` perché sono già il formato di destinazione. La cartella sorgente `gym-profile-icons` resta nella radice del progetto come concept (decisione dell'utente) e non viene letta dal build: l'app importa solo le copie in `src/assets/profile-icons/`. Le versioni `outline` e i PNG restano disponibili lì per usi futuri (es. achievement). Dato che la cartella è fuori da `src`, Vite non la include nel bundle.

### 2. Dati: `users/{uid}/profile/main` → `{ avatarId, updatedAt }`
Un solo documento con id fisso `main` (sotto `profile` perché in futuro conterrà altre preferenze). `profileApi.ts`: `getProfile(uid)` (restituisce `{ avatarId?: string }`, documento assente = vuoto) e `saveAvatar(uid, avatarId)` con `setDoc(..., { merge: true })`. Nessuna modifica alle regole; aggiunta di un test in `tests/firestore.rules.test.ts` per il nuovo percorso (proprietario consentito, altro utente e anonimo negati).
**Alternativa**: campo `avatarId` sul documento utente `users/{uid}` — scartata: oggi non esiste un documento radice e il pattern dell'app è una sottocollezione per tipo di dato.

### 3. Hook `useProfile(uid)` e salvataggio
`useProfile(uid)` legge il documento una volta (cache di modulo per uid) ed espone `{ avatarId, loading, error, saveAvatar }`. A differenza dei tips, l'avatar mostrato nel profilo cambia **solo dopo** il successo del salvataggio: il selettore tiene una scelta locale (`draftId`) usata per l'anteprima nel selettore stesso; `saveAvatar(draftId)` scrive, e solo a promessa risolta aggiorna stato e cache; in caso di errore restituisce `false` e imposta `error`, lasciando aperti selettore e scelta. Questo soddisfa "avatar del profilo non cambia" nello scenario di errore.

### 4. XP e livello: `useXpSummary(uid)`
Hook che legge `listCompletedSessions(uid)` all'apertura della pagina (nessuna cache: i dati cambiano a ogni sessione conclusa e la query è la stessa già usata da Storico), calcola `totalXp` e `levelProgress` e restituisce `{ xp, progress, loading, error }`. Errore → il profilo mostra un messaggio al posto di livello/XP ma resta utilizzabile (avatar, nome, modifica). La stessa pagina non duplica la logica di calcolo: riusa le funzioni pure di `xp.ts` (nessuna nuova costante di gioco).
**Alternativa**: cache globale degli XP aggiornata alla chiusura della sessione — scartata come ottimizzazione prematura per un'app single-user, e creerebbe un secondo punto di verità da tenere coerente.

### 5. Pagina e componenti
`ProfilePage` (route `/profile`) con `PageHeader title="Profilo"` e `actions` = pulsante "Modifica" (outline, 44px) che alterna la modalità selettore. Sezioni: identità (`AvatarBadge` 104px con `rounded` squircle proporzionale, nome in display, pill "Livello N" verde con testo scuro come nell'esempio), riquadro XP (XP totali in display grande, `XpBar` esistente con "xpIntoLevel / xpForNext XP"). Modalità modifica: `AvatarPicker` — griglia 4 colonne di bottoni 72px con `<img>` del badge, `aria-label` = etichetta, `aria-pressed` per la selezione, anello di accento sul selezionato — con pulsanti "Salva" (primary) e "Annulla" (secondary) e messaggio d'errore. Nome: `user.displayName ?? user.email`. Palette e font: token esistenti (`bg-surface-raised`, `text-accent`, `font-display`), non quelli dell'esempio (`#232f3e`, Montserrat), per coerenza con l'app.
**Alternativa**: selezione con salvataggio immediato al tocco — scartata: l'esempio prevede un pulsante "Modifica" e gli scenari richiedono "Salva/Annulla".

### 6. Navigazione
`TabBar`: quarta voce `{ to: '/profile', label: 'Profilo', icon: 'user' }` (nuova icona `user` in `Icon.tsx`, stile Lucide come le altre); `AppRoutes`: `<Route path="/profile" element={<ProfilePage uid={uid} />} />`. Quattro voci su 375px restano ≥ 80px ciascuna (target ≥ 44px). Il logout resta nell'`PageHeader` del Profilo come nelle altre sezioni principali.
**Alternativa**: accesso al profilo da un avatar nell'header — scartata: richiederebbe di modificare tutti gli header e l'esempio fornito è una pagina a sé.

## Risks / Trade-offs

- **[Rischio]** Un avatar rimosso dal preset in futuro lascia un id orfano nel documento → **Mitigazione**: `getAvatar` ricade sul predefinito (requisito "Avatar non più disponibile") con test.
- **[Rischio]** Aprire il Profilo rilegge tutto lo storico a ogni visita → **Trade-off accettato** (stessa query della pagina Storico, uso single-user su Spark); se crescesse troppo si potrà salvare un totale incrementale (livello 2 della progressione).
- **[Rischio]** Quattro voci nella tab bar riducono lo spazio per le etichette → **Mitigazione**: etichette brevi, verifica a 320px.
- **[Trade-off]** `import.meta.glob` con `?url`: gli SVG (< 4 KB) vengono incorporati da Vite come data URI nel bundle JS (circa +17 KB complessivi) invece di file separati in `dist/assets`; trascurabile per un'app single-user, e non serve alcuna richiesta di rete aggiuntiva per mostrare gli avatar.
- **[Trade-off]** Il nome dipende dall'account Google e non è modificabile dall'app.

## Migration Plan

Solo frontend e un documento creato al primo salvataggio: nessuna migrazione. Deploy con il merge su `main`; rollback = revert (il documento `profile/main` resta innocuo).
