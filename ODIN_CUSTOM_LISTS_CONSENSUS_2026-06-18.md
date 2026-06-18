# ODIN — Custom Lists & No-Date: Consensus (TASK 016)

Data: 2026-06-18 · Consensus reale `consensus7.ps1` (OpenRouter, 7/7 modelli, **nessun Haiku**). Raw: `_consensus/_odin_consensus_raw.md`.

## Domanda
Validare prima dell'implementazione: rinomina liste, task senza data come backlog, migrazione liste default, hint UX — rischi (perdita dati, migrazione, regressioni, mobile, a11y, GitHub Pages static).

## Esito del consensus (7/7)
**Accordo:**
- Nessuna perdita dati diretta da rinomina o cambio filtri.
- Nessun problema GitHub Pages (app statica).
- Hint UX = utile, basso rischio.
- Rinomina liste = standard, rischi minori (validazione no-duplicati/no-vuoto, id stabile).

**Disaccordi:**
- Cambio filtri OGGI/SETTIMANA (no-date esclusi): metà modelli BLOCKER (regressione: i no-date "spariscono" dalle viste), metà MAJOR/MINOR. Mitigazione proposta: vista/toggle dedicata per i no-date.
- Migrazione automatica liste default: rischio BLOCKER di corruzione dati per alcuni → **sconsigliata**.

## Decisione adottata (consensus-aligned)
1. ✅ **Implementare:** no-date fuori da OGGI/SETTIMANA `(t.due && t.due<=...)` + **vista "Prima o poi"** dedicata (mitiga il BLOCKER: i no-date NON spariscono, sono in una vista chiara + in TUTTE).
2. ✅ **Implementare:** rinomina liste con validazione (no duplicati, no vuoto), **id invariato** → zero rischio dati.
3. ✅ **Implementare:** hint UX "vuoto = prima o poi" nel form.
4. ❌ **NON implementare:** migrazione automatica liste default (rischio dati) → l'utente le crea con l'add esistente.
5. 🔒 **Sicurezza:** backup pre-modifica creato (`_consensus/index_pre_task016_backup.html`); nessun segreto; **deploy = NON eseguito** (commit su branch, non main).

CONFIDENZA: alta sul piano (1,2,3 + vista backlog; niente migrazione auto).
