# AUDIT — revisione esterna di luigiromano.vercel.app

Fatto il 2026-09-21 su **https://luigiromano.vercel.app**, sito pubblico in produzione.
Nessun file del sito è stato modificato: questo documento è solo analisi.

Chi scrive non è l'autore del sito e non ha partecipato alle decisioni di progetto.
Dove un giudizio è mio e non misurato, lo dico.

## Come ho misurato

| Cosa | Come |
|---|---|
| Testi | HTML pubblicato delle 6 pagine + testo realmente visibile (`innerText`) nei due percorsi, a 390 e 1280 |
| Accessibilità | axe-core 4.10.2 iniettato da CDN su **20 combinazioni** (5 pagine × 2 percorsi × 390/1280), più controlli manuali su tabulazione, focus, ordine, contrasto |
| Prestazioni | Chromium con throttling mobile stile Lighthouse (1,6 Mbps, 150 ms RTT, CPU 4×), **3 run per pagina, mediana**; byte reali via CDP `encodedDataLength` |
| Vista | Screenshot del sito pubblico a 390, 768 e 1280 nei due percorsi |

Tre limiti da tenere presenti:

1. **Non c'è un punteggio Lighthouse.** L'API PageSpeed Insights aveva la quota giornaliera anonima
   esaurita, e la regola 7 di `CLAUDE.md` vieta di misurare sul dev server. Ci sono le metriche
   grezze, non il voto sintetico. Il numero "85" che sta in `docs/STATO.md` non è stato né
   confermato né smentito.
2. **Il "blocco del thread" che cito non è il TBT di Lighthouse**: è la somma delle attività lunghe
   oltre 50 ms nei primi 5 secondi. Stesso ordine di grandezza, finestra diversa.
3. **axe copre una parte di WCAG, non tutto.** Zero violazioni non vuol dire zero problemi: il
   difetto più serio che ho trovato (ordine delle card) axe non lo vede.

---

## Passata 1 — Copy

Skill: `copywriting`, `unslop`. Riferimento di voce: `docs/voce.md`.

### I cinque problemi più gravi

**1. Il titolo della pagina più importante è "Luigi". Cinque caratteri.**
È l'unica riga che leggono Google, la scheda del browser e chi condivide il link. Non contiene il
cognome, il ruolo, la città, niente. Le altre pagine hanno titoli buoni (`Non ho rifatto il sito.
Ho letto i numeri. | Luigi` è ottimo): la home, che è quella che riceve le visite, no.

**2. L'H1 dedica il corpo più grande alla cosa meno utile.**
`Ciao, sono Luigi.` occupa due righe fino a 6,5rem; la promessa vera sta sotto, a meno della metà
(`clamp(1.625rem, 3.5vw, 2.75rem)`). E le due promesse non reggono il peso:

- `Scrivo codice che si fa leggere` è un doppio senso. Non è verificabile e non dice cosa sai fare.
- `Faccio negozi che vendono davvero` è la frase che sta sul sito di ogni agenzia. Il lavoro lo fa
  l'avverbio: togli "davvero" e resta una frase vuota.

`Faccio negozi` da solo è concreto e tuo. È il resto che lo annacqua.

**3. Il registro dominante non è la tua voce: è quella di un modello.**
Il conteggio sta già in `docs/inventario-testi.md` e l'ho verificato sul testo pubblicato. I due
punti-punchline (`X: Y`) ricorrono una trentina di volte in circa 1.280 parole visibili; nel tuo
campione di `docs/voce.md`, zero volte in 324 parole. Stessa storia per l'antitesi `non X, ma Y` e
per l'aforisma che chiude la sezione. Il segnale più chiaro è una ripetizione letterale: **"un
pavimento, non una misura"** compare due volte, nel testo del caso reale e dentro il funnel. Un tic
ripetuto identico a due schermate di distanza è la firma della macchina, non dell'autore.

**4. Il sito non dice mai chi sei.**
Nel testo visibile non compaiono: il cognome (sta solo nel dominio), una foto, la zona in cui
lavori, da quanto lo fai, se sei libero. "Campania" appare solo come luogo del cliente. Un
recruiter e un negoziante cercano quei dati per primi, e qui non ci sono.

**5. Tre affermazioni si contraddicono da sole.**

