---
titolo: "Fornace Vietri"
slug: fornace-vietri
nota: "Progetto concept. Il laboratorio è inventato, il problema è reale. Le foto sono generate con l'AI."
lente: sistema
target: dev
tags:
  - Shopify
  - Design system
  - Catalogo
  - Mobile
cover: ../../assets/progetti/fornace-vietri/fornace-copertina.jpg
coverAlt: "Due schermate del negozio Fornace Vietri su telefono. Nella prima un piatto dipinto a mano, nella seconda una brocca con l'etichetta Venduto e il bottone Richiedine una simile."
sommario: "Concept Shopify per un laboratorio di ceramica. Ogni pezzo è unico, e quello venduto resta nel negozio."
ordine_dev: 2
ordine_business: 3
capitoli:
  - id: laboratorio
    titolo: Il laboratorio
    righe:
      - "Un laboratorio di ceramica sulla Costiera Amalfitana, con due persone. Piatti, vasi, piastrelle e tazze, tutti fatti e dipinti a mano."
      - "Vendono in laboratorio e ai turisti d'estate. Vogliono vendere online tutto l'anno."
    figura:
      src: ../../assets/progetti/fornace-vietri/fornace-brand.jpg
      alt: "Identità del negozio. Logo a cerchi blu e giallo, quattro colori (Smalto, Cobalto, Giallo Vietri, Terra scura), il carattere Young Serif, le mani di un'artigiana che dipinge un piatto, e tre pezzi: un piatto con pesci, una brocca a spirale e una piastrella con un fiore."
  - id: problema
    titolo: Il problema
    righe:
      - "Ogni pezzo esiste in una sola copia. Due piatti simili hanno decorazioni diverse, quindi non sono varianti dello stesso prodotto."
      - "Shopify è pensato per prodotti in serie, con un prodotto in più taglie o colori e una giacenza. Qui ogni pezzo è un prodotto a sé con giacenza 1, e quando viene venduto sparisce dal negozio."
      - "Il laboratorio carica i pezzi dal telefono, tra un'infornata e l'altra. Quello che costruisco deve essere semplice da usare ogni giorno, e per il resto ci sono io."
  - id: decisione
    titolo: La decisione
    righe:
      - "Un pezzo venduto non sparisce dal negozio. Resta visibile con l'etichetta Venduto e un bottone “Richiedine uno simile”."
      - "Per un artigiano i pezzi venduti mostrano cosa sa fare. Se li nascondi, il negozio si svuota proprio quando vende. Se restano visibili, chi arriva tardi può chiedere un pezzo su commissione."
      - "Il rischio è un negozio che sembra vuoto perché è pieno di pezzi venduti. Per questo la collezione mostra prima i pezzi disponibili e poi quelli venduti, separati."
    figura:
      src: ../../assets/progetti/fornace-vietri/fornace-stati.jpg
      alt: "La stessa card prodotto in tre stati. Ciotola Onde, pezzo unico a 95 euro, con Aggiungi al carrello. Brocca Spirale, già venduta, senza prezzo e con Richiedine una simile. Vaso Cobalto, fatto su richiesta in circa 4 settimane, con Chiedi un preventivo."
  - id: sistema
    titolo: Il sistema
    righe:
      - "Quattro parti, pensate per chi gestisce il negozio dal telefono."
    sottosezioni:
      - titolo: Tre stati del prodotto
        righe:
          - "Disponibile, con il prezzo e “Aggiungi al carrello”. Venduto, senza prezzo e con “Richiedine uno simile”. Su commissione, con i tempi indicativi e “Chiedi un preventivo”."
          - "Il laboratorio sceglie lo stato con un solo campo nella scheda prodotto, dal telefono."
      - titolo: Collezioni per tecnica e per colore
        righe:
          - "Chi compra ceramica cerca per tecnica (dipinto a mano, smaltato, graffito) o per colore (blu, giallo, verde). Le collezioni seguono questi due criteri."
          - "Sono collezioni automatiche. Il laboratorio assegna le etichette al pezzo e Shopify lo mette nella collezione giusta."
      - titolo: Una card uguale per foto diverse
        righe:
          - "Le foto le fa il laboratorio, con luci e sfondi diversi. La card ha formato quadrato, sfondo crema dietro la foto, nome e stato sempre nello stesso punto."
          - "Così la griglia resta ordinata anche quando le foto non si somigliano."
      - titolo: Sezioni riutilizzabili
        righe:
          - "Poche sezioni, che il laboratorio combina senza toccare il codice. Griglia prodotti, pezzo in evidenza, racconto del laboratorio e richiesta su commissione."
    galleria:
      - etichetta: Home
        src: ../../assets/progetti/fornace-vietri/fornace-home.jpg
        alt: "Home del negozio su telefono. Foto del laboratorio, il titolo Ceramiche dipinte a mano, un pezzo alla volta, il Piatto Pesci in evidenza a 68 euro, i filtri per colore e per tecnica, e un riquadro sul laboratorio con il link per chiedere un pezzo su commissione."
      - etichetta: Collezione Blu
        src: ../../assets/progetti/fornace-vietri/fornace-collezione.jpg
        alt: "Collezione Blu, 5 pezzi di cui 3 disponibili. In alto i tre pezzi disponibili con il prezzo, poi il Vaso Cobalto su commissione, in fondo la Brocca Spirale già venduta con il link Richiedine uno simile."
      - etichetta: Pezzo disponibile
        src: ../../assets/progetti/fornace-vietri/fornace-prodotto.jpg
        alt: "Scheda della Ciotola Onde. Etichetta Pezzo unico, prezzo 95 euro, bottone Aggiungi al carrello, poi misure, tecnica, colore e cura."
      - etichetta: Pezzo venduto
        src: ../../assets/progetti/fornace-vietri/fornace-venduto.jpg
        alt: "Scheda della Brocca Spirale venduta. Nessun prezzo, un riquadro con il bottone Richiedine una simile e, sotto, due pezzi disponibili con colori simili."
  - id: imparato
    titolo: Cosa ho imparato
    righe:
      - "Shopify funziona anche per chi non vende in serie, ma va deciso all'inizio, non aggiustato dopo."
      - "Chi carica i prodotti dal telefono ha poco tempo. Ogni campo in più nella scheda prima o poi resta vuoto, quindi i campi devono essere pochi."
      - "Con la scritta “esaurito” il cliente se ne va. Con “Venduto, richiedine uno simile” può fare una richiesta al laboratorio."
  - id: negozio-vero
    titolo: Nel negozio vero farei
    righe:
      - "Partirei da un dev store Shopify gratuito. I tre stati li salverei in un metafield, cioè un campo in più nella scheda prodotto, e il codice del tema sarebbe pubblico su GitHub."
---
