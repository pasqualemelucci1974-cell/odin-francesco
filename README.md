# O.D.I.N.

Optimized Data Integration Network — Web app self-tracking standalone in stile cyberpunk per Francesco, supporto Ausbildung con ADHD.

App online: https://pasqualemelucci1974-cell.github.io/odin-francesco/

## Cos'è

App HTML singola, zero dipendenze, zero backend, zero cloud. Tutti i dati restano in localStorage del browser dell'utente. Nessun account, nessun tracking, nessuna telemetria.

## Filosofia

- Trust-first: il sistema lavora per l'utente, non sopra
- Anti-gamification controllata: XP come feedback, mai streak punitivi
- Self-tracking onesto sopra performance metrics

## Stack

- Vanilla JavaScript, HTML, CSS — niente framework
- localStorage (chiave odin_v12_francesco, immutabile)
- PWA con manifest inline e favicon SVG (icona Valknut + Occhio di Odin)

## Versione corrente

v1.8.3 — note-XP introdotto su richiesta diretta dell'utente con guardrail anti-farming.

## Update

Sostituisci index.html con la nuova versione. I dati persistono perché localStorage è dominio-scoped.