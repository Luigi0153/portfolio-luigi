# Inventario dei testi del sito

Fatto il 2026-09-21. Tutti i testi visibili a un visitatore, con posizione e giudizio.
Nessun testo è stato riscritto: questo file serve solo a decidere.
Esclusa `/styleguide` (pagina interna). Esclusi i commenti nel codice.

Profilo di voce di riferimento: `.claude/skills/unslop/references/style-profile.md`

## Come leggere la colonna "Giudizio"

- **sua** — coerente col profilo estratto da `docs/voce.md`: concreta, a catena, senza effetti.
- **neutra** — etichetta funzionale. Non ha una voce e non deve averne una.
- **generica** — vera ma interscambiabile: potrebbe stare sul sito di chiunque.
- **da AI** — porta un segno strutturale di scrittura generata. I tre che ricorrono qui:
  1. **due punti-punchline** (`X: Y`, il setup e la battuta). 30 volte, misurate su un estratto
     di tutto il testo visibile (128 righe, 1.280 parole). Nel campione di Luigi: **0 volte in
     324 parole.**
  2. **antitesi negativa** (`non X, è Y` / `Non X. Y.`). 32 occorrenze di "non", 2,5 ogni 100
     parole contro 1,2 nel suo campione, e quasi sempre in posizione di battuta.
  3. **frammento aforistico** a chiudere un blocco (`La palette è ancora quella di prima.`).
     La skill ne concede uno per testo. Qui ce ne sono più di dieci.

Un giudizio "da AI" non vuol dire che la frase sia brutta o falsa. Diverse sono le righe
migliori del sito. Vuol dire che la forma è quella del modello, non la tua, e che se stanno
tutte insieme il sito suona scritto da una macchina brava.

---

## 1. Navigazione, layout, footer

| Testo | Dove | Giudizio | Perché |
|---|---|---|---|
| `Luigi` (logo) | `src/components/ui/Nav.astro:19` | neutra | È il tuo nome. |
| `Progetti` · `Come lavoro` · `Contatti` | `Nav.astro:8-12`, `Base.astro:107-109` | neutra | Etichette. `Come lavoro` in prima persona è giusto. |
| `Salta al contenuto` | `src/layouts/Base.astro:91` | neutra | Formula standard di accessibilità. |
| `Shopify Web Developer e AI Web Designer.` | `Base.astro:103` | sua | Viene da `CLAUDE.md`, è come ti definisci. |
| `© 2026 Luigi. Fatto a mano, con qualche prompt.` | `Base.astro:112` | **da AI** | Battuta con strizzatina d'occhio, frase nominale. Nel tuo campione: zero battute in 324 parole. La coppia "a mano / con qualche prompt" è un'antitesi costruita. |

## 2. Hero (home)

| Testo | Dove | Giudizio | Perché |
|---|---|---|---|
| `Shopify Web Developer · AI Web Designer` | `src/components/sections/Hero.astro:24` | neutra | Il `·` è un separatore da template, ma innocuo. |
| `Ciao, sono Luigi.` | `Hero.astro:27` | sua | Apertura piatta e diretta: è esattamente come apri tu (5 risposte su 5 aprono rispondendo, senza scena). |
| `Scrivo codice che si fa leggere.` | `Hero.astro:29` | **da AI** | Doppio senso ("leggibile" + "piacevole"). I giochi di parole non esistono nel tuo campione. E non dice niente di verificabile: cosa vuol dire "si fa leggere"? |
| `Faccio negozi che vendono davvero.` | `Hero.astro:32` | generica | `Faccio negozi` è concreto e tuo. `vendono davvero` è la frase che sta su ogni sito di ogni agenzia: il lavoro lo fa tutto l'avverbio. |
| `Cerchi uno sviluppatore` / `Vuoi vendere online` | `src/components/ui/TargetSwitch.tsx:6-7` | sua | Domanda diretta, seconda persona, zero effetti. Le due migliori righe brevi del sito. |
| `Scegli il percorso` (aria-label) | `TargetSwitch.tsx:36` | neutra | — |
| `Vedi il codice` / `Vedi i risultati` | `Hero.astro:43-44` | neutra | Il parallelismo è un po' meccanico, ma è la natura dello switch. |
| meta: `Negozi che vendono, codice che regge.` | `src/pages/index.astro:9` | **da AI** | Due membri di tre parole con la stessa struttura e rima interna. È il "balanced antithesis" da manuale: suona bene e non aggiunge un dato. |

## 3. Scena scrivania

