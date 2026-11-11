## 1. Header

- [x] 1.1 In `PageHeader` aggiungere la prop opzionale `toolbar` (seconda riga sotto titolo e avatar, `flex items-center justify-between gap-2`, nello stesso elemento sticky), cambiare il `h1` da `truncate` a `line-clamp-2 break-words` con interlinea stretta e allineare in alto l'avatar (`items-start` nella riga 1); verificare con `npx tsc -b` e `npm run lint`
- [x] 1.2 In `ActiveSessionPage` spostare `XpChip` e "Termina" da `actions` a `toolbar` e rimuovere da `XpChip` il restringimento `max-[359px]:px-2`; verificare con `npx tsc -b` e `npm run build`

## 2. Verifica

- [x] 2.1 Verificare che `npm run build`, `npm run lint` e `npm run test:unit` passino e che le modifiche siano limitate a `PageHeader.tsx`, `ActiveSessionPage.tsx` e `XpChip.tsx`
- [x] 2.2 Prova manuale a 375px e 320px: sessione libera ("Sessione libera" per intero con avatar a destra), sessione da routine con nome corto e con nome molto lungo (due righe, puntini oltre), contatore XP e "Termina" sulla seconda riga senza scroll orizzontale, header che resta in alto scorrendo, altre pagine (Routine, Storico, Profilo, modulo routine) invariate con titoli corti e leggibili con titoli lunghi
