## Why

Nell'header della sessione attiva il titolo ("Sessione libera" o il nome della routine) condivide la riga con contatore XP, "Termina" e avatar: su schermi stretti resta poco spazio e il titolo viene troncato con i puntini, fino a diventare quasi illeggibile a 320px. Un titolo che dice in quale sessione ci si trova va invece mostrato per intero.

## What Changes

- **Header della sessione su due righe**: la prima riga contiene il titolo (a tutta la larghezza disponibile) e l'avatar; la seconda riga contiene il contatore XP a sinistra e il pulsante "Termina" a destra. Il titolo non condivide più la riga con le azioni.
- **Titoli lunghi**: in tutti gli header il titolo può andare su due righe (poi puntini) invece di essere troncato su una sola, così nomi di routine lunghi restano leggibili.
- **Sessione vuota e altre pagine**: nessun cambio di aspetto per gli header che hanno solo titolo e avatar (Routine, Storico, Profilo, sessione non avviata).
- Nessuna modifica a dati, XP, timer, tab bar o logica di sessione.

## Capabilities

### New Capabilities
Nessuna.

### Modified Capabilities
- `app-navigation`: il requisito "Header della sessione attiva" cambia (non più titolo troncato su una riga con contatore XP, "Termina" e avatar, ma header su due righe con titolo leggibile); il requisito "Header di pagina" aggiunge che i titoli lunghi vanno a capo fino a due righe.

## Impact

- **Codice modificato**: `src/components/ui/PageHeader.tsx` (nuova prop opzionale per la seconda riga, titolo con `line-clamp-2`), `src/features/session/ActiveSessionPage.tsx` (passa contatore XP e "Termina" alla seconda riga), ed eventualmente `src/features/xp/XpChip.tsx` (rimuovere il restringimento sotto 360px introdotto per fare spazio).
- **Dati e Firestore**: nessuna modifica.
- **Trade-off**: l'header fisso diventa più alto durante la sessione (circa una riga in più, ~48px), quindi resta meno spazio per il contenuto mentre si scorre; da valutare a mano a 320px.
- **Fuori scope**: nascondere l'header allo scorrimento, titoli modificabili, nome della routine mostrato altrove.