| Testo | Dove | Giudizio | Perché |
|---|---|---|---|
| `Progetti` `Come lavoro` `Contatti` `Caso reale` | `DeskScene.astro:24,32,40,48` | neutra | Etichette degli hotspot. |
| `Computer: vai ai progetti`, `Taccuino: come lavoro`, `Telefono: contatti`, `Tabellino: il caso reale` | `DeskScene.astro:25,33,41,49` | neutra | Qui i due punti sono etichettatura per screen reader, non una battuta. Corretto così. |
| `Tazza di caffè` | `DeskScene.astro:114` | neutra | — |
| `// pausa caffè registrata nel log` | `DeskScene.astro:134` | **da AI** | Easter egg con `//` come cornice: è la battuta che scrive un modello quando gli si chiede "metti un easter egg". Niente nel tuo campione dice che scherzi così. |

## 4. Griglia progetti (home)

| Testo | Dove | Giudizio | Perché |
|---|---|---|---|
| `Progetti` | `ProjectGrid.astro:32` | neutra | — |
| `Prima capire il vincolo, poi scrivere il codice.` | `ProjectGrid.astro:34` | generica | Il ritmo `prima X, poi Y` è tuo (è il tuo modo di elencare azioni). Ma "il vincolo" è un'astrazione: tu non usi mai parole così, dici "gli ordini da evadere", "le etichette". |
| `Una sola domanda: questa scelta fa vendere di più?` | `ProjectGrid.astro:37` | **da AI** | Due punti-punchline, e "Una sola domanda" è un'apertura a effetto. La domanda in sé è buona: è la cornice che è costruita. |
| `Lente: decisione` / `sistema` / `flusso` | `ProjectGrid.astro:66`, frontmatter dei 3 `.md` | **da AI** | "Lente" è un concetto curatoriale, e decisione/sistema/flusso è vocabolario da design system. Nel tuo campione non c'è una sola astrazione di questo tipo. È anche l'etichetta che il visitatore incontra per prima su ogni card. |
| `In arrivo` | `ProjectGrid.astro:75`, `[slug].astro:64` | neutra | Onesta: dice che non c'è ancora niente. |

## 5. Caso reale (`src/content/progetti/caso-reale.md`)

