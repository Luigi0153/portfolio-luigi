# Passata prestazioni: misure e proposte

> Data: 29 settembre 2026. Misure di Claude Code, nessuna modifica applicata al repository.

Su mobile quattro pagine su cinque superano 90. Il caso reale è a 84, e la colpa è uno spostamento di layout (CLS 0,203), non il peso. Su desktop tutte le pagine sono a 100.

## Condizioni di misura

- Lighthouse 12, preset mobile e desktop, sulla build di preview rifatta dall'ultimo commit (0ac1b8a).
- 3 run per pagina, in sequenza. Riportata la mediana di ogni valore.
- La home è misurata nel percorso sviluppatore, perché Lighthouse parte senza una scelta salvata.

## 1. Punteggi

| Pagina | Mobile (3 run) | LCP | CLS | TBT | Peso | Desktop | LCP | CLS | Peso |
|---|---|---|---|---|---|---|---|---|---|
| Home | 94 (96/94/94) | 2,71 s | 0,000 | 47 ms | 473 KB | 100 | 0,55 s | 0,001 | 503 KB |
| Caso reale | 84 (84/85/81) | 2,88 s | 0,203 | 58 ms | 422 KB | 100 | 0,65 s | 0,003 | 435 KB |
| Fornace Vietri | 96 (95/98/96) | 2,54 s | 0,000 | 106 ms | 541 KB | 100 | 0,62 s | 0,000 | 418 KB |
| Pizzeria | 96 (96/96/96) | 2,36 s | 0,000 | 127 ms | 274 KB | 100 | 0,56 s | 0,000 | 331 KB |
| /loghi | 97 (97/97/97) | 1,97 s | 0,085 | 65 ms | 168 KB | 100 | 0,42 s | 0,035 | 145 KB |

Il TBT su desktop è 0-2 ms su tutte le pagine. La varianza è stata bassa: al massimo 4 punti tra le run della stessa pagina.

### Da cosa vengono i due spostamenti

Riprodotti con Playwright, causa trovata per entrambi.

**Caso reale, 0,203.** I quattro tag sotto il titolo stanno su una riga con il font di riserva, Consolas. Quando arriva JetBrains Mono diventano più larghi, 344px → 362px, e MOBILE va a capo. Copertina e contenuto scendono di 36px. Ritardando un font alla volta si è verificato che dipende solo dal font mono. Consolas è il font di riserva di Windows: su Android, iOS e sui server di PageSpeed il mono di riserva è largo quasi come JetBrains Mono. Per i visitatori veri lo spostamento probabilmente non c'è, ma è quello che misura la regola 7.

**/loghi, 0,085.** La barra dei filtri parte nascosta e compare quando gira JavaScript: la griglia scende di 112px. Difetto introdotto con la sezione loghi.

### LCP su mobile

Il tempo si perde tutto nel ritardo di rendering, circa 2 secondi, mentre il download dell'immagine principale è quasi zero. In home l'elemento LCP è il titolo dell'hero. Le parole del titolo partono invisibili e compaiono con SplitText solo dopo che i font sono caricati. Causa probabile, non ancora isolata.

## 2. Le 10 risorse più pesanti

Byte trasferiti su mobile al caricamento di ogni pagina.

| # | Risorsa | Tipo | Peso | Pagina |
|---|---|---|---|---|
| 1 | fornace-home (galleria) | immagine | 114 KB | Fornace Vietri |
| 2 | caso-riepilogo-mobile | immagine | 113 KB | Caso reale |
| 3 | client.js (React DOM, per lo switch) | JS | 65 KB | Home |
| 4 | fornace-collezione (galleria) | immagine | 62 KB | Fornace Vietri |
| 5 | fornace-venduto (galleria) | immagine | 61 KB | Fornace Vietri |
| 6 | caso-fase1-scheda (slider) | immagine | 59 KB | Caso reale |
| 7 | pizzeria-flusso-mobile | immagine | 56 KB | Pizzeria |
| 8 | fornace-prodotto (galleria) | immagine | 54 KB | Fornace Vietri |
| 9 | caso-oggi-scheda (slider) | immagine | 51 KB | Caso reale |
| 10 | fornace-brand | immagine | 38 KB | Fornace Vietri |