| Dove | Cosa dice | Perché non regge |
|---|---|---|
| StatTile del caso reale | `94%` traffico da mobile, e sotto `Il desktop qui non esiste.` | Il desktop è il 6%: esiste. È l'unico punto del sito in cui una battuta smentisce il numero che ha sopra |
| `/come-lavoro`, stack | Colonna `Motion e 3D` | Sotto non c'è niente di 3D, e la stessa pagina scrive `L'oggetto 3D nell'hero era previsto: l'ho tolto` |
| Footer, ogni pagina | `Fatto a mano, con qualche prompt.` | Sul sito di chi vende lavoro fatto bene, "con qualche prompt" toglie valore proprio mentre il resto della pagina cerca di darne |

### Punti di forza

Le righe migliori del sito sono davvero buone, e sono buone per la ragione giusta: dicono un fatto
e si fermano.

- `Il 94% del traffico arriva da mobile, e il 30% degli ordini da TikTok Shop, che nel funnel del
  sito non si vede.` Due numeri veri e un limite dichiarato in coda, senza commento sopra.
- La didascalia del grafico che spiega **perché** aprile e maggio restano senza numero. Spiegare un
  dato mancante invece di riempirlo è raro e vale più di tre aggettivi.
- Il funnel dichiara il denominatore di ogni riga. È onestà messa nell'interfaccia.
- `Ti lascio il sito e le istruzioni per cambiarlo senza chiamarmi.` Rinuncia a una dipendenza
  commerciale, ed è la frase che un cliente ricorda.
- Tutta la microcopy del form: `Come ti chiami`, `Due righe bastano`, `Serve un'email valida,
  altrimenti non posso risponderti`. Dove il testo doveva lavorare, nessuno ha cercato di essere
  brillante, e si sente.

### Voto: 6/10

Il sito contiene una decina di righe che valgono più di interi portfolio, quasi tutte nel caso
reale e nel form. Ma sono circondate da un registro che non è il tuo, la home non dice niente di
verificabile, e il titolo della pagina principale è un nome proprio. Il livello non è basso: è
disomogeneo, e la parte più visibile è la più debole.

---

## Passata 2 — Conversione

Skill: `cro`. Obiettivo unico del sito: farsi contattare.

### I cinque problemi più gravi (comuni ai due target)

**1. Dopo l'hero, la home non chiede mai di essere contattata.**
Ho contato i link visibili a 390. Nel corpo della home c'è **un solo** collegamento a `/contatti`:
la tessera "CONTATTI" della scena, un'icona quadrata in mezzo ad altre tre. Gli altri due accessi
sono la voce di menu e il link nel footer. Nessun bottone, nessuna frase che inviti a scrivere. La
pagina finisce con la terza card e passa al footer.

**2. Il case study, che è l'argomento migliore che hai, finisce in un vicolo cieco.**
Sulla pagina `/progetti/caso-reale` i link a `/contatti` nel corpo sono **zero**. Chi ha appena
letto +63%, +86% e il funnel — cioè la persona più convinta che passerà mai dal sito — trova
"Cosa ho imparato" e poi il footer. Niente "parliamone", niente progetto successivo, niente.

**3. Sopra la piega non c'è una sola prova.**
I tre numeri veri (+63% ordini, +86% fatturato, 94% mobile) vivono a due click dalla home. Il primo
schermo contiene un saluto, una promessa generica, uno switch e un bottone che porta a una griglia.
Un visitatore che non scorre esce senza aver visto niente di verificabile.

**4. Il form manda nome, email e messaggio a un terzo, e il sito non lo dice.**
L'`action` è `https://formspree.io/f/xkjgoowv`. Le parole "privacy", "consenso", "trattamento dei
dati" compaiono **zero volte in tutto il sito**, e non esiste una pagina di informativa. Per il
target business è un freno di fiducia; per un sito italiano con un form di contatto è anche un
buco di conformità. Non sono un legale e non do un parere legale: segnalo che manca del tutto.

**5. Lo switch promette due siti e ne consegna tre righe.**
È il progetto n°5, la cosa di cui il sito va più fiero. Sulla home cambia: una riga dell'H1,
l'etichetta del bottone, il sommario della sezione progetti, e l'ordine visivo di due card "in
arrivo". Tutto qui. Chi lo prova si aspetta un riordino e vede muoversi un pallino. La promessa
("stessa struttura, contenuti riordinati") sulla pagina più vista non viene mantenuta.

