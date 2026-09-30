# Storia del progetto

Cosa è stato fatto nelle fasi finite, come e perché: misure, decisioni di dettaglio, correzioni.
Spostato da `docs/STATO.md` il 2026-09-30, senza cambiare il testo. Non si legge a inizio
sessione: si apre solo per cercare come o perché è stato fatto qualcosa. Lo stato attuale e i
lavori da fare stanno in `docs/STATO.md`.

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
  - **Home**: `LoghiStriscia.astro` dopo la griglia progetti, prima i primi quattro riquadri,
    dal 2026-09-30 tutti i loghi in un carosello (vedi "Blocco testi e carosello"), e link
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
    **Rifatta il 2026-09-30** (quattro servizi, apertura in Fraunces, forme SVG, blocco di
    chiusura ink): vedi "Blocco testi e carosello". Le righe di questo elenco che parlano di
    cinque servizi, senza icone e titolo a sinistra non valgono più.
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
  - **Da fare** (al 2026-09-29): spostato in `docs/STATO.md`, sezione "Da fare".
- **Blocco testi e carosello (2026-09-30).** Cinque punti dettati da Luigi, un commit ciascuno,
  nessun push. Dettaglio delle voci cambiate in `docs/inventario-testi.md`.
  - **1. Etichetta `Branding concept`** (`9bb5484`). Nuovo campo facoltativo `tipo` nello schema
    di `progetti`, mostrato prima della lente nella card e nella pagina (`BRANDING CONCEPT ·
    SISTEMA`, `… · FLUSSO`). Sotto il titolo di Fornace e pizzeria: `Brand e negozio online,
    progetto inventato. Le foto sono generate con l'AI.` Sommari e description passano da
    `Concept` a `Branding concept`. Della vecchia riga è sparito `il problema è reale`, perché
    `progetto inventato` lo sostituisce: se serve, si rimette. Il caso reale non ha `tipo`.
  - **2. `/come-lavoro`** (`fba312f`). Tolta la sezione con il prompt (costante `PROMPT_REALI`,
    markup e stili). Al suo posto la sezione `Come uso l'intelligenza artificiale`, tre
    paragrafi verbatim, sfondo cream-2 come lo stack. I bottoni finali sono passati in fondo
    a questa sezione, ultima della pagina. Il paragrafo con `<code>` di "Uno switch invece di
    due siti" (solo percorso dev) è rimasto: non fa parte della sezione prompt.
  - **3. `Cosa faccio per te`** (`b8e1359`), solo percorso business. Etichetta mono sopra
    l'apertura in Fraunces (è l'h2), quattro righe numerate tra linee ink da 1px (`<ol>`), ogni
    riga con una forma SVG diversa (cerchio, quarto di cerchio, quadrato, triangolo), ink con
    un solo dettaglio arancio, `aria-hidden`. Sotto 768 le righe si impilano (numero e forma,
    poi titolo e testo), da 768 sono su una riga. Blocco di chiusura pieno ink con testo cream e
    `Contattami` (primary arancio; sul fondo ink il riempimento dell'hover diventa cream, perché
    quello ink non si vedrebbe). Nessuna animazione: la sezione non ne aveva e nel resto della
    home non ce ne sono di simili.
  - **4. Carosello dei loghi** (`c841056`). `LoghiCarosello.astro`, usato da `LoghiStriscia`, che
    ora mostra tutti i loghi (prima i primi quattro). Movimento: solo `@keyframes scorri` su
    `transform`, 40 px al secondo, durata ricavata dalla lunghezza della fila. Lo script
    duplica la fila `2 + ceil(vista / fila)` volte, riempie la vista anche con un solo logo, e
    ricalcola a ogni resize e al cambio di `prefers-reduced-motion`. Le copie hanno
    `aria-hidden="true"`, i loro link `tabindex="-1"`, e perdono `data-astro-transition-scope`
    (due `view-transition-name` uguali farebbero saltare la transizione). Fermo: al passaggio del
    mouse (solo `@media (hover: hover)`), con `:has(:focus-visible)` (non `:focus-within`: un clic
    col mouse su un link lascerebbe il carosello fermo per sempre) e al tocco. Trascinamento con
    pointer events, `touch-action: pan-y`, cattura del puntatore solo dopo 5px di movimento
    (prima, il clic sui link si perderebbe) e clic soppresso dopo un trascinamento; lo scarto si
    riporta sempre dentro la lunghezza di una fila, quindi la fila non finisce mai. Lo
    scorrimento che il browser fa per il focus da tastiera diventa uno spostamento. Con
    `prefers-reduced-motion` e senza JavaScript: niente copie, niente animazione,
    `overflow-x: auto`, si scorre a mano. Righe con misure fisse, altezza uguale con e senza
    copie. Immagini `loading="lazy"`.
  - **5. Testi dei loghi, provvisori** (`dc5e43e`). Da tre a quattro frasi per logo, solo
    informazioni del repo. **Da riscrivere con i tuoi appunti.** Le frasi che Luigi aveva già
    scritto il 2026-09-28 sono rimaste in testa, con in più forma, colori e ispirazione. Luigi
    Romano: barra nera e quarto di cerchio arancione, Bauhaus. Fornace: Costiera Amalfitana, i
    quattro colori del negozio, Young Serif. Vico Stretto: sigillo con VS, Napoli, dal 1961,
    marmo chiaro, nero e bordeaux, Bodoni Moda, "bottega in bianco e nero". Boutique: `ispirato ai
    brand di moda campani`, avorio, nero e cuoio, la B come icona. "Progetto concept" del logo
    Vico Stretto è diventato "branding concept".
  - **Test.** Nuovo `scripts/test-carosello.mjs` (390 touch e 1280): animazione CSS in loop,
    copie e loro aria-hidden/tabindex, vista sempre piena in tutto il giro e dopo ogni
    trascinamento, nessun salto al riavvolgimento del loop, pausa al focus / al mouse / al tocco
    e ripartenza, trascinamento con mouse e con dito (eventi touch veri via CDP) che riprende da
    dove è stato lasciato, clic soppresso dopo il trascinamento e clic normale che apre il logo,
    reduced-motion (anche il cambio a pagina aperta), senza JavaScript, CLS della striscia 0,
    lazy. Provato una volta con 12 loghi e con 1 logo (voci temporanee, poi tolte): la vista è
    sempre piena. Aggiornati `test-progetti` (etichetta e riga sotto il titolo, in card e in
    pagina), `test-pagine` (sezione IA con il testo esatto, niente prompt, description),
    `test-switch` (sommari), `test-percorsi` (struttura nuova di "Cosa faccio per te", colori
    letti dai token), `test-loghi` (carosello in home, da 3 a 4 frasi per logo).
  - **Misura** (Lighthouse 12 mobile, home, build di preview, percorso dev, 3 run, mediana):
    **96** (89 / 96 / 96) contro il 94 di prima, CLS **0** (0 / 0 / 0,022) come prima, LCP 2,63 s,
    TBT 114 ms (302 / 114 / 64). La run da 89 ha 330 ms di task lunghi nello script dell'hero;
    il CLS 0,022 della terza è la forma Bauhaus del quarto di cerchio dell'hero. Il carosello non
    entra in nessuno dei due. L'hero dà uno spostamento intermittente anche fuori da Lighthouse,
    misurato con un osservatore di layout-shift: a 390 0,024 (le forme Bauhaus, 2 caricamenti su
    6), a 1280 0,063 (la riga dev sotto il titolo che scende da 320 a 443px e trascina le forme,
    3 su 12), sempre tra i 120 e i 270 ms, prima che il carosello esista. Non toccato: va
    guardato se il CLS della home conta.

