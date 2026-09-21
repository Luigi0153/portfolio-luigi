# Stato del progetto

**Fase corrente:** Fase 5 chiusa, sito pronto per il deploy. Fase 4 annullata. Prossime: Fase 6 (Fornace Vietri) e Fase 7 (landing pizzeria).

## Completo
- **Fase 1** — token, layout, Nav, Card, Tag, Button, StatTile, SectionHeader, `/styleguide`.
- **Fase 2** — hero con switch target (isola React, scelta in `localStorage`, `html[data-target]`), scena scrivania con hotspot ed etichette.
- **Fase 3** — collection `progetti`, caso reale + 2 placeholder, griglia con ordine per percorso, dettaglio `/progetti/[slug]` con colonna pinnata, ramp/funnel/StatTile/slider prima-dopo, tilt card, View Transitions, conteggio numeri.
- **Fase 5** — `/come-lavoro` (4 passi, stack, progetto n°5), `/contatti` (canali + form Formspree attivo), 404, sitemap + robots (endpoint) + og-image per ogni pagina, `vercel.json`, README in italiano. Review finale fatta: contrasti AA e bersagli tattili a posto.
- Test permanenti: `test-switch`, `test-scena`, `test-etichette`, `test-progetti`, `test-pagine` (390 e 1280), tutti verdi.

## Correzioni dall'audit (2026-09-21)

Fonte: `docs/AUDIT.md`. Di quella lista sono stati chiusi quattro punti, tutti verificati a 390
e 1280 con i cinque test permanenti verdi e la build pulita.

- **Stack senza 3D** — in `come-lavoro.astro` il gruppo `Motion e 3D` è diventato `Motion`: la
  pagina non promette più una cosa che la Fase 4 ha annullato.
- **Form solo se collegato** — con `FORM_ATTIVO` falso `/contatti` non renderizza più il modulo:
  restano i canali diretti in colonna singola (`.contatti__griglia--sola`) e la description non
  nomina un form che non c'è. Sparito l'avviso che mostrava al visitatore `src/dati-sito.ts`, e
  con lui il ramo morto nello script (`data-attivo` e il messaggio "non ancora collegato").
- **Ordine delle card nel DOM** — via le due regole `order` da `ProjectGrid.astro`: le celle
  portano `data-ord-dev` / `data-ord-biz` e uno script inline le riordina nel DOM prima del paint,
  a ogni cambio di percorso (MutationObserver su `html[data-target]`, che lo switch scrive senza
  emettere eventi) e dopo lo swap delle View Transitions. Senza JavaScript resta l'ordine del
  markup, che è quello dev. Chiusa l'unica violazione WCAG misurata (2.4.3 e 1.3.2, livello A).
- **Invito al contatto** — nuovo `src/components/sections/InvitoContatto.astro`, in fondo alla
  home dopo la griglia e in fondo a ogni pagina progetto dopo "Cosa ho imparato". Bottone primary
  verso `/contatti`. **Il testo è provvisorio**: va riscritto nel passaggio sui copy.

Il resto della lista di `docs/AUDIT.md` (titolo della home, prova sopra la piega, cosa fai per
il percorso business, consenso e informativa del form, font e immagini, switch senza React,
etichette della scena visibili a riposo) non è stato toccato.

## Annullato
- **Fase 4 — oggetto 3D nell'hero.** Annullata il 2026-09-19. Due motivi: lo spazio dell'hero è già occupato dalla scena scrivania della Fase 2.5, e Three.js aggiungerebbe peso JS proprio dove il Lighthouse mobile è già sotto soglia (85 contro il ≥ 90 della regola 7). Restano quindi non necessari `HeroObject.tsx`, `public/models/hero.glb` e `hero-fallback.png`. Le dipendenze `three` e `@types/three` sono in `package.json` ma non importate da nessun file: da rimuovere quando si tocca il `package.json`.

## Manca
- **Prompt 2 e 3 del progetto n°5.** L'array `PROMPT_REALI` in `src/pages/come-lavoro.astro` ne ha uno solo, l'unico con una fonte nel repo (PROMPT DI AVVIO, da `MASTER_PROMPT.md`). Gli altri due non sono recuperabili da qui: il blocco "FASE 2.5" non è mai stato scritto in `MASTER_PROMPT.md` (il file ha un solo commit, e contiene le fasi 1-5), e il commit `a1784f8` registra la diagnosi del burst, non il prompt che l'ha prodotta. Servono i testi veri da Luigi: la sezione è già pronta, basta aggiungere le voci.
- **Dominio da confermare.** `site` in `astro.config.mjs` è `https://luigi-portfolio.vercel.app`: se Vercel assegna un nome diverso al primo import va corretto lì e ricostruito (canonical, og:url, sitemap e robots leggono da lì).
- **Passaggio sui copy.** L'inventario voce per voce è in `docs/inventario-testi.md` (135 voci,
  con giudizio e posizione nel codice): è la lista di lavoro per la riscrittura. Da lì passa
  anche il testo provvisorio dell'invito al contatto ("Parliamone" / "Due righe bastano.").
- **Fase 6/7** — concept Fornace Vietri e landing pizzeria: per ora sono due card "in arrivo" con pagina di dettaglio quasi vuota. Servono i contenuti in `docs/content/`.
- Fase di performance dedicata a fine progetto (regola 7).

## Decisioni aperte
- **Lighthouse mobile home a 85**, sotto il ≥ 90 della regola 7. In locale l'LCP è l'h1 a 188 ms: i 3,6 s vengono dal throttling simulato. Sospetto principale il peso JS (gsap 27 KB + ScrollTrigger 17 KB + React 65 KB, 36 KiB segnalati come inutilizzati). Non ancora stabilito se sia una regressione della Fase 3 o il livello di partenza.
- Servono da Luigi: i testi dei prompt 2 e 3 del progetto n°5 (vedi "Manca") e i contenuti in `docs/content/` per Fornace Vietri e pizzeria (c'è solo `caso-reale.md`).

## Decise
- Form di `/contatti`: **Formspree** (deciso il 2026-09-19).