### Percorso "Cerchi uno sviluppatore" (recruiter, agenzie)

**Cosa spinge.** `/come-lavoro` è scritta bene per questo lettore: i quattro passi, lo stack, la
sezione "Il come" con `localStorage`, `prefers-reduced-motion`, il perché del 3D tolto. È l'unica
pagina con una CTA finale doppia (`Parliamo di codice` + `Vedi i progetti`). E il caso reale mostra
la cosa che un recruiter fatica a valutare da un CV: aver congelato un redesign per guardare i
numeri è giudizio, e il giudizio si vede peggio del codice.

**Cosa frena.**

- Il bottone dice `Vedi il codice` e porta a `#progetti`, cioè a tre card. Di codice non ce n'è.
  La promessa del bottone e la destinazione non coincidono.
- Il link a GitHub esiste in un solo punto del sito, su `/contatti`: tre click dalla home. Sul caso
  reale non c'è un repo, uno snippet, un commit.
- Due dei tre progetti sono vuoti (vedi passata 3). Un portfolio con un caso su tre è un portfolio
  con un caso.
- Niente CV scaricabile, niente cognome, niente disponibilità.

### Percorso "Vuoi vendere online" (piccole attività)

**Cosa spinge.** Qui la voce funziona: `Raccontami il negozio.`, `Anche se non sai da dove si
comincia.`, `se non sono la persona giusta te lo dico subito`. Sono tre frasi che abbassano la
soglia d'ingresso meglio di qualsiasi garanzia scritta. I quattro passi sono in italiano normale, e
`Qui si cambia idea gratis` risponde alla paura vera di chi non ha mai commissionato un sito.

**Cosa frena.**

- **Il sito non dice mai cosa vendi.** Non c'è un elenco di servizi, da nessuna parte. Un
  negoziante non può capire se fai store nuovi, sistemi quelli esistenti, curi il catalogo, lavori
  a mese o a progetto. Senza quello non sa neanche se sei la persona a cui scrivere.
- Nessun prezzo, nessun ordine di grandezza, nessuna durata tipica. Non serve un listino: serve una
  riga che eviti la domanda "e quanto mi costa parlarne?".
- L'unico caso è anonimo per scelta (regola 8), il che è corretto, ma lascia il lettore senza un
  nome, una faccia, una frase del cliente. Zero testimonianze sul sito.
- Il telefono è dietro un cancello: `Scrivimi prima due righe: ti mando io il numero e un orario.`
  Per un negoziante il telefono è il canale naturale, e qui è l'unico messo dopo un passaggio.
- L'email mostrata è `luigi4375@gmail.com`. Quattro cifre in coda a un indirizzo gratuito, su un
  sito che vende competenza tecnica, è la prima crepa che nota un cliente attento. Ed è in chiaro,
  quindi raccoglibile dai bot.

### Voto: 4/10

Le due strade esistono e sono scritte con cura, ma il sito ha un obiettivo solo e lo lascia cadere
proprio dove serve: la home non chiede niente, la pagina più persuasiva non ha un'uscita, la prova
è nascosta a due click e l'offerta non è mai dichiarata. La qualità della scrittura non compensa
l'assenza della struttura di conversione.

---

## Passata 3 — Usabilità e intuitività

Skill: `web-design-guidelines` (regole scaricate dalla fonte Vercel, applicate al sito pubblico).
Le regole specifiche dell'inglese (Title Case, "avoid first person") non si applicano: il sito è
italiano e in prima persona per scelta.

### I cinque problemi più gravi

**1. La scena scrivania non dichiara di essere navigazione.**
Misurato a 1280, a riposo: tutte e quattro le etichette hanno `opacity: 0` e `visibility: hidden`.
Chi usa il mouse vede quattro disegni senza nessun segno che siano link. L'etichetta compare solo
al passaggio del mouse o col focus da tastiera. Tre dei quattro oggetti portano dove porta già il
menu (Progetti, Come lavoro, Contatti): l'unica destinazione nuova è "Caso reale", che è anche la
più importante del sito ed è quella nascosta meglio.

