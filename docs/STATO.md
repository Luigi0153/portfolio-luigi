# Stato del progetto

**Fase corrente:** passata prestazioni, blocco A fatto (2026-09-29). Fase 4 annullata.

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
- **Caso reale, immagini e proposta (2026-09-26).** Immagini in `src/assets/progetti/caso-reale/`.
  Sette capitoli: Contesto, Decisione, Cosa ho fatto (nuovo), Risultato, Il negozio oggi
  (nuovo), Il passo successivo (nuovo), Cosa ho imparato.
  - **Copertina.** `caso-copertina` in griglia e in cima alla pagina al posto della cover
    geometrica; og dalla copertina tagliata a 1200x630 (469 KB). Eliminati `caso-reale.png`, i
    segnaposto `scheda-prima.png`/`scheda-dopo.png` e `prepara-cover.mjs`, che generava solo
    quelle tre (tolto anche dal README).
  - **Cosa ho fatto.** I quattro interventi reali in elenco (aggiunta rapida nelle card scritta
    con Claude Code, badge ESAURITO, testi su spedizioni e resi oggi nel footer, categorie del
    catalogo) più la figura `caso-riepilogo`.
  - **Il negozio oggi.** `caso-oggi-home` e `caso-oggi-scheda` in galleria, con la riga sul
    negozio anonimo.
  - **Il passo successivo.** Due sottosezioni con etichetta "Proposta" (Tag) e una linea sopra.
    Fase 1, correzioni, con le quattro correzioni in elenco e lo slider. Fase 2, nuova
    identità, con `caso-fase2-identita`, galleria `caso-fase2-home` + `caso-fase2-scheda`,
    `caso-fase2-packaging`.
  - **Slider.** Da Risultato a Fase 1. `scripts/prepara-slider.mjs` ritaglia con sharp
    `caso-oggi-scheda` e `caso-fase1-scheda` alla prima schermata, 780x1688 (390x844 a 2x),
    senza ricomporre: in "Oggi" il bottone Aggiungi resta sotto il taglio, com'è davvero.
    `BeforeAfter` accetta `etichettaPrima`/`etichettaDopo` (default Prima/Dopo): qui "Oggi" e
    "Fase 1".
  - **Schema.** Le sottosezioni hanno ora `etichetta`, `elenco`, `dati` e `immagini`, una
    sequenza libera di figure e gallerie. Figura, galleria, elenco e blocchi dati sono passati
    in componenti (`CasoFigura`, `CasoGalleria`, `CasoElenco`, `CasoDati`) usati da capitoli e
    sottosezioni; output dei concept invariato.
  - **Testi.** Nessun numero fuori da `docs/content/caso-reale.md`: niente prezzi, codici colore
    o date degli screenshot negli alt. La fascia 35-54 anni della Fase 2 è stata aggiunta al
    documento, dalla skill `sisters-store-brand`: sono le statistiche Instagram del negozio
    (follower, non clienti verificate). Per questo la Fase 2 non parla più di "chi compra qui"
    ma del "pubblico del negozio su Instagram, in maggioranza donne tra i 35 e i 54 anni",
    nella pagina e nelle due immagini dell'identità, larga e mobile (sostituite da Luigi il
    2026-09-28). Nel resto del sito "chi compra" compare solo in Fornace, dove parla di chi
    compra ceramica in generale, non di un pubblico misurato. In Decisione "ho lavorato in ordine su tre cose" è diventato "tre priorità in
    ordine", perché Cosa ho fatto e la Fase 1 mostrano che la scheda prodotto non è ancora stata
    rifatta. Le tre priorità seguono l'ordine della "Scelta" del documento.
  - **Versioni mobile (2026-09-28).** `caso-riepilogo` e `caso-fase2-identita` hanno una
    versione ricomposta per il telefono (`-mobile`, 780 di larghezza), montata con lo stesso
    `<picture>` del flusso della pizzeria: sotto i 768 la mobile, da 768 la larga, stesso alt.
    Lo schema accetta ora `mobile` anche sulle figure delle sottosezioni (`FIGURA` in
    `content.config.ts`, condivisa con `figura` del capitolo). `test-progetti` verifica a 390
    la versione mobile e a 1280 la larga per le due figure.
  - **Test.** `test-progetti` verifica le sette sezioni, la copertina (griglia e pagina), ogni
    immagine nel suo capitolo e la Fase 2 nell'ordine giusto, le due parti "Proposta", alt,
    caricamento, overflow, slider con etichette Oggi e Fase 1 e immagini 780x1688.
