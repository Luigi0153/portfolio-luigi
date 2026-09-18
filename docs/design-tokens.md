# Design Tokens — "Retro-Bauhaus"

Mood: retro-tech caldo come base, accenti pop Bauhaus. Mai bianco puro, mai grigio freddo.

## Colori (definiscili in `src/styles/tokens.css` con @theme di Tailwind v4)

| Token | Hex | Uso |
|---|---|---|
| --color-cream | #fdf4e4 | sfondo pagina |
| --color-cream-2 | #f6e9d2 | card, superfici secondarie |
| --color-ink | #1a1a1a | testo principale, bordi forti |
| --color-ink-2 | #4a4540 | testo secondario |
| --color-verde | #399f80 | colore dominante, sezioni, link |
| --color-verde-deep | #2a7a62 | hover del verde |
| --color-arancio | #c93c00 | CTA primaria, hover, sottolineature |
| --color-blu | #0270c0 | solo percorso "sviluppatore", codice, badge tech |
| --color-giallo | #fedf3e | forme Bauhaus, evidenziazioni, max 5% della pagina |
| --color-rosso | #e4091e | solo nelle grafiche dei concept (mai nella UI) |

Dark mode: NON prevista al lancio.

## Tipografia (Google Fonts, self-hosted via @fontsource)
- Display / titoli: **Fraunces** variable, opsz 72, wght 500-700, asse SOFT 50. Tracking -0.02em.
- Testo / UI: **Hanken Grotesk** 400/500/600. Line-height 1.55 corpo, 1.2 titoli.
- Mono / etichette tech: **JetBrains Mono** 400, uppercase, tracking 0.08em, size 12-13px.

Scala (mobile → desktop, usa clamp):
- h1: clamp(2.75rem, 8vw, 6.5rem)
- h2: clamp(2rem, 4.5vw, 3.5rem)
- h3: clamp(1.375rem, 2.5vw, 1.75rem)
- body: 1rem / 1.125rem desktop
- label: 0.8125rem mono

## Spaziatura e forme
- Griglia: container max 1200px, gutter 20px mobile / 40px desktop.
- Sezioni: padding-block 80px mobile / 140px desktop.
- Raggio: card 20px, bottoni 999px (pill), immagini 12px.
- Bordo "retro": 2px solid var(--color-ink) sulle card principali, ombra dura 4px 4px 0 var(--color-ink) sull'hover. L'ombra dura è **solo delle Card**: mai sui bottoni.
- Forme Bauhaus decorative: cerchio, semicerchio, quarto di cerchio, barra. Solo giallo/arancio/blu, opacità 1, mai sfumature.

## Motion (GSAP)
- Durata base 0.6s, ease "power3.out". Stagger 0.08s.
- Entrate: fade + translateY 24px. Niente bounce, niente scale > 1.05.
- Forme Bauhaus: rotazione lenta continua (60s) + parallax leggero su scroll (max 40px).
- Hero 3D: rotazione idle 0.15 rad/s, segue il mouse con lerp 0.05; su touch solo idle. Con `prefers-reduced-motion`: immagine statica png al posto del canvas.
- ScrollTrigger sui case study: pin della colonna sinistra (titolo + tags) mentre scorrono le immagini.

## Bottoni — stati
- Niente ombra dura e niente traslazioni: forma, dimensioni e posizione non cambiano mai in nessuno stato.
- **Hover**: riempimento che scorre da sinistra a destra in 0.25s ease power-out (`var(--ease-brand)`). Realizzato con `::before` in `position: absolute; inset: 0`, da `scaleX(0)` con `transform-origin: left` a `scaleX(1)`. Il contenuto del bottone sta sopra con z-index. Si anima solo `transform`, mai `width`.
  - primary: base arancio con testo cream → riempimento ink con testo cream.
  - secondary (outline ink): base trasparente con testo ink → riempimento ink con testo cream.
  - ghost: base trasparente con testo ink → riempimento cream-2 con testo ink.
- **Active**: `scaleX(1)` immediato, nessun rimbalzo.
- **Focus**: solo `:focus-visible` (mai `:focus`): outline 2px solid ink, outline-offset 3px, simmetrico su tutto il perimetro.
- Gli stili hover vivono dentro `@media (hover: hover)`: su touch il riempimento non resta attaccato dopo il tap. Il body ha `-webkit-tap-highlight-color: transparent`.
- Con `prefers-reduced-motion`: niente scorrimento, cambio colore istantaneo.

## Componenti da definire (con stati default / hover / focus / active / disabled)
Button (primary arancio, secondary outline ink, ghost), Tag mono, Card progetto, Switch target (hero), Nav sticky con indicatore verde, Section header (label mono + h2 Fraunces), Before/After slider, Stat tile (numero Fraunces + label mono), Footer con "visitor book" (prima versione: solo link mailto e social).
