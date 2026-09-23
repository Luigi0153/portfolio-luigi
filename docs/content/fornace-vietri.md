# Fornace Vietri — concept

> Progetto concept: il laboratorio è inventato, il problema è comune a tanti artigiani.
> Nessun numero inventato: niente vendite, niente percentuali, niente clienti.
> Il valore del case study sta nel ragionamento e nel sistema, non nei risultati.
> I testi pubblicati sono in `src/content/progetti/fornace-vietri.md`, riscritti da questa
> bozza secondo la regola 5 di `CLAUDE.md` (niente metafore, frasi dirette).

Lente del portfolio: un sistema.
Tag: Shopify · Design system · Catalogo · Mobile

Riga sotto il titolo: "Progetto concept. Il laboratorio è inventato, il problema è reale. Le foto sono generate con l'AI."

## Decisioni prese

- **Decisione centrale del case study:** il pezzo venduto resta visibile nel negozio.
- **Immagini dei pezzi:** foto realistiche, generate con l'AI per il concept.
- **Mockup:** immagini statiche, non un prototipo navigabile.

---

## Il laboratorio

Un laboratorio di ceramica artigianale sulla Costiera Amalfitana, due persone. Piatti, vasi, piastrelle e tazze, tutti fatti e dipinti a mano. Vendono in laboratorio e ai turisti d'estate, e vogliono vendere online tutto l'anno.

## Il problema

Ogni pezzo esiste in una sola copia. Due piatti "uguali" hanno decorazioni diverse, quindi non sono varianti dello stesso prodotto.

Shopify è pensato per prodotti in serie: un prodotto, tante taglie o colori, una giacenza. Qui funziona al contrario, ogni pezzo è un prodotto a sé con giacenza 1, e quando lo vendi sparisce.

In più il laboratorio carica i pezzi dal telefono, tra un'infornata e l'altra. Quello che costruisco deve essere semplice da usare ogni giorno, e per il resto ci sono io.

## I vincoli

- Pezzi unici, giacenza 1, niente varianti.
- Foto fatte dal laboratorio, belle ma diverse tra loro per luce e sfondo.
- Chi gestisce il negozio non è tecnico e lavora dal telefono.
- Molte persone vedono un pezzo, lo vogliono, e trovano "esaurito".

## La decisione

Un pezzo venduto non sparisce dal negozio. Resta visibile con lo stato "Venduto" e un bottone "Richiedine uno simile".

Perché: per un artigiano i pezzi venduti mostrano cosa sa fare. Se li nascondi, il negozio si svuota proprio quando vende. Se restano visibili, chi arriva tardi può chiedere un pezzo su commissione.

Il rischio: un negozio pieno di pezzi venduti può sembrare vuoto. Per questo la collezione mostra prima i disponibili e poi i venduti, separati.

## Il sistema

### Tre stati del prodotto
- **Disponibile**: prezzo e "Aggiungi al carrello".
- **Venduto**: niente prezzo, etichetta "Venduto", bottone "Richiedine uno simile".
- **Su commissione**: pezzi fatti su richiesta, con i tempi indicativi e "Chiedi un preventivo".

Lo stato lo sceglie il laboratorio con un solo campo nella scheda prodotto, dal telefono.

### Collezioni per tecnica e per colore
Invece di categorie classiche, due modi di cercare che rispecchiano come ragiona chi compra ceramica: per tecnica (dipinto a mano, smaltato, graffito) e per colore dominante (blu, giallo, verde). Collezioni automatiche: il laboratorio assegna le etichette, Shopify le ordina da solo.

### Una card prodotto che regge foto diverse
Formato fisso quadrato, sfondo crema uniforme dietro la foto, nome e stato sempre nella stessa posizione. Anche con foto scattate in modo diverso, la griglia resta ordinata.

### Sezioni riutilizzabili
Poche sezioni, combinabili dal laboratorio senza toccare codice: griglia prodotti, pezzo in evidenza, racconto del laboratorio, richiesta su commissione.

## Immagini

In `src/assets/progetti/fornace-vietri/`, foto realistiche generate con l'AI:

- `fornace-copertina` — cover nella griglia progetti e in cima alla pagina; anche og-image.
- `fornace-brand` — identità del negozio, dopo "Il laboratorio".
- `fornace-stati` — le tre card affiancate nei tre stati, dentro "La decisione".
- Quattro schermate mobile, 390px, in galleria dentro "Il sistema":
  1. `fornace-home` — home con pezzo in evidenza e collezioni per colore e per tecnica.
  2. `fornace-collezione` — collezione "Blu", disponibili prima e venduti dopo.
  3. `fornace-prodotto` — scheda prodotto disponibile.
  4. `fornace-venduto` — scheda prodotto venduto, con "Richiedine una simile".

## Cosa ho imparato

- Shopify funziona anche per chi non vende in serie, ma va deciso all'inizio, non aggiustato dopo.
- Chi carica i prodotti dal telefono ha poco tempo. Ogni campo in più nella scheda prima o poi resta vuoto, quindi i campi devono essere pochi.
- Con la scritta "esaurito" il cliente se ne va. Con "Venduto, richiedine uno simile" può fare una richiesta al laboratorio.

## Nel negozio vero farei

Costruire lo store su un dev store Shopify gratuito, con i tre stati gestiti da un metafield e il codice del tema pubblico su GitHub.