- **Sezione loghi (2026-09-28).** Da `docs/FASE_LOGHI.md`.
  - **Collection `loghi`** (`src/content/loghi/`, un file per logo, corpo non usato): `nome`,
    `tipo` (progetto | esercizio | rebranding | esplorazione), `stile`, `fondo` (hex a 6 cifre
    oppure `cream`/`cream-2`, che puntano ai token), `immagine`, `ordine`, e facoltativi `prima`,
    `schizzo`, `applicazioni` (massimo 3, con alt), `testo`, `progetto` (percorso della pagina
    progetto). `ordine` non era nel documento: serve a decidere i "primi quattro" della home,
    perché l'ordine del loader non è garantito. Lo slug è il nome del file. Quattro voci:
    Luigi Romano (Geometrico, fondo cream), Fornace Vietri (Serif), Vico Stretto (Sigillo),
    Boutique (Monogramma, collega al caso reale), tutte tipo Progetto. Il `testo` di ognuna
    è scritto da Luigi (2026-09-28): compare sotto il nome nel dettaglio ed è anche la meta
    description della pagina.
  - **Regole condivise** in `src/loghi.ts`: etichette dei tipi, frase di non affiliazione,
    fondo, alt (`Logo di <nome> (<Tipo>)`), chiave dello stile, `getLoghi()` ordinato.
  - **Riquadro** (`LogoRiquadro.astro`, griglia in `LoghiGriglia.astro`): quadrato del colore
    di fondo, tipo sempre visibile in alto a sinistra, nome in basso sempre visibile su touch e
    che sale al passaggio del mouse o col focus dove c'è hover. Nome e tipo scritti sono
    `aria-hidden`: l'alt, che è il nome del link, li contiene già. Per rebranding ed
    esplorazioni la frase di non affiliazione sta sotto il riquadro, fuori dal link.
  - **/loghi**: titolo, una riga, filtri a pillola (aspetto dei Tag, 36px di altezza) generati
    dagli stili usati, griglia 2 colonne e 4 da 1024. Filtri `<button aria-pressed>` in un
    `role="group"`, uno alla volta, premere lo stile attivo torna a "Tutti"; riquadri nascosti
    con `hidden`, conteggio in una live region. Senza JavaScript la barra resta `hidden` e si
    vede tutto.
  - **/loghi/[slug]**: tipo e stile come Tag, nome in h1, `testo` e link "Vedi il progetto" se
    ci sono, logo grande sul suo fondo; poi solo i formati con immagini: Prima e dopo (linea con
    "↑ Prima" e "Dopo ↓"), Applicazioni, Dallo schizzo al finale (freccia ↓ su telefono, → da
    768). La frase di non affiliazione sta sotto il logo grande e sotto il prima e dopo.
  - **Home**: `LoghiStriscia.astro` dopo la griglia progetti, primi quattro riquadri e link
    "Vedi tutti i loghi". Navbar invariata a tre voci; `Loghi` nel footer dopo Progetti.
  - **Og**: le pagine loghi usano `og.png` di default, nessuna og dedicata.
  - **Test.** Nuovo `scripts/test-loghi.mjs` (390 touch e 1280): caricamento, riquadri quadrati
    e colonne, tipo e alt, nome su touch e al passaggio del mouse, filtri con clic e tastiera,
    aria-pressed, senza JavaScript, frase di non affiliazione nel riquadro e nel dettaglio,
    formati senza sezioni vuote, testo visibile e uguale alla description quando c'è,
    immagini caricate, home (striscia, nav, footer), overflow.
    Il ramo esplorazione con tutti e quattro i formati è stato provato con una voce temporanea,
    poi tolta. `test-pagine`: la sitemap conta 7 pagine fisse più quelle dei loghi.
