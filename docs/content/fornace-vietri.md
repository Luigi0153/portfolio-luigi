# Fornace Vietri — concept (bozza da correggere)

> Progetto concept: il laboratorio è inventato, il problema è comune a tanti artigiani.
> Nessun numero inventato: niente vendite, niente percentuali, niente clienti.
> Il valore del case study sta nel ragionamento e nel sistema, non nei risultati.
> Le voci marcate [DA DECIDERE] le sceglie Luigi.

Lente del portfolio: un sistema.
Tag: Shopify · Design system · Catalogo · Mobile

---

## Il laboratorio

Un laboratorio di ceramica artigianale sulla Costiera Amalfitana, due persone. Piatti, vasi, piastrelle e tazze, tutti fatti e dipinti a mano. Vendono in laboratorio e ai turisti d'estate, e vogliono vendere online tutto l'anno.

## Il problema

Ogni pezzo esiste in una sola copia. Due piatti "uguali" hanno decorazioni diverse, quindi non sono varianti dello stesso prodotto.

Shopify è pensato per prodotti in serie: un prodotto, tante taglie o colori, una giacenza. Qui funziona al contrario, ogni pezzo è un prodotto a sé con giacenza 1, e quando lo vendi sparisce.

In più il laboratorio aggiorna il negozio da solo, dal telefono, tra un'infornata e l'altra. Tutto quello che costruisco deve restare semplice da gestire per chi non è tecnico.

## I vincoli

- Pezzi unici, giacenza 1, niente varianti.
- Foto fatte dal laboratorio, belle ma diverse tra loro per luce e sfondo.
- Chi gestisce il negozio non è tecnico e lavora dal telefono.
- Molte persone vedono un pezzo, lo vogliono, e trovano "esaurito".

## La decisione

Un pezzo venduto non sparisce dal negozio. Resta visibile con lo stato "Venduto" e un bottone "Richiedine uno simile".

Perché: per un artigiano i pezzi venduti sono la prova di cosa sa fare. Nasconderli significa svuotare il negozio proprio mentre funziona. Tenerli visibili trasforma un "esaurito" in una richiesta su commissione.

Il rischio: un negozio pieno di pezzi venduti può sembrare vuoto. Per questo la collezione mostra prima i disponibili e poi i venduti, separati.

[DA DECIDERE 1] Tieni questa decisione come centrale, oppure preferisci un'altra? Alternativa possibile: "le foto disordinate le sistemo con un sistema di impaginazione, non rifacendo le foto".

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

## Cosa mostrare (mockup)

Quattro schermate mobile, 390px:
1. Home con pezzo in evidenza e collezioni per tecnica.
2. Collezione "Blu", disponibili prima e venduti dopo.
3. Scheda prodotto disponibile.
4. Scheda prodotto venduto, con "Richiedine uno simile".

Più un quadro con le tre card affiancate nei tre stati: è l'immagine che spiega il sistema in un colpo d'occhio.

[DA DECIDERE 2] Le immagini dei pezzi in ceramica: generate in Gemini nello stesso stile retro della scena scrivania, oppure più realistiche?

[DA DECIDERE 3] Il prototipo cliccabile: pagina navigabile dentro il portfolio (le quattro schermate collegate tra loro), oppure solo immagini statiche con lo slider?

## Cosa ho imparato

- Shopify si può piegare anche a chi non vende in serie, ma va deciso all'inizio, non aggiustato dopo.
- Per chi gestisce da solo, ogni campo in più nella scheda prodotto è un campo che prima o poi resta vuoto.
- Un "esaurito" è una porta chiusa. Un "Venduto, richiedine uno simile" è una conversazione che inizia.

## Nel negozio vero farei

Costruire lo store su un dev store Shopify gratuito, con i tre stati gestiti da un metafield e il codice del tema pubblico su GitHub.
