## 1. Avatar e dati

- [x] 1.1 Copiare i 16 SVG `badge` da `gym-profile-icons/gym-profile-icons/svg/badge/` in `src/assets/profile-icons/` e creare `src/features/profile/avatars.ts` (`AVATARS` con id, etichetta italiana e url via `import.meta.glob`, `DEFAULT_AVATAR_ID = 'muscle'`, `getAvatar` con fallback sull'id sconosciuto) con test `tests/avatars.test.ts` (16 avatar, id univoci, etichette non vuote, id sconosciuto e `undefined` → muscle); aggiungere il test a `test:unit` e verificare con `npm run test:unit` e `npm run build` (gli SVG finiscono in `dist/assets`)
- [x] 1.2 Creare `src/features/profile/profileApi.ts` (`getProfile`, `saveAvatar` con `setDoc` merge su `users/{uid}/profile/main`) e aggiungere a `tests/firestore.rules.test.ts` il caso per quel percorso (proprietario consentito, altro utente e anonimo negati); verificare con `npx tsc -b` e, dove l'emulatore è disponibile, con `npm run test:rules`
- [x] 1.3 Creare `useProfile(uid)` (lettura con cache di modulo, `saveAvatar` che aggiorna stato e cache solo a scrittura riuscita e restituisce `false` + `error` in caso di errore) e `useXpSummary(uid)` (storico → `totalXp` → `levelProgress`, con `loading` ed `error`); verificare con `npx tsc -b` e `npm run lint`

## 2. Pagina Profilo

- [x] 2.1 Aggiungere l'icona `user` a `src/components/ui/Icon.tsx`, la quarta voce "Profilo" in `TabBar` e la route `/profile` in `App.tsx`; verificare a 320px e 375px che le quattro voci siano leggibili, toccabili (≥ 44px) e che la voce attiva si evidenzi
- [x] 2.2 Creare `AvatarBadge` e `ProfilePage` (intestazione con "Modifica", identità con avatar 104px, nome `displayName ?? email`, pill "Livello N", XP totali, `XpBar` con "xpIntoLevel / xpForNext XP", stato di errore dello storico senza bloccare avatar e nome) con i token e i font dell'app; verificare a 375px che il layout sia fedele all'esempio `profilo.html` e che livello, XP e barra coincidano con quelli del riepilogo di fine sessione
- [x] 2.3 Creare `AvatarPicker` (griglia 4 colonne di bottoni ≥ 44px con `aria-label` e `aria-pressed`, selezione evidenziata, anteprima immediata nel selettore, "Salva" e "Annulla", messaggio d'errore con selettore ancora aperto) e collegarlo al pulsante "Modifica"; verificare cambio avatar, annullamento, persistenza dopo ricaricamento e, con rete bloccata, che compaia l'errore senza cambiare l'avatar del profilo

## 3. Verifica d'insieme

- [x] 3.1 Verificare che `npm run build`, `npm run lint` e `npm run test:unit` passino e che le modifiche siano limitate a `src/assets/profile-icons/`, `src/features/profile/`, `Icon.tsx`, `TabBar.tsx`, `App.tsx`, `package.json` e ai test
- [x] 3.2 Prova manuale a 375px e 320px: aprire il Profilo da utente con e senza sessioni concluse, cambiare avatar, ricaricare, controllare con "riduci movimento" attivo e confrontare l'aspetto con `gym-profile-icons/profilo.html` (palette nera dell'app al posto del blu-grigio)

## Workflow follow-up

- Archiviare la change dopo la verifica manuale.
- La cartella `gym-profile-icons` resta nella radice come concept: non va toccata né copiata nel build oltre ai 16 SVG badge.
- Gli achievement/badge restano per una change futura (le icone `outline` e `profilo.html` sono ancora nella cartella).
