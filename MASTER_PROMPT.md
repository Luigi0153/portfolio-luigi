# MASTER PROMPT — Portfolio Luigi (Astro + Tailwind v4 + GSAP + Three.js)

> Come usarlo: apri Claude Code nella cartella del progetto già creata con `npm create astro@latest`.
> Incolla PRIMA il blocco "PROMPT DI AVVIO". Poi, una alla volta, incolla il blocco della fase successiva
> solo quando quella prima è confermata. Non incollare tutto insieme: sprecheresti token e perderesti il controllo.

---

## PROMPT DI AVVIO (incolla per primo)

Sei il mio Senior Frontend Engineer e UX/UI Designer. Stiamo costruendo il mio portfolio personale.
Prima di fare qualsiasi cosa:
1. Leggi `CLAUDE.md`, `docs/design-tokens.md` e `docs/content/caso-reale.md`.
2. Elenca in 5 righe cosa hai capito (target, stack, mood, regole) e le skill che userai.
3. Verifica che il progetto Astro avvii (`npm run dev`) e che React, Tailwind v4, GSAP e Three siano installati; se manca qualcosa dimmi il comando esatto, non installare da solo.
4. Non scrivere ancora codice del sito. Fermati e aspetta che ti dica "FASE 1".

---

## FASE 1 — Fondamenta e design system

Obiettivo: token, font, layout base, componenti UI. Zero contenuti reali.
1. Crea `src/styles/tokens.css` con `@theme` di Tailwind v4 usando ESATTAMENTE i valori di `docs/design-tokens.md`. Importalo in `src/styles/global.css`.
2. Installa i font via `@fontsource-variable/fraunces`, `@fontsource/hanken-grotesk`, `@fontsource/jetbrains-mono` (chiedi ok prima di `npm install`). Configura `font-display: swap`.
3. `src/layouts/Base.astro`: html lang="it", meta viewport, SEO base (title, description, og), skip-link, `<slot/>`, footer minimo.
4. Componenti in `src/components/ui/` con tutti gli stati: Button (primary/secondary/ghost), Tag, Card, SectionHeader, StatTile. Usa la skill `ui-ux-pro-max` per gerarchia e spaziature.
5. Pagina `src/pages/styleguide.astro` che mostra palette, scala tipografica, tutti i componenti nei loro stati, e 4 forme Bauhaus statiche (cerchio, semicerchio, quarto, barra) in giallo/arancio/blu.
6. Verifica con Playwright: screenshot di /styleguide a 390px e 1280px. Controlla contrasto AA su ogni combinazione testo/sfondo e riportamelo in tabella.
7. `npm run build` senza errori, commit `feat: design system e styleguide`.
FERMATI. Mostrami gli screenshot e aspetta "FASE 2".

---

## FASE 2 — Hero con switch target + forme Bauhaus animate

Obiettivo: la prima schermata, senza ancora il 3D (placeholder).
1. `src/components/sections/Hero.astro` + isola React `TargetSwitch.tsx` (client:load). Due opzioni: "Cerchi uno sviluppatore" / "Vuoi vendere online". Lo stato va salvato in `localStorage` (chiave `target`) e in `data-target` su `<html>`, così ogni sezione può riordinarsi via CSS/JS senza ricaricare.
2. Hero mobile: h1 Fraunces su 2-3 righe ("Ciao, sono Luigi." + una riga che cambia con il target), switch subito sotto, CTA primaria che cambia testo con il target ("Vedi il codice" / "Vedi i risultati"). Il 3D è un placeholder `div` 320x320 con bordo ink e sfondo cream-2.
3. Forme Bauhaus decorative in background con GSAP: rotazione lenta continua + parallax leggero su scroll, secondo `docs/design-tokens.md`. Disattivate con `prefers-reduced-motion`.
4. Nav sticky con logo testuale "Luigi" in Fraunces, 3 link (Progetti, Come lavoro, Contatti), indicatore verde sulla sezione attiva.
5. Microcopy ironico e breve: proponimi 3 varianti per la riga sotto l'h1 per ciascun target, io scelgo.
6. Playwright: screenshot 390/1280 per entrambi i target. Build, commit `feat(hero): switch target e forme animate`.
FERMATI e aspetta "FASE 3".

# FASE 2.5 — Hero-scrivania interattiva (2D illustrata + micro-interazioni)

> Incolla questo blocco in Claude Code DOPO aver messo i 5 PNG in `public/scene/`.

---

## FASE 2.5

