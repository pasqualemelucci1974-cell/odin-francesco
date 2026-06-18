# ODIN — Custom Lists & No-Date: Implementation (TASK 016)

Data: 2026-06-18 · File: `index.html` (single-file PWA). Backup: `_consensus/index_pre_task016_backup.html`.
**Deploy: NON eseguito.** Modifiche su branch `feat/custom-lists-nodate` (GitHub Pages serve `main` → merge = deploy = decisione di Pasquale).

## Audit (cosa c'era già)
- Liste in `state.settings.lists` (default inbox/studio/esami/salute/vita). `addList()` e `deleteList()` **già esistenti** (inbox protetta, riassegna task).
- Task: `t.listId`, `t.due` (già nullable), `t.done`. Form CREA MISSION già con selettore lista + data opzionale.
- Overdue (riga 2307): `t.due && t.due < today` → no-date **già** non-overdue (corretto).
- **Gap:** mancava la rinomina; i task **senza data comparivano in OGGI/SETTIMANA** (filtro `!t.due || ...`).

## Modifiche applicate (5, mirate)
1. **No-date fuori da OGGI/SETTIMANA** — `renderTasks()`: `today`/`week` ora `t.due && t.due <= ...` (esclude i senza-data). Idem `tasksToday` (riga ~1847).
2. **Nuova vista "Prima o poi"** — bottone `data-view="someday"` + filtro `!t.done && !t.due` → backlog dei task senza data (mitiga regressione: restano trovabili qui + in TUTTE).
3. **Rinomina liste** — `renameList(id)` (prompt, validazione no-duplicati/no-vuoto, **id invariato**) + matita ✏️ in `renderListsManager` (delete resta, inbox protetta).
4. **Hint UX** — label Scadenza: "(vuoto = prima o poi)".
5. (Add/Delete liste già presenti, invariati.)

NON fatto (per sicurezza dati, da consensus): migrazione automatica liste default.

## QA (Playwright, localStorage di test) — PASS
Verifica programmatica (`browser_evaluate`), task seed dated/no-date:
| Vista | task con data | task senza data |
|---|---|---|
| OGGI | ✅ presente | ✅ **assente** (fix) |
| Prima o poi | assente | ✅ **presente** (backlog) |
| Tutte | ✅ | ✅ (trovabile) |
- `renameList` rinomina e persiste ✓. View tabs renderizzati: **Oggi · Settimana · Tutte · Prima o poi · Fatte** ✓.
- Nessun errore JS bloccante; app statica carica (onboarding primo-avvio normale con storage vuoto).
- Evidenza: `_consensus/odin-qa-v110.jpeg`.

## Sicurezza dati
- Modifiche solo a filtri di vista + `name` lista (id stabile) + nuova funzione → **non distruttive**. Nessuna migrazione di schema. Backup creato. localStorage esistente di Francesco preservato.

## Prossimo passo (richiede Pasquale)
1. Aprire ODIN dal tuo browser (dati reali) e provare: crea task senza data → va in "Prima o poi"; rinomina una lista (es. Studio → "Obiettivi futuri").
2. Se ok → **merge `feat/custom-lists-nodate` in `main`** = deploy live per Francesco (tua decisione).
3. (Opz.) creare manualmente le liste "Obiettivi attuali/futuri" con "+ Aggiungi lista" (migrazione auto evitata per sicurezza).