Subito dopo vengono Fraunces (37 KB, su tutte le pagine) e gsap (27 KB, su tutte tranne /loghi). I quattro font insieme pesano circa 99 KB per pagina.

Due cose da notare:

- Le due immagini dello slider (righe 6 e 9) si scaricano subito anche se stanno in fondo alla pagina. Sono `<img>` dentro l'isola React, senza `loading="lazy"`.
- Fornace scarica tutta la galleria anche se è lontana dalla prima schermata. Su rete lenta Chromium anticipa il caricamento pigro di parecchio.

## 3. Interventi, in ordine di guadagno sul costo

1. **Filtri di /loghi visibili da subito.** La barra si mostra sempre e si nasconde solo senza JavaScript, con `<noscript><style>`. Il CLS di /loghi va da 0,085 a 0, per 10 minuti di lavoro. Il test "senza JavaScript i filtri non ci sono" resta valido.
2. **Font di riserva della stessa larghezza per il mono.** Un `@font-face` che usa `local("Consolas")` con `size-adjust` intorno al 109%, messo prima di Consolas nella lista dei font. Sugli altri sistemi Consolas non c'è e non cambia niente. Il CLS del caso reale dovrebbe andare da 0,203 a circa 0, e il punteggio mobile oltre 90. Circa 1 ora, compresa la verifica di etichette e tag in tutto il sito. Alternativa scartata: precaricare JetBrains Mono (una riga, ma su rete lenta non è garantito che arrivi prima del primo disegno, e aggiunge 21 KB in competizione con la copertina).
3. **Slider del caso reale con caricamento pigro.** `loading="lazy"` e `decoding="async"` sulle due `<img>` di `BeforeAfter.tsx`. 110 KB in meno al caricamento del caso reale, per 5 minuti.
4. **Dimensioni delle immagini più vicine a quelle mostrate.** Più larghezze per le versioni mobile delle figure (oggi c'è una sola versione da 780px), le larghezze per lo slider, una larghezza da 320 per i riquadri dei loghi. Circa 36 + 54 + 20 KB secondo Lighthouse, per circa 1 ora. Toglie peso ma non sposta il punteggio.
5. **CSS dentro l'HTML.** Con `inlineStylesheets: "always"` spariscono le due richieste CSS che bloccano il primo disegno (8+3 KB compressi). Lighthouse stima fino a circa 300 ms di LCP in meno su mobile. In cambio il CSS non resta in cache tra una pagina e l'altra. 5 minuti di config più le verifiche; prima va controllato il nome dell'opzione nella documentazione di Astro 7.
6. **Entrata del titolo dell'hero su telefono.** Sotto i 768px le parole potrebbero salire di 24px senza partire invisibili, oppure il titolo potrebbe non animarsi. Potrebbe togliere parecchio dall'LCP della home, ma è una scelta di design e va prima misurata con una prova. Circa 30 minuti.
7. **Switch senza React.** Punto 8 di `docs/AUDIT.md`: circa 65 KB di JavaScript in meno in home, di cui 36 KB segnati da Lighthouse come non usati. Circa 2 ore, compreso il rifacimento di test-switch. Il TBT è già basso (47 ms), quindi il guadagno di punteggio è piccolo. Lo slider del caso reale resterebbe React, ma si carica solo quando arriva in vista.
8. **Un peso di Hanken Grotesk in meno** (14 KB per pagina). Prima va verificato dove si usa il peso 500. Guadagno piccolo.

## Decisioni

- **Blocco A — da fare subito:** interventi 1, 2, 3.
- **Blocco B — dopo, con misura prima e dopo:** interventi 4 e 5. Regola per il 4: ogni larghezza resta almeno il doppio della larghezza mostrata.
- **Prova C:** intervento 6, da valutare guardando l'animazione sul telefono.
- **Rimandati:** interventi 7 e 8.