Va detto che il caso peggiore è stato previsto: con `(hover: none) and (pointer: coarse)` le
etichette sono sempre visibili, quindi su tablet touch il problema non c'è. Resta il desktop.

**2. Nel percorso business l'ordine che si vede non è l'ordine con cui si naviga.**
Misurato a 768 e 1280, percorso "Vuoi vendere online":

| | Ordine |
|---|---|
| A schermo | caso-reale → pizzeria → fornace-vietri |
| Nel DOM (tabulazione, screen reader) | caso-reale → fornace-vietri → pizzeria |

Il riordino è fatto con la proprietà CSS `order`, che sposta quello che si vede e non quello che
c'è. Chi naviga con la tastiera salta dalla prima card alla terza e poi torna indietro. Formalmente
è WCAG 2.4.3 (Focus Order) e 1.3.2 (Meaningful Sequence), entrambi di livello A. Nel percorso
sviluppatore l'ordine coincide e il problema non si presenta.

**3. Due card su tre portano a una pagina vuota.**
`/progetti/pizzeria`: un titolo, quattro tag, una forma astratta, due frasi. Alta 1.096 px sul
telefono, cioè poco più di uno schermo. Nessun h2, nessuna CTA, nessuna data, nessun "ti avviso
quando è pronto". Stessa cosa per Fornace Vietri. Sono nella sitemap, quindi indicizzate. Dal punto
di vista di chi arriva, la griglia promette tre casi e ne mantiene uno.

**4. Sulla pagina di un progetto, il menu non segnala più dove sei.**
La voce "Progetti" punta a `/#progetti`, cioè a un'ancora della home: non esiste una pagina indice
dei progetti. Su `/progetti/caso-reale` nessuna voce del menu risulta attiva, non c'è una
briciola di pane, e "Torna ai progetti" è un link alto 31 px in cima alla pagina. Chi arriva lì da
Google non ha modo di capire in che sezione si trova.

**5. A desktop l'hero ha un vuoto in mezzo.**
A 1280 la colonna sinistra finisce al bottone e la scena sta in alto a destra: sotto restano circa
200 px di niente prima di "Progetti". Gli oggetti inoltre galleggiano senza un piano d'appoggio —
non c'è un tavolo, un'ombra, una linea d'orizzonte — quindi la "scrivania" si legge come quattro
icone sparse più che come una scena.

### Punti di forza

Questa è la passata in cui il sito va meglio, e diverse cose sono fatte meglio della media dei siti
professionali.

- **Tastiera**: skip link come primo elemento, ordine di tabulazione logico (menu → switch → CTA →
  i quattro oggetti), focus visibile su ogni elemento interattivo (outline 2-3 px piena).
- **`prefers-reduced-motion`**: verificato con il flag attivo. Le forme restano ferme, GSAP non
  anima, e — la parte che quasi nessuno fa bene — **tutti i contenuti restano visibili**. Niente
  blocchi rimasti a opacità zero.
- **Zero overflow orizzontale** su tutte e 5 le pagine, nei due percorsi, a 390 e 1280.
- Form con label vere e cliccabili, `autocomplete`, `type="email"`, errori in linea legati con
  `aria-describedby`, messaggi che dicono come rimediare.
- 404 che risponde davvero 404 e offre due strade.
- Le tessere mobile sono una soluzione migliore della scena desktop: etichettate, grandi, chiare.

### Voto: 6/10

Le fondamenta sono solide e in alcuni punti esemplari. Quello che manca è l'orientamento: il
visitatore non sa che la scena è navigabile, non sa dove si trova nelle pagine di progetto, e due
volte su tre trova una pagina vuota in fondo a un click. Più un difetto reale di ordine nel
percorso business.

---

## Passata 4 — Visivo

Skill: `design-taste-frontend`, `ui-ux-pro-max`, con `docs/design-tokens.md` come riferimento
prevalente.

### I cinque problemi più gravi

**1. La gerarchia tipografica premia il nome e penalizza il messaggio.**
`h1` arriva a 6,5rem per dire "Ciao, sono Luigi"; la riga che contiene la proposta si ferma a
2,75rem. Il carattere più grande del sito porta l'informazione meno utile. È una scelta di
composizione, non di copy, e si risolve invertendo le due scale.

