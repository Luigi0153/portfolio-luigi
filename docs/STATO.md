# Stato del progetto

**Fase corrente:** Fase 3 chiusa (commit `bc40586`). Fase 4 annullata. Prossima: Fase 5.

## Completo
- **Fase 1** — token, layout, Nav, Card, Tag, Button, StatTile, SectionHeader, `/styleguide`.
- **Fase 2** — hero con switch target (isola React, scelta in `localStorage`, `html[data-target]`), scena scrivania con hotspot ed etichette.
- **Fase 3** — collection `progetti`, caso reale + 2 placeholder, griglia con ordine per percorso, dettaglio `/progetti/[slug]` con colonna pinnata, ramp/funnel/StatTile/slider prima-dopo, tilt card, View Transitions, conteggio numeri.
- Test permanenti: `test-switch`, `test-scena`, `test-etichette`, `test-progetti` (390 e 1280), tutti verdi.

## Annullato
- **Fase 4 — oggetto 3D nell'hero.** Annullata il 2026-09-19. Due motivi: lo spazio dell'hero è già occupato dalla scena scrivania della Fase 2.5, e Three.js aggiungerebbe peso JS proprio dove il Lighthouse mobile è già sotto soglia (85 contro il ≥ 90 della regola 7). Restano quindi non necessari `HeroObject.tsx`, `public/models/hero.glb` e `hero-fallback.png`. Le dipendenze `three` e `@types/three` sono in `package.json` ma non importate da nessun file: da rimuovere quando si tocca il `package.json`.

## Manca
- **Fase 5** — `/come-lavoro`, `/contatti`, 404, sitemap, og-image, review `web-design-guidelines`, deploy Vercel.
- **Fase 6/7** — concept Fornace Vietri e landing pizzeria: per ora sono due card "in arrivo" con pagina di dettaglio quasi vuota.
- Fase di performance dedicata a fine progetto (regola 7).

## Decisioni aperte
- **Lighthouse mobile home a 85**, sotto il ≥ 90 della regola 7. In locale l'LCP è l'h1 a 188 ms: i 3,6 s vengono dal throttling simulato. Sospetto principale il peso JS (gsap 27 KB + ScrollTrigger 17 KB + React 65 KB, 36 KiB segnalati come inutilizzati). Non ancora stabilito se sia una regressione della Fase 3 o il livello di partenza.
- Servono da Luigi: i 3 prompt reali per il progetto n°5 e i contenuti in `docs/content/` per Fornace Vietri e pizzeria (c'è solo `caso-reale.md`).

## Decise
- Form di `/contatti`: **Formspree** (deciso il 2026-09-19).
