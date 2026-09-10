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
- `npm run test:rules` — verifica le Firestore Security Rules sull'emulatore (richiede Java)

## Setup Firebase (una tantum)

1. Crea un progetto Firebase sul piano **Spark** (gratuito).
2. In Authentication, abilita il provider **Google**.
3. In Firestore, crea il database in modalità produzione.
4. Registra un'app web nel progetto e copia i valori di config nel tuo `.env` locale.
5. Restringi l'API key su Google Cloud Console (APIs & Services → Credentials) alle sole
   API Firebase necessarie (Identity Toolkit, Firestore, ecc.).
6. Deploya le regole e gli indici con `firebase deploy --only firestore`.

## Deploy e CI/CD

Il deploy usa Firebase Hosting con i workflow ufficiali generati da
`firebase init hosting:github` (richiede repo GitHub collegata e progetto Firebase creati):

- push su `main` → deploy automatico in produzione
- ogni pull request → preview deploy temporaneo

Questi workflow non sono ancora stati generati in questo repository: vanno creati eseguendo
`firebase init hosting:github` una volta completato il setup del progetto Firebase (vedi sopra).