**2. I contrasti passano, ma per pochi centesimi, e sulle card non passano più.**
Calcolati sui token:

| Colore | Su crema (#fdf4e4) | Su card (#f6e9d2) |
|---|---|---|
| arancio #c93c00 | 4,66 ✅ | **4,24** ❌ |
| blu #0270c0 | 4,71 ✅ | **4,29** ❌ |
| verde-deep #2a7a62 | 4,74 ✅ | **4,31** ❌ |
| verde #399f80 | **2,98** ❌ | 2,76 ❌ |

Oggi non c'è nessuna violazione reale (axe: 0 su 20 combinazioni) perché quei colori finiscono su
crema o a corpo grande. Ma il margine è di 3-5 centesimi sopra la soglia: il primo testo d'accento
che qualcuno metterà dentro una card scenderà sotto AA senza che nessuno se ne accorga. E il verde
base, a 2,98, è già sotto 3:1 e viene usato come colore predefinito della sottolineatura dei link.

**3. Le forme Bauhaus competono con la CTA invece di accompagnarla.**
A 1280 il quarto di cerchio arancio sta alla stessa altezza del bottone `Vedi il codice` ed è dello
stesso colore: due macchie arancio alla stessa quota, di cui solo una è cliccabile. Il cerchio
giallo in alto è tagliato dal bordo superiore in modo che sembra un ritaglio sbagliato più che una
scelta. Le forme sono l'elemento più caratterizzante del sito e sono anche l'unico che disturba una
decisione.

**4. Sulla stessa schermata convivono tre linguaggi visivi.**
L'illustrazione della scrivania è line-art vintage con ombreggiature; le forme sono Bauhaus piatte;
i grafici del caso reale sono flat moderni. Presi uno a uno funzionano tutti. Insieme, nell'hero,
raccontano tre epoche diverse. Il retro non è portato dalla tipografia o dal colore ma solo dai
disegni: se togli le illustrazioni, resta un layout editoriale contemporaneo pulito.

**5. A desktop molte sezioni restano mezze vuote.**
Nel caso reale la colonna sinistra si svuota dopo la copertina e da "Decisione" in giù resta circa
metà pagina bianca. Su `/come-lavoro` la sezione "I prompt che hanno deciso qualcosa" è una sola
card stretta con due terzi di riga vuota accanto — e il titolo è al plurale. La pagina pizzeria è
uno schermo con una forma e due frasi.

### Lo stile retro aiuta o distrae?

Domanda diretta, risposta divisa in tre.

- **Aiuta nella griglia e nel caso reale.** Le copertine geometriche danno identità a progetti che
  altrimenti sarebbero tre rettangoli grigi, e i grafici disegnati con la stessa mano fanno sembrare
  i dati una scelta editoriale invece di un export da Analytics. Qui il retro lavora.
- **Distrae nell'hero.** Quattro forme in movimento, una scena illustrata e uno switch nello stesso
  schermo sono tre cose che chiedono attenzione mentre la CTA ne chiede una quarta.
- **Sparisce sul mobile.** A 390 la scena diventa una griglia 2×2 di icone con etichette: chiara e
  usabile, ma somiglia al menu di un'app e del retro non resta quasi niente. Visto che il 94% del
  traffico del tuo caso reale è mobile, vale la pena chiedersi per chi è pensata la scena.

### Punti di forza

- La palette è riconoscibile e calda, e — verificato sul CSS pubblicato — è applicata con
  disciplina: nessun colore fuori token nella UI, l'unica eccezione è dichiarata nel codice (i
  magenta del burst).
- L'accoppiata Fraunces / Hanken Grotesk / JetBrains Mono è scelta bene e usata con coerenza: il
  mono è sempre e solo etichetta, mai testo.
- Le illustrazioni sono il vero patrimonio del sito. In un portfolio da sviluppatore sono rare e
  ricordabili.
- I grafici (rampa, funnel, StatTile, slider prima/dopo) sono disegnati, non presi da una libreria,
  e sono onesti: ogni barra dichiara la sua base.
- Bordo 2 px più ombra dura sulle card, bottoni senza ombra e senza spostamenti: la regola dei
  token è rispettata ovunque, e questo tiene insieme tutto.

### Voto: 7/10

