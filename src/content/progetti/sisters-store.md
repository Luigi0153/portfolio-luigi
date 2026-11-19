---
# I numeri vengono da docs/content/caso-reale.md e sono la fase 1, da giugno a settembre 2026,
# prima del sito nuovo. Il periodo è sempre scritto accanto ai numeri.
# [DA CONFRONTARE A DICEMBRE] a metà dicembre si aggiungono i numeri del sito nuovo (online dall'11
# novembre 2026), senza sostituire quelli della fase 1: cerca questa sigla nel repo per trovarli tutti.
titolo: "Creazione e rebranding"
slug: sisters-store
# il nome del negozio sta nel campo tipo: si legge sopra il titolo, prima della lente
tipo: "Sisters Store"
sito:
  testo: sistersstore.it
  url: https://sistersstore.it
lente: decisione
target: both
tags:
  - Shopify
  - Analytics
  - Catalogo
  - Mobile
cover: ../../assets/progetti/sisters-store/sisters-copertina.jpg
coverAlt: "Il logo di Sisters Store, il monogramma SS e il nome, su una foto di notte sfocata. Davanti un computer e un telefono con la home del negozio: una ragazza con gli occhiali da sole in una strada di notte, il titolo Autunno 2026 e i bottoni Novità donna e Novità uomo. Sul telefono, sotto, Da non perdere ora con una borsa e uno zaino."
# l'og è un JPEG: la copertina è una foto (scripts/prepara-og.mjs)
og: jpg
# [DA CONFRONTARE A DICEMBRE] sommario_business e sintesi_business
sommario: "Sisters Store, borse, zaini e abbigliamento di marca. Prima i dati e quattro interventi su Shopify, poi il sito nuovo, online dall'11 novembre 2026."
sommario_business: "Sisters Store, borse e zaini. Da giugno a settembre 2026 la conversione del sito è passata da 0,19% a 0,50%. Poi il sito nuovo, online dall'11 novembre."
sintesi_business:
  testo: "Da giugno a settembre 2026, prima del sito nuovo, la conversione del sito è passata da 0,19% a 0,50%, circa 2,6 volte, mentre le visite sono calate."
  capitolo: risultato
  link: "Vai al risultato"