Obiettivo: trasformare l'hero in una scena esplorabile senza perdere velocità, accessibilità né il percorso rapido per i recruiter.

In `public/scene/` trovi cinque illustrazioni già pronte, stile vettoriale piatto retro anni '70-'80, tutte su fondo pieno `#fdf4e4` e nella palette dei token: `computer.png`, `taccuino.png`, `telefono.png`, `tabellino.png`, `tazza.png`.

### A. Struttura della scena
1. Sostituisci il placeholder 320×320 nell'hero con `src/components/sections/DeskScene.astro`: le illustrazioni posizionate in modo assoluto dentro un contenitore con `aspect-ratio` fisso e unità relative (%), così scala senza rompersi. Convertile in webp con `<Image>` di Astro.
2. Oggetti cliccabili (hotspot), ognuno un `<a>` reale con `aria-label` esplicito:
   - computer CRT → `/#progetti` (è l'oggetto principale, il più grande)
   - taccuino → `/come-lavoro`
   - telefono → `/contatti`
   - tabellino → `/progetti/caso-reale`
   - tazza → nessun link: easter egg, vedi punto D
3. Poiché le illustrazioni hanno fondo crema pieno uguale a quello della pagina, si fondono da sole: non servono ritagli né trasparenze. Se sui bordi compare una linea di stacco, applica un leggero `mix-blend-mode: multiply` o rifila l'immagine.
4. Ogni hotspot ha uno stato hover: sollevamento 6px, comparsa del burst radiale dietro l'oggetto e delle scintille (vedi punto C6), etichetta accanto all'oggetto (mono, uppercase, 12px). Anima solo `transform` e `opacity`.
5. `@media (hover: hover)` per gli hover. Su touch gli oggetti hanno l'etichetta sempre visibile sotto, altrimenti non si capisce che sono cliccabili.
6. Navigazione da tastiera: ordine di tab computer → taccuino → telefono → tabellino, focus visibile con l'anello ink dei token.

### B. Layout responsive
- Desktop (≥1024px): scena a destra, h1 + switch + CTA a sinistra, come ora.
- Tablet: scena sotto il testo, larghezza piena, altezza contenuta.
- Mobile (390px): NON riprodurre la scena in miniatura. Mostra gli stessi 4 oggetti come griglia 2×2 di tessere quadrate, ciascuna con illustrazione ed etichetta. Requisito, non ripiego.

### C. Micro-interazioni
1. Ingresso dell'hero: h1 che si compone per parole con SplitText (GSAP, plugin gratuito), stagger 60ms, poi entrano gli oggetti con stagger 80ms. Durata totale sotto 1,2s.
2. Parallax leggero degli oggetti al movimento del mouse (max 12px, lerp 0.06, velocità diverse per oggetto per dare profondità). Su touch: nessuno.
3. Card progetto (quando esisteranno): sollevamento + rotazione max 2° seguendo il puntatore.
4. Transizione di apertura: View Transitions native di Astro tra home e pagina progetto, con la card che si espande. Fallback: navigazione normale.
5. I numeri del caso reale si animano al conteggio quando entrano in viewport (ScrollTrigger, una volta sola).
6. Burst e scintille dell'hover: generali come SVG inline nel componente, NON come immagini. Burst = raggi che partono dal centro, due toni di magenta (#f01a7a, #ff4da6), che ruotano lentamente su hover. Scintille = quattro stelle a quattro punte bianche di dimensioni diverse, che pulsano con stagger. Entrambi dietro l'oggetto, opacity 0 di default.

### D. Easter egg (uno solo)
Click sulla tazza: il vapore si anima e compare per 2s un messaggio mono nell'angolo. Proponimi 3 testi, scelgo io. Nessun suono, nessun blocco della pagina.

### E. Vincoli non negoziabili
- La nav sticky resta sempre visibile: la scena è un di più, mai l'unico modo di navigare.
- `prefers-reduced-motion`: scena statica, nessun parallax, nessun SplitText, link comunque funzionanti.
- Peso totale delle illustrazioni sotto 400 KB dopo conversione webp. `loading="eager"` solo above the fold.
- Nessuna nuova libreria oltre a GSAP già presente.
- Lighthouse mobile ≥ 90 dopo questa fase: misuralo e riportamelo.

### F. Verifiche
Playwright a 390/768/1280 per entrambi i target, screenshot, test tastiera, test con reduced-motion attivo, `npm run build` pulita, commit `feat(hero): scena scrivania interattiva`.
Poi FERMATI.

## FASE 3 — Sezione progetti e case study reale

1. Content collection Astro `src/content/progetti/` con schema: titolo, slug, lente (flusso/sistema/vincolo/decisione/rimozione), target ("dev" | "business" | "both"), tags, cover, ordine_dev, ordine_business.
2. Crea `caso-reale.md` nella collection usando SOLO `docs/content/caso-reale.md`. Aggiungi due placeholder: `fornace-vietri.md` e `pizzeria.md` con frontmatter completo e corpo "in arrivo".
3. `ProjectGrid.astro`: card con bordo retro, ombra dura all'hover, ordinamento che cambia in base a `data-target` (dev: prima i progetti tecnici; business: prima risultati). Card "in arrivo" con tag giallo.
4. Pagina dinamica `src/pages/progetti/[slug].astro`: layout a due colonne su desktop con colonna sinistra pinnata da GSAP ScrollTrigger (titolo, lente, tags), a destra le sezioni Contesto / Decisione / Risultato / Cosa ho imparato. Su mobile tutto in colonna, senza pin.
5. Per il caso reale, componenti dati: grafico ramp ordini (SVG inline, 4 barre), funnel a 4 step, StatTile per +63% / +86% / 94% mobile. Nessuna libreria di grafici.
6. Slider Before/After (isola React, accessibile da tastiera) con due immagini placeholder 390x844.
7. Playwright 390/1280 sulla lista e sul dettaglio. Build, commit `feat(progetti): collection e caso reale`.
FERMATI e aspetta "FASE 4".

---

## FASE 4 — Oggetto 3D nell'hero (Three.js)

1. Crea `src/components/three/HeroObject.tsx` (isola React, `client:visible`). Carica `public/models/hero.glb` con GLTFLoader + DRACOLoader. Se il file non esiste ancora, usa una geometria procedurale provvisoria: un toro con materiale MeshStandardMaterial verde #399f80, luce calda arancio e una rim light blu.
2. Canvas trasparente, pixel ratio max 1.5, dimensione responsive (320px mobile, 480px desktop). Rotazione idle + segue il mouse con lerp 0.05; su touch solo idle. Pausa quando fuori viewport (IntersectionObserver).
3. Con `prefers-reduced-motion` o WebGL assente: mostra `public/models/hero-fallback.png` (placeholder per ora).
4. Misura: il bundle Three deve essere caricato solo su questa pagina e dopo il first paint. Riportami il peso del chunk.
5. Playwright + Lighthouse mobile sulla home: obiettivo ≥ 90 performance. Se sotto, proponi 3 ottimizzazioni prima di applicarle.
Build, commit `feat(hero): oggetto 3d`. FERMATI e aspetta "FASE 5".

---

## FASE 5 — Pagine "Come lavoro", "Contatti", progetto n°5 e deploy

1. `/come-lavoro`: processo in 4 step (Ascolto → Numeri → Prototipo → Codice) con label mono e h3 Fraunces; sezione stack con Tag; sezione "Come ho costruito questo sito" = il progetto n°5: spiega lo switch target come decisione UX, lo stack, e mostra 3 prompt reali che ho usato (te li passo io).
2. `/contatti`: mailto, LinkedIn, GitHub, e un form minimo (Formspree o Vercel Forms: chiedi quale preferisco). CTA che cambia con il target.
3. Pagina 404 ironica in stile Bauhaus.
4. SEO: sitemap (`@astrojs/sitemap`), robots, og-image statica per home e per ogni progetto (genera un template svg → png con la palette).
5. Review finale con la skill `web-design-guidelines`: elenco problemi ordinati per gravità, poi correggili.
6. `vercel.json` se serve, README in italiano con comandi. Build, commit `chore: pronto per il deploy`.
7. Dammi la sequenza esatta di comandi git per pubblicare su GitHub e i click per importare il repo su Vercel.
FERMATI. Dopo il deploy passeremo a "FASE 6 — concept Fornace Vietri" e "FASE 7 — landing Pizzeria", per cui ti darò i contenuti in `docs/content/`.

---

## Promemoria per me (Luigi)
- Ogni fase finisce con screenshot + build + commit. Se Claude non si ferma, scrivi "STOP, torna al checkpoint".
- Se cambio idea su un colore/font, modifico `docs/design-tokens.md` e scrivo "rileggi i token", non descrivo il colore a voce.
- Per risparmiare token: `/clear` all'inizio di ogni fase (CLAUDE.md viene riletto da solo), `/compact` se la fase diventa lunga.