| Testo | Riga | Giudizio | Perché |
|---|---|---|---|
| `Non ho rifatto il sito. Ho letto i numeri.` | 2 | **da AI** | L'antitesi negativa in forma canonica (`Non X. Y.`). È forte e vera, ma è la prima cosa che si legge e annuncia il registro di tutto il resto. |
| `Boutique di borse e accessori in Campania. Due mesi di dati, una decisione contro-intuitiva.` | 13 | misto | Prima frase: concreta, ottima. `una decisione contro-intuitiva` è **da AI**: si auto-elogia, e tu nel campione non ti metti mai in vetrina (passi all'impersonale proprio per evitarlo). |
| `Quattro barre che salgono, l'ultima in arancio, davanti a un cerchio giallo.` | 12 | neutra | Alt text. Descrive, non commenta: giusto. |
| `Store aperto ad aprile 2026, ordini veri da giugno: due mesi di dati, non due anni.` | 26 | **da AI** | Due punti + antitesi. `non due anni` risponde a un'obiezione che nessuno ha fatto. I dati sono veri, la forma no. |
| `Il 94% del traffico arriva da mobile, e il 30% degli ordini da TikTok Shop, che nel funnel del sito non si vede.` | 27 | sua | **La riga più tua di tutto il sito.** Frase a catena con "e", due numeri veri, un limite dichiarato in coda. Niente battute. |
| `Le borse fanno il 68% del fatturato: in pratica è un negozio di borse, non di borse più abbigliamento più accessori.` | 28 | misto | Due punti + antitesi, ma `in pratica` e l'accumulo "borse più abbigliamento più accessori" sono tuoi (è il tuo `commenti, messaggi, DM etc.`). |
| `La tentazione era rifare palette, font e homepage, perché il sito è brutto.` | 30 | sua | Onesta su di te, elenco con "e", e dice una cosa scomoda invece di nasconderla. |
| `I dati dicevano altro: solo 4 persone su 100 aggiungono al carrello, e chi arriva al checkout lo abbandona 9 volte su 10.` | 31 | sua | I due punti qui fanno un lavoro vero (introducono i dati) invece di preparare una battuta. `4 su 100`, `9 volte su 10`: si legge ad alta voce. |
| `Redesign congelato. In ordine: scheda prodotto mobile, checkout provato con ordini veri dal telefono, igiene del catalogo.` | 32 | misto | `Redesign congelato.` è un frammento secco a effetto. `igiene del catalogo` è da consulente. Ma `In ordine:` + tre azioni concrete è molto tuo. |
| `Da giugno a luglio gli ordini passano da 19 a 31, il fatturato cresce dell'86%, lo scontrino medio da 56 a 64 euro.` | 34 | sua | Tre dati in catena, zero commento sopra. Non spiega al lettore cosa deve pensarne: perfetta. |
| `Il 15,8% del fatturato aveva il product_type vuoto e rompeva report e collezioni smart. Ora è a posto.` | 35 | sua | `product_type`, `collezioni smart`: gergo vero, scritto come lo scrivi tu. `a posto` è lessico da bottega. |
| `La palette è ancora quella di prima.` | 36 | **da AI** | L'aforisma che chiude la sezione richiamando l'apertura. Bellissima e completamente costruita: è la mossa che un modello fa per chiudere in bellezza. |
| `Uno store di due mesi non si confronta con la media Shopify, si confronta con il suo mese precedente.` | 38 | misto | Antitesi `non X, Y` con ripetizione del verbo. Struttura da modello, contenuto giusto e difendibile. |
| `Mai concludere niente da un segmento con meno di 30 conversioni.` | 39 | sua | Regola operativa secca, con una soglia vera. Nessun effetto. |
| `Il traffico social in-app non viene tracciato bene: quei tassi sono un pavimento, non una misura.` | 40 | **da AI** | Metafora + antitesi. E il tic si ripete identico nel funnel (§7): la stessa immagine due volte diventa un marchio di fabbrica. |
| `Nome dello store e logo restano anonimi: i numeri sono quelli veri, il cliente no.` | 43 | **da AI** | Due punti + antitesi ellittica (`il cliente no`). La cosa che dice è necessaria, la forma è da battuta. |

## 6. Progetti in arrivo

| Testo | Dove | Giudizio | Perché |
|---|---|---|---|
| `Fornace Vietri` | `fornace-vietri.md:2` | neutra | Nome. |
| `Concept di store per una fornace di ceramica: un catalogo che regge i pezzi unici.` | `fornace-vietri.md:12` | generica | Due punti-punchline, e `regge` sta già nella meta della home: si sta ripetendo. |
| `In arrivo. Il pezzo difficile è il catalogo: quando ogni piatto è diverso dagli altri, varianti e collezioni smart smettono di funzionare come le racconta il manuale.` | `fornace-vietri.md:18-19` | sua | `il pezzo difficile`, `come le racconta il manuale`: suona di bottega. Frase lunga a catena, come scrivi tu. |
| `Landing per una pizzeria` | `pizzeria.md:2` | neutra | — |
| `Una pagina sola e un obiettivo solo: far prenotare un tavolo dal telefono.` | `pizzeria.md:12` | **da AI** | `una X sola e un Y solo` è un parallelismo costruito, più i due punti. La seconda metà (il tavolo, il telefono) è concreta e buona. |
| `In arrivo. La domanda vera non è quanto è bella la pagina, ma quante persone arrivano al tasto prenota senza pensarci due volte.` | `pizzeria.md:18-19` | **da AI** | `la domanda vera non è X, ma Y` è una delle formule più riconoscibili del registro AI. `il tasto prenota` e `senza pensarci due volte` invece sono tuoi. |
| Alt text delle 3 cover | i 3 `.md`, riga 11 | neutra | Descrivono forme e colori. Giusti. |

## 7. Pagina di dettaglio progetto

| Testo | Dove | Giudizio | Perché |
|---|---|---|---|
| `Torna ai progetti` | `src/pages/progetti/[slug].astro:52` | neutra | — |
| `Contesto` `Decisione` `Risultato` `Cosa ho imparato` | `[slug].astro:33-36` | neutra | `Cosa ho imparato` in prima persona è la scelta giusta. |
| `+63%` · `Ordini` · `Da 19 a 31, giugno contro luglio.` | `[slug].astro:108-112` | sua | `giugno contro luglio` è secco e concreto. |
| `+86%` · `Fatturato` · `Stesso periodo, stesso store.` | `[slug].astro:114-119` | sua | Il raddoppio `stesso...stesso` è il tuo `molto molto`. |
| `94%` · `Traffico da mobile` · `Il desktop qui non esiste.` | `[slug].astro:121-125` | **da AI** | Battuta iperbolica, e contraddice il numero che sta sopra: il desktop è il 6%, quindi esiste. È l'unico punto del sito dove una frase a effetto smentisce un dato. |
| `Trascina per confrontare la scheda prodotto prima e dopo` | `[slug].astro:137` | neutra | Istruzione chiara. |
| Alt `prima` e `dopo` della scheda | `[slug].astro:134-136` | neutra | Descrivono cosa cambia. Corretti. |
| `Prima` / `Dopo` (etichette slider) | `src/components/ui/BeforeAfter.tsx:55,58` | neutra | — |
| `{pos}% della versione nuova` | `BeforeAfter.tsx:73` | neutra | — |
| `Ordini per mese: giugno 19, luglio 31. Ad aprile e maggio lo store era appena aperto e i volumi non sono significativi, quindi restano senza numero.` | `src/components/ui/RampChart.astro:88-90` | sua | Frase lunga con `quindi`, spiega perché un dato manca invece di riempirlo. Delle migliori del sito. |
| `Sessioni` · `Aggiunge al carrello` · `Arriva al checkout` · `Completa l'ordine` + i 4 denominatori | `src/components/ui/Funnel.astro:18-45` | sua | Verbi alla terza persona singolare come li dice un negoziante. Ogni riga dichiara il suo denominatore: onestà, non retorica. |
| `Il 30% degli ordini arriva da TikTok Shop e qui dentro non si vede: questi tassi sono un pavimento, non una misura.` | `Funnel.astro:72-75` | **da AI** | Ripete alla lettera il `pavimento, non una misura` del `.md` (§5, riga 40). Ripetuto, il tic diventa evidente. |

## 8. `/come-lavoro`

| Testo | Dove | Giudizio | Perché |
|---|---|---|---|
| meta: `...porto un negozio online da 'esiste' a 'vende', e lo stack che uso per farlo.` | `src/pages/come-lavoro.astro:94` | **da AI** | `da X a Y` con le virgolette è il merismo vuoto: sembra una scala e non lo è. Tu non usi virgolette (0 nel campione). |
| `Il metodo` / `Come lavoro` | `come-lavoro.astro:104-105` | neutra | — |
| `Quattro passi, sempre nello stesso ordine. Il codice è l'ultimo, ed è la parte che discutiamo di meno.` | `come-lavoro.astro:107-108` | sua | `ed è` continua la frase invece di iniziarne una nuova: è il tuo ritmo. |
| `...Nessuno dei quattro si chiama "ti mando un preventivo e sparisco".` | `come-lavoro.astro:111-112` | **da AI** | Battuta tra virgolette contro un nemico immaginario. Tu dici cosa non si può fare (§4 del profilo), non prendi in giro qualcun altro. |
| `Il processo` / `Ascolto, numeri, prototipo, codice` | `come-lavoro.astro:121-122` | generica | Quattro sostantivi in fila: è una struttura reale del lavoro, quindi passa, ma la quaterna simmetrica è una forma da modello. |
| `In quest'ordine. Saltare il primo è il modo più veloce per rifare il quarto.` | `come-lavoro.astro:123` | **da AI** | Aforisma chiastico (primo/quarto). Efficace e costruito a tavolino. |
| `Ascolto` · `Prima di aprire l'editor, capisco cosa si rompe.` | `come-lavoro.astro:16-17` | sua | `cosa si rompe` è concreto, e l'impersonale è il tuo. |
| `Mezz'ora di domande scomode: chi compra, cosa abbandona, dove si perde.` | `come-lavoro.astro:19` | **da AI** | Tre membri paralleli dopo i due punti: la regola del tre in forma pura. `domande scomode` e `mezz'ora` invece sono buoni. |
| `Quasi sempre il problema non è quello che mi avevi detto al telefono.` | `come-lavoro.astro:20` | sua | `quasi sempre` è un'esitazione onesta, il telefono è un oggetto vero. Ottima. |
| `Numeri` · `Guardo i dati che hai già, prima di produrne di nuovi.` | `come-lavoro.astro:24-25` | sua | Concreta, e non promette strumenti nuovi. |
| `Analytics, ordini, ricerche interne: tre grafici bastano a scegliere da dove partire.` | `come-lavoro.astro:27` | **da AI** | Tre membri + due punti, e `tre grafici bastano` è una soglia senza fonte: da dove viene il tre? È il tipo di numero che un modello inventa per suonare preciso. |
| `Se non c'è niente da misurare, la prima cosa che installo è il metro.` | `come-lavoro.astro:28` | **da AI** | Metafora a chiusura di blocco. Bella. Non tua: nel campione non c'è una sola metafora, solo cose che esistono. |
| `Prototipo` · `La cosa più economica da buttare via è un prototipo.` | `come-lavoro.astro:32-33` | **da AI** | Massima da manuale di design thinking. Vera, ma è una citazione d'aria, non una tua frase. |
| `Una schermata vera, cliccabile, sul telefono: si decide guardandola, non descrivendola.` | `come-lavoro.astro:35` | **da AI** | Il punto di massima densità di segni del sito: tre aggettivi, due punti, antitesi con due gerundi in rima. |
| `Qui si cambia idea gratis. Dopo costa.` | `come-lavoro.astro:36` | **da AI** | Coppia di frammenti secchi. `si cambia` è tuo, il resto è ritmo da slogan. |
| `Codice` · `Solo alla fine, e scritto per chi lo aprirà dopo di me.` | `come-lavoro.astro:40-41` | sua | La seconda metà è generosa e specifica. |
| `Componenti piccoli, nomi in chiaro, niente librerie per cose che fa il browser.` | `come-lavoro.astro:43` | generica | Tre membri, ma tutti concreti e tecnici: passa. |
| `Ti lascio il sito e le istruzioni per cambiarlo senza chiamarmi.` | `come-lavoro.astro:44` | sua | Concreta, e rinuncia a una dipendenza commerciale. Una delle migliori del sito. |
| `Gli attrezzi` / `Lo stack` | `come-lavoro.astro:149` | sua | `Gli attrezzi` è da bottega: esattamente il tuo registro. |
| `Poche cose, conosciute bene. Ogni dipendenza in più è un problema che erediterà qualcun altro.` | `come-lavoro.astro:151-152` | misto | Prima frase tua. Seconda è un aforisma, ma dice una cosa tecnica vera. |
| `Roba standard e diffusa: se un giorno non ci sono io, chiunque sa metterci le mani.` | `come-lavoro.astro:155-156` | sua | `roba`, `metterci le mani`: il tuo lessico preciso. Tra le migliori del sito. |
| `E-commerce` `Front-end` `Motion e 3D` `Altro` | `come-lavoro.astro:51,55,59,63` | neutra | **Nota di contenuto, non di voce:** `Motion e 3D` promette il 3D, che la Fase 4 ha annullato (`docs/STATO.md`). Da sistemare a prescindere dalla voce. |
| `Progetto n°5` / `Come ho costruito questo sito` | `come-lavoro.astro:183-184` | neutra | — |
| `Questo portfolio è l'ultimo dei miei case study: la pagina che stai leggendo è anche la dimostrazione.` | `come-lavoro.astro:185` | **da AI** | Meta-frase autoreferenziale più due punti. È la mossa che fa un modello quando gli si chiede di essere brillante. |
| `La decisione` / `Uno switch invece di due siti` | `come-lavoro.astro:190-191` | sua | Titolo che dice la cosa e basta. |
| `Chi assume e chi vende cercano due cose diverse...: il primo vuole vedere come è fatto, il secondo se funziona. Due siti separati erano il doppio del lavoro e metà della manutenzione.` | `come-lavoro.astro:193-195` | misto | Prima frase: chiara e utile. `il doppio del lavoro e metà della manutenzione` è un'antitesi simmetrica costruita, e tra l'altro non è un conto che hai fatto. |
| `Così lo switch nell'hero non filtra i contenuti: li riordina e ne cambia l'accento. Stesse sezioni, stesso HTML, priorità diverse. La scelta resta in localStorage e vale su tutto il sito.` | `come-lavoro.astro:198-200` | misto | `Stesse sezioni, stesso HTML, priorità diverse` è regola del tre, ma il raddoppio `stesse/stesso` è tuo. L'ultima frase è ottima: piatta e informativa. |
| `Tecnicamente è un attributo su <html> e un pugno di regole CSS: zero re-render, zero JavaScript al cambio, e funziona anche prima che React si idrati.` | `come-lavoro.astro:203-205` | generica | `un pugno di` e `zero X, zero Y` sono effetti, ma tutto è verificabile e il pubblico è tecnico: regge. |
| `Tradotto: cambia in un istante, non ricarica niente, e chi arriva da Google vede subito la versione giusta per sé.` | `come-lavoro.astro:208-209` | misto | `Tradotto:` è un connettivo da modello. La catena con `e` che segue è tua. |
| `Il come` / `Statico, e leggero per scelta` | `come-lavoro.astro:214-215` | generica | `per scelta` è la rivendicazione difensiva tipica: nessuno ti aveva accusato. |
| `Astro genera pagine statiche: React entra solo dove serve davvero toccare qualcosa, cioè lo switch e lo slider prima/dopo. Tutto il resto è HTML e CSS.` | `come-lavoro.astro:217-219` | sua | `cioè` + i due casi veri. Spiega invece di posare. |
| `Le animazioni sono GSAP con ScrollTrigger, e si spengono da sole con prefers-reduced-motion. I font sono self-hosted, le immagini le converte Astro in webp.` | `come-lavoro.astro:222-224` | sua | Catena con `e`, elenco tecnico piatto, verbi normali (`sono`, `converte`). Il tuo ritmo. |
| `L'oggetto 3D nell'hero era previsto: l'ho tolto. Costava più chilobyte di quanto aggiungesse, e la scena della scrivania raccontava già la stessa cosa.` | `come-lavoro.astro:227-229` | sua | Ammette una rinuncia e dà due ragioni. `era previsto: l'ho tolto` è secco senza fare la battuta. |
| `I prompt che hanno deciso qualcosa` | `come-lavoro.astro:237` | sua | Titolo che sta in piedi da solo. |
| `Non "fammi un portfolio". Estratti veri, presi dai file del progetto: quello che ha cambiato la direzione del lavoro.` | `come-lavoro.astro:239-241` | **da AI** | Apre negando un'alternativa che nessuno ha proposto, con le virgolette ironiche. Poi i due punti-punchline. Due segni in tre righe. |
| `Fase 0 — l'avvio` | `come-lavoro.astro:83` | **da AI** | L'unico em dash di tutto il sito, e tu non ne usi (0 in 324 parole). Dettaglio piccolo ma è il tell tipografico più noto. |
| `Cosa ne è uscito` | `come-lavoro.astro:255` | sua | Domanda piatta, senza posa. |
| `Un riassunto di verifica invece di una cartella piena di file da buttare. Il lavoro è partito dal punto giusto perché non è partito subito.` | `come-lavoro.astro:86-87` | **da AI** | La seconda frase è un paradosso a effetto (`è partito... perché non è partito`). Costruitissima. |
| `Parliamo di codice` / `Parliamo del tuo negozio` | `come-lavoro.astro:268-269` | sua | `il tuo negozio` è la tua parola. |
| `Vedi i progetti` | `come-lavoro.astro:271` | neutra | — |

## 9. `/contatti`

| Testo | Dove | Giudizio | Perché |
|---|---|---|---|
| meta: `Scrivimi: email, LinkedIn, GitHub o il form qui sotto. Rispondo entro un giorno lavorativo, anche solo per dirti che non sono la persona giusta.` | `src/pages/contatti.astro:19` | sua | La coda è coerente col tratto più forte del tuo campione: dire in faccia il limite. |
| `Contatti` | `contatti.astro:29` | neutra | — |
| `Mandami il problema, non il brief.` | `contatti.astro:33` | **da AI** | Antitesi `X, non Y` in forma pura. E `brief` è gergo da agenzia che nel tuo campione non c'è. |
| `Raccontami il negozio.` | `contatti.astro:34` | sua | Imperativo semplice, `il negozio` è la tua parola. Tre parole e nessun effetto: la migliore riga breve del sito. |
| `Repo, staging, un bug che non torna: scrivi pure in mezzo al discorso. Rispondo entro un giorno lavorativo.` | `contatti.astro:37-38` | misto | Tre membri + due punti. Ma `scrivi pure in mezzo al discorso` è concreto e accogliente: quella tienila. |
| `Anche se non sai da dove si comincia. Rispondo entro un giorno lavorativo, e se non sono la persona giusta te lo dico subito.` | `contatti.astro:41-42` | sua | Impersonale `si comincia`, catena con `e`, limite dichiarato. Tutti e tre i tuoi tratti in due frasi. |
| `I modi diretti` | `contatti.astro:50` | generica | Un po' curatoriale, ma breve e innocua. |
| `Email` + indirizzo | `contatti.astro:53-54` | neutra | — |
| `Parliamo di lavoro` (handle LinkedIn) | `src/dati-sito.ts:33` | generica | Vera e interscambiabile. |
| `Il codice, quello vero` (handle GitHub) | `dati-sito.ts:34` | **da AI** | La coda enfatica `quello vero` è un tic. E rispetto a cosa è vero? L'altro codice del sito non è finto. |
| `(si apre in una nuova scheda)` | `contatti.astro:72` | neutra | Solo per screen reader. Corretta. |
| `Preferisci il telefono? Scrivimi prima due righe: ti mando io il numero e un orario.` | `contatti.astro:80-81` | sua | Domanda diretta, poi due azioni concrete. `ti mando io` prende l'iniziativa invece di spiegarla. |
| `Oppure scrivi qui` | `contatti.astro:86` | sua | Piatta e giusta. |
| `Tre campi. Nessun "reparto di competenza".` | `contatti.astro:88` | **da AI** | Frammento + virgolette ironiche + nemico immaginario. Tre segni in sei parole. |
| `Tre campi, ci metti un minuto. Niente call obbligatoria.` | `contatti.astro:91` | misto | `ci metti un minuto` è tuo. `Niente call obbligatoria` nega un'alternativa che non hai mai proposto. |
| `Form non ancora collegato. Manca l'id Formspree in src/dati-sito.ts: fino ad allora usa l'email qui accanto.` | `contatti.astro:96-99` | — | **Problema di destinatario, non di voce:** parla a te, non al visitatore, e gli mostra un percorso di file. Oggi è nascosto (`FORM_ATTIVO` è vero), ma se torna il segnaposto compare in pagina. |
| `Come ti chiami` / `La tua email` / `Cosa ti serve` | `contatti.astro:110,124,138` | sua | Etichette parlate invece di `Nome*`. Ottime tutte tre. |
| `Due righe bastano. Link e dettagli tecnici benvenuti.` | `contatti.astro:147` | sua | Abbassa la soglia d'ingresso, non si vanta. |
| `Lascia vuoto questo campo` | `contatti.astro:154` | neutra | Trappola antispam, invisibile. |
| `Nuovo messaggio dal portfolio` | `contatti.astro:158` | neutra | Oggetto dell'email che arriva a te. |
| `Mandamelo` | `contatti.astro:161` | sua | Una parola, imperativo, zero posa. |
| `Invia il messaggio` | `contatti.astro:162` | generica | Corretta e anonima. Per il target business forse va bene così. |
| `Scrivi come ti chiami.` | `contatti.astro:483` | sua | — |
| `Serve un'email valida, altrimenti non posso risponderti.` | `contatti.astro:484` | sua | Dà la ragione dell'errore invece di sgridare. |
| `Due righe su cosa ti serve.` | `contatti.astro:485` | sua | — |
| `Controlla i campi segnati qui sopra.` | `contatti.astro:554` | sua | — |
| `Il form non è ancora collegato: scrivimi via email, ci metti lo stesso tempo.` | `contatti.astro:562` | sua | `ci metti lo stesso tempo` toglie l'attrito invece di scusarsi. |
| `Invio in corso...` | `contatti.astro:569` | neutra | — |
| `Ricevuto. Ti rispondo entro un giorno lavorativo.` | `contatti.astro:580` | sua | Due informazioni, niente ringraziamenti finti. |
| `Non è partito. Riprova, o scrivimi direttamente via email.` | `contatti.astro:582` | sua | — |
| `Connessione assente. Riprova tra poco, o scrivimi via email.` | `contatti.astro:585` | sua | — |

## 10. 404

| Testo | Dove | Giudizio | Perché |
|---|---|---|---|
| `Pagina non trovata` | `src/pages/404.astro:12` | neutra | — |
| `Questa pagina non esiste. Le altre sì.` | `404.astro:13` | **da AI** | Coppia di frammenti con antitesi ellittica. Sta nella meta description, quindi la vedono anche i motori. |
| `Errore 404` | `404.astro:24` | neutra | — |
| `Questa pagina non l'ho mai scritta.` | `404.astro:25` | sua | Prima persona, sorprendente senza fare la battuta. Ottima. |
| `O l'ho tolta, come l'oggetto 3D che doveva stare nell'hero: pesava più di quanto valesse.` | `404.astro:27-28` | sua | Autoreferenziale in modo onesto: cita una rinuncia vera, con la ragione. |
| `Comunque, da qui non si passa.` | `404.astro:28-29` | **da AI** | Citazione appiccicata (Gandalf) a chiudere in battuta. È l'aforisma finale di cui la skill parla: si può togliere e la pagina migliora. |
| `Torna alla home` / `Vedi i progetti` | `404.astro:32-33` | neutra | — |

---

## Conto finale

135 voci d'inventario (qualche voce raggruppa etichette identiche, per esempio le tre voci
di menu), per un totale di circa **1.280 parole** di testo visibile:

| Giudizio | Quante |
|---|---|
| sua | 47 |
| neutra | 34 |
| **da AI** | **33** |
| generica | 10 |
| misto | 10 |
| non classificabile (avviso tecnico) | 1 |

Un quarto delle voci porta un segno strutturale. Non sono distribuite a caso:

- **Dove la frase deve fare un lavoro, la voce è tua.** Tutti i messaggi del form, le etichette
  dei campi, i denominatori del funnel, le didascalie dei grafici, i tre StatTile tranne uno:
  quasi tutti "sua". Non c'era spazio per essere brillanti, quindi nessuno lo è stato.
- **Dove la frase deve fare colpo, la voce è del modello.** Titoli, sommari, chiuse di sezione,
  easter egg, 404, meta description. Quasi tutte le 33 voci "da AI" stanno in posizione di
  titolo o di chiusa; le uniche eccezioni sono dentro i quattro passi di `/come-lavoro`, che
  sono fatti di titoletti e chiuse anche loro.

Le tre cose che il conteggio dice con più chiarezza:

1. **I due punti-punchline sono la forma dominante del sito e non esistono nella tua scrittura.**
   30 volte in 1.280 parole di sito, 0 volte in 324 parole tue. È il singolo intervento con più effetto:
   in metà dei casi al posto dei due punti ci va un "e", o un punto.
