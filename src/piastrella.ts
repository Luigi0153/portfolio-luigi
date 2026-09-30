/**
 * Piastrella Bauhaus che si costruisce: un quadrato diviso in tanti pezzi
 * quante sono le righe di una lista. La riga 1 mostra il primo pezzo, la riga
 * 2 i primi due, e così via: l'ultima mostra la figura completa.
 *
 * Il quadrato si divide in modo ricorsivo, sempre lungo il lato più lungo e in
 * proporzione ai pezzi di ciascuna parte, così le celle hanno tutte la stessa
 * area con qualsiasi numero di pezzi. Il pezzo di ogni cella è una delle forme
 * del marchio (quarto di cerchio, cerchio, quadrato, triangolo, barra), in
 * quest'ordine e poi da capo. Le celle sono numerate in ordine di lettura.
 *
 * Il risultato sono solo stringhe `d` per un <path>, in un viewBox 0 0 100 100:
 * la figura ha sempre la stessa dimensione e i pezzi restano allineati tra
 * una riga e l'altra.
 */

const FORME = ["quarto", "cerchio", "quadrato", "triangolo", "barra"] as const;
type Forma = (typeof FORME)[number];

interface Cella {
  x: number;
  y: number;
  w: number;
  h: number;
}

const LATO = 100;
/** Margine da ogni lato della cella: tra due pezzi restano il doppio. */
const MARGINE = 2.5;

function dividi(c: Cella, n: number): Cella[] {
  if (n <= 1) return [c];
  const a = Math.ceil(n / 2);
  const parte = a / n;
  if (c.w >= c.h) {
    const wa = c.w * parte;
    return [
      ...dividi({ ...c, w: wa }, a),
      ...dividi({ ...c, x: c.x + wa, w: c.w - wa }, n - a),
    ];
  }
  const ha = c.h * parte;
  return [
    ...dividi({ ...c, h: ha }, a),
    ...dividi({ ...c, y: c.y + ha, h: c.h - ha }, n - a),
  ];
}

/** Arrotonda per non far dipendere l'ordine di lettura dai decimali. */
const r = (v: number) => Math.round(v * 100) / 100;

function pezzo(forma: Forma, c: Cella): string {
  const x = c.x + MARGINE;
  const y = c.y + MARGINE;
  const w = c.w - MARGINE * 2;
  const h = c.h - MARGINE * 2;
  const m = Math.min(w, h);

  switch (forma) {
    case "cerchio": {
      const raggio = m / 2;
      const cx = x + w / 2;
      const cy = y + h / 2;
      return `M${r(cx - raggio)} ${r(cy)}a${r(raggio)} ${r(raggio)} 0 1 0 ${r(raggio * 2)} 0a${r(raggio)} ${r(raggio)} 0 1 0 ${r(-raggio * 2)} 0Z`;
    }
    case "quadrato": {
      const x0 = x + (w - m) / 2;
      const y0 = y + (h - m) / 2;
      return `M${r(x0)} ${r(y0)}h${r(m)}v${r(m)}h${r(-m)}Z`;
    }
    case "triangolo":
      return `M${r(x + w / 2)} ${r(y)}L${r(x + w)} ${r(y + h)}H${r(x)}Z`;
    case "barra": {
      // Una pillola, orizzontale nelle celle larghe e verticale in quelle alte.
      const t = m * 0.4;
      const k = t / 2;
      if (w >= h) {
        const y0 = y + (h - t) / 2;
        return `M${r(x + k)} ${r(y0)}H${r(x + w - k)}A${r(k)} ${r(k)} 0 0 1 ${r(x + w - k)} ${r(y0 + t)}H${r(x + k)}A${r(k)} ${r(k)} 0 0 1 ${r(x + k)} ${r(y0)}Z`;
      }
      const x0 = x + (w - t) / 2;
      return `M${r(x0)} ${r(y + k)}A${r(k)} ${r(k)} 0 0 1 ${r(x0 + t)} ${r(y + k)}V${r(y + h - k)}A${r(k)} ${r(k)} 0 0 1 ${r(x0)} ${r(y + h - k)}Z`;
    }
    case "quarto": {
      // Centro nell'angolo più lontano dal centro della piastrella, così
      // l'arco guarda verso l'interno della figura.
      const sinistra = c.x + c.w / 2 <= LATO / 2;
      const sopra = c.y + c.h / 2 <= LATO / 2;
      const dx = sinistra ? 1 : -1;
      const dy = sopra ? 1 : -1;
      const ax = sinistra ? x : x + w;
      const ay = sopra ? y : y + h;
      const giro = dx * dy > 0 ? 1 : 0;
      return `M${r(ax)} ${r(ay)}H${r(ax + dx * m)}A${r(m)} ${r(m)} 0 0 ${giro} ${r(ax)} ${r(ay + dy * m)}Z`;
    }
  }
}

/** I `d` dei `n` pezzi, nell'ordine in cui compaiono. */
export function piastrella(n: number): string[] {
  const celle = dividi({ x: 0, y: 0, w: LATO, h: LATO }, n).toSorted(
    (a, b) => Math.round(a.y * 10) - Math.round(b.y * 10) || a.x - b.x,
  );
  return celle.map((cella, i) => pezzo(FORME[i % FORME.length], cella));
}
