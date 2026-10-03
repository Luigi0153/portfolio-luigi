# Caso reale (anonimizzato) — "Boutique di accessori, Sud Italia"

Nome pubblico: "Boutique di borse e accessori, Campania" (mai il nome vero, logo sfocato negli screenshot).
Ruolo: gestione continuativa dello store Shopify — catalogo, tema, analisi dati, decisioni di priorità.
Lente del portfolio: "una decisione che posso difendere".

Regole sui dati: niente fatturato in euro, niente nome dello store, dominio o marchi dello store.
Si mostra la crescita della conversione, non il valore assoluto. Le visite sono calate e va detto.
Mai scrivere che gli interventi hanno causato la crescita: si dice cosa è successo nei mesi in cui
sono stati fatti.

## Contesto (dati reali, periodo giugno–settembre 2026, aggiornati il 2026-10-03)
- Store nato ad aprile 2026, ordini significativi da giugno. Il periodo dei dati è da giugno a settembre 2026: quattro mesi.
- Conversione del sito: da 0,19% a 0,50%, circa 2,6 volte. Per mese: giugno 0,19%, luglio 0,35%, agosto 0,36%, settembre 0,50%.
- Visite mensili: circa dimezzate, da circa 3.650 a circa 1.800. Gli acquisti per visita sono aumentati su un traffico più piccolo.
- Valore medio dell'ordine: +37%.
- Mobile: 93% delle visite e 93% degli acquisti.
- Canali: 66% sito, 30% TikTok, 4% app Shop. (Il dato non dice se sono ordini o fatturato: nel sito si scrive "vendite".)
- Categorie: borse e zaini insieme fanno oltre l'80% del fatturato. In pratica è un negozio di borse e zaini, non "borse + abbigliamento + accessori".
- Pubblico: donne, il 59% tra i 35 e i 54 anni (statistiche Instagram del negozio, luglio 2026: sono i follower, non le clienti verificate).
- Funnel, totali giugno–settembre 2026, solo sito: 12.025 visite → 511 aggiungono al carrello (4,25% delle visite) → 391 arrivano al checkout (76,5% di chi ha aggiunto) → 39 completano l'ordine (10,0% di chi è arrivato al checkout).
- A luglio il 15,8% del fatturato aveva `product_type` vuoto: rompeva report e collezioni smart. Già sistemato. Nel sito si scrive sempre "a luglio".

## Cosa non c'è più (superato il 2026-10-03)
Il confronto giugno → luglio (ordini 19 → 31, +63%; fatturato +86%; scontrino medio €56 → €64, +14%), il 94% di traffico da mobile, il 68% di borse sul fatturato e il funnel di luglio (4.233 sessioni, 4,04%, 82,5%, 10,6%). Il sito non li usa più.

## Cosa mostrare
1. Grafico della conversione mensile, giugno–settembre (4 barre).
2. Funnel a 4 passi con i totali del periodo.
3. Tre numeri: conversione 2,6 volte, valore medio ordine +37%, 93% da mobile.
4. Prima/dopo della scheda prodotto mobile (wireframe → mockup).
5. Le immagini `caso-riepilogo` (desktop e mobile) sono fuori dalla pagina finché non vengono rifatte coi dati nuovi: i file restano in `src/assets/progetti/caso-reale/`.

## La decisione
Tentazione: rifare palette, font, homepage ("il sito è brutto").
Dati: il problema non è estetico. Solo 4 persone su 100 mettono qualcosa nel carrello (scheda prodotto mobile), e di chi arriva al checkout ne completa 1 su 10 (il collo di bottiglia è dentro il checkout, non prima).
Scelta: congelare il redesign estetico, lavorare in ordine su (1) scheda prodotto mobile, (2) checkout testato con ordini reali da telefono, (3) igiene del catalogo. La palette viene dopo.

## Risultato (come va scritto)
Nei mesi in cui ho fatto questi interventi, la conversione del sito è passata da 0,19% a 0,50%, circa 2,6 volte. Le visite sono calate, da circa 3.650 a circa 1.800 al mese: gli acquisti sono cresciuti su un traffico più piccolo. Il valore medio dell'ordine è salito del 37%. Non posso dire quanto sia merito degli interventi: lo store è giovane e nello stesso periodo è cambiato anche il traffico.

## Il passo successivo
Molti arrivano al checkout, ma pochi completano l'acquisto. Da qui la proposta, in due fasi (Fase 1 correzioni alla scheda prodotto, Fase 2 nuova identità), che resta una proposta e non un lavoro consegnato.

## Cosa ho imparato (max 3 righe nel sito)
- Per uno store di quattro mesi il termine di paragone è il mese precedente, non la media Shopify.
- Mai concludere da un segmento con meno di 30 conversioni.
- Il traffico social in-app non viene tracciato bene: i tassi sono un pavimento, non una misura.

## Microcopy proposto
Titolo: "Non ho rifatto il sito. Ho letto i numeri."
Tag: Shopify · Analytics · Catalogo · Mobile
