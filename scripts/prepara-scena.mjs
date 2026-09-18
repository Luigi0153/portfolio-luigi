/*
  Prepara le illustrazioni della scena scrivania:
  1. rimuove lo sfondo crema (flood fill dai bordi: tocca solo l'area collegata
     al bordo, non i crema interni agli oggetti, protetti dai contorni ink);
  2. rifila il padding trasparente (trim);
  3. salva PNG RGBA in src/assets/scene/, che <Image> converte in webp in build.
  Input: src/assets/scene-src/*.png (originali 1024x1024 su fondo crema).
  Uso: node scripts/prepara-scena.mjs   (rilanciare se cambiano gli originali)
  Usa lo sharp già incluso in Astro: nessuna dipendenza nuova.
*/
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const IN = "src/assets/scene-src";
const OUT = "src/assets/scene";
const TOLLERANZA = 48; // distanza Manhattan RGB massima per considerare un pixel "sfondo"

await mkdir(OUT, { recursive: true });

for (const file of (await readdir(IN)).filter((f) => f.endsWith(".png"))) {
  const { data, info } = await sharp(path.join(IN, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const px = (x, y) => (y * width + x) * 4;

  // colore di sfondo di riferimento: media dei quattro angoli
  const angoli = [px(2, 2), px(width - 3, 2), px(2, height - 3), px(width - 3, height - 3)];
  const bg = [0, 1, 2].map((c) =>
    Math.round(angoli.reduce((s, i) => s + data[i + c], 0) / angoli.length),
  );
  const eSfondo = (i) =>
    Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) <=
    TOLLERANZA;

  // BFS dai pixel di bordo: azzera l'alpha della regione di sfondo collegata
  const visitato = new Uint8Array(width * height);
  const coda = [];
  for (let x = 0; x < width; x++) coda.push([x, 0], [x, height - 1]);
  for (let y = 0; y < height; y++) coda.push([0, y], [width - 1, y]);

  while (coda.length > 0) {
    const [x, y] = coda.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const idx = y * width + x;
    if (visitato[idx]) continue;
    visitato[idx] = 1;
    const i = idx * 4;
    if (!eSfondo(i)) continue;
    data[i + 3] = 0;
    coda.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  const out = path.join(OUT, file);
  const conAlpha = await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();
  await sharp(conAlpha).trim({ threshold: 10 }).toFile(out);

  const meta = await sharp(out).metadata();
  const kb = Math.round((await sharp(out).png().toBuffer()).length / 1024);
  console.log(`✓ ${file}  ${meta.width}x${meta.height}  ~${kb} KB (png intermedio)`);
}