È un sito con una faccia sua, che è la cosa più difficile da ottenere e la più facile da perdere.
Perde punti per la gerarchia invertita nell'hero, per un sistema di colore senza margine di
sicurezza e per gli spazi vuoti a desktop, non per mancanza di gusto.

---

## Passata 5 — Accessibilità e prestazioni (misurate sul sito pubblico)

### Numeri misurati

Mediana di 3 run, throttling mobile (1,6 Mbps, 150 ms RTT, CPU 4×):

| Pagina | TTFB | FCP | LCP | Blocco thread (5 s) | CLS | Peso totale |
|---|---|---|---|---|---|---|
| `/` | 106 ms | 1.280 ms | 1.280 ms | 532 ms | 0,041 | **509,5 KB** |
| `/come-lavoro/` | 100 ms | 1.100 ms | 1.100 ms | 537 ms | 0,001 | 248,3 KB |
| `/contatti/` | 104 ms | 1.060 ms | 1.060 ms | 351 ms | 0,000 | 200,7 KB |
| `/progetti/caso-reale/` | 106 ms | 1.216 ms | 1.216 ms | 550 ms | 0,000 | 262,8 KB |

Composizione della home mobile: font 179,8 KB, immagini 180,7 KB, script 128,8 KB, HTML 9,4 KB,
CSS 10,8 KB.

### I cinque problemi più gravi

**1. I font sono il peso fisso del sito: 179 KB su ogni singola pagina.**
Di questi, **118,5 KB sono il solo `fraunces-latin-full-normal.woff2`**: la variabile con tutti gli
assi, importata da `global.css` come `@fontsource-variable/fraunces/full.css` perché i token usano
`opsz 72` e `SOFT 50`. Due valori fissi. Per due numeri che non cambiano mai si paga l'intero spazio
di variazione, ed è in `preload` con `fetchpriority="high"`, quindi si prende la banda per primo.
Su `/contatti` — la pagina che deve convertire — i font sono il **90%** dei 200 KB scaricati.

**2. La home scarica 54 KB di tazza di caffè che sul telefono non si vede mai.**
`tazza.webp` pesa 54 KB, ha `loading="eager"` e a 390 px la sua larghezza resa è **0**: la scena
è `display: none` sotto 768 px e le tessere mobile non includono la tazza. Il file viene chiesto lo
stesso. Le altre quattro immagini vengono servite a 576-640 px per essere disegnate a **87 px**:
circa sette volte i pixel necessari, anche contando uno schermo a densità doppia.

**3. 128,8 KB di JavaScript sulla home, di cui 66,3 KB di React per due bottoni.**
Il runtime React viene scaricato solo per idratare lo switch. La pagina `/come-lavoro` spiega, e
correttamente, che lo switch è "un attributo su `<html>` e un pugno di regole CSS: zero re-render,
zero JavaScript al cambio". È vero **al cambio**; resta che per arrivarci si scaricano 66,3 KB. Con
CPU 4× il blocco misurato sulla home è 532 ms, il valore peggiore del sito insieme al caso reale.
Il resto: gsap 28 KB, ScrollTrigger 17,9 KB, ClientRouter 5,9 KB.

**4. Lo stato dello switch arriva agli screen reader solo dopo l'idratazione.**
In `TargetSwitch.tsx` lo stato parte da `null` e viene impostato in `useEffect`, quindi
`aria-pressed` è `undefined` al primo render. Con `client:idle` l'idratazione avviene dopo il resto:
fino a quel momento chi usa uno screen reader trova due bottoni senza stato e non può sapere quale
percorso è attivo. Lo script inline nel `<head>` che imposta già `data-target` prima del paint
potrebbe impostare anche `aria-pressed`, e il problema sparirebbe senza toccare React.

**5. Ordine visivo diverso dall'ordine del DOM nel percorso business.**
È l'unica violazione WCAG misurata su tutto il sito (2.4.3 e 1.3.2, livello A). La descrizione
completa e la tabella sono nella passata 3, punto 2: la riporto qui perché formalmente è un difetto
di accessibilità, non solo di usabilità, e perché axe non lo rileva.

### Punti di forza

Va detto chiaramente: **axe-core non ha trovato una sola violazione su 20 combinazioni** di pagina,
percorso e larghezza. È un risultato che pochi siti professionali ottengono.

