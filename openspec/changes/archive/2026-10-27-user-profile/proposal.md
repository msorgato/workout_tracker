## Why

Gli XP e il livello introdotti con la change `xp-level-up-animations` si vedono solo per un istante nel riepilogo di fine sessione: dopo, l'utente non ha un posto dove consultare la propria esperienza accumulata. Serve una sezione **Profilo** che mostri livello, XP totali e avanzamento verso il livello successivo, con un'identità visiva personale: un'icona scelta da un set di avatar a tema palestra.

## What Changes

- **Nuova sezione Profilo** raggiungibile da una quarta voce nella tab bar (Routine, Sessione, Storico, **Profilo**), con il layout dell'esempio fornito in `gym-profile-icons/profilo.html` adattato ai token e ai font dell'app (palette nero/verde, Barlow Condensed + Inter):
  - intestazione "Profilo" con pulsante "Modifica";
  - identità: avatar a badge, nome dell'account Google e pill "Livello N";
  - XP totali, barra di avanzamento verso il livello successivo ("N / M XP") calcolati dallo storico delle sessioni con le regole già esistenti.
- **Icona del profilo da un preset di 16 avatar** (barbell, bolt, calendar, crown, dumbbell, flame, heartbeat, kettlebell, medal, muscle, shaker, sneaker, star, stopwatch, target, trophy), forniti come SVG in `gym-profile-icons`. Le 16 versioni "badge" (icona nera su squircle verde) vengono copiate negli asset dell'app e servite dal build.
- **Modifica dell'icona**: il pulsante "Modifica" apre un selettore con la griglia dei 16 avatar; la scelta si vede subito nell'anteprima, "Salva" la memorizza, "Annulla" la scarta. Senza scelta salvata si usa un'icona predefinita (muscle, come nell'esempio).
- **Persistenza**: la scelta è salvata su Firestore in `users/{uid}/profile/main` (campo `avatarId`), quindi segue l'utente tra dispositivi. Le regole di sicurezza esistenti su `users/{uid}/**` la coprono già.
- **Fuori dalla schermata** (come richiesto): badge/achievement, statistiche "Workout / Giorni streak / Record", elenco "Ultimi allenamenti". Restano per una fase successiva.
- Nessuna modifica al calcolo di XP e livelli, alle sessioni, alle routine o al riepilogo di fine sessione.

## Capabilities

### New Capabilities
- `user-profile`: pagina Profilo con identità (avatar, nome), livello, XP totali e avanzamento, selezione e salvataggio dell'avatar da un preset.

### Modified Capabilities
- `app-navigation`: la tab bar passa da tre a quattro voci con l'aggiunta di Profilo (modifica del requisito "Tab bar inferiore con icone", con `MODIFIED` e testo completo).

## Impact

- **Codice nuovo**: `src/assets/profile-icons/*.svg` (16 file copiati), `src/features/profile/` (`avatars.ts` registro id/etichetta/url, `profileApi.ts`, `useProfile.ts`, `useXpSummary.ts`, `ProfilePage.tsx`, `AvatarBadge.tsx`, `AvatarPicker.tsx`), un'icona "user" in `Icon.tsx`.
- **Codice modificato**: `src/App.tsx` (route `/profile`), `src/components/ui/TabBar.tsx` (quarta voce), test delle regole Firestore (nuovo percorso).
- **Dati**: nuovo documento `users/{uid}/profile/main` con `avatarId` e `updatedAt`, creato al primo salvataggio. Nessuna migrazione.
- **Letture Firestore**: una lettura del documento profilo e una dello storico completo (la stessa query già usata da Storico e dal riepilogo di fine sessione) a ogni apertura del Profilo. Trascurabile per l'uso single-user sul piano Spark.
- **Dipendenze**: nessuna nuova. Le icone sono SVG statici nel build, coerenti con il vincolo "nessun upload / nessun Cloud Storage".
- **Decisioni confermate dall'utente**:
  - nome mostrato = nome dell'account Google, o email se mancante; l'handle `@username` dell'esempio non c'è perché l'app non ha il concetto di username;
  - stile: si mantengono palette e font dell'app (nero/verde, Barlow Condensed + Inter); il blu-grigio dell'esempio è sostituito dal nero, il layout resta quello dell'esempio;
  - cartella icone: si copiano i 16 SVG badge negli asset dell'app; la cartella `gym-profile-icons` **resta dov'è** (nella radice del progetto, fuori dal build) come materiale di concept, con `profilo.html`, le icone `outline` e i PNG;
  - achievement/badge sbloccabili: non gestiti ora, possibile sviluppo futuro.
- **Fuori scope**: achievement/badge sbloccabili, serie di giorni consecutivi, record, ultimi allenamenti, nome utente e handle modificabili, caricamento di immagini proprie, ricerca o ordinamento degli avatar.