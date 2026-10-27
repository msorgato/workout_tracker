## 1. Stato del profilo condiviso

- [x] 1.1 Creare `src/features/profile/ProfileContext.tsx` con `ProfileProvider` (logica di `useProfile`: lettura una tantum, `avatarId`, `loading`, `error`, `saveAvatar` applicato solo a scrittura riuscita, `clearError`) e `useProfile()` come consumer che lancia un errore se manca il provider; rimuovere la cache di modulo da `useProfile.ts` (il file diventa il re-export o viene eliminato); montare il provider in `App.tsx` sopra le route autenticate; aggiornare `ProfilePage` alla nuova firma; verificare con `npx tsc -b`, `npm run lint` e `npm run test:unit`

## 2. Header e logout

- [x] 2.1 Modificare `PageHeader`: rimuovere `showLogout` e il logout, aggiungere `Link` a `/profile` con `AvatarBadge` 36px in area 44×44 (`aria-label="Profilo"`) e prop `showAvatar` (default `true`); aggiornare le chiamate (`SessionDetail`, `RoutineForm`, `RoutineCsvImport`, `ActiveSessionPage`) togliendo `showLogout={false}` e passare `showAvatar={false}` da `ProfilePage`; verificare con `npx tsc -b` e `npm run lint`
- [x] 2.2 Aggiungere a `ProfilePage` il pulsante "Esci" (secondary, icona `log-out`, a tutta larghezza, ≥ 44px) in fondo dopo la card XP, collegato a `useAuth().logout`; verificare con `npx tsc -b`
- [x] 2.3 Header della sessione a 320px: ridurre il gap delle `actions`, rendere compatto `XpChip` sotto 360px se necessario, titolo troncato; verificare con `npm run build` e a 320px e 375px che contatore XP, "Termina" e avatar stiano nello schermo senza scroll orizzontale

## 3. Stato della sessione conservato

- [x] 3.1 Creare `src/features/session/useSessionDraft.ts` (`restFor` con `deadline`, `weightInputs`, `repsInputs`, `extraUnlocked` e setter, azzerati al cambio o alla fine di `session?.id`) ed esporlo da `SessionProvider`/`useSession()`; spostare in esso lo stato oggi locale a `ActiveSessionPage` (resta locale: pops, lastAddedSet, poppedBadge, finishing, summary); aggiungere test unitari della logica pura (reset al cambio di sessione) se estraibile e includerli in `test:unit`; verificare con `npx tsc -b`, `npm run lint` e `npm run test:unit`
- [x] 3.2 Modificare `RestTimer` per ricevere `deadline` e calcolare i secondi rimanenti da quella (invece di crearla al montaggio), e fare in modo che `ActiveSessionPage` azzeri `restFor` senza montare il timer se la scadenza è già passata; verificare con `npx tsc -b` e `npm run build`

## 4. Verifica d'insieme

- [x] 4.1 Verificare che `npm run build`, `npm run lint` e `npm run test:unit` passino e che le modifiche siano limitate a `PageHeader`, `ProfileContext`/`useProfile`, `ProfilePage`, `App.tsx`, alle pagine che passavano `showLogout`, e ai file di sessione/timer (`SessionContext`, `useSessionDraft`, `ActiveSessionPage`, `RestTimer`)
- [x] 4.2 Prova manuale a 375px e 320px, compresa la sessione: avvia un recupero, vai al Profilo e torna (il timer prosegue dal tempo reale), lascia scadere il recupero altrove (al ritorno nessun timer né suono), digita peso/ripetizioni, naviga e torna (valori conservati), sblocca una serie extra e verifica che resti, termina e riavvia (stato pulito); poi: avatar presente in Routine, Sessione (vuota e attiva), Storico, dettaglio sessione, modulo routine e import CSV; tocco avatar → Profilo; avatar assente nel Profilo; cambio avatar e subito visibile nelle altre sezioni; "Esci" dal Profilo disconnette; ricarica senza avatar salvato → predefinito

## Workflow follow-up

- Archiviare dopo `user-profile` (questa change dipende dalla sua implementazione e dalla sua spec).
