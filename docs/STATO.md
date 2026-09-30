# Stato del progetto

**Fase corrente:** chiusura della prova sfondi e nuova figura di "Cosa faccio per te" fatte (2026-09-30), dopo il blocco modifiche dello stesso giorno, il blocco testi e carosello e la passata prestazioni, blocco A (2026-09-29). Fase 4 annullata.

La storia delle fasi finite (cosa è stato fatto, come e perché, misure e decisioni di dettaglio)
è in `docs/STORIA.md`. Qui restano solo lo stato attuale e i lavori da fare.

## Sito oggi
- **Home:** hero con switch tra i due percorsi (scelta in `localStorage`, `html[data-target]`) e scena scrivania, griglia progetti con ordine per percorso, "Cosa faccio per te" (solo percorso business, con la L del marchio che si costruisce riga dopo riga), carosello dei loghi su fondo ink (l'unica sezione della home su fondo scuro), invito al contatto.
- **Progetti:** caso reale (sette capitoli, slider prima/dopo) e i concept Fornace Vietri e pizzeria Vico Stretto, etichettati "Branding concept", con foto generate con l'AI. Dettaglio in `/progetti/[slug]`.
- **Loghi:** `/loghi` con filtri e `/loghi/[slug]`, quattro loghi con testi provvisori. Nessuna etichetta "Progetto", né a vista né nell'alt: il campo `tipo` resta nei dati per l'etichetta "Esercizio di stile".
- **Nav:** Progetti, Come lavoro, Loghi e "Scrivimi" (unico accesso ai contatti, in pillola anche su telefono; sotto i 340px senza bordo). Il quarto di cerchio del marchio ruota al passaggio, col focus e al tocco.
- **Altre pagine:** `/come-lavoro` (processo, stack, progetto n°5, "Il mio processo creativo"), `/contatti` (canali e form Formspree), 404, sitemap, robots, og-image, `vercel.json`.
- **Design:** palette a tre colori (cream, ink, arancio), token in `src/styles/tokens.css` e `docs/design-tokens.md`. La geometria del marchio sta in `src/logo.ts`, usata dalla navbar e dalla figura di "Cosa faccio per te".
- **Prestazioni:** Lighthouse mobile home 96 (mediana di 3 run, 2026-09-30), CLS 0 in mediana; passata prestazioni con il blocco A fatto.

- Test permanenti: `test-switch`, `test-scena`, `test-etichette`, `test-progetti`, `test-pagine` (390 e 1280), `test-nav` (320, 360, 390, 430, 768, 1280 più le rotazioni), `test-forme` (320, 390, 768, 1024, 1280), `test-loghi` (390 touch e 1280), `test-percorsi` (390 e 1280, due percorsi), `test-carosello` (390 touch e 1280, reduced-motion, senza JavaScript), tutti verdi.

## Da fare
- **Passata prestazioni.** Blocco B: interventi 4 (dimensioni delle immagini) e 5 (CSS dentro l'HTML), con
  misura prima e dopo. Prova C: intervento 6 (entrata del titolo dell'hero su telefono), da
  valutare guardando l'animazione, **insieme al CLS intermittente dell'hero** da sistemare
  nello stesso intervento: 0,063 a 1280px (la riga dev sotto il titolo scende da 320 a 443px
  e trascina le forme, 3 caricamenti su 12) e 0,024 a 390px (le forme Bauhaus, 2 su 6), tra i
  120 e i 270 ms. Dettagli nella misura del "Blocco testi e carosello" in `docs/STORIA.md`. **Rimandati:** 7 (switch senza React) e 8 (un peso di Hanken
  Grotesk in meno).
- **Audit e copy.** I punti di `docs/AUDIT.md` ancora aperti vanno riverificati: l'elenco del 2026-09-21 in `docs/STORIA.md` ("Correzioni dall'audit") è in parte superato da lavori successivi. Il passaggio sui copy è in `docs/inventario-testi.md`; le voci lasciate non toccate sono in `docs/STORIA.md`, "Revisione testi con la nuova regola 5".
- **Testi dei loghi (2026-09-30).** Quelli in `src/content/loghi/*.md` sono **provvisori**: tre o quattro frasi per logo scritte da Claude con le sole informazioni del repo, sopra le frasi che Luigi aveva già scritto. Da riscrivere con i suoi appunti.
- **Riordino delle sezioni del caso reale per percorso — opzione futura, da valutare quando ci
  saranno i contenuti di Fornace Vietri e pizzeria.** Era la proposta 1 delle due preparate il
  2026-09-22 sul punto 5 della passata 2 di `docs/AUDIT.md` ("lo switch promette due siti e ne
  consegna tre righe"); Luigi ha scelto la 2, già in produzione (vedi `docs/STORIA.md`). L'idea: su
  `/progetti/caso-reale` le quattro sezioni (Contesto, Decisione, Risultato, Cosa ho imparato)
  cambiano ordine col percorso — business parte dal Risultato, cioè dai numeri e dal ramp chart;
  dev tiene l'ordine processuale di oggi. Zero copy nuovo, cambia solo la sequenza. Costo stimato
  mezza giornata: servono due varianti `data-only` dell'intero blocco (il pin della colonna
  sinistra non è coinvolto, è ancorato a titolo e cover). Il rischio da risolvere prima di
  aprirla: duplicare nel DOM componenti con animazione (StatTile col conteggio, RampChart,
  Funnel, slider prima/dopo) vuol dire che la variante nascosta non anima mai, e chi cambia
  percorso dopo aver già scrollato la vedrebbe ferma — serve un hook che faccia ripartire le
  entrate al cambio di `html[data-target]`.
- Fase di performance dedicata a fine progetto (regola 7): avviata il 2026-09-29, blocco A fatto, il resto in `docs/STORIA.md`, "Passata prestazioni".

## Annullato
- **Fase 4 — oggetto 3D nell'hero.** Annullata il 2026-09-19. Due motivi: lo spazio dell'hero è già occupato dalla scena scrivania della Fase 2.5, e Three.js aggiungerebbe peso JS proprio dove il Lighthouse mobile è già sotto soglia (85 contro il ≥ 90 della regola 7). Restano quindi non necessari `HeroObject.tsx`, `public/models/hero.glb` e `hero-fallback.png`. Le dipendenze `three` e `@types/three` sono in `package.json` ma non importate da nessun file: da rimuovere quando si tocca il `package.json`.

## Note attuali
- **Dominio.** `luigiromano.cloud` è valido su Vercel: record A `@` → `216.198.79.1` e CNAME `www` → `vercel-dns`; `www` reindirizza a `luigiromano.cloud`. Dominio definitivo (2026-09-29): `site` in `astro.config.mjs` è `https://luigiromano.cloud`, senza www, e da lì leggono canonical, og:url, anteprime social, sitemap e robots (verificato nella build). Nessun altro file del repo contiene il dominio; non ci sono dati strutturati. `docs/AUDIT.md` nomina ancora `luigiromano.vercel.app` perché è la revisione fatta su quel sito. Ricontrollato il 2026-09-30 (escluse STORIA e PRESTAZIONI): nessun riferimento al vecchio dominio nel codice, nei test o nella config, quindi niente da aggiornare.

## Decisioni aperte
- **Lighthouse mobile home**: era 85 (sotto il ≥ 90 della regola 7), il 2026-09-29 è 94 nella passata prestazioni (mediana di 3 run, percorso sviluppatore, LCP 2,71 s). Nella stessa passata Fornace e pizzeria sono a 96; caso reale (93) e /loghi (99) sono misurati dopo il blocco A. L'LCP della home è il titolo dell'hero, che parte invisibile: vedi la prova C. Dopo il blocco testi e carosello (2026-09-30): 96 di mediana (89 / 96 / 96), CLS 0, LCP 2,63 s.
- Servono da Luigi: gli appunti per riscrivere i testi dei quattro loghi (vedi "Da fare").
- **Nav a 320px.** Con quattro voci, il marchio e "Scrivimi" la riga è piena: 3,5px di spazio per lato alle voci e "Scrivimi" senza bordo. Da 360 in su respira. Se a 320 pesa, l'alternativa è un menu a scomparsa sotto i 400px.
- **[DA VERIFICARE] Il nome "Vico Stretto"** (dal documento dei contenuti): prima di pubblicare
  controllare che non esista una pizzeria reale con questo nome. In caso, cambiarlo. Il nome
  compare nel titolo e nei testi di `src/content/progetti/pizzeria.md`, ma anche dentro tutte
  e sei le immagini di `src/assets/progetti/pizzeria-vico-stretto/` e nell'og: cambiarlo vuol
  dire rifare le immagini.
- **Schema del flusso illeggibile a 390.** `pizzeria-flusso` è larga 2880x987: a 350px il testo
  dei riquadri misura pochi pixel. Il contenuto è comunque nella pagina (i tre passi nell'elenco
  sopra, i cinque di prima nel capitolo Il problema e nell'alt). Se serve leggibile anche da
  telefono: una versione verticale dell'immagine per il mobile, oppure lo schema scorrevole in
  orizzontale come la galleria.

## Decise
- Form di `/contatti`: **Formspree** (deciso il 2026-09-19).
