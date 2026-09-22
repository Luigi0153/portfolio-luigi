/*
  Genera favicon.ico (32x32) e apple-touch-icon.png (180x180) da
  public/favicon.svg.

  Fondo cream pieno e marchio rimpicciolito al centro: così le due icone
  raster si leggono sia nella scheda chiara sia in quella scura, dove l'SVG
  si arrangia da solo con prefers-color-scheme ma il PNG no. librsvg ignora
  quella media query, quindi il marchio esce sempre nella versione chiara
  (barra ink), che è quella giusta sul cream.

  sharp non scrive .ico: il PNG a 32px va dentro un contenitore ICO scritto
  a mano (header di 6 byte + una voce da 16 + il PNG così com'è), formato che
  i browser leggono tutti.

  Uso: node scripts/prepara-favicon.mjs   (rilanciare se cambia favicon.svg)
  Output: public/favicon.ico e public/apple-touch-icon.png
*/
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const CREAM = "#fdf4e4";
const svg = await readFile("public/favicon.svg");

/* lato: misura finale; marchio: lato del riquadro 100x100 dell'SVG, il cui
   disegno occupa già l'80% in altezza, quindi il margine vero è più ampio. */
async function icona(lato, marchio) {
  // L'SVG è 100x100 a 72 dpi: la densità lo rasterizza già grande, poi si scala
  const logo = await sharp(svg, { density: Math.ceil((72 * marchio * 4) / 100) })
    .resize(marchio, marchio)
    .png()
    .toBuffer();
  const bordo = Math.round((lato - marchio) / 2);
  return sharp({
    create: { width: lato, height: lato, channels: 4, background: CREAM },
  })
    .composite([{ input: logo, top: bordo, left: bordo }])
    .flatten({ background: CREAM })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function ico(png, lato) {
  const testa = Buffer.alloc(6);
  testa.writeUInt16LE(0, 0); // riservato
  testa.writeUInt16LE(1, 2); // tipo: icona
  testa.writeUInt16LE(1, 4); // una sola immagine
  const voce = Buffer.alloc(16);
  voce.writeUInt8(lato, 0); // larghezza
  voce.writeUInt8(lato, 1); // altezza
  voce.writeUInt8(0, 2); // niente palette
  voce.writeUInt8(0, 3); // riservato
  voce.writeUInt16LE(1, 4); // piani colore
  voce.writeUInt16LE(32, 6); // bit per pixel
  voce.writeUInt32LE(png.length, 8); // dimensione dati
  voce.writeUInt32LE(6 + 16, 12); // offset dei dati
  return Buffer.concat([testa, voce, png]);
}

const png32 = await icona(32, 28);
await writeFile("public/favicon.ico", ico(png32, 32));

const png180 = await icona(180, 140);
await writeFile("public/apple-touch-icon.png", png180);

console.log(`favicon.ico ${ico(png32, 32).length} B, apple-touch-icon.png ${png180.length} B`);