- **Switch, livello 3 e servizi (2026-09-28).** Proposta sui tre livelli dello switch (home,
  capitoli, testi brevi): Luigi ha scelto il livello 3 per intero, il livello 1 com'è (l'ordine
  della griglia cambiava già) e il livello 2 rimandato (riordino dei capitoli del caso reale:
  il Risultato rimanda a Cosa ho fatto e a Decisione, i grafici stanno nel Contesto, i concept
  non hanno un risultato). Fatti per ora:
  - **"Vedi il codice"** nel percorso dev porta al repository pubblico
    (`REPO_PORTFOLIO` in `dati-sito.ts`), in una nuova scheda con `rel="noopener noreferrer"`,
    freccia SVG `aria-hidden` in `currentColor` e "(si apre in una nuova scheda)" per gli
    screen reader. Nell'hero ora ci sono due Button `data-only` invece di due etichette in uno:
    "Vedi i risultati" (business) porta ancora a `#progetti`. Con la freccia il bottone è più
    largo: sotto i 768 i due bottoni dell'hero hanno 24px di padding laterale invece di 28
    (187 + 142 + 16 = 345px nei 350 utili a 390), e vanno in colonna sotto i 390 invece che
    sotto i 380.
  - **"Cosa faccio per te"** (`CosaFaccio.astro`), solo nel percorso business
    (`data-only="business"`: senza JavaScript non c'è), in home tra la griglia progetti e i
    loghi. Cinque servizi dettati da Luigi, uno per riga tra linee ink, nessuna icona, bottone
    primary "Contattami" verso `/contatti`. Da 1024 titolo a sinistra e lista a destra.
  - **Test.** Nuovo `scripts/test-percorsi.mjs` (390 e 1280, due percorsi, più senza
    JavaScript): bottone primary giusto per percorso, repository, nuova scheda, icona e avviso,
    CTA sulla stessa riga, sezione servizi solo nel business e nel posto giusto, voci in
    ordine, una per riga, senza icone, linee lunghe uguali, bottone di contatto, overflow.
  - **Testi per percorso**, scelti da Luigi tra due varianti ciascuno.
    - *Invito al contatto* (`InvitoContatto.astro`, home e pagine progetto): titolo unico
      "Raccontami il progetto"; dev `Cerchi uno sviluppatore per il tuo team o per un
      progetto? Scrivimi, ti rispondo io.` con bottone "Scrivimi"; business `Dimmi cosa vendi
      e a chi. Lo costruiamo insieme, e dopo il lancio resto al tuo fianco.` con bottone
      "Parliamone" (prima "Raccontami cosa vendi...", cambiato per non ripetere il titolo). Riga e bottone sono due coppie `data-only`, il titolo no.
    - *Sommari delle card*: nuovo campo facoltativo `sommario_business` (senza, vale
      `sommario`). I tre `sommario` riscritti sono anche le nuove description delle pagine
      (caso reale "Prima due mesi di dati, poi quattro interventi su Shopify...", Fornace
      "Pezzi unici con giacenza 1...", pizzeria "Concept di una landing page...").
    - *Sintesi del caso reale*: nuovo campo `sintesi_business` (`testo`, `capitolo`, `link`),
      montato sotto il titolo solo nel percorso business, testo fisso in ink, link "Vai al
      risultato" a `#sez-risultato`. Lo schema blocca la build se `capitolo` non è l'id di
      un capitolo. Visibile solo sotto i 1024: da lì le colonne sono due e le tessere del
      Contesto, con gli stessi numeri, stanno subito accanto; `display:none` la toglie anche
      agli screen reader.
    - `test-switch` verifica invito e sommari visibili nei due percorsi, prima e dopo il
      refresh; `test-pagine` verifica sul caso reale la sintesi (solo business, sotto il
      titolo, il link porta al Risultato, nascosta e fuori dagli screen reader da 1024, con
      il confine provato a 1023 e 1024), l'invito per percorso e le tre description.
- **Passata prestazioni, blocco A (2026-09-29).** Da `docs/PRESTAZIONI.md`, interventi 1, 2 e 3,
  un commit ciascuno.
  - **1. Filtri di /loghi** visibili da subito: via l'attributo `hidden` e la riga dello script
    che lo toglieva; li nasconde solo `<noscript slot="head"><style is:inline>` con
    `display:none!important` (serve `!important`: `.loghi__filtri` ha `display:flex` con
    specificità più alta). CLS 0,085 → 0.
  - **2. Riserva del mono.** `@font-face "JetBrains Mono Riserva"` in `global.css`, con
    `src: local("Consolas")`, `size-adjust: 109%` e override verticali (ascent 93,6%, descent
    27,5%, line-gap 0), messo in `--font-mono` subito dopo JetBrains Mono. Calibrato misurando i
    quattro tag del caso reale con e senza il font: 108% dà 0,72px, 109% 0,08px, 110% 0,56px
    di differenza massima. Lo scatto si vede a 412px (la larghezza di Lighthouse mobile), non a
    390: lì "Mobile" va a capo con entrambi i font. Confronto su 13 pagine, 4 larghezze (390,
    412, 768, 1280) e 2 percorsi, 2604 elementi in mono: nessuna a capo o altezza diversa (senza
    gli override verticali restava un chip `<code>` di `/come-lavoro` più basso di 2px).
    CLS del caso reale 0,203 → 0.
  - **3. Slider del caso reale**: `loading="lazy"` e `decoding="async"` sulle due `<img>` di
    `BeforeAfter.tsx` (erano nel markup del server e si scaricavano subito). Peso del caso reale
    422 → 312 KB.
  - **Misura** (Lighthouse 12 mobile, build di preview, mediana di 3 run, "prima" dal report):
    caso reale 84 → 93 (LCP 2,88 → 2,46 s, CLS 0,203 → 0), /loghi 97 → 99 (LCP 1,97 → 1,83 s,
    CLS 0,085 → 0). Il TBT del caso reale oscilla molto tra le run (11-236 ms sulla stessa
    build, anche senza la modifica del font): non va letto come effetto degli interventi.
  - **Da fare.** Blocco B: interventi 4 (dimensioni delle immagini) e 5 (CSS dentro l'HTML), con
    misura prima e dopo. Prova C: intervento 6 (entrata del titolo dell'hero su telefono), da
    valutare guardando l'animazione. **Rimandati:** 7 (switch senza React) e 8 (un peso di Hanken
    Grotesk in meno).
- Test permanenti: `test-switch`, `test-scena`, `test-etichette`, `test-progetti`, `test-pagine` (390 e 1280), `test-nav` (320, 360, 390, 430, 768, 1280 più le rotazioni), `test-forme` (320, 390, 768, 1024, 1280), `test-loghi` (390 touch e 1280), `test-percorsi` (390 e 1280, due percorsi), tutti verdi.

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
- **Dominio.** `luigiromano.cloud` è valido su Vercel: record A `@` → `216.198.79.1` e CNAME `www` → `vercel-dns`; `www` reindirizza a `luigiromano.cloud`. Da controllare: `site` in `astro.config.mjs` è ancora `https://luigiromano.vercel.app`, quindi canonical, og:url, sitemap e robots puntano a quell'indirizzo e non a `luigiromano.cloud` (vanno corretti lì e ricostruiti, quando Luigi lo decide).
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
- Fase di performance dedicata a fine progetto (regola 7): avviata il 2026-09-29, blocco A fatto, il resto in "Passata prestazioni" sopra.

## Decisioni aperte
- **Lighthouse mobile home**: era 85 (sotto il ≥ 90 della regola 7), il 2026-09-29 è 94 nella passata prestazioni (mediana di 3 run, percorso sviluppatore, LCP 2,71 s). Nella stessa passata Fornace e pizzeria sono a 96; caso reale (93) e /loghi (99) sono misurati dopo il blocco A. L'LCP della home è il titolo dell'hero, che parte invisibile: vedi la prova C.
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
