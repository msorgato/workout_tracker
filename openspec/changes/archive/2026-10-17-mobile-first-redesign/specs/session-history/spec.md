## ADDED Requirements

### Requirement: Riepilogo per sessione nell'elenco
Il sistema SHALL mostrare per ogni sessione dello storico una card con nome (routine o "Sessione libera"), orario di inizio, durata, numero di esercizi, numero totale di serie e volume totale (somma di peso × ripetizioni), calcolati dai dati della sessione senza letture aggiuntive.

#### Scenario: Sessione completata
- **WHEN** una sessione di 52 minuti contiene 2 esercizi con serie 3×(60 kg × 10) e 2×(20 kg × 12)
- **THEN** la card mostra durata 52 min, 2 esercizi, 5 serie e volume 2.280 kg

#### Scenario: Sessione senza fine registrata
- **WHEN** una sessione non ha un orario di fine
- **THEN** la card non mostra la durata ma mostra gli altri valori

### Requirement: Raggruppamento per giorno
Il sistema SHALL raggruppare le sessioni dello storico per giorno di inizio, dal più recente, con un'intestazione per ciascun giorno.

#### Scenario: Due sessioni lo stesso giorno
- **WHEN** esistono due sessioni iniziate lo stesso giorno e una del giorno precedente
- **THEN** l'elenco mostra due gruppi, il primo con le due sessioni del giorno più recente
