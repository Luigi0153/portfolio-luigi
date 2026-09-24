# Pizzeria Vico Stretto — concept

> Progetto concept: la pizzeria è inventata, il problema è comune a tante pizzerie di quartiere.
> Nessun numero inventato: niente prenotazioni, percentuali o clienti.
> Il valore del case study sta nel flusso e nelle scelte, non nei risultati.
> I testi pubblicati sono in `src/content/progetti/pizzeria.md`, riscritti da questa
> bozza secondo la regola 5 di `CLAUDE.md` (frasi dirette, niente metafore).
> La verifica del nome "Vico Stretto" è tra le decisioni aperte di `docs/STATO.md`.

Lente del portfolio: un flusso.
Tag: Landing page · Prenotazioni · Mobile · Instagram

Riga sotto il titolo: "Progetto concept. La pizzeria e la sua storia sono inventate, il problema è reale. Le foto sono generate con l'AI."

## Decisioni prese

- **Prenotazione:** passa da WhatsApp con un messaggio già scritto, non da un modulo con conferma via email.
- **Foto della pizza e del locale:** realistiche, generate con l'AI per il concept.
- **Mockup:** immagini statiche, non un prototipo navigabile.

---

## La pizzeria

Una pizzeria napoletana di quartiere, forno a legna, una sala da quaranta coperti. Lavora molto con Instagram: i reel delle pizze girano, la gente scrive in direct per chiedere se c'è posto.

## Il problema

Le prenotazioni arrivano da tutte le parti: messaggi Instagram, telefonate in pieno servizio, WhatsApp. Chi risponde è lo stesso che sta al banco. Molte richieste restano senza risposta, altre si perdono.

Chi vede un reel e vuole prenotare deve uscire da Instagram, cercare il numero, chiamare o scrivere, e aspettare. Troppi passaggi per una decisione presa d'impulso.

## I vincoli

- Chi prenota arriva quasi sempre dal telefono, da un link nella bio di Instagram.
- La pizzeria non vuole portali che trattengono una commissione su ogni coperto.
- Chi lavora in sala non ha tempo di gestire un gestionale complicato.
- Il menu oggi è un PDF, che dal telefono si legge male.

## Il flusso

Dal reel alla prenotazione in tre tocchi:

1. Tocco sul link nella bio di Instagram: si apre la landing.
2. Tocco su "Prenota un tavolo": si scelgono giorno, orario e numero di persone.
3. Tocco su "Invia": si apre WhatsApp con il messaggio già scritto. La pizzeria conferma con una risposta.

## La decisione

La prenotazione passa da WhatsApp con un messaggio precompilato, non da un portale né da un gestionale.

Perché: la pizzeria usa già WhatsApp tutto il giorno, non paga commissioni, e il cliente riceve la conferma da una persona. Il messaggio arriva ordinato, con giorno, ora e persone sempre nello stesso formato, quindi rispondere richiede pochi secondi.

Il rischio: senza un sistema automatico, due persone potrebbero chiedere l'ultimo tavolo nello stesso momento. Si accetta, perché la conferma la dà sempre la pizzeria.

## Cosa ho tolto

- Il menu di navigazione: la pagina ha un solo obiettivo, far prenotare.
- Il menu in PDF: sostituito da un menu leggibile dal telefono, con le pizze principali e i prezzi.
- Il widget del portale di prenotazione, con la sua commissione.
- La galleria di foto infinita: bastano tre immagini, il resto lo fa Instagram.

## La pagina

Una sola pagina, pensata per il telefono:

1. In alto: nome, una foto della pizza, una riga su chi sono, e il bottone "Prenota un tavolo".
2. Il menu: le pizze principali con prezzo, leggibili senza zoom.
3. Orari, indirizzo con mappa, e il bottone per chiamare, sempre a portata di pollice.
4. Il bottone "Prenota" resta fisso in basso mentre si scorre.

## Immagini

In `src/assets/progetti/pizzeria-vico-stretto/`, foto realistiche generate con l'AI, mockup statici:

- `pizzeria-copertina` — cover nella griglia progetti e in cima alla pagina; anche og-image.
- `pizzeria-brand` — tavola del brand (logo, colori, caratteri, foto, menu), dopo "La pizzeria".
- `pizzeria-flusso` — il percorso prima (cinque passaggi) e dopo (tre tocchi), dentro "Il flusso". Sotto i 768px la versione in colonna `pizzeria-flusso-mobile`, stesso alt.
- Tre schermate mobile in galleria dentro "La pagina":
  1. `pizzeria-landing` — la pagina completa su telefono.
  2. `pizzeria-prenota` — il pannello di scelta di giorno, orario e persone.
  3. `pizzeria-messaggio` — il messaggio WhatsApp già scritto, con la risposta della pizzeria.

## Cosa ho imparato

- Il percorso più corto passa dagli strumenti che il cliente usa già.
- Ogni pagina con più di un obiettivo finisce per non raggiungerne nessuno.
- Una conferma data da una persona vale più di una conferma automatica, per un locale di quartiere.

## Nel locale vero farei

Mettere in bio il link alla landing, misurare quante persone arrivano al messaggio WhatsApp e quante prenotazioni vengono confermate, e rivedere il flusso dopo un mese di dati veri.
