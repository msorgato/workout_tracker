## Why

L'avatar scelto nel Profilo si vede solo aprendo quella sezione, ma è la parte più personale e gradevole dell'interfaccia: l'utente vuole vederlo sempre, in qualunque sezione si trovi, e usarlo come scorciatoia verso il Profilo.

## What Changes

- **Avatar sempre visibile nell'header**: ogni header di pagina mostra in alto a destra il badge dell'avatar del profilo (circa 40px, 36px se serve spazio); toccandolo si apre il Profilo. Vale per le sezioni principali (Routine, Sessione, Storico), per la sessione attiva e per le pagine di dettaglio/modulo. Nella pagina Profilo l'avatar nell'header non compare (è già in grande nella pagina).
- **Logout spostato nel Profilo**: il pulsante "Esci" esce da tutti gli header e diventa un'azione della pagina Profilo (in fondo alla pagina, con target ≥ 44px). Viene meno la proprietà `showLogout` dell'header.
- **Sessione attiva**: l'header mantiene il contatore XP e il pulsante "Termina" e aggiunge l'avatar; il titolo si tronca per fare spazio, anche a 320px.
- **Stato del profilo condiviso**: l'avatar è letto una sola volta e condiviso tra header e pagina Profilo tramite un provider, così il cambio di avatar si riflette subito ovunque senza riletture.
- **Stato a video della sessione conservato durante la navigazione**: con l'avatar sempre a portata di tocco è facile lasciare la pagina Sessione per sbaglio. Oggi lo stato locale della pagina (timer di recupero, peso e ripetizioni digitati ma non confermati, serie extra sbloccate) si perde allo smontaggio. Passa nel contesto della sessione: tornando su Sessione si ritrova tutto com'era, e il countdown del recupero continua in tempo reale (scadenza assoluta) anche mentre si è altrove.
- Nessun cambio alla tab bar (la voce Profilo resta com'è), al calcolo di XP/livello, ai dati su Firestore o alle regole di sicurezza.

## Capabilities

### New Capabilities
Nessuna.

### Modified Capabilities
- `app-navigation`: il requisito "Header di pagina" passa da "titolo + logout" a "titolo + avatar del profilo con accesso al Profilo"; nuovo requisito per l'avatar sempre visibile e per la posizione del logout nel Profilo.
- `workout-session`: nuovo requisito per cui lo stato a video della sessione attiva (recupero in corso, valori digitati, serie extra sbloccate) sopravvive alla navigazione verso altre sezioni.

## Impact

- **Codice modificato**: `src/components/ui/PageHeader.tsx` (avatar al posto del logout, niente `showLogout`), `src/features/profile/useProfile.ts` (da hook con stato proprio a consumer di un provider), `src/features/profile/ProfilePage.tsx` (pulsante "Esci"), `src/App.tsx` (provider), le pagine che passavano `showLogout={false}` (`SessionDetail`, `RoutineForm`, `RoutineCsvImport`, `ActiveSessionPage`).
- **Codice nuovo**: `src/features/profile/ProfileContext.tsx` (provider + hook di consumo), `src/features/session/useSessionDraft.ts` (stato a video della sessione, esposto da `SessionContext`).
- **Codice modificato (sessione)**: `SessionContext.tsx`, `ActiveSessionPage.tsx` (legge/scrive lo stato dal contesto), `RestTimer.tsx` (riceve la scadenza assoluta invece di ripartire da zero al montaggio).
- **Dati e Firestore**: nessuna modifica; una sola lettura di `users/{uid}/profile/main` per sessione di navigazione (oggi già così, grazie alla cache di modulo).
- **Dipendenze tra change**: richiede la change `user-profile` (avatar, `AvatarBadge`, `useProfile`) e va archiviata dopo di essa. Le due change modificano `app-navigation` su requisiti diversi (tab bar vs header), quindi non confliggono.
- **Rischio principale**: spazio nell'header della sessione a 320px (titolo + contatore XP + "Termina" + avatar); da verificare a mano.
- **Fuori scope**: avatar nella tab bar, menu a tendina dall'avatar, nome utente nell'header, achievement.
