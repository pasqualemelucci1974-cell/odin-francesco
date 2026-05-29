# 📄 Handout — Usare `curl` per ottenere l'Impressum da un sito Wix

> Riepilogo della chat — data: 29/05/2026

---

## Argomento trattato
Come usare il comando **`curl`** per ottenere informazioni (in particolare la
pagina **Impressum** / note legali) da un sito ospitato su **Wix.com**.

---

## 1. Cos'è `curl`
- È un **comando da terminale**, non una funzione da "attivare".
- Già preinstallato su **Linux, macOS e Windows 10/11**.
- Verifica della presenza:
  ```bash
  curl --version
  ```
- Su Windows, se manca: `winget install curl`.

---

## 2. Comando base per scaricare la pagina Impressum
```bash
curl -L https://www.nomesito.com/impressum
```

### Opzioni utili
| Opzione | Funzione |
|---------|----------|
| `-L` | Segue i redirect (frequenti su Wix) |
| `-s` | Modalità silenziosa (niente barra di avanzamento) |
| `-I` | Mostra solo gli header HTTP (diagnostica) |
| `-A "Mozilla/5.0"` | Simula un browser (Wix talvolta blocca i bot) |
| `-o file.html` | Salva il risultato in un file |

### Esempio completo
```bash
curl -sL -A "Mozilla/5.0" https://www.nomesito.com/impressum -o impressum.html
```

---

## 3. ⚠️ Limite importante con Wix
- I siti Wix sono **renderizzati via JavaScript**.
- `curl` scarica solo lo **scheletro HTML iniziale**, spesso **senza il testo
  dell'Impressum**.
- Per ottenere il contenuto reale servono strumenti che **eseguono JavaScript**:
  - **Playwright**
  - **Puppeteer**
  - (browser headless in generale)

---

## ✅ Punti chiave da ricordare
1. `curl` è già disponibile, basta aprirlo nel terminale.
2. Usa sempre `-L` per i redirect e `-A` per simulare un browser.
3. Se la pagina è "vuota" → il contenuto è caricato via JavaScript → serve un
   browser headless.

---

## 🔜 Prossimo passo suggerito
Fornire **l'URL preciso del sito Wix** e specificare **quali dati servono**
(es. ragione sociale, indirizzo, P.IVA) per ricevere il comando esatto e capire
se basta `curl` o serve Playwright/Puppeteer.