2. **L'ironia richiesta dalla regola 5 di `CLAUDE.md` non ha una base nel campione.** Zero
   battute in 324 parole. Le battute che stanno sul sito (footer, tazza del caffè, "reparto di
   competenza", Gandalf nel 404, "il desktop qui non esiste") sono mie, non tue. Vanno tenute
   perché ti piacciono o togliute perché non ti somigliano: è una decisione, non una correzione.
3. **Nessuna frase del sito arriva alla tua lunghezza.** Media di 7,9 parole per frase (mediana
   6) contro le tue 46. Zero frasi sopra le 40 parole in tutto il sito. La regola "max 3 righe
   per sezione" non c'entra: in tre righe ci sta benissimo una tua frase da 40 parole. Oggi non
   ce n'è una.

## Cosa è cambiato dopo questa fotografia

L'inventario è del 2026-09-21 ed è rimasto com'era: è una fotografia, non una lista viva. Lo
stesso giorno, però, quattro correzioni dell'audit hanno toccato dei testi. Qui sotto cosa non
torna più, così la riscrittura non lavora su righe che non esistono. I numeri di riga delle
tabelle sopra sono quelli di prima delle correzioni.

| Voce | Dov'era | Cosa è successo |
|---|---|---|
| `Motion e 3D` | §8, `come-lavoro.astro:59` | Ora è `Motion`. La nota di contenuto è chiusa. |
| `Form non ancora collegato. Manca l'id Formspree in src/dati-sito.ts...` | §9 | Tolta. Senza id Formspree il form non viene più renderizzato: restano i canali diretti. |
| `Il form non è ancora collegato: scrivimi via email, ci metti lo stesso tempo.` | §9 | Tolta con il ramo di codice che la mostrava. Era un peccato: era una riga "sua". |
| meta di `/contatti` | §9 | Invariata quando il form c'è. Con il form spento perde `o il form qui sotto`. |

Quattro voci nuove in `src/components/sections/InvitoContatto.astro` (in fondo alla home e a ogni
pagina progetto): `Contatti` (eyebrow, neutra), `Parliamone`, `Due righe bastano. Rispondo entro
un giorno lavorativo.`, bottone `Scrivimi`. Erano testo provvisorio; riscritte il 2026-09-21
insieme alla griglia progetti (vedi tabella sotto).

| Voce | Dov'era | Cosa è successo |
|---|---|---|
| `Prima capire il vincolo, poi scrivere il codice.` | §4, intro dev | → `Il codice arriva per ultimo. Prima viene il problema vero.` |
| `Una sola domanda: questa scelta fa vendere di più?` | §4, intro business | → `Ogni scelta qui sotto punta a vendere di più.` |
| `Lente: decisione` / `sistema` / `flusso` | §4, `ProjectGrid.astro:69` e `[slug].astro:55` | Via l'etichetta "Lente:" e i due punti: resta solo il valore come tag maiuscolo (`DECISIONE` / `SISTEMA` / `FLUSSO`), stesso pattern in entrambi i file. |
| `Parliamone` | InvitoContatto, titolo | → `Raccontami il progetto` |
| `Due righe bastano. Rispondo entro un giorno lavorativo.` | InvitoContatto, riga | → `Scrivimi quello che hai adesso. Rispondo entro un giorno lavorativo.` (non è più una copia letterale della riga del form in §9) |

## Cosa non ho potuto giudicare

Il campione ha un solo genere: risposta lunga e parlata. Di microcopy, titoli e sommari — cioè
di quasi tutto il sito — non c'è una riga scritta da te. I giudizi su quelle voci sono **miei**,
basati sull'assenza di un tratto nel campione, non sulla presenza del tratto opposto. Con due
o tre righe tue di scrittura corta diventerebbero verificabili.
