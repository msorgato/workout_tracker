## Why

Due difetti emersi usando la sessione attiva:

1. **Le serie non hanno mai una fine.** La routine definisce `targetSets` per ogni esercizio, ma `createSessionFromRoutine` non lo copia nella sessione (`SessionExercise` ha solo `targetRestSeconds` e `targetWeight`). L'app quindi non sa quante serie sono previste: il pulsante "Serie N completata" resta sempre attivo e si può registrare un numero infinito di serie.
2. **Il peso viene mostrato troncato.** Con il passo di 2,5 kg il valore corretto è calcolato (`stepValue('40', 2.5) → '42.5'`, già coperto da test), ma nel `Stepper` il campo valore è stretto tra due pulsanti da 44px, in una card su due colonne (Peso e Reps affiancati). Su schermi piccoli resta poco spazio per un testo grande (`text-4xl`) e la parte dopo il punto (es. "42.5" → "42.") viene tagliata. Causa da confermare in verifica a 320–375px.

## What Changes

- **Serie target nella sessione**: l'avvio di una sessione da routine copia `targetSets` nell'esercizio della sessione. Le sessioni libere, gli esercizi aggiunti in corso d'opera e le sessioni già in corso create prima di questa modifica non hanno un target e restano senza limite (comportamento attuale).
- **Avanzamento visibile**: la card mostra "Serie 2/4" quando c'è un target; il pulsante recita "Serie 2 completata" come oggi.
- **Esercizio completato**: raggiunto il numero di serie previsto, la card mostra lo stato "Completato" (es. "4/4"), il pulsante principale "Serie N completata" non è più mostrato e compare un'azione secondaria "Aggiungi serie extra" per registrarne altre di proposito. Le serie oltre il target sono indicate come extra (es. "5/4").
- **Peso e ripetizioni sempre leggibili**: i due stepper passano su righe a tutta larghezza (uno sotto l'altro) con il valore in uno spazio sufficiente per almeno 6 caratteri (es. "142,5") anche a 320px di larghezza; nessun valore viene tagliato.
- Nessuna modifica a Firestore Security Rules, alle routine, al timer di recupero o allo storico. Il nuovo campo `targetSets` è opzionale nei documenti di sessione, quindi nessuna migrazione.

## Capabilities

### New Capabilities
(nessuna)

### Modified Capabilities
- `workout-session`: aggiunta di requisiti su serie target (copia dalla routine, avanzamento, completamento, serie extra) e sulla leggibilità del peso. Il delta usa solo `ADDED`.

## Impact

- **Codice modificato**: `src/lib/types.ts` (campo `targetSets?` in `SessionExercise`), `src/features/session/sessionsApi.ts` (copia di `targetSets` in `createSessionFromRoutine`), `src/features/session/ActiveSessionPage.tsx` (indicatore, stato completato, serie extra, layout steppers), `src/components/ui/Stepper.tsx` (valore leggibile), nuova funzione pura per lo stato di avanzamento con test Vitest.
- **Dati**: nuovo campo opzionale `targetSets` negli esercizi del documento di sessione. Nessun impatto su costi o quote Spark.
- **Fuori scope**: precompilare le ripetizioni da `targetReps`, avanzamento automatico al prossimo esercizio, modifica del numero di serie target durante la sessione, separatore decimale con la virgola in visualizzazione (l'input accetta già virgola e punto).
- **Assunzione**: il timer di recupero parte dopo ogni serie, compresa l'ultima dell'esercizio, come oggi.
