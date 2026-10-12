# workout_tracker

Tracker per sessioni di allenamento in palestra oppure outdoor. App React + Vite +
TypeScript con Firebase (Authentication + Firestore, piano Spark).

Vedi `workout-tracker-spec.md` per la specifica completa e `openspec/changes/workout-tracker-mvp/`
per proposal/design/tasks.

## Setup locale

```bash
npm install
cp .env.example .env   # poi valorizza con la config del tuo progetto Firebase
npm run dev
```

Variabili richieste in `.env` (dalla console Firebase, sezione impostazioni progetto → app web):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Script disponibili

- `npm run dev` — server di sviluppo Vite
- `npm run build` — type-check (`tsc -b`) + build di produzione in `dist/`
- `npm run preview` — anteprima locale della build
- `npm run lint` — lint con oxlint
- `npm run format` / `npm run format:check` — formattazione con Prettier
- `npm run test:unit` — test puri (nessuna dipendenza da Firebase, es. parsing CSV)
- `npm run test:rules` — security rules + test di integrazione Firestore sull'emulatore (richiede Java)

## Sviluppo locale contro gli emulatori Firebase

Per lavorare senza toccare il progetto Firebase reale (es. mentre si prova import/sessioni):

```bash
firebase emulators:start --only auth,firestore --project demo-workout-tracker
```

In un altro terminale, con `VITE_USE_FIREBASE_EMULATORS=true` in `.env.local` (oltre ai valori
in `.env`, anche fittizi va bene per i soli emulatori):

```bash
npm run dev
```

L'app si collega agli emulatori invece che al progetto reale; il login Google apre l'account
chooser fittizio dell'Auth Emulator invece del vero OAuth Google.

## Setup Firebase (una tantum)

1. Crea un progetto Firebase sul piano **Spark** (gratuito).
2. In Authentication, abilita il provider **Google**.
3. In Firestore, crea il database in modalità produzione.
4. Registra un'app web nel progetto e copia i valori di config nel tuo `.env` locale.
5. Restringi l'API key su Google Cloud Console (APIs & Services → Credentials) alle sole
   API Firebase necessarie (Identity Toolkit, Firestore, ecc.).
6. Deploya le regole e gli indici con `firebase deploy --only firestore`.

## Deploy e CI/CD

Il deploy usa Firebase Hosting con i workflow GitHub Actions generati da
`firebase init hosting:github` (`.github/workflows/firebase-hosting-*.yml`):

- push su `main` → deploy automatico in produzione
- ogni pull request → preview deploy temporaneo

La build in CI legge la config Firebase da GitHub Actions Variables (Settings → Secrets and
variables → Actions → Variables), non da secrets: la Firebase web config non è sensibile per
design (vedi `workout-tracker-spec.md`).