- **Blocco modifiche (2026-09-30).** Sei punti dettati da Luigi, un commit ciascuno, nessun
  push. Testi cambiati in `docs/inventario-testi.md`.
  - **1. Piastrella che si costruisce** (`0345b01`). In "Cosa faccio per te" (percorso
    business) le forme diverse per riga sono diventate un'unica figura: la riga n mostra i primi
    n pezzi di una piastrella quadrata, l'ultimo arancio e i precedenti ink. `src/piastrella.ts`
    calcola i pezzi per qualsiasi numero di righe: divide il quadrato 100x100 in modo ricorsivo
    lungo il lato più lungo, in proporzione ai pezzi di ciascuna parte, così le celle hanno la
    stessa area; le celle si numerano in ordine di lettura e ricevono le forme nell'ordine
    quarto di cerchio, cerchio, quadrato, triangolo, barra, poi da capo. Il quarto ha il centro
    nell'angolo più lontano dal centro della piastrella (l'arco guarda dentro la figura).
    Restituisce solo stringhe `d` per `<path>`: stessa dimensione e posizione in ogni riga,
    64px a 390 e 88px da 768. Con 4 righe la piastrella è 2x2. `test-percorsi` controlla n pezzi
    alla riga n, ultimo arancio e precedenti ink, pezzi già presenti nello stesso punto, stessa
    misura e posizione.
  - **2. `/come-lavoro`** (`f4c7a68`). Titolo `Il mio processo creativo` e terzo paragrafo
    verbatim. `test-pagine` aggiornato.
  - **3. Prova dei fondi** (`5b7669a`). `?fondi=a|b|c`, letto solo dall'URL da uno script in
    `Base.astro` che scrive `html[data-fondi]` (anche dopo lo swap delle View Transitions).
    Senza parametro non cambia niente. Le regole stanno in un solo blocco "PROVA FONDI" di
    `src/styles/global.css`, fuori da `@layer` per battere utility e stili scoped; le tre
    sezioni portano `data-fondo` ("progetti" in `ProjectGrid`, "loghi" in `LoghiStriscia`,
    "come-lavoro" sull'ultima sezione di `/come-lavoro`). **"Come lavoro" l'ho letto come la
    sezione `Il mio processo creativo` di `/come-lavoro`**, perché in home non c'è una sezione
    con quel nome. Aggiunti padding in alto a loghi, "Cosa faccio per te" e invito, che prima
    poggiavano sul padding in basso della sezione sopra. Sui fondi ink: testi cream, intro
    cream-2, bordo e ombra dura delle card cream, focus cream, link senza arancio all'hover
    (arancio su ink fa 3,4:1). Sull'arancio: testi cream, primary ink con riempimento cream
    all'hover, secondary con bordo cream. Sulle card dei fondi cream-2: cream invece di cream-2.
    Il parametro non sopravvive a un clic sulla nav (l'URL cambia): per vedere /come-lavoro
    in una variante serve `/come-lavoro?fondi=b`.
    Nuovo token **provvisorio** `--color-sabbia: #e7d7bb` (tinta 38°, stessa famiglia del cream;
    1,18:1 sul cream-2, quindi si stacca): ink 12,3:1, ink-2 6,7:1, arancio 3,6:1.
    **Contrasti** (WCAG, misurati sulle pagine vere a 390 e 1280, ogni testo visibile con il suo
    sfondo; i due viewport danno gli stessi numeri; soglia AA 4,5:1, 3:1 per il testo grande):

    | Variante | Sezione | Coppie (testo su fondo) | Minimo |
    |---|---|---|---|
    | oggi | Progetti | ink su cream 15,94; ink-2 su cream 8,68; ink e ink-2 su cream-2 (card) 14,51 e 7,90 | 7,90 |
    | oggi | Loghi | ink su cream 15,94; ink-2 su cream 8,68; ink su cream-2 14,51 | 8,68 |
    | oggi | Come lavoro | ink su cream-2 14,51; ink-2 su cream-2 7,90; bottone primary cream su arancio 4,66 | 4,66 |
    | A | Progetti su cream-2 | ink su cream-2 14,51; ink-2 su cream-2 7,90; card cream: ink 15,94, ink-2 8,68 | 7,90 |
    | A | Loghi su ink | cream su ink 15,94; cream-2 su ink 14,51; nome dei riquadri ink su cream-2 14,51 | 14,51 |
    | A | Come lavoro su cream | ink 15,94; ink-2 8,68; bottone primary cream su arancio 4,66 | 4,66 |
    | B | Progetti su ink | cream su ink 15,94; cream-2 su ink 14,51; dentro le card ink 14,51, ink-2 7,90 | 7,90 |
    | B | Loghi su cream-2 | ink 14,51; ink-2 7,90 | 7,90 |
    | B | Come lavoro su arancio | cream su arancio 4,66 (titolo, tre paragrafi, bottone secondary); bottone primary cream su ink 15,94; all'hover ink su cream 15,94 | 4,66 |
    | C | Progetti su sabbia | ink su sabbia 12,30; ink-2 su sabbia 6,69; dentro le card 14,51 e 7,90 | 6,69 |
    | C | Loghi, Come lavoro | come A | 14,51 / 4,66 |

    Tutto supera AA. Il valore stretto è cream su arancio (4,66:1, soglia 4,5): tiene per i testi
    della pagina (16 e 18px) e per i bottoni, ma non ha margine. Niente test permanenti su
    questo punto, come richiesto; lo script di misura non è nel repo.
  - **4. Marchio che ruota** (`99c3553`). Il quarto di cerchio arancio (`.site-nav__quarto`)
    ruota di 90° e torna in 450ms (`@keyframes gira-quarto`, `var(--ease-brand)`) al passaggio
    del mouse (`@media (hover: hover)`) e con `:focus-visible`. Gira attorno al centro del suo
    riquadro (63, 70 nel viewBox, `transform-box: view-box`), così resta dentro il marchio:
    ruotando attorno all'angolo finiva fuori dal viewBox e spariva per metà animazione. Al tocco
    parte su `pointerdown` (non mouse) con la classe `is-gira`, tolta a `animationend`: `:active`
    finisce al rilascio e taglierebbe l'animazione. La navigazione alla home avviene comunque al
    clic. Con `prefers-reduced-motion` niente né da CSS né da script. Solo il tocco usa JS, con
    un solo listener sul documento (l'header è persistito). Uscendo dall'hover a metà corsa
    l'animazione si interrompe e il quarto scatta al suo posto: a 450ms non si nota. `test-nav`
    copre mouse, tastiera, tocco (con navigazione) e movimento ridotto.
  - **5. Nav** (`d811e5b`). Voci: Progetti, Come lavoro, **Loghi**, poi `Scrivimi`. `Loghi` è
    attiva solo su `/loghi` (come le altre voci di pagina: nelle pagine `/loghi/[slug]` nessuna
    voce è attiva, come già per `/progetti/[slug]`). Sul telefono non c'era un menu: la pillola
    mostrava le tre voci in riga e `Scrivimi` compariva solo da 768px. Ho messo `Scrivimi` in
    pillola a ogni larghezza. Il margine è poco: a 320px la riga con marchio (44px), quattro
    voci a 13px e `Scrivimi` avanza 3px. Per farcele stare lo spazio interno delle voci scende
    più in fretta sotto i 400px (`clamp(0.21875rem, 5vw - 12.5px, 0.625rem)`: 3,5px per lato a
    320, 5,5 a 360, 7 a 390, 10 da 526) e `Scrivimi` perde il bordo sotto i 340px. Nessuna
    larghezza da 320 a 1280 va in overflow o a capo; spazi tra le voci contenuti e non
    decrescenti. `Scrivimi` ha `aria-current="page"` su `/contatti` (aggiornato anche dallo
    script dopo una navigazione) e si riempie di ink, come una voce attiva. `test-nav`: voci,
    `Loghi` attivo, `Scrivimi` unico accesso ai contatti a tutte le larghezze, il suo stato su
    `/contatti`. `test-loghi`: la nav ha `Loghi`.
  - **6. Etichetta `Progetto`** (`72fcfa7`). `etichettaTipo()` in `src/loghi.ts` restituisce
    `null` per il tipo `progetto` e l'etichetta per gli altri. Card, striscia e dettaglio non
    scrivono il tag se è `null`. Il logo nella card ha la stessa misura con o senza etichetta
    (il posto in alto resta), così le card con l'etichetta `Esercizio di stile` non avranno il
    logo di un'altra misura. L'alt dell'immagine dice ancora `(Progetto)`: il campo nei dati
    e l'alt sono rimasti, come chiesto. Nessun logo ha oggi un altro tipo, quindi la
    parte "altri tipi mostrano l'etichetta" non è coperta da un test con dati veri.
  - **Test.** Dieci test permanenti sulla build di preview, tutti verdi (test-switch,
    test-scena, test-etichette, test-progetti, test-pagine, test-nav, test-forme, test-loghi,
    test-percorsi, test-carosello).

- **Chiusura della prova sfondi e nuova figura (2026-09-30).** Tre punti, un commit ciascuno,
  nessun push. Nello stesso giorno del blocco modifiche qui sopra, di cui corregge il punto 1 e
  il punto 3.
  - **1. Sfondi** (`b152a1e`). Scelta la variante A solo per la striscia dei loghi: fondo ink,
    ora nel CSS della sezione (`LoghiStriscia.astro`, con `:global` per i figli). Tutto il
    resto è tornato come prima della prova: il commit della prova (`5b7669a`) è stato annullato
    per intero, quindi sono spariti `?fondi`, il blocco "PROVA FONDI" di `global.css`, gli
    attributi `data-fondo`, lo script in `Base.astro` e la sabbia (`tokens.css` e
    `design-tokens.md`). Sul fondo ink: testi cream, intro e note cream-2, bordo e ombra dura
    delle card cream, anello del focus cream, barra di scorrimento cream-2. Il padding della
    striscia è ora sopra e sotto, con un margine sotto per staccarla dall'invito. **Contrasti**
    (WCAG, misurati sulla pagina vera a 390 e 1280, stessi numeri): titolo 15,94, intro e nome
    dei riquadri 14,51, link "Vedi tutti i loghi" 15,94 (anche in hover, dove resta cream e
    cambia solo la sottolineatura); anello del focus su card e link 15,94; bordo delle card
    15,94; sottolineatura arancio del link 3,42 (soglia 3:1 per i non-testo). Il carosello non
    ha frecce né pulsanti: i controlli sono le card (link) e il trascinamento. Tutto supera AA.
  - **2. La L del marchio** (`70ae1b3`). La figura di "Cosa faccio per te" è ora il marchio che
    si costruisce: `LogoCresce.astro` (props `riga`, `totale`) su `src/logo.ts`, che contiene
    la geometria del marchio (barra 17,10,26x80 e quarto `M43 90V50A40 40 0 0 1 83 90Z` nel
    viewBox 0 0 100 100) ed è usata anche da `Nav.astro`, così le due non possono divergere.
    Con N righe la barra è divisa in N-1 segmenti (con una riga sola la L è già completa): la
    parte arrivata è un solo rettangolo dall'alto che cresce (tanti segmenti affiancati
    lascerebbero una linea chiara tra l'uno e l'altro); i segmenti che mancano sono rettangoli
    col solo contorno in ink-2, 1,25px fissi (`vector-effect="non-scaling-stroke"`), e il
    quarto di cerchio è solo contorno fino all'ultima riga, dove diventa arancio. All'ultima riga
    i due elementi sono identici a quelli della navbar. Tolti `src/piastrella.ts` e il suo
    uso. `test-percorsi` controlla altezza della barra riga per riga, contorni nel posto che
    avranno, quarto solo contorno, ultima riga uguale al marchio letto dalla navbar, stessa
    misura e posizione. Verificato con 4 righe; per altri numeri vale la stessa logica ma non
    è coperto da un test.
  - **3. Alt dei loghi** (`25ff88f`). `altLogo()` non scrive più `(Progetto)`:
    `Logo di X`. Gli altri tipi mantengono l'etichetta, come a vista.
  - **Test.** Dieci test permanenti sulla build di preview, tutti verdi.

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

## Passaggi successivi (stavano sotto "Manca" in `docs/STATO.md`)
- ~~Prompt 2 e 3 del progetto n°5.~~ Chiuso il 2026-09-30: la sezione con i prompt è stata tolta da `/come-lavoro` (al suo posto "Come uso l'intelligenza artificiale"), quindi non servono più.
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
