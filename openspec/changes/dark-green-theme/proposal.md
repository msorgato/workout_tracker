## Why

L'interfaccia attuale usa lo stile di default grezzo del template Tailwind (sfondo bianco, grigi neutri, blu/verde/rosso presi senza un sistema coerente). L'utente vuole un'identità visiva più curata e distintiva: palette scura (nero/grigio scuro) con verde brillante come colore di accento, da applicare in modo coerente su tutta l'app.

## What Changes

- Introduzione di una palette di design basata su token CSS (variabili, non classi Tailwind sparse): sfondo quasi nero, superfici grigio scuro, bordi sottili, testo chiaro/attenuato, verde brillante come accento primario.
- Sostituzione di tutti gli usi hardcoded di colori Tailwind (`bg-white`, `text-gray-*`, `bg-blue-*`, `bg-green-*`, `border-gray-*`, `bg-red-*`, ecc.) nei componenti esistenti con i nuovi token.
- Consolidamento del colore "azione primaria" (attualmente un mix di blu e verde a seconda del componente) sul verde brillante in tutta l'app; il rosso resta riservato alle azioni distruttive (elimina/conferma eliminazione), adattato alla leggibilità su sfondo scuro.
- **BREAKING (visivo, non funzionale)**: sostituisce integralmente il tema chiaro attuale — non viene introdotto un toggle chiaro/scuro in questa versione, l'app avrà un solo tema (scuro+verde).

## Capabilities

### New Capabilities
- `ui-theme`: definizione di una palette di design a token (sfondo scuro, superfici, bordi, testo, accento verde) applicata in modo coerente su tutte le viste dell'app.

### Modified Capabilities
(nessuna — nessuna funzionalità esistente cambia comportamento, solo aspetto visivo.)

## Impact

- **Codice modificato**: `src/index.css` (nuovi design token via `@theme` di Tailwind v4), e le classi Tailwind in tutti i componenti con markup/stile: `App.tsx`, `features/auth/LoginPage.tsx`, `features/auth/RouteGuard.tsx`, `features/routines/*.tsx`, `features/session/ActiveSessionPage.tsx`, `features/rest-timer/RestTimer.tsx`, `features/history/*.tsx`, `components/ExerciseAutocomplete.tsx`.
- **Nessuna modifica a logica, modello dati, Firestore o funzionalità**: puro restyling, zero impatto su costi/piano Spark.
- **Fuori scope per questa versione**: toggle chiaro/scuro, rebrand del favicon/nome app, animazioni/transizioni elaborate (restano minime, coerenti con lo stile minimale attuale).