ordine_dev: 1
ordine_business: 1
capitoli:
  - id: contesto
    titolo: Contesto
    # [DA CONFRONTARE A DICEMBRE] righe 2 e 3
    righe:
      - "Sisters Store vende borse, zaini e abbigliamento di marca su sistersstore.it. Il negozio è aperto da aprile 2026, gli ordini veri arrivano da giugno."
      - "Da giugno a settembre 2026 il 93% delle visite e il 93% degli acquisti arrivano dal telefono. Le vendite vengono per il 66% dal sito, per il 30% da TikTok e per il 4% dall'app Shop."
      - "Nello stesso periodo borse e zaini fanno insieme oltre l'80% del fatturato: un negozio di borse e zaini, con abbigliamento e accessori intorno."
    dati:
      - statistiche
      - ramp
  - id: decisione
    titolo: Decisione
    # [DA CONFRONTARE A DICEMBRE] riga 2
    righe:
      - "La tentazione era rifare palette, font e homepage, perché il sito non convinceva a livello estetico."
      - "I dati dicevano altro: da giugno a settembre 2026 solo 4 persone su 100 aggiungono al carrello, e di chi arriva al checkout ne completa 1 su 10."
      - "Redesign in pausa, e tre priorità in ordine: scheda prodotto mobile, checkout provato con ordini veri dal telefono, catalogo pulito."
    dati:
      - funnel
  - id: fatto
    titolo: Cosa ho fatto nella fase 1
    righe:
      - "Prima del sito nuovo, sul negozio ho fatto quattro interventi."
    elenco:
      voci:
        - "L'aggiunta rapida al carrello nelle card, senza aprire la scheda prodotto e con la scelta della taglia quando serve. L'ho scritta in codice con Claude Code."
        - "Il badge ESAURITO. I pezzi finiti restano visibili e il bottone si disattiva."
        - "I testi su spedizioni e resi, che mancavano. Oggi stanno nel footer."
        - "Le categorie del catalogo sistemate, perché rompevano report e collezioni."
  - id: risultato
    titolo: Il risultato della fase 1
    # [DA CONFRONTARE A DICEMBRE] righe 1 e 2
    righe:
      - "Da giugno a settembre 2026, nei mesi in cui ho fatto questi interventi, la conversione del sito è passata da 0,19% a 0,50%, circa 2,6 volte, e il valore medio dell'ordine è salito del 37%."
      - "Le visite sono calate, da circa 3.650 a circa 1.800 al mese: gli acquisti sono cresciuti su un traffico più piccolo. Non posso dire quanto sia merito degli interventi: lo store è giovane e nello stesso periodo è cambiato anche il traffico."
      - "A luglio il 15,8% del fatturato aveva il product_type vuoto e rompeva report e collezioni smart. Ora è a posto."
  - id: sito-nuovo
    titolo: Il sito nuovo
    righe:
      - "A ottobre ho rifatto il sito, che è online dall'11 novembre 2026. Ho cambiato quello che pesava sugli acquisti dal telefono: scheda prodotto, collezioni e menu. Poi l'identità, con un logo nuovo e un solo colore d'accento."
      - "Le schermate di prima vengono dal tema vecchio, aperto oggi in anteprima. Il tema è quello vecchio, i prodotti sono quelli di oggi."
    sottosezioni:
      - titolo: La home
        righe:
          - "Prima in cima c'era una foto con la scritta L'essenza delle tendenze e un solo bottone verso il catalogo, poi sei riquadri per categoria."
          - "Ora i due bottoni in cima portano alle novità per donna e per uomo. Sotto ci sono borse e zaini di stagione, poi prodotti originali, spedizione, reso entro 14 giorni e pagamenti sicuri, e gli ultimi arrivi con lo sconto in percentuale."
        dati:
          - before-after-home
        immagini:
          - galleria:
              - etichetta: Prima
                src: ../../assets/progetti/sisters-store/sisters-prima-home.jpg
                alt: "La home di prima, su telefono. La striscia Invita un amico per maggiori sconti, il logo corsivo, una foto di una donna con una giacca nera e una borsa color cuoio con la scritta L'essenza delle tendenze e il bottone Vai al catalogo. Sotto Ultime tendenze, sei riquadri con foto e i nomi Uomo, Donna, Calzature, Zaini, Borse e Promo, poi l'inizio delle Novità."
              - etichetta: Dopo
                src: ../../assets/progetti/sisters-store/sisters-dopo-home.jpg
                alt: "La home di oggi, su telefono. La striscia Spedizione in Italia 4,95 euro, gratis da 200 euro, il monogramma SS e una foto di notte con il titolo Autunno 2026 e i bottoni Novità donna e Novità uomo. Sotto Da non perdere ora, con una borsa e uno zaino su card rosa, poi quattro riquadri con Prodotti originali, la spedizione, Reso entro 14 giorni e Pagamenti sicuri. Poi Appena arrivati con le schede Donna e Uomo e i prodotti con lo sconto del 20% e il bottone più."
      - titolo: La scheda prodotto
        righe:
          - "Prima, aprendo la scheda dal telefono, il bottone per comprare non si vedeva nella prima schermata."
          - "Ora Aggiungi al carrello resta fisso in fondo allo schermo, con la chat accanto. Sotto il bottone ci sono spedizione, reso e pagamento sicuro."
          - "Il marchio sta sopra il nome, lo sconto è in percentuale e i dettagli del prodotto sono già aperti."
        dati:
          - before-after
      - titolo: Le collezioni
        righe:
          - "Prima i filtri stavano in sottomenu da aprire uno per uno. Ora sono tutti in un pannello solo, già aperti, con categoria, prezzo, disponibilità, marchio, taglia e genere."
          - "Nelle card il marchio sta sopra un nome più corto, lo sconto è in percentuale sulla foto e il bottone con il più aggiunge al carrello. Al posto delle pagine numerate c'è Mostra altri prodotti, e i pezzi esauriti restano visibili ma attenuati."
        immagini:
          - galleria:
              - etichetta: Prima
                src: ../../assets/progetti/sisters-store/sisters-prima-collezione.jpg
                alt: "La collezione Borse di prima, su telefono. Il titolo Borse in maiuscolo a sinistra, una riga di descrizione, Filtra e ordina e 113 prodotti. Le card hanno i nomi in maiuscolo su tre righe, come Borsa Saint Barth - Colette Wax dark leopard, il prezzo barrato e quello scontato con EUR, e sotto ogni card il bottone Scegli taglia."
              - etichetta: Prima, i filtri
                src: ../../assets/progetti/sisters-store/sisters-prima-filtri.jpg
                alt: "Il pannello Filtra e ordina di prima, su telefono. Quattro voci con una freccia, Disponibilità, Prezzo, Marchio e Categoria, ognuna da aprire a parte, e l'ordinamento. In fondo Rimuovi tutto e Applica."
              - etichetta: Dopo
                src: ../../assets/progetti/sisters-store/sisters-dopo-collezione.jpg
                alt: "La collezione Borse di oggi, su telefono. Il titolo Borse in Playfair al centro, la descrizione, Filtra e ordina e 113 prodotti. Le card hanno l'etichetta viola meno 20% sulla foto, un bottone tondo con il più, il marchio Saint Barth sopra un nome più corto, come Borsa Colette Wax dark leopard, e il prezzo scontato accanto a quello barrato."
              - etichetta: Dopo, i filtri
                src: ../../assets/progetti/sisters-store/sisters-dopo-filtri.jpg
                alt: "Il pannello Filtra e ordina di oggi, su telefono. Tutti i filtri sono già aperti uno sotto l'altro, con il numero di prodotti accanto a ogni scelta: Disponibilità, Prezzo con i campi Da e A, Marchio con Lacoste, Saint Barth e Sprayground, Categoria con Borse, Borsello e Pochette. In fondo Rimuovi tutto e Applica."
      - titolo: L'identità
        righe:
          - "Il logo è un monogramma con due S, una nera e una corsiva viola. Il viola è uno solo, quello del logo, e serve per sconti e promozioni."
          - "I titoli sono in Playfair Display, i testi in Poppins; il Montserrat resta nel nome del logo, nell'hero e nei numeri."
  - id: imparato
    titolo: Cosa ho imparato
    # [DA CONFRONTARE A DICEMBRE] riga 1, "quattro mesi"
    righe:
      - "Per uno store di quattro mesi il termine di paragone è il mese precedente, non la media Shopify."
      - "Mai concludere niente da un segmento con meno di 30 conversioni."
      - "Il traffico social in-app sfugge in parte al tracciamento: i numeri qui sono minimi, non definitivi."
---
