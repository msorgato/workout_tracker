## Context

Motivazione in proposal.md, requisiti in specs/. Stato osservato:

- `PageHeader` (`src/components/ui/PageHeader.tsx`) mostra titolo, slot `actions` e un `IconButton` di logout controllato da `showLogout` (default `true`). Passano `showLogout={false}`: `SessionDetail`, `RoutineForm`, `RoutineCsvImport` e la sessione attiva; mostrano il logout `HistoryPage`, `RoutinesPage`, la sessione vuota e `ProfilePage`.
- La sessione attiva mette nelle `actions` `XpChip` e il pulsante "Termina".
- `useProfile(uid)` (`src/features/profile/useProfile.ts`) ha stato locale per istanza e una cache di modulo per uid: due istanze (header e pagina) avrebbero stati separati, e dopo `saveAvatar` l'header non si aggiornerebbe.
- `useAuth().user` fornisce l'uid; `AppRoutes` in `src/App.tsx` conosce già l'uid autenticato.
- `AvatarBadge` esiste già (`avatarId`, `size`, `className`); l'avatar predefinito è `muscle`.
- Palette e tema: token esistenti; area toccabile minima 44px come nel resto dell'app.

## Goals / Non-Goals

**Goals:**
- Avatar visibile in ogni header (tranne Profilo), cliccabile verso `/profile`.
- Stato del profilo condiviso: cambio avatar riflesso subito ovunque, una sola lettura.
- Logout nel Profilo; header della sessione ancora leggibile a 320px.

**Non-Goals:**
- Avatar nella tab bar, menu a comparsa, nome nell'header.
- Modifiche a dati, regole Firestore, XP/livello.

## Decisions

### 1. `ProfileProvider` + hook di consumo
Nuovo `src/features/profile/ProfileContext.tsx` con `ProfileProvider` (montato in `App.tsx` dentro il ramo autenticato, con l'uid) che contiene la logica oggi in `useProfile`: lettura una tantum, `avatarId`, `loading`, `error`, `saveAvatar` (applicato solo a scrittura riuscita), `clearError`. `useProfile()` diventa `useContext` (senza argomento uid) e restituisce la stessa forma, quindi `ProfilePage` cambia solo la chiamata. La cache di modulo non serve più: il provider vive per tutta la sessione di navigazione e si resetta al logout perché è montato solo da autenticati; si elimina per evitare due fonti di verità.
**Alternativa**: lasciare l'hook e aggiungere un evento/store esterno — scartata: più codice e stesso risultato di un context.

### 2. Avatar nell'header come `Link` a `/profile`
In `PageHeader`: al posto del logout, `<Link to="/profile" aria-label="Profilo">` con `AvatarBadge size={36}` (squircle) dentro un'area di 44×44 (`size-11`, centrata), così il target è ≥ 44px senza ingrandire il badge. Se il profilo non è caricato o è in errore si mostra l'avatar predefinito (`getAvatar(undefined)`), senza spinner né scatti di layout. Nella pagina Profilo l'avatar non compare: `PageHeader` legge `useLocation().pathname` e lo nasconde su `/profile`, oppure riceve `showAvatar={false}` da `ProfilePage` (si preferisce la prop esplicita, più semplice da testare e senza dipendere dal router).
**Alternativa**: avatar anche nella tab bar al posto dell'icona — rimandata, fuori richiesta.

### 3. Header della sessione a 320px
I tre elementi a destra (`XpChip`, "Termina", avatar 44) occupano circa 230px su 320px meno 32px di padding: resta poco spazio per il titolo, già `truncate` e `min-w-0 flex-1`. Si riduce il gap delle `actions` a `gap-1` nella sessione e si verifica a 320px; se non basta, si riduce `XpChip` (solo numero senza etichetta) a schermi < 360px. Il titolo resta troncato e il nome completo della routine rimane visibile nella pagina sotto.
**Alternativa**: spostare l'avatar sotto l'header nella sessione — scartata: contraddice "sempre in header".

### 4. Logout in `ProfilePage`
Pulsante "Esci" `secondary` (icona `log-out`, `fullWidth`, altezza ≥ 44px) in fondo alla pagina, dopo la card XP, chiama `useAuth().logout`. Si rimuovono `showLogout` e il relativo `IconButton` da `PageHeader` e le prop `showLogout={false}` dalle pagine che la passavano.

### 5. Stato a video della sessione nel `SessionContext`
`ActiveSessionPage` tiene in `useState` `restFor`, `weightInputs`, `repsInputs` ed `extraUnlocked`; allo smontaggio (cambio route) si perdono. Nuovo `useSessionDraft(sessionId)` in `src/features/session/useSessionDraft.ts` che custodisce questi quattro valori con i relativi setter; `SessionProvider` lo compone con `useActiveSession` ed espone il tutto da `useSession()`. Lo stato si azzera quando `session?.id` cambia o diventa `null` (chiusura o nuova sessione). Restano locali alla pagina (puro effetto grafico, ok perderli): `pops`, `lastAddedSet`, `poppedBadge`, `finishing`, `summary`. Il riepilogo di fine sessione (`summary`) resta locale: si mostra subito dopo "Termina" e non ha senso conservarlo altrove.
`restFor` diventa `{ exerciseIndex, seconds, deadline }` con `deadline = Date.now() + seconds*1000` calcolata al completamento della serie. `RestTimer` riceve `deadline` (al posto di creare `deadlineRef` al montaggio) e calcola `remaining` da quella; al rientro i secondi mostrati sono quelli reali. Se alla ripresa `deadline` è già passata, `ActiveSessionPage` azzera `restFor` senza montare il timer: niente suono o vibrazione tardivi (l'utente era altrove e l'avviso non avrebbe senso).
Il timer **non** suona mentre l'utente è in un'altra sezione (il componente è smontato): compromesso accettato, un timer globale con audio fuori pagina è un altro tema.
**Alternative**: montare `ActiveSessionPage` sempre e nasconderla con CSS (mantiene tutto ma tiene vivi effetti e listener, e complica routing e animazioni); persistere su `sessionStorage` (sopravvive anche al ricaricamento ma aggiunge serializzazione e scenari di stato obsoleto, fuori richiesta).

## Risks / Trade-offs

- **[Rischio]** `RestTimer` cambia contratto (`deadline` invece di `targetSeconds` + stato interno) → **Mitigazione**: è usato solo da `ActiveSessionPage`; si mantiene `targetSeconds` per il disegno dell'anello e si verifica avvio, "Salta" e scadenza a mano.
- **[Rischio]** Stato obsoleto riusato da una sessione successiva → **Mitigazione**: reset su cambio di `session?.id`, con il caso coperto dal requisito.

- **[Rischio]** Header della sessione affollato a 320px → **Mitigazione**: titolo troncato, gap ridotti, `XpChip` compatto sotto 360px; verifica manuale a 320px.
- **[Rischio]** Logout meno raggiungibile (due tocchi) → **Trade-off accettato** (richiesta esplicita dell'utente).
- **[Rischio]** `useProfile()` ora fallisce fuori dal provider → **Mitigazione**: errore esplicito se manca il provider, e il provider è montato sopra tutte le route autenticate.
- **[Trade-off]** Il provider legge il profilo anche se l'utente non apre mai il Profilo: una lettura di un documento piccolo, trascurabile.

## Migration Plan

Solo frontend, nessuna migrazione. Deploy con il merge su `main`; rollback = revert. La change va archiviata dopo `user-profile`.
