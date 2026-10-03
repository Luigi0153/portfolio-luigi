# Stato del progetto

**Fase corrente:** `/contatti` a due percorsi e pagina `/privacy` fatti (2026-09-30), dopo la chiusura della prova sfondi, la nuova figura e i nuovi testi di "Cosa faccio per te" dello stesso giorno, dopo il blocco modifiche dello stesso giorno, il blocco testi e carosello e la passata prestazioni, blocco A (2026-09-29). Fase 4 annullata.

La storia delle fasi finite (cosa è stato fatto, come e perché, misure e decisioni di dettaglio)
è in `docs/STORIA.md`. Qui restano solo lo stato attuale e i lavori da fare.

## Sito oggi
- **Home:** hero con switch tra i due percorsi (scelta in `localStorage`, `html[data-target]`) e scena scrivania, griglia progetti con ordine per percorso, "Cosa faccio per te" (solo percorso business, con la L del marchio che si costruisce riga dopo riga), carosello dei loghi su fondo ink (l'unica sezione della home su fondo scuro), invito al contatto.
- **Progetti:** caso reale (sette capitoli, slider prima/dopo) e i concept Fornace Vietri e pizzeria Vico Stretto, etichettati "Branding concept", con foto generate con l'AI. Dettaglio in `/progetti/[slug]`.
- **Loghi:** `/loghi` con filtri e `/loghi/[slug]`, quattro loghi con testi provvisori. Nessuna etichetta "Progetto", né a vista né nell'alt: il campo `tipo` resta nei dati per l'etichetta "Esercizio di stile".
- **Nav:** Progetti, Come lavoro, Loghi e "Scrivimi" (unico accesso ai contatti, in pillola anche su telefono; sotto i 340px senza bordo). Il quarto di cerchio del marchio ruota al passaggio, col focus e al tocco.
- **Altre pagine:** `/come-lavoro` (processo, stack, progetto n°5, "Il mio processo creativo"), `/contatti` (diversa per i due percorsi, vedi sotto), `/privacy`, 404, sitemap, robots, og-image, `vercel.json`.
- **Design:** palette a tre colori (cream, ink, arancio), token in `src/styles/tokens.css` e `docs/design-tokens.md`. La geometria del marchio sta in `src/logo.ts`, usata dalla navbar e dalla figura di "Cosa faccio per te".
- **Prestazioni:** Lighthouse mobile home 96 (mediana di 3 run, 2026-09-30), CLS 0 in mediana; passata prestazioni con il blocco A fatto.

- **Contatti (2026-09-30).** In cima lo stesso switch dell'hero, con la stessa scelta salvata: se c'è è preselezionata, se manca la pagina la chiede e non mostra nessun percorso (`html[data-scelto]`, scritto dallo script in `Base.astro`). "Vuoi vendere online": modulo a passi (`ContattiBusiness.astro`), una domanda per schermata, indicatore "1 di 3" in aria-live, focus sulla domanda nuova, Indietro che conserva le risposte, un solo invio alla fine. "Cerchi uno sviluppatore": email, LinkedIn e GitHub in evidenza e modulo corto (`ContattiDev.astro`). Helper condivisi in `src/scripts/modulo.ts`, stili in `src/styles/modulo.css`. Senza JavaScript i moduli sono normali e il POST nativo funziona.
- **Hero e percorsi (2026-10-03).** Le righe, i bottoni e la prova dell'hero (`[data-only]`) del percorso non attivo hanno anche l'attributo `hidden`, oltre al `display: none` del CSS: lo aggiorna lo script di `Hero.astro` con un osservatore su `html[data-target]` (a ogni cambio, all'avvio e dopo le View Transitions). Description della home: "Luigi Romano, web developer a Napoli. Realizzo siti e negozi online per le attività e resto al loro fianco anche dopo la consegna." Nuovo token "titolo lungo" (`--leading-titolo-lungo`, 1.3, per titoli e aperture oltre 3 righe su mobile) usato solo da `.servizi__apertura`; le righe dell'hero restano a 1.2. `Button.astro` ha `target` e `rel` nelle Props.
- **Caso reale aggiornato (2026-10-03).** Dati giugno–settembre 2026 in `docs/content/caso-reale.md` (la fonte) e in `src/content/progetti/caso-reale.md`: conversione del sito da 0,19% a 0,50% (circa 2,6 volte), visite calate da circa 3.650 a circa 1.800 al mese, valore medio ordine +37%, 93% da mobile, canali 66/30/4, borse e zaini oltre l'80% del fatturato. Tre tessere (`CasoDati.astro`), grafico della conversione mensile (`RampChart.astro`), funnel con i totali del periodo (`Funnel.astro`, 12.025 → 511 → 391 → 39). Il testo non attribuisce la crescita agli interventi. Niente fatturato in euro. La riga della prova nell'hero (percorso business) dice "Su un negozio reale: 2,6 volte più acquisti ogni 100 visite, da giugno a settembre", con "negozio reale" che porta al caso; la controlla `test-switch`. Le immagini `caso-riepilogo` e `caso-fase2-identita` (desktop e mobile) sono fuori dalla pagina, vedi "Da fare".
- Test permanenti: `test-hero-hidden` (390 e 1280, `hidden` sulle varianti dell'hero all'avvio, dopo ogni cambio di percorso e dopo una navigazione interna), `test-contatti` (390 e 1280, due percorsi, senza JavaScript, invii a Formspree intercettati), `test-switch`, `test-scena`, `test-etichette`, `test-progetti`, `test-pagine` (390 e 1280), `test-nav` (320, 360, 390, 430, 768, 1280 più le rotazioni), `test-forme` (320, 390, 768, 1024, 1280), `test-loghi` (390 touch e 1280), `test-percorsi` (390 e 1280, due percorsi), `test-carosello` (390 touch e 1280, reduced-motion, senza JavaScript), tutti verdi.

## Da fare
- **Rifare due immagini del caso reale con i dati giugno–settembre 2026.** `caso-riepilogo` (desktop e mobile: dentro 4,04% e 4.233 sessioni, dati di luglio) e `caso-fase2-identita` (desktop e mobile: nella riga della palette c'è scritto "il 68% del fatturato", ora è oltre l'80% con gli zaini) sono fuori dalla pagina. I file sono intatti in `src/assets/progetti/caso-reale/`. Nel markdown (`src/content/progetti/caso-reale.md`) restano due commenti con le istruzioni per rimetterle, e `test-progetti` controlla che non siano in pagina: quando tornano, il test va aggiornato.
- **Informativa privacy da far controllare.** Il testo di `/privacy` (`src/pages/privacy.astro`) è una bozza scritta da Claude, breve e in parole semplici, non un parere legale. Va fatto controllare prima della pubblicazione da chi se ne intende. Dal 2026-09-30 dice che Formspree ha sede fuori dall'UE e che i dati si conservano al massimo 12 mesi (frase di Luigi). Punti da verificare: titolare e base di trattamento (oggi il consenso con la casella), se basta dire "fuori dall'UE" per il trasferimento dei dati a Formspree, se i 12 mesi valgono anche per quello che Formspree tiene sui suoi server, e la frase su Vercel, che non ho potuto confrontare con le loro condizioni. La casella del consenso c'è nei due moduli (`consenso_privacy`); senza JavaScript il controllo è quello nativo del browser.
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
- **Campi inviati a Formspree (`/contatti`, id `xkjgoowv`).** Modulo a passi: `servizio`, `servizio_altro` (solo se "Altro"), `situazione`, `nome`, `contatto_preferito` (Telefono o Email), `telefono` oppure `email` (mai tutti e due, con JavaScript), `consenso_privacy`, `percorso` ("Vuoi vendere online"), `_subject`, `_gotcha`; con l'email c'è anche `_replyto`. Senza JavaScript partono tutti i campi, anche vuoti, e Formspree usa `email` come indirizzo di risposta. Modulo corto: `nome`, `email`, `messaggio`, `consenso_privacy`, `percorso` ("Cerchi uno sviluppatore"), `_subject`, `_gotcha`. I valori sono le etichette lette dall'utente, così l'email che arriva si capisce senza tabelle.
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
