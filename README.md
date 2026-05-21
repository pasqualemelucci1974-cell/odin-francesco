# O.D.I.N.

**Optimized Data Integration Network** – Web app self-tracking standalone in stile cyberpunk per Francesco – supporto Ausbildund con ADHD.

🚀 **App online**: https://pasqualemelucci1974-cell.github.io/odin-francesco/

## Cos'è

App HTML singola, zero dipendenze, zero backend, zero cloud. Tutti i dati restano in `localStorage` del browser dell'utente. Nessun account, nessun tracking, nessuna telemetria.

## Filosofia
- **Trust-first**: il sistema lavora per l'utente, non sopra l'utente
- **Anti-gamification controllata**: XP esistono come feedback, ma nessuno streak punitivo, nessun target forzato, nessuna leaderboard
- **Self-tracking onesto > performance metrics**

## Stack
- Vanilla JavaScript / HTML / CSS – niente framework, niente build
- localStorage (chiave: `odin_v12_francesco`, immutable)
- PWA con manifest inline + favicon SVG (icona "Valknut + Occhio di Odino")

## Versione

v1.8.3 – note-XP introdotto su richiesta diretta dell'utente con guardrail anti-farming (cap 5 XP, soglia minima 20 char, bonus only first-of-day).

## Update

Sostituisci `index.html` con la nuova versione. I dati persistono perché localStorage è dominio-scoped e l'URL non cambia.

## Backup dati

L'utente esporta JSON dal pannello Settings ⏩ Backup. Backup mensile consigliato (la persistenza Safari iOS può rilasciare localStorage; Chrome Android è più affidabile).