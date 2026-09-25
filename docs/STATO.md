# Stato del progetto

**Fase corrente:** Fase 7 (pizzeria Vico Stretto) chiusa il 2026-09-24, in attesa di conferma. Fase 4 annullata.

## Completo
- **Fase 1** — token, layout, Nav, Card, Tag, Button, StatTile, SectionHeader, `/styleguide`.
- **Fase 2** — hero con switch target (isola React, scelta in `localStorage`, `html[data-target]`), scena scrivania con hotspot ed etichette.
- **Fase 3** — collection `progetti`, caso reale + 2 placeholder, griglia con ordine per percorso, dettaglio `/progetti/[slug]` con colonna pinnata, ramp/funnel/StatTile/slider prima-dopo, tilt card, View Transitions, conteggio numeri.
- **Fase 5** — `/come-lavoro` (4 passi, stack, progetto n°5), `/contatti` (canali + form Formspree attivo), 404, sitemap + robots (endpoint) + og-image per ogni pagina, `vercel.json`, README in italiano. Review finale fatta: contrasti AA e bersagli tattili a posto.
- **Fase 6 — concept Fornace Vietri (2026-09-23).** Pagina `/progetti/fornace-vietri` online,
  non più "in arrivo". Testi da `docs/content/fornace-vietri.md` (decisioni aperte chiuse, via i
  `[DA DECIDERE]`), riscritti secondo la regola 5: via le metafore ("Un esaurito è una porta
  chiusa", "Shopify si può piegare", "trasforma un esaurito in una richiesta"), virgolette
  tipografiche “ ” sui nomi dei bottoni. Sotto il titolo la riga `Progetto concept. Il
  laboratorio è inventato, il problema è reale. Le foto sono generate con l'AI.` (campo `nota`).
  Sei capitoli: Il laboratorio (+ `fornace-brand`), Il problema, La decisione (+ `fornace-stati`),
  Il sistema (quattro sottosezioni + galleria delle quattro schermate), Cosa ho imparato, Nel
  negozio vero farei. Lente `sistema`, tag Shopify · Design system · Catalogo · Mobile.
  - **Schema.** Le quattro chiavi fisse `sezioni`/`dati` (contesto, decisione, risultato,
    imparato) sono diventate un elenco `capitoli`, ognuno con `id`, `titolo`, `righe` (max 3),
    `figura`, `dati`, `sottosezioni`, `galleria`, montati in quest'ordine. Il caso reale è
    passato alla stessa struttura con output identico (stessi id `sez-*`, stessi titoli).
  - **Galleria.** Sotto i 768 scorre in orizzontale con scroll-snap, una schermata alla volta
    (`min(78vw, 320px)`, la seguente spunta a destra), a filo dei bordi dello schermo;
    contenitore `role="region"` con `tabindex="0"` per lo scorrimento da tastiera. Da 768 le
    quattro schermate stanno affiancate in griglia. Etichetta mono sopra ogni schermata.
  - **Cover.** `fornace-copertina` in griglia e in cima alla pagina; la vecchia cover geometrica
    `fornace-vietri.png` è eliminata e tolta da `prepara-cover.mjs`. Le cover della griglia
    passano da 4:3 a 3:2, il formato della copertina: le cover geometriche (1200x900) perdono solo
    50px vuoti sopra e sotto. La cella grande ora va al pubblicato con `ordine_dev` più basso, non
    al primo file letto dal loader.
  - **Og-image.** `prepara-og.mjs` accetta `copertina`: per Fornace l'og è la copertina tagliata
    al centro a 1200x630 (PNG 492 KB, senza palette che su una foto farebbe bande).
  - **Test.** `test-progetti` conta un solo tag "in arrivo" (pizzeria) e verifica la pagina di
    Fornace a 390 e 1280: riga concept, sei capitoli in ordine, ogni immagine nel suo capitolo,
    alt, caricamento, galleria affiancata a 1280 e scorrevole con snap a 390, og servita.
    Verificato sulla build di preview con i sette test permanenti (tutti verdi) e screenshot
    a 390/1280 di griglia (entrambi i percorsi) e pagina.
- **Fase 7 — concept pizzeria Vico Stretto (2026-09-24).** Pagina `/progetti/pizzeria` online,
  stesso schema di Fornace. Titolo `Pizzeria Vico Stretto`, lente `flusso`, tag Landing page ·
  Prenotazioni · Mobile · Instagram, riga `Progetto concept. La pizzeria è inventata, il
  problema è reale. Le foto sono generate con l'AI.` Testi da `docs/content/pizzeria.md`
  (decisioni chiuse: prenotazione via WhatsApp con messaggio già scritto, foto realistiche
  generate con l'AI, mockup statici; via i `[DA DECIDERE]`), riscritti secondo la regola 5.
  Otto capitoli: La pizzeria (+ `pizzeria-brand`), Il problema, Il flusso (+ `pizzeria-flusso`),
  La decisione, Cosa ho tolto, La pagina (+ galleria di tre schermate), Cosa ho imparato, Nel
  locale vero farei. La sezione "I vincoli" del documento non ha un capitolo suo: commissioni e
  gestionale stanno in una riga di Il problema, il menu in PDF in Cosa ho tolto.
  - **Schema.** Nuovo campo `elenco` del capitolo (`numerato`, `voci` da 2 a 6), montato tra le
    righe e la figura: i tre passi del flusso (`<ol>`) e le quattro voci di Cosa ho tolto e La
    pagina (`<ul>`) non stavano nelle tre righe. Marcatori ink-2, numeri in mono.
  - **Galleria.** Il numero di colonne da 768 segue il numero di schermate (`--schermate`,
    quattro per Fornace, tre qui), e `sizes` di conseguenza. `aria-label` da "Schermate del
    negozio" a "Schermate del progetto".
  - **Niente più "in arrivo".** Tolti il campo `in_arrivo` dallo schema, il tag nella griglia e
    nella pagina, il ramo che mostrava il corpo del file (con `render` e `.caso__prosa`), il
    filtro sulla cella grande; `capitoli` ora è obbligatorio (almeno uno). Il `Tag` tone
    `cream` resta, perché lo usano i chip di codice di `/come-lavoro`; nello styleguide l'esempio
    "In arrivo" è diventato un chip `Liquid`. Eliminata la vecchia cover geometrica
    `pizzeria.png` e il suo SVG in `prepara-cover.mjs`.
  - **Og-image.** `og/pizzeria.png` dalla copertina, tagliata a 1200x630 (444 KB).
  - **Test.** `test-progetti` verifica che nessuna card sia "in arrivo", le copertine dei due
    concept in griglia, e passa le stesse verifiche di pagina a Fornace e pizzeria da una
    tabella `CONCEPT` (riga concept, capitoli in ordine, elenchi, figure nel capitolo giusto,
    galleria, alt, caricamento, snap a 390, og). Verificato sulla build di preview con i sette
    test permanenti (tutti verdi) e screenshot a 390/1280 di griglia (entrambi i percorsi) e
    pagina.
- **Pizzeria, nuova identità (2026-09-24).** Immagini sostituite da Luigi con la direzione
  "bottega in bianco e nero": fondo nero, marmo, un solo rosso per pomodoro e bottone, logo a
  sigillo con "dal 1961", Bodoni Moda e Karla, ambienti in bianco e nero e pizze a colori, menu
  su marmo con i puntini fino al prezzo. Riscritti cover alt e tutti gli alt; la riga concept
  diventa `Progetto concept. La pizzeria e la sua storia sono inventate, il problema è reale.
  Le foto sono generate con l'AI.` Og rigenerata dalla nuova copertina (309 KB).
  - **Figura con versione mobile.** Campo opzionale `figura.mobile` nello schema: la pagina
    monta un `<picture>` con la versione larga in `<source media="(min-width: 768px)">`
    (ottimizzata con `getImage`, con `width`/`height` per il suo rapporto) e la versione
    mobile nell'`<img>`, stesso alt. Usato per `pizzeria-flusso` / `pizzeria-flusso-mobile`.
    `test-progetti` verifica che a 390 si carichi la mobile e a 1280 la larga.
- **Pizzeria, palette rivista (2026-09-25).** Immagini sostituite di nuovo, stessi nomi: via il
  fondo nero e il rosso, dentro marmo chiaro al 60%, nero al 30%, bordeaux al 10%. Restano
  sigillo "dal 1961", Bodoni Moda e Karla, ambienti in bianco e nero e pizze a colori; il menu
  passa da lastra di marmo a lavagna nera. Riscritti gli alt che nominavano il fondo nero o il
  colore rosso (copertina, `pizzeria-brand`, `pizzeria-landing`, `pizzeria-prenota`) con
  "marmo chiaro", "bordeaux" e "lavagna nera". Og rigenerata dalla nuova copertina.
- Test permanenti: `test-switch`, `test-scena`, `test-etichette`, `test-progetti`, `test-pagine` (390 e 1280), `test-nav` (320, 360, 390, 430, 768, 1280 più le rotazioni), `test-forme` (320, 390, 768, 1024, 1280), tutti verdi.

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
  verso `/contatti`.

Il resto della lista di `docs/AUDIT.md` (titolo della home, prova sopra la piega, cosa fai per
il percorso business, consenso e informativa del form, switch senza React, etichette della scena
visibili a riposo) non è stato toccato.

- **Font e tazza (2026-09-21)** — due dei tre "pedaggi" di prestazioni della passata 5 sono
  chiusi. `global.css` non importa più `@fontsource-variable/fraunces/full.css` (tutti gli assi,
  100-900): al suo posto un `@font-face` locale su `src/assets/fonts/fraunces-latin-72-50.woff2`,
  un'istanza con opsz e SOFT fissati a 72/50 (gli unici valori usati da `--display-axes`) e wght
  variabile solo 500-700 (gli unici pesi usati). File generato con l'API statica di Google Fonts
  (stesso font open source di `@fontsource`, licenza OFL) e self-hosted da qui, come vuole la
  regola dello stack. **-81,5 KB per pagina.** La dipendenza `@fontsource-variable/fraunces` resta
  in `package.json` inutilizzata, come `three`/`@types/three`: da togliere insieme quando si tocca
  il file. In `DeskScene.astro` la tazza passa da `loading="eager"` a `loading="lazy"`: dentro
  `.desk__scena`, che è `display:none` sotto 768px, un'immagine lazy non si scarica finché
  quel display non cambia. **-54 KB sulla home mobile.** Misurato con Playwright + CDP
  (`encodedDataLength`, mediana di 3 run, build di preview, 390px): home 507,4→368,7 KB,
  come-lavoro 252,4→168,9 KB, contatti 205,3→121,9 KB, caso-reale 267,3→183,8 KB. Verificato con
  i cinque test permanenti e screenshot a 390/1280, tutto verde. Resta il terzo pedaggio (React
  per lo switch, -66 KB) e la fase di Lighthouse dedicata.

- **Nav a pillola su mobile (2026-09-22).** Annullata la distribuzione a tutta larghezza del
  commit `4155f25`: sotto i 768 la pillola torna larga quanto il contenuto e centrata, staccata
  12px per lato (il padding-inline dell'header, cioè i 24px chiesti). Gli spazi stanno in tre
  variabili di `.site-nav` (`--nav-gap`, `--nav-pad-voce`, `--nav-pad-logo`), tutte in `clamp()`:
  lo spazio tra due voci va da 12,2px a 320 a 20px da 527 in su, dove si ferma. Il testo delle
  voci (`--nav-testo-voce`) scende solo dove gli spazi hanno già toccato il minimo — 14px da 360
  in su, 13px a 320, mai sotto — e resta su una riga sola. Il riempimento verde si posiziona con
  `getBoundingClientRect()` invece di `offsetWidth`/`offsetLeft`, che arrotondano all'intero
  mentre ora le voci misurano frazioni di pixel. Separatore rimesso anche sotto i 768: con la
  pillola stretta è di nuovo lui a staccare il logo dalle voci. Nuovo test permanente
  `scripts/test-nav.mjs`: 6 larghezze × 3 voci attive, ognuna anche ruotata in orizzontale.
  A 320 la pillola misura 282 di 296 disponibili: è la larghezza più stretta che regge, sotto
  quella il contenuto uscirebbe dal bordo.

- **Marchio nella nav e favicon (2026-09-23).** Nella pillola il testo "Luigi" è diventato il
  marchio "L" come SVG inline (barra ink + quarto di cerchio arancio, colori dai token), dentro
  un link 44x44 con `aria-label="Luigi Romano, torna alla home"`. Via `--nav-pad-logo` e il
  `padding-left` in più della pillola da desktop. Il separatore torna **solo da 768**. Il nome
  per intero non è più nella nav, quindi `SITE_NAME` in `Base.astro` passa da "Luigi" a
  "Luigi Romano" (titolo, og:site_name, og/twitter title), in più c'è `<meta name="author">`;
  la home ha titolo "Luigi Romano". Il footer lo aveva già. Favicon: `public/favicon.svg`
  (fornito da Luigi, barra cream nella scheda scura) + `favicon.ico` 32 e
  `apple-touch-icon.png` 180 su fondo cream, generati da `scripts/prepara-favicon.mjs` con
  sharp. L'archivio del marchio è in `docs/brand/` e non va usato nel sito. `test-nav` ora
  verifica anche marchio (misure, centratura, aria-label, focus ink), separatore e presenza del
  nome in titolo, meta e footer su 5 pagine.

## Annullato
- **Fase 4 — oggetto 3D nell'hero.** Annullata il 2026-09-19. Due motivi: lo spazio dell'hero è già occupato dalla scena scrivania della Fase 2.5, e Three.js aggiungerebbe peso JS proprio dove il Lighthouse mobile è già sotto soglia (85 contro il ≥ 90 della regola 7). Restano quindi non necessari `HeroObject.tsx`, `public/models/hero.glb` e `hero-fallback.png`. Le dipendenze `three` e `@types/three` sono in `package.json` ma non importate da nessun file: da rimuovere quando si tocca il `package.json`.

## Manca
- **Prompt 2 e 3 del progetto n°5.** L'array `PROMPT_REALI` in `src/pages/come-lavoro.astro` ne ha uno solo, l'unico con una fonte nel repo (PROMPT DI AVVIO, da `MASTER_PROMPT.md`). Gli altri due non sono recuperabili da qui: il blocco "FASE 2.5" non è mai stato scritto in `MASTER_PROMPT.md` (il file ha un solo commit, e contiene le fasi 1-5), e il commit `a1784f8` registra la diagnosi del burst, non il prompt che l'ha prodotta. Servono i testi veri da Luigi: la sezione è già pronta, basta aggiungere le voci.
- **Dominio da confermare.** `site` in `astro.config.mjs` è `https://luigi-portfolio.vercel.app`: se Vercel assegna un nome diverso al primo import va corretto lì e ricostruito (canonical, og:url, sitemap e robots leggono da lì).
- **Passaggio sui copy.** L'inventario voce per voce è in `docs/inventario-testi.md` (135 voci,
  con giudizio e posizione nel codice): è la lista di lavoro per la riscrittura. Fatti la griglia
  progetti, l'invito al contatto, il sottotitolo dell'hero (2026-09-21, quest'ultimo fuori
  dall'inventario perché il titolo/sottotitolo di `Hero.astro` era già stato riscritto una volta
  nel commit `2236e9b`, prima e indipendentemente da questo passaggio) e il caso reale (2026-09-21,
  9 voci riscritte su proposta di tre varianti, vedi "Cosa è cambiato" in `docs/inventario-testi.md`;
  il 2026-09-22 allineata anche la riga gemella in `Funnel.astro:72-75`). La scena scrivania
  (2026-09-22) è stata rivista: unica voce "da AI", l'easter egg della tazza — proposte 3
  varianti, Luigi ha scelto di tenere il testo attuale. Il 2026-09-22 riscritta anche
  `/come-lavoro`: le 17 voci "da AI"/"misto" dell'inventario (di 18 — "Il processo" era
  "generica" e resta fuori), proposte 3 varianti ciascuna, Luigi ha scelto lettera per lettera
  con alcune correzioni a mano (niente "invece di immaginartela" alla voce 8, "Poche cose,
  conosciute bene" riscritto invece che ripetuto identico alla voce 10, solo la prima frase
  alla voce 15, due voci — 3 e 12 — riscritte da capo su sua richiesta di "più semplice e
  diretto"). Verificata con i cinque test permanenti (un fallimento sulla CTA business al primo
  giro, flake legato al riavvio del server preview: 3/3 verde ai run successivi) e screenshot a
  390/1280 per entrambi i target. Il 2026-09-22 riscritte anche le 3 voci "da AI" di footer
  (`Base.astro:112`) e 404 (`404.astro:12` e :28-29), proposte 3 varianti ciascuna: la meta
  description del 404 è ora neutra (scelta C). Il footer e la chiusa del 404 sono poi stati
  corretti a mano da Luigi, fuori dalle varianti proposte: footer → `© {year} Luigi Romano.`
  (via il nome buttato lì, niente più battuta); chiusa del 404 → `Pagina non trovata. Succede
  anche ai corrieri migliori.`, la frase 15 già pronta in `docs/voce.md`, al posto della frase
  sull'oggetto 3D e della battuta su Gandalf. Verificata con i cinque test permanenti (tutti
  verdi) e screenshot di home e 404 a 390/1280.

  Il 2026-09-22 (secondo giro) toccati hero, contatti, caso reale e il resto di `/come-lavoro`
  su richiesta diretta di Luigi (non dall'inventario, testi già decisi da lui). Hero: aggiunta
  una riga sola per il percorso business, sopra quella colorata (`Aiuto le aziende a vendere
  online con Shopify.` + `Partiamo dai numeri del tuo negozio e decidiamo insieme cosa
  cambiare.`), riga dev accorciata (`Lavoro su Shopify ogni giorno, su negozi veri.`). Contatti:
  le due righe sotto il titolo ora sono un invito diretto per percorso (`Cerchi uno sviluppatore
  Shopify...` / `Hai un progetto per la tua azienda...`), e la promessa di tempo di risposta
  ("Rispondo entro un giorno lavorativo") è sparita ovunque nel sito (meta, intro, esito form,
  `InvitoContatto.astro`) — restano le altre voci "da AI" della pagina, non toccate (`Tre campi.
  Nessun "reparto di competenza".`, ecc.). Caso reale: il sommario non nomina più "in Campania".
  `/come-lavoro`: i quattro passi rinominati (Ci conosciamo, Guardo i numeri, Prototipo, Online)
  e riscritti sui testi di Luigi; poi, su sue correzioni a una prima proposta, riscritti anche
  titolo della sezione processo (via l'intro che ripeteva quella di pagina), intro dev, e tutto
  il blocco progetto n°5 (via il nome tecnico `localStorage` non spiegato al lettore business e
  la frase su Google non verificata, riscritto senza i due punti a effetto il paragrafo "Il
  come"). `test-progetti.mjs` e `test-pagine.mjs` avevano asserzioni sui testi vecchi (vecchio
  titolo del caso reale, vecchi nomi dei passi): aggiornate. Verificata con i cinque test
  permanenti (tutti verdi) e screenshot a 390/768/1280, entrambi i percorsi, su home, contatti,
  come-lavoro, caso-reale.

  Il 2026-09-23 (terzo giro, testi dettati da Luigi) Shopify esce dall'hero. Eyebrow `Web
  Developer · AI Web Designer`; riga dev `Programmatore web junior. Lavoro ogni giorno su negozi
  online veri.`; riga business `Aiuto le aziende a vendere online.` ("junior" non compare nel
  percorso business: né testo visibile, né title, meta o aria-label). `/come-lavoro`: un'intro
  sola per i due percorsi (`Questi sono i passi che seguo, dall'idea al sito online.`), passo
  prototipo e passo online riscritti ("resto al tuo fianco" al posto di "ti lascio le
  istruzioni per gestirlo da solo"), stack business `Uso strumenti standard e diffusi. Il sito
  resta tuo, e io resto a disposizione.` al posto di "se un giorno non ci sono io". Shopify
  resta nello stack e nel caso reale. Stesso giorno: footer e og-image della home `Web Developer
  e AI Web Designer`, meta della home `Luigi Romano, web developer e AI web designer. Creo e
  seguo siti e negozi online, anche su Shopify.`; `/contatti` con un titolo e una riga soli per
  i due percorsi (`Discutiamone insieme.` + `Cerchi uno sviluppatore per il tuo team o per
  creare e gestire il tuo sito? Contattami.`). Regola 5 di `CLAUDE.md` riscritta da Luigi:
  niente ironia salvo la tazza, il cliente non resta mai solo. `prepara-og.mjs` ora legge il
  Fraunces self-hosted (`src/assets/fonts/`): il pacchetto `@fontsource-variable/fraunces` non
  c'è più. Rigenerata solo `og.png`; le altre og, rifatte con il nuovo file, differivano solo
  nell'antialiasing e sono state lasciate com'erano.

- **Palette a tre colori (2026-09-23).** `verde`, `verde-deep`, `blu`, `giallo` e `rosso` escono
  da `src/styles/tokens.css` e da `docs/design-tokens.md`: restano `cream`/`cream-2` (60%),
  `ink`/`ink-2` (30%), `arancio` (10%, unico accento). Tolti a mano da ogni file che li usava,
  build e classi Tailwind non generate non lo segnalano da sole. Le regole, componente per
  componente:
  - **Nav** (`Nav.astro`): voce attiva ink con testo cream (contrasto 15,9:1); `Scrivimi` outline
    ink su fondo trasparente, riempimento ink al passaggio del mouse.
  - **Hero**: riga sotto il nome ink-2 in entrambi i percorsi (prima blu/verde-deep).
  - **Link** (`global.css`): sottolineatura arancio sempre, testo arancio al passaggio del mouse
    (prima verde/verde-deep); selezione del testo fondo arancio, testo cream.
  - **Forme Bauhaus**: ogni composizione (hero, `/come-lavoro`, `/contatti`, 404, cover dei
    progetti, og-image) resta a una forma arancio e le altre ink, mai più di una insieme.
  - **Grafici**: `RampChart` (barre mensili) e `Funnel` (imbuto del caso reale) hanno barre
    cream/ink, solo l'ultima (il mese o il passo finale) in arancio, bordo ink sempre presente
    sulla pista. `StatTile`: tone ridotto a `ink` (default) e `arancio`; nel caso reale solo
    +86% di fatturato è arancio, +63% ordini e 94% traffico restano ink.
  - **Tag**: tone ridotto a `ink` (solo bordo) e `cream` (fondo cream-2, bordo e testo restano
    ink) — usato per "in arrivo" e per i chip tecnici (`Liquid`, `Astro`, ecc., prima `blu`).
  - **Chip di codice** (`<code>` in "Come ho costruito questo sito"): ora un vero chip, fondo
    cream-2 e testo ink (14,5:1) al posto del testo blu senza fondo.
  - **Esito del form** (`/contatti`): messaggio positivo fondo ink/testo cream (prima
    verde-deep); quello negativo era già cream-2 con bordo arancio, invariato.
  - **Burst dell'hover sulla scena** (`DeskScene.astro`): arancio e cream-2, entrambi token (un
    primo passaggio aveva messo un secondo tono di arancio fuori token, corretto lo stesso giorno) al
    posto dei due magenta.
  - **Before/After**: tag "Dopo" cream-2 con bordo ink (prima giallo).
  - **Cover dei progetti e og-image**: `prepara-cover.mjs` e `prepara-og.mjs` avevano la
    palette completa hardcoded e un sistema di "accento per percorso" (blu/verde/arancio) che
    non ha più senso con un solo accento; tolto, ogni composizione ora usa un solo arancio.
    Rigenerate tutte le cover (`src/assets/progetti/*.png`) e tutte le og-image.
  - **Styleguide**: palette, tabella contrasti e stati dei componenti aggiornati alla nuova
    lista; tolte le voci non più valide (`tone="verde"`, `tone="blu"`, `tone="giallo"`).

  Contrasti AA ricontrollati (formula WCAG, non stimati): tutte le coppie di testo realmente
  usate restano sopra 4,5:1 — ink/cream 15,94, ink/cream-2 14,51, ink-2/cream 8,68,
  ink-2/cream-2 7,90, cream/ink 15,94, arancio/cream 4,66 (testo normale, compresi i bottoni
  primary e i link in hover). Nessuna coppia di testo usata resta sotto soglia: l'unico caso a
  4,24:1 (arancio su cream-2) è l'icona decorativa `↗` dei link esterni, `aria-hidden` e quindi
  non testo. Verificato con i sei test permanenti sulla build di preview (tutti verdi) e
  screenshot a 390/1280, entrambi i percorsi, su tutte le pagine incluso lo styleguide.

- **Revisione testi con la nuova regola 5 (2026-09-23).** Riletti tutti i testi visibili del
  sito contro la regola 5 riscritta (niente ironia salvo la tazza, niente giochi di parole,
  niente termini tecnici non necessari). Luigi ha scelto due correzioni dalla lista proposta:
  riga dev dell'hero senza "veri" (`Lavoro ogni giorno su negozi online.`), e via il paragrafo
  sull'oggetto 3D nell'hero dal blocco "Il come" di `/come-lavoro` (il blocco resta di due
  paragrafi). Il resto della lista (404, "reparto di competenza" nel form, "Il codice, quello
  vero", lo "stack" nella description di `/come-lavoro`, le og-image fuori sincrono) non è stato
  toccato: resta da decidere. Verificato con i sei test permanenti sulla build di preview (tutti
  verdi) e screenshot a 390/1280.

- **Nav, forme e testi (2026-09-23).**
  - **Riempimento della nav trasparente.** Segnalato da Luigi: voce attiva col testo cream e
    riempimento trasparente. Nel sorgente, nella build e sul sito online il riempimento era già
    `--color-ink` (dal commit `d711bf2`): il bug non si riproduce, e con il vecchio
    `var(--color-verde-deep)` rimesso apposta il fondo diventa `rgba(0, 0, 0, 0)`, cioè
    proprio il sintomo, quindi con ogni probabilità era una vista rimasta indietro (dev server o
    cache del browser). Cercando è però uscito un difetto vero: l'id di `transition:persist`
    dell'header era un contatore diverso per pagina (home `-7`, caso reale `-3`, contatti e
    come-lavoro `-1`), quindi uscendo dalla home o dal caso reale l'header veniva sostituito e
    il riempimento smetteva di scorrere. Ora il nome è fisso (`transition:persist="site-nav"`);
    per non lasciare "Progetti" accesa uscendo dalla home, le voci di sezione ripartono spente a
    ogni pagina. `test-nav` verifica su tutte le pagine, aperte direttamente e raggiunte dalla
    nav, che la voce col testo cream abbia sotto il riempimento con fondo ink (letto dal token)
    e che l'header resti lo stesso nodo.
  - **Colori residui.** Nel codice (componenti, CSS, script, classi Tailwind, stili inline, script
    delle immagini) nessun riferimento a verde, verde-deep, blu, giallo, rosso o ai loro hex.
    Restavano solo i testi alternativi di tre cover, che descrivevano colori non più presenti:
    riscritti (`cerchio nero`, `barra nera`, `Due archi neri affiancati...`). Lasciati apposta: i
    documenti storici (`MASTER_PROMPT.md`, `docs/AUDIT.md`, `docs/inventario-testi.md`, questo
    file) e `docs/content/fornace-vietri.md`, dove blu, giallo e verde sono i colori delle
    ceramiche. Le illustrazioni della scena scrivania (schermo blu, tasti verdi e rossi del
    telefono, barre del grafico) sono disegni raster e non sono state toccate.
  - **Forme Bauhaus lontane dal testo.** Nuovo `scripts/test-forme.mjs`: per ogni forma calcola
    l'area che può occupare davvero (disco della diagonale per quelle che girano, più la corsa
    del parallax verso l'alto, ritaglio dell'overflow) e vuole almeno 8px da ogni riga di testo,
    etichette della scena comprese. Il primo giro ha trovato 24 casi: il cerchio e il quarto di
    `/contatti` sul titolo, il semicerchio dell'hero sulla CTA e sul +86% a 1024 e 1280, e a 390
    tutte e quattro le forme dell'hero sulle etichette delle tessere. Correzioni: hero sotto i
    768 senza barra e con cerchio, semicerchio e quarto spostati negli angoli; hero da 1024 con
    il semicerchio sotto la scena invece che in basso a sinistra; `/contatti` con il quarto
    nell'angolo in alto a destra e il cerchio sotto la fine del titolo; `/come-lavoro` cerchio
    4px più in alto (a 320 stava a 5,8px). Verificato anche a 360, 430, 900, 1100 e 1440.
  - **Testi.** 404: titolo `Pagina non trovata.`, testo `La pagina che cerchi non esiste o è
    stata spostata.`, description `Pagina non trovata.` (il bottone `Torna alla home` c'era
    già, `Vedi i progetti` è rimasto). Form: intro dev `Nome, email e messaggio. Ti rispondo
    io.`, "call" → "chiamata" nell'intro business. GitHub: `Guarda il mio codice` (contatti e
    footer). Description di `/come-lavoro`: `Come lavoro con i clienti, passo dopo passo, e gli
    strumenti che uso.` Og: home con slogan `Creo e seguo siti e negozi online.`, contatti con
    titolo `Discutiamone insieme.` e come sottotitolo la riga della pagina (la vecchia
    prometteva di rispondere entro un giorno lavorativo, promessa tolta dal sito il 2026-09-22),
    caso reale con titolo `I numeri prima, il sito dopo.` e lente `decisione`.
    `prepara-og.mjs` accetta ora i file da rigenerare come argomenti.
  Verificato sulla build di preview con i sette test permanenti (tutti verdi) e screenshot a
  390/768/1280 di home, contatti, come-lavoro e 404.

- **Prova sopra la piega nell'hero (2026-09-22).** Risponde a due punti della passata 2 di
  `docs/AUDIT.md`: il 3 (i numeri veri stavano a due click dalla home) e il 5 (lo switch cambiava
  troppo poco). Sotto la CTA dell'hero c'è ora una riga che cambia col percorso e linka a
  `/progetti/caso-reale`: dev `Il 94% delle visite del caso reale arriva da telefono. Per questo
  parto sempre dal mobile.`, business `+86% di fatturato da giugno a luglio, nel caso reale.`
  Le due cifre sono verificate su `docs/content/caso-reale.md` (righe 9 e 11). Testo statico e
  non `StatTile`: senza conteggio non c'è nessuna animazione da far ripartire quando lo switch
  scopre l'altra variante, che è il rischio principale dell'opzione rimandata qui sotto in
  "Manca". Verificata con i cinque test permanenti (tutti verdi) e screenshot della home a
  390/768/1280 nei due percorsi.
- **Riordino delle sezioni del caso reale per percorso — opzione futura, da valutare quando ci
  saranno i contenuti di Fornace Vietri e pizzeria.** Era la proposta 1 delle due preparate il
  2026-09-22 sul punto 5 della passata 2 di `docs/AUDIT.md` ("lo switch promette due siti e ne
  consegna tre righe"); Luigi ha scelto la 2, già in produzione (vedi sotto). L'idea: su
  `/progetti/caso-reale` le quattro sezioni (Contesto, Decisione, Risultato, Cosa ho imparato)
  cambiano ordine col percorso — business parte dal Risultato, cioè dai numeri e dal ramp chart;
  dev tiene l'ordine processuale di oggi. Zero copy nuovo, cambia solo la sequenza. Costo stimato
  mezza giornata: servono due varianti `data-only` dell'intero blocco (il pin della colonna
  sinistra non è coinvolto, è ancorato a titolo e cover). Il rischio da risolvere prima di
  aprirla: duplicare nel DOM componenti con animazione (StatTile col conteggio, RampChart,
  Funnel, slider prima/dopo) vuol dire che la variante nascosta non anima mai, e chi cambia
  percorso dopo aver già scrollato la vedrebbe ferma — serve un hook che faccia ripartire le
  entrate al cambio di `html[data-target]`.
- Fase di performance dedicata a fine progetto (regola 7).

## Decisioni aperte
- **Lighthouse mobile home a 85**, sotto il ≥ 90 della regola 7. In locale l'LCP è l'h1 a 188 ms: i 3,6 s vengono dal throttling simulato. Sospetto principale il peso JS (gsap 27 KB + ScrollTrigger 17 KB + React 65 KB, 36 KiB segnalati come inutilizzati). Non ancora stabilito se sia una regressione della Fase 3 o il livello di partenza.
- Servono da Luigi: i testi dei prompt 2 e 3 del progetto n°5 (vedi "Manca").
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
