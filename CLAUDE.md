# Portfolio Luigi — istruzioni permanenti per Claude Code

## Chi sono
Luigi, Shopify Web Developer (catalogo, temi, personalizzazione) e AI Web Designer.
Faccio anche siti/landing WordPress. Portfolio personale, firmato con il mio nome.
Lingua del sito: italiano. Lingua con me: italiano.

## Obiettivo del sito
Doppio target con uno switch nell'hero:
- "Cerchi uno sviluppatore" → recruiter/agenzie: stack, processo, codice, case study tecnici.
- "Vuoi vendere online" → piccole attività: risultati, prima/dopo, CTA diretta.
Stessa struttura, contenuti riordinati. Il toggle è esso stesso un case study (progetto n°5).

## Stack (non cambiarlo senza chiedere)
Astro 7 + Tailwind CSS v4 + React (solo isole interattive) + GSAP ScrollTrigger + Three.js (un solo .glb nell'hero, lazy).
Deploy Vercel. Nessuna altra libreria UI/animazione senza il mio ok esplicito.

## Regole di lavoro
1. Leggi sempre `docs/design-tokens.md` prima di scrivere CSS. Usa solo i token, mai colori hardcoded.
2. Mobile-first: progetta a 390px, poi 768, poi 1280. Verifica ogni pagina con Playwright a 390 e 1280 prima di dire "fatto".
3. Una fase alla volta (vedi MASTER_PROMPT.md). Alla fine di ogni fase: `npm run build` senza errori, screenshot, commit, poi FERMATI e chiedi conferma.
4. Commit piccoli con messaggi in italiano: `feat(hero): switch target`, `fix(mobile): overflow card`.
5. Testi: microcopy ironico e breve (max 1 riga per bottone/etichetta). Case study: max 3 righe di testo per sezione, il resto sono immagini.
6. Accessibilità: contrasto AA sui token, focus visibile, `prefers-reduced-motion` disattiva GSAP e il 3D.
7. Performance: immagini in `<Image>` di Astro (webp/avif), font self-hosted con `font-display: swap`, .glb < 1 MB, Lighthouse mobile ≥ 90. Lighthouse si misura sulla build di preview, mai sul dev server, come mediana di 3 run. La verifica di performance è una fase dedicata a fine progetto, non un controllo a ogni fase.
8. Non inventare dati per il caso reale: usa solo quelli in `docs/content/caso-reale.md`. Nome dello store e logo sempre anonimizzati.
9. Se un'istruzione è ambigua, fai una domanda sola e proponi la tua opzione preferita.
10. Prima di aggiungere un pacchetto npm, spiega in una riga perché e aspetta il mio ok.
11. Astro 7: `astro dev` e `astro preview` girano come demoni (il comando esce subito; porta e pid nell'output, stop con `npx astro dev stop` / `npx astro preview stop`). Dopo ogni `npm install` o nuova isola React riavvia il demone dev. Se un'isola non si idrata ma la build è pulita (es. `_jsxDEV is not a function`): ferma il demone, cancella `node_modules/.vite`, riavvia — non toccare la config JSX.

## Skill disponibili in .claude/skills
Mie: design-taste-frontend, ui-ux-pro-max, web-design-guidelines, cro, shopify-expert, sisters-store-brand.
Esterne: gsap-skills (ufficiali GSAP), astro-agent-skills (incluud), threejs-fundamentals / threejs-loaders / threejs-lighting (CloudAI-X).
Usa `design-taste-frontend` e `ui-ux-pro-max` per ogni scelta visiva; `web-design-guidelines` per la review finale; `cro` per la landing pizzeria; `shopify-expert` per il concept Fornace Vietri; `sisters-store-brand` solo per estrarre dati (anonimizzando).
Per qualsiasi animazione usa PRIMA le skill GSAP ufficiali (ScrollTrigger, matchMedia, SplitText: tutti i plugin sono gratuiti). Per componenti, layout e content collection usa le skill Astro. Per l'hero 3D (Fase 4) usa le tre skill threejs. Se due skill si contraddicono, vince `docs/design-tokens.md` e poi la skill ufficiale.

## Struttura cartelle
src/pages, src/layouts, src/components (ui/, sections/, three/), src/content (case study in markdown), src/styles/tokens.css, public/models (glb), docs/.
