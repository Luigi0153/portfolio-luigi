# FASE LOGHI — Sezione "Loghi e rebranding"

> Da aggiungere in fondo a MASTER_PROMPT.md. Incollare in Claude Code solo il blocco "PROMPT".

## Obiettivo

Una pagina /loghi con i marchi disegnati da Luigi: quelli nati nei progetti, i loghi creati da zero come esercizio, i rebranding e le esplorazioni su marchi famosi. Serve a mostrare la mano da designer, accanto ai case study.

## I tipi di lavoro

Ogni logo ha un'etichetta che dice cos'è, sempre visibile:
- **Progetto**: nato in un case study del portfolio (Fornace Vietri, Vico Stretto, Boutique, il logo personale).
- **Esercizio**: logo creato da zero per un'attività inventata.
- **Rebranding**: nuova versione di un marchio esistente, con prima e dopo.
- **Esplorazione**: rilettura di un marchio famoso come esercizio di stile.

Regola fissa per Rebranding ed Esplorazione di marchi esistenti: sotto il lavoro compare sempre la frase "Esercizio di stile. Non affiliato ai marchi citati, nessun uso commerciale." Nessun marchio famoso compare nella griglia progetti o viene presentato come cliente.

## I formati di presentazione

1. **Riquadro in griglia**: il logo su un riquadro quadrato del suo colore di fondo. Al passaggio del mouse, o sempre visibili su telefono, nome e tipo.
2. **Prima e dopo**: il marchio originale sopra, il nuovo sotto, divisi da una linea con le parole PRIMA e DOPO. Per i rebranding.
3. **Logo e applicazioni**: il marchio grande su un campo di colore, e sotto due o tre foto con il marchio applicato (insegna, busta, packaging, abbigliamento). Le foto si generano in Gemini senza scritte e il logo si sovrappone dopo, come fatto per il packaging del caso reale.
4. **Dallo schizzo al finale**: la bozza a mano accanto alla versione definitiva, con una freccia.

## Il contenuto

Collection "loghi", un file per logo, con: nome, tipo (progetto | esercizio | rebranding | esplorazione), stile (per i filtri), colore di fondo del riquadro, immagine principale, e facoltativi: prima, schizzo, applicazioni (lista di immagini), testo breve, collegamento al case study.

I filtri si generano dagli stili effettivamente usati, non da una lista fissa. Primo set proposto: Serif, Script, Monogramma, Geometrico, Sigillo, Bubbly.

## Materiale di partenza

Quattro loghi già pronti, in src/assets/loghi/, PNG con sfondo trasparente:
- luigi-romano.png — tipo Progetto, stile Geometrico, fondo crema del sito.
- fornace-vietri.png — tipo Progetto, stile Serif, fondo #F3EEE4, collega a /progetti/fornace-vietri.
- vico-stretto.png — tipo Progetto, stile Sigillo, fondo #EEECE7, collega a /progetti/pizzeria.
- boutique.png — tipo Progetto, stile Monogramma, fondo #F5F2EC, collega al caso reale.

---

## PROMPT

```
Crea la sezione loghi del portfolio secondo docs/FASE_LOGHI.md (leggilo tutto prima di iniziare).

1. Content collection "loghi" con lo schema descritto nel documento. Crea le quattro voci di partenza con le immagini in src/assets/loghi/.
2. Pagina /loghi: titolo, una riga di introduzione, filtri per stile come pillole (stesso stile dei tag del sito), griglia di riquadri quadrati: 2 colonne su telefono, 4 da 1024px. Il filtro funziona anche senza JavaScript mostrando tutto, e con JavaScript filtra senza ricaricare. Filtri accessibili da tastiera, con aria-pressed.
3. Ogni riquadro apre il dettaglio del logo in una pagina /loghi/[slug], che mostra i formati disponibili per quel logo: logo grande, prima e dopo, applicazioni, schizzo. Se un formato non ha immagini, non compare.
4. Etichetta del tipo sempre visibile. Per i tipi Rebranding ed Esplorazione, la frase fissa di non affiliazione sotto il lavoro, sia nel riquadro che nel dettaglio.
5. In home, dopo la griglia progetti, una striscia "Loghi" con i primi quattro riquadri e il link "Vedi tutti i loghi". Niente voce nuova nella navbar: resta a tre voci. Aggiungi /loghi nel footer.
6. Testi secondo la regola 5 di CLAUDE.md. Immagini con <Image> di Astro, alt con nome e tipo.
7. Test: la pagina carica, i filtri filtrano, la frase di non affiliazione compare dove deve, nessun overflow a 390 e 1280. Aggiorna docs/STATO.md.
Build, test sulla build di preview, commit. Non pushare.
```

## Dopo il prompt: come aggiungere un logo

1. Esporta il logo in PNG con sfondo trasparente, almeno 1200 px sul lato lungo, o in SVG.
2. Mettilo in src/assets/loghi/.
3. A Claude Code: "Aggiungi un logo alla collection loghi: nome …, tipo …, stile …, fondo …" e, se ci sono, le immagini di prima e dopo, schizzo o applicazioni.
