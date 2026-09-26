/*
  Ritaglia le due schede prodotto del caso reale alla sola prima schermata di
  un telefono, 390x844 a doppia risoluzione (780x1688), per lo slider
  prima/dopo. Le catture di partenza sono a pagina intera e già larghe 780px:
  si tiene solo la parte alta, senza ricomporre niente. Stessa dimensione per
  entrambe, come chiede lo slider (un solo aspect-ratio per le due immagini).
  Uso: node scripts/prepara-slider.mjs   (rilanciare se cambiano le catture)
*/
import sharp from "sharp";
import path from "node:path";

const DIR = "src/assets/progetti/caso-reale";
const W = 390 * 2;
const H = 844 * 2;

const RITAGLI = [
  ["caso-oggi-scheda.jpg", "caso-oggi-scheda-schermo.jpg"],
  ["caso-fase1-scheda.jpg", "caso-fase1-scheda-schermo.jpg"],
];

for (const [da, a] of RITAGLI) {
  const sorgente = sharp(path.join(DIR, da));
  const { width } = await sorgente.metadata();
  if (width !== W) throw new Error(`${da}: larga ${width}px, attesi ${W}`);

  await sorgente
    .extract({ left: 0, top: 0, width: W, height: H })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(DIR, a));
  console.log(`ok ${a} ${W}x${H}`);
}