- Core Web Vitals in verde anche sotto throttling: LCP tra 1,06 e 1,28 s (soglia 2,5 s), CLS
  massimo 0,041 (soglia 0,1).
- TTFB intorno ai 100 ms, cache edge `HIT` da Francoforte, brotli attivo, asset `_astro` con
  `max-age=31536000, immutable`.
- Intestazioni di sicurezza presenti: HSTS con `preload`, `X-Content-Type-Options`,
  `Referrer-Policy`.
- Tutte le immagini hanno `width` e `height` espliciti, le copertine sotto la piega sono `lazy`,
  l'alt text descrive invece di commentare.
- `prefers-reduced-motion` rispettato davvero, contenuti inclusi.
- `robots.txt` corretto (esclude `/styleguide`), sitemap valida, 404 con stato giusto, `lang="it"`,
  landmark semantici, un solo `h1` per pagina.

### Voto: 7/10

L'accessibilità meriterebbe da sola un 8: è curata a un livello che non ci si aspetta da un
portfolio. Le prestazioni tengono il voto più basso perché il sito paga tre pedaggi evitabili —
un font variabile completo per due assi fissi, immagini a sette volte la dimensione utile, React per
uno switch che funziona in CSS — e perché la pagina del contatto è fatta per il 90% di caratteri
tipografici.

---

## I dieci interventi a maggior rapporto costo/beneficio

In ordine: prima quelli che costano poco e rendono molto.

| # | Intervento | Dove | Costo | Cosa cambia |
|---|---|---|---|---|
| 1 | Titolo della home da `Luigi` a nome, cognome, ruolo e zona | `src/pages/index.astro:9` | 5 min | L'unica riga che Google mostra smette di essere vuota |
| 2 | Una CTA di contatto in fondo alla home **e** in fondo al caso reale | `ProjectGrid.astro`, `progetti/[slug].astro` | 30 min | Chiude le due uscite oggi cieche, sulla pagina più vista e sulla più persuasiva |
| 3 | Portare i tre numeri del caso reale sopra la piega | `Hero.astro` | 1 h | Dà una prova a chi non scorre |
| 4 | Cinque righe su cosa fai davvero, per il percorso business | nuova sezione in home | 1 h | Oggi un negoziante non può capire cosa comprare |
| 5 | Riga di consenso sul form + pagina di informativa | `contatti.astro` | 1-2 h | Toglie un freno di fiducia e colma un buco di conformità |
| 6 | Istanza statica del font al posto della variabile completa | `global.css:5`, `Base.astro:86` | 1-2 h | **Circa -80/90 KB su ogni pagina del sito** |
| 7 | Tazza fuori dal caricamento mobile + immagini alla dimensione resa | `DeskScene.astro:98-130` | 1 h | **Circa -100 KB sulla home mobile**, -54 KB subito solo con la tazza |
| 8 | Switch senza React, con `aria-pressed` nello script inline | `TargetSwitch.tsx`, `Base.astro:38` | 2 h | **-66 KB**, meno blocco del thread, e stato accessibile fin dal primo paint |
| 9 | Etichette della scena visibili a riposo anche col mouse | `DeskScene.astro:232-266` | 30 min | Rende scopribili quattro link oggi invisibili, tra cui il caso reale |
| 10 | Riordino delle card nel DOM invece che con `order` CSS | `ProjectGrid.astro:121-125` | 1 h | Chiude l'unica violazione WCAG del sito |

Tre che non entrano in classifica solo perché costano un po' di più o dipendono da una tua
decisione, non da un'ora di lavoro:

- **Email su dominio tuo** al posto di `luigi4375@gmail.com`. Cambia la percezione più di mezza
  pagina di copy, ma serve comprare un dominio e spostare la posta.
- **Le due card "in arrivo"**: o ricevono un paragrafo vero e una data, o escono dalla griglia e
  dalla sitemap. Così com'è, la griglia promette tre casi e ne mantiene uno.
- **Passata sui testi con `docs/voce.md` alla mano**, partendo dai due punti-punchline: sono una
  trentina e nella metà dei casi al loro posto ci va una "e" o un punto. È la revisione con più
  effetto sul registro complessivo, ed è anche la più lunga.
