# CONSENSUS - 2026-06-18 20:13

## Domanda
ODIN = web-app PWA monofile vanilla JS (single index.html ~4100 righe), dati in localStorage, deploy su GitHub Pages (auto-deploy da main). E' lo strumento personale di studio/task di Francesco, LIVE con dati reali.

STATO ATTUALE del codice (verificato):
- Liste in state.settings.lists (default: inbox/studio/esami/salute/vita, con emoji). I task hanno t.listId, t.due (data, gia' NULLABLE), t.done.
- ESISTONO gia': addList() (aggiunge {id,name,emoji:'cartella'}), deleteList() (inbox protetta, riassegna i task a inbox), UI listsManager con input "+ Aggiungi lista".
- NON esiste: rinomina lista; scelta emoji in aggiunta.
- Overdue (riga 2307): const overdue = t.due && t.due < today && !t.done  -> i task SENZA data NON sono overdue (corretto).
- Viste: OGGI filtra `!t.done && (!t.due || t.due <= today)` -> i task SENZA data compaiono in OGGI. SETTIMANA idem. TUTTE mostra tutto. FATTE i completati.
- Migrazione load: preserva s.settings.lists se presente, altrimenti DEFAULT_LISTS.

RICHIESTA UTENTE (Francesco): poter creare/rinominare le proprie liste (es. "Obiettivi attuali", "Obiettivi futuri") invece delle fisse; e poter mettere task SENZA data "da parte" (backlog "prima o poi"), trovabili, non scaduti, e NON che intasano OGGI.

MODIFICHE PROPOSTE (da validare):
1. Aggiungere renameList(id) + matita nell'UI listsManager.
2. Cambiare OGGI/SETTIMANA per ESCLUDERE i task senza data (t.due richiesto per OGGI), cosi' i no-date restano "da parte" e si vedono in TUTTE e nel filtro-lista. (regressione possibile: oggi i no-date compaiono in OGGI).
3. Migrazione NON distruttiva: aggiungere liste "Obiettivi attuali" e "Obiettivi futuri" agli utenti esistenti SENZA toccare le liste/task gia' presenti.
4. Hint UX nel form: "lascia la data vuota = prima o poi".

DOMANDA: per ciascun punto indica rischi BLOCKER/MAJOR/MINOR, in particolare: rischio PERDITA DATI, sicurezza schema/migrazione localStorage, edge-case task senza data, regressioni su OGGI/SETTIMANA/TUTTE/FATTE/overdue/calendario, UX mobile, naming liste, accessibilita', compatibilita' app statica GitHub Pages. Dai una raccomandazione: implementare tutto o solo parte? come rendere la migrazione sicura? Struttura: PRIORITA' / RISCHI / RACCOMANDAZIONE / CONFIDENZA. Conciso.


## Sintesi di consenso (giudice: deepseek/deepseek-v3.2)
### PUNTI DI ACCORDO
1. **Priorità**: La modifica ai filtri (punto 2) è ritenuta ad **alta priorità** per risolvere il problema del backlog (tutti i modelli).
2. **Hint UX** (punto 4): È considerato **utile e a basso rischio**, da implementare insieme alla modifica dei filtri (tutti).
3. **Rinomina liste** (punto 1): Giudicata **funzionalità standard**, rischi minori (tutti, tranne Moonshot che la include nella raccomandazione "small").
4. **Nessuna perdita dati diretta**: Le modifiche ai filtri e alla rinomina **non causano perdita di dati** (tutti).
5. **GitHub Pages**: Nessun rischio di compatibilità (tutti).

### DISACCORDI/CONTRADDIZIONI
1. **Modifica filtri OGGI/SETTIMANA (punto 2)**:
   - **BLOCKER vs. MAJOR/MINOR**: Grok, Deepseek, Moonshot e Qwen lo classificano come **BLOCKER** per la regressione comportamentale (task senza data scompaiono dalle viste). Llama, Mistral e Gemini lo considerano **MAJOR/MINOR** (regressione gestibile).
   - **Raccomandazione**: Moonshot propone un **toggle** ("Mostra no-date in OGGI") per preservare la retrocompatibilità. Tutti gli altri suggeriscono di applicare la modifica direttamente, con avvisi all'utente.

2. **Migrazione liste (punto 3)**:
   - **BLOCKER vs. MAJOR vs. EVITA**: Qwen e Moonshot vedono **rischio BLOCKER** di corruzione dati. Llama e Gemini lo classificano come **MAJOR** ma implementabile con cautela. Deepseek e Grok **raccomandano di evitarla**, lasciando all'utente la creazione manuale.

3. **Implementazione completa**:
   - **Sì** (Qwen, Mistral, Llama, Gemini) con test accurati.
   - **No, solo parziale** (Deepseek: punti 2+4; Grok: 1+2+4; Moonshot: rinomina + toggle).

### SINTESI DI CONSENSO FINALE AZIONABILE
**Piano d'azione**:
1. **Implementa SUBITO**:
   - **Punto 2** (Modifica filtri OGGI/SETTIMANA): Cambia criteri a `(t.due && t.due <= today)`. **Comunica esplicitamente il cambiamento** all'utente (es. tooltip/messaggio one-time).
   - **Punto 4** (Hint UX): Aggiungi suggerimento nel form.
2. **Implementa DOPO**:
   - **Punto 1** (Rinomina liste): Aggiungi `renameList()` con validazione (no duplicati, no nomi vuoti). **Proteggi "inbox" dalla rinomina**.
3. **NON implementare**:
   - **Punto 3** (Migrazione automatica liste). **Evita di aggiungere liste default** agli utenti esistenti. L'utente può crearle manualmente.
4. **Considera come miglioramento futuro** (opzionale):
   - Il **toggle** suggerito da Moonshot per mostrare/nascondere i task senza data in "OGGI" potrebbe mitigare regressioni per utenti avanzati.

**Migrazione sicura**:
- **Nessuna migrazione automatica** dello schema `lists`.
- Prima del deploy, **esporta backup** dello `state` da localStorage.
- Modifica solo i filtri `filterToday()` e `filterWeek()`.
- Aggiungi un **controllo di versione** (`state.settings.version`) per future migrazioni.

**CONFIDENZA**: **ALTA** sul piano proposto (punti 1,2,4 evitando la migrazione automatica). Il consenso è forte sulle azioni prioritarie e sulla necessità di evitare rischi inutili sui dati esistenti.

**TIE-BREAK UMANO**: Non necessario. La sintesi riflette la maggioranza delle valutazioni di rischio e le raccomandazioni più conservative.

## Risposte individuali (7 modelli)

### deepseek/deepseek-v3.2
**PRIORITA'**  
1. Modifica filtri OGGI/SETTIMANA (blocca backlog)  
2. Migrazione liste aggiuntive (non distruttiva)  
3. Rinomina liste + UI (miglioramento)  
4. Hint UX (chiarezza)

**RISCHI**  
- **BLOCKER**: Modifica filtri rompe comportamento esistente (task no-date spariscono da OGGI/SETTIMANA). Rischio confusioni utente ("dove sono finiti?"). Nessuna perdita dati.  
- **MAJOR**: Migrazione automatica aggiunge liste obbligatorie (anche se non volute). Bassa compatibilità con utenti che gestiscono liste manualmente.  
- **MINOR**: UI rinomina richiede validazione input (no liste duplicate, no nomi vuoti).  
- **MINOR**: Hint UX migliora chiarezza ma non risolve problemi di scoperta (task no-date nascosti in TUTTE).

**RACCOMANDAZIONE**  
Implementare in ordine:  
1. **Solo punto 2** (modifica filtri) + **punto 4** (hint nel form). Risolve immediatamente il problema backlog senza modifiche invasive.  
2. **Aggiungere rinomina liste** (punto 1) opzionale, dato che l'utente può già creare/eliminare liste.  
3. **Non aggiungere liste default** (punto 3). L'utente può crearle manualmente se servono. Evita migrazioni forzate.  

**Migrazione sicura**:  
- Modificare solo `filterToday()` e `filterWeek()`: sostituire `(!t.due || t.due <= today)` con `(t.due && t.due <= today)`.  
- Testare con backup di localStorage (esporta state in JSON prima).  
- Aggiornare hint in form-add-task: "Data vuota = 'Prima o poi' (non appare in OGGI/SETTIMANA)".  

**CONFIDENZA**: Alta. Modifica minima, nessun dato perso, comportamento chiaro (no-date = backlog esplicito). Regressioni controllate (overdue già gestisce no-date correttamente, TUTTE/FATTE/calendario invariati).

### qwen/qwen-2.5-72b-instruct
### PRIORITA'
1. Aggiungere renameList(id) + matita nell'UI listsManager.
2. Cambiare OGGI/SETTIMANA per ESCLUDERE i task senza data (t.due richiesto per OGGI).
3. Migrazione NON distruttiva: aggiungere liste "Obiettivi attuali" e "Obiettivi futuri" agli utenti esistenti SENZA toccare le liste/task gia' presenti.
4. Hint UX nel form: "lascia la data vuota = prima o poi".

### RISCHI
1. **renameList(id)**:
   - **Rischio**: MINOR. Potenziale errore utente nel rinominare liste importanti.
   - **Misure**: Verifica di non permettere il rinominare "inbox".
   - **Rischio di perdita dati**: MINOR.

2. **Cambiare OGGI/SETTIMANA**:
   - **Rischio**: MAJOR. Regressione nel filtering di task, potrebbero non apparire in OGGI/SETTIMANA come previsto.
   - **Misure**: Testare ampiamente con vari scenari di dati.
   - **Rischio di perdita dati**: MINOR.

3. **Migrazione NON distruttiva**:
   - **Rischio**: BLOCKER. Potenziale perdita o corruzione dei dati esistenti durante la migrazione.
   - **Misure**: Backup dei dati prima della migrazione, implementare una migrazione reversibile.
   - **Rischio di perdita dati**: BLOCKER.

4. **Hint UX**:
   - **Rischio**: MINOR. Potrebbe non essere visibile a tutti gli utenti.
   - **Misure**: Testare l'UX su dispositivi mobili.
   - **Rischio di perdita dati**: Nullo.

### RACCOMANDAZIONE
- **Implementare tutto**: Sì, ma con cautela.
- **Migrazione sicura**: 
  - Backup dei dati prima della migrazione.
  - Implementare una migrazione reversibile.
  - Testare ampiamente in un ambiente di staging con dati reali.
  - Rilasciare una versione beta per un gruppo di utenti selezionati prima del deploy generale.

### CONFIDENZA
- Alta per i punti 1 e 4.
- Media-alta per il punto 2, con attenzione alle regressioni.
- Media-bassa per il punto 3, data la criticità della migrazione dei dati esistenti.

### moonshotai/kimi-k2-0905
PRIORITA': Critico
RISCHI:
- DELETE/RINOMINA lista → ID cambia? (conflitto task.t.listId) → PERDITA task assoluta BLOCKER
- Migrazione: duplicazione/espansione liste vs campi legacy → malfùnzioni MAJOR
- OGGI senza no-date: i 30% di task Francesco potrebbero scomparire → rottura workflow BLOCKER
- localStorage corrotto → dati persi BLOCKER (backup manca)

RACCOMANDAZIONE:
- giochiamo SMALL: mantieni le 5 liste default, non migrare liste, non cambiare filtri.
- aggiungi solo "rinomina lista" (inline edit, id non cambia) e emoji-picker per label visiva.
- introduci toggle setting "Mostra no-date in OGGI" (default true), retro-compatibile, zero riscrittura SQL/storage.
- backlog handled by flag t.backlog (true/false) rilascio futuro (zero rottura vista attuale).

CONFIDENZA: 90% safe

### mistralai/mistral-small-3.2-24b-instruct
**PRIORITA'**:
1. Cambiare OGGI/SETTIMANA per escludere task senza data.
2. Migrazione non distruttiva.
3. Aggiungere renameList(id) + matita nell'UI listsManager.
4. Hint UX nel form.

**RISCHI**:
1. **MAJOR**: Regressione su OGGI/SETTIMANA (task senza data non più visibili).
2. **MINOR**: UX mobile (spazio per matita e input di rinominamento).
3. **MINOR**: Compatibilità con app statica GitHub Pages (nessun rischio, è client-side).
4. **MAJOR**: Migrazione non distruttiva (possibile errore nel preservare dati esistenti).

**RACCOMANDAZIONE**:
- Implementare tutti i punti, ma testare accuratamente la regressione su OGGI/SETTIMANA.
- Per la migrazione, creare una copia di backup dei dati prima di applicare le modifiche.
- Testare su diversi dispositivi per l'UX mobile.

**CONFIDENZA**: Media (dipende dalla qualità dei test).

### meta-llama/llama-3.3-70b-instruct
**PRIORITA'**
1. Modifica OGGI/SETTIMANA per escludere task senza data
2. Aggiungere renameList(id) e UI per rinominare liste
3. Migrazione non distruttiva per aggiungere nuove liste
4. Hint UX per lasciare data vuota

**RISCHI**
- Modifica OGGI/SETTIMANA: MINOR (regressione possibile, ma facile da testare)
- Aggiungere renameList(id): MINOR (rischio di perdita dati se non gestito correttamente)
- Migrazione non distruttiva: MAJOR (rischio di perdita dati se non eseguita correttamente)
- Hint UX: MINOR (nessun impatto sulla logica dell'app)

**RACCOMANDAZIONE**
Implementare tutto, ma con attenzione particolare alla migrazione non distruttiva. Assicurarsi di testare accuratamente tutte le funzionalità, soprattutto quelle relative alla gestione dei dati e alla visualizzazione delle liste. Per rendere la migrazione sicura, eseguire i seguenti passaggi:
- Creare una copia dei dati esistenti in localStorage prima di eseguire la migrazione
- Eseguire la migrazione in modo graduale, verificando che ogni passaggio sia stato eseguito correttamente prima di procedere
- Testare la migrazione con dati di esempio e con dati reali

**CONFIDENZA**
80% - La modifica proposta può essere implementata con successo se si tiene conto dei rischi e si eseguono i test necessari. La migrazione non distruttiva richiede particolare attenzione per evitare la perdita di dati.

### google/gemini-2.5-flash
Ecco l'analisi delle modifiche proposte:

## 1. Aggiungere renameList(id) + matita nell'UI listsManager.

*   **PRIORITÀ:** MEDIA
*   **RISCHI:**
    *   **MINORE:** Naming delle liste: se si usano nomi molto simili ad altre liste, potrebbe generare confusione.
    *   **MINORE:** UX mobile: la visualizzazione e l'interazione con l'icona di modifica potrebbero essere complesse su schermi piccoli, ma si traduce in un campo di input: è gestibile.
    *   **NESSUNO:** Perdita dati, sicurezza schema/migrazione, edge cases task senza data, regressioni, accessibilità, compatibilità.
*   **RACCOMANDAZIONE:** Implementare. È una funzionalità standard e attesa per la gestione delle liste.
*   **CONFIDENZA:** ALTA

## 2. Cambiare OGGI/SETTIMANA per ESCLUDERE i task senza data (`t.due` richiesto per OGGI).

*   **PRIORITÀ:** ALTA (risolve il problema principale di Francesco)
*   **RISCHI:**
    *   **MAJOR:** **Regressione OGGI/SETTIMANA**: Questo è un cambiamento di comportamento fondamentale. Gli utenti abituati a vedere i task senza data in "Oggi" o "Questa settimana" non li vedranno più. Questo è l'obiettivo, ma va comunicato chiaramente all'utente.
    *   **MINORE:** Edge-case task senza data: i task senza data diventeranno di fatto "task backlog". Assicurarsi che siano facilmente accessibili tramite il filtro "Tutte" e il filtro per lista specifica (questo è già garantito, ma è bene ribadirlo).
    *   **NESSUNO:** Perdita dati, sicurezza schema/migrazione, overdue, calendario, UX mobile, naming liste, accessibilità, compatibilità.
*   **RACCOMANDAZIONE:** Implementare, ma solo dopo aver comunicato il cambiamento di comportamento all'utente (un tooltip, un messaggio pop-up alla prima apertura dopo l'aggiornamento). Si addressa direttamente la richiesta dell'utente di "mettere task SENZA data 'da parte'".
*   **CONFIDENZA:** ALTA

## 3. Migrazione NON distruttiva: aggiungere liste "Obiettivi attuali" e "Obiettivi futuri" agli utenti esistenti SENZA toccare le liste/task già presenti.

*   **PRIORITÀ:** MEDIA (migliora l'esperienza di default per i nuovi e vecchi utenti)
*   **RISCHI:**
    *   **MINOR:** **Sicurezza schema/migrazione localStorage:** Se l'implementazione non è attenta, si potrebbero creare duplicati o errori nella struttura delle liste. La strategia deve essere: se l'utente esiste e `state.settings.lists` non contiene già queste liste specifiche (identificate magari da un `id` o `name` specifico), le si aggiunge.
    *   **MINORE:** Naming liste: Se l'utente avesse già creato liste con nomi identici o simili, potrebbe generare confusione. Un ID univoco (UUID) per le liste è fondamentale per evitare collisioni.
    *   **NESSUNO:** Perdita dati, edge cases task senza data, regressioni, UX mobile, accessibilità, compatibilità.
*   **RACCOMANDAZIONE:** Implementare con cautela, usando un meccanismo di migrazione robusto che controlli l'esistenza delle liste predefinite prima di aggiungerle. Implementare un sistema di ID unico per le liste (es. UUID) se non già presente, per evitare collisioni di nomi o dipendenze problematiche in migrazioni future.
*   **CONFIDENZA:** MEDIA (per la migrazione sicura)

## 4. Hint UX nel form: "lascia la data vuota = prima o poi".

*   **PRIORITÀ:** ALTA (mitiga il rischio di regressione del punto 2)
*   **RISCHI:**
    *   **NESSUNO:** Perdita dati, sicurezza schema/migrazione, edge cases task senza data, regressioni, UX mobile, naming liste, accessibilità, compatibilità.
*   **RACCOMANDAZIONE:** Implementare. È un'ottima pratica UX per guidare l'utente sul nuovo comportamento dei task senza data.
*   **CONFIDENZA:** ALTA

---

**RACCOMANDAZIONE GENERALE:**

Implementare tutte le modifiche per rispondere alle esigenze dell'utente.

**Come rendere la migrazione sicura (principalmente per il punto 3):**

1.  **Versione della configurazione:** Aggiungere un campo `state.settings.version` o simile.
2.  **Logica di migrazione:** All'avvio dell'applicazione:
    *   Caricare lo `state` dal `localStorage`.
    *   Controllare `state.settings.version`. Se non presente o inferiore alla versione attuale attesa per queste modifiche (es. `1.1`):
        *   Eseguire i passaggi di migrazione:
            *   Per il punto 3: Iterare `DEFAULT_LISTS`. Se una lista predefinita (es. "Obiettivi attuali") non esiste già in `state.settings.lists`, aggiungerla. Assicurarsi di generare ID univoci per le nuove liste aggiunte.
        *   Aggiornare `state.settings.version` alla versione corrente.
    *   Salvare lo `state` aggiornato nel `localStorage`.

Questo approccio garantisce che la migrazione avvenga solo una volta per utente e non sovrascriva dati esistenti, ma aggiunga solo le nuove funzionalità.

**Considerazioni aggiuntive:**

*   **UI mobile:** Testare attentamente le modifiche (rinomina, messaggi UX) su dispositivi mobili.
*   **Accessibilità:** Assicurarsi che le nuove funzionalità della UI siano accessibili (es. etichette ARIA per le icone di modifica).
*   **Naming liste:** Prevedere un controllo minimo sulla validità del nome (non vuoto, max lunghezza).

### x-ai/grok-4.3
**PRIORITA'**  
1. Punto 2 (filtro OGGI/SETTIMANA) + hint UX (4)  
2. Punto 1 (renameList)  
3. Punto 3 (migrazione liste)  

**RISCHI**  
- **Punto 2 (BLOCKER)**: regressione forte per utente attuale (no-date spariscono da OGGI). Edge-case: task senza data creati prima. Rischio UX confusion.  
- **Punto 1 (MINOR)**: semplice, nessun rischio dati.  
- **Punto 3 (MAJOR)**: possibile duplicati o collisioni id/nome se migrazione non controllata. Rischio schema localStorage corrotto su utenti esistenti.  
- Nessun rischio sicurezza (statico GitHub Pages). Mobile/accessibilità neutri. Overdue/TUTTE/FATTE restano integri se filtro OGGI corretto.

**RACCOMANDAZIONE**  
Implementa **solo 1+2+4**. Evita migrazione automatica liste (punto 3). Fai rename manuale da utente. Migrazione sicura = nessuna modifica automatica a `settings.lists`; aggiungi solo se array vuoto (mai). Testa prima su clone localStorage.

**CONFIDENZA**  
85
