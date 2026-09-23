/*
  Genera le cover dei progetti e i due placeholder del before/after.
  Composizioni geometriche Bauhaus con i soli colori dei token: nessuna foto
  stock (sarebbe fuori sistema) e nessuno screenshot finto di un'interfaccia
  che non esiste. Niente testo nelle immagini: librsvg non ha i font del sito.
  Output: src/assets/progetti/*.png, che <Image> converte in webp in build.
  Uso: node scripts/prepara-cover.mjs   (rilanciare se cambiano le cover)
  Usa lo sharp già incluso in Astro: nessuna dipendenza nuova.
*/
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = "src/assets/progetti";

const T = {
  cream: "#fdf4e4",
  cream2: "#f6e9d2",
  ink: "#1a1a1a",
  ink2: "#4a4540",
  arancio: "#c93c00",
};

const W = 1200;
const H = 900;

/* Cover 1 - caso reale: la rampa degli ordini. Quattro barre che salgono,
   l'ultima in arancio (il mese della decisione), un cerchio ink dietro. */
const casoReale = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${T.cream2}"/>
  <circle cx="905" cy="250" r="165" fill="${T.ink}"/>
  <g stroke="${T.ink}" stroke-width="7">
    <rect x="160" y="560" width="150" height="200" fill="${T.cream}"/>
    <rect x="345" y="470" width="150" height="290" fill="${T.ink}"/>
    <rect x="530" y="380" width="150" height="380" fill="${T.ink}"/>
    <rect x="715" y="215" width="150" height="545" fill="${T.arancio}"/>
  </g>
  <rect x="120" y="760" width="790" height="7" fill="${T.ink}"/>
</svg>`;

/* La cover di Fornace Vietri non è più generata qui: è la copertina del
   concept, in src/assets/progetti/fornace-vietri/. */

/* Cover 2 - pizzeria: il cerchio con la fetta tolta, la barra del forno. */
const pizzeria = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${T.cream2}"/>
  <path d="M520 450 L520 190 A260 260 0 1 0 780 450 Z" fill="${T.arancio}" stroke="${T.ink}" stroke-width="7"/>
  <path d="M556 414 L556 226 A188 188 0 0 1 744 414 Z" fill="${T.ink}" stroke="${T.ink}" stroke-width="7"/>
  <rect x="840" y="250" width="150" height="400" rx="75" fill="${T.ink}" stroke="${T.ink}" stroke-width="7"/>
  <rect x="180" y="700" width="450" height="46" rx="23" fill="${T.ink}"/>
</svg>`;

/* Before/after della scheda prodotto mobile, 390x844.
   "prima": wireframe fitto, gerarchia piatta, CTA sotto la piega.
   "dopo": immagine grande, prezzo leggibile, CTA fissa in fondo. */
const BW = 390;
const BH = 844;

const grigio = "#cfc6b4";
const grigioScuro = "#a89e8b";

const prima = `
<svg xmlns="http://www.w3.org/2000/svg" width="${BW}" height="${BH}" viewBox="0 0 ${BW} ${BH}">
  <rect width="${BW}" height="${BH}" fill="${T.cream}"/>
  <rect x="0" y="0" width="${BW}" height="54" fill="${grigio}"/>
  <rect x="16" y="20" width="96" height="14" rx="7" fill="${grigioScuro}"/>
  <rect x="330" y="18" width="44" height="18" rx="9" fill="${grigioScuro}"/>
  <rect x="16" y="74" width="358" height="200" fill="${grigio}"/>
  <g fill="${grigioScuro}">
    <rect x="16" y="292" width="250" height="13" rx="6"/>
    <rect x="16" y="315" width="190" height="13" rx="6"/>
    <rect x="16" y="346" width="80" height="16" rx="8"/>
  </g>
  <g fill="${grigio}">
    <rect x="16" y="384" width="358" height="11" rx="5"/>
    <rect x="16" y="403" width="358" height="11" rx="5"/>
    <rect x="16" y="422" width="358" height="11" rx="5"/>
    <rect x="16" y="441" width="300" height="11" rx="5"/>
    <rect x="16" y="460" width="358" height="11" rx="5"/>
    <rect x="16" y="479" width="270" height="11" rx="5"/>
    <rect x="16" y="498" width="358" height="11" rx="5"/>
    <rect x="16" y="517" width="220" height="11" rx="5"/>
  </g>
  <g fill="${grigio}">
    <rect x="16" y="556" width="358" height="40" rx="6"/>
    <rect x="16" y="606" width="358" height="40" rx="6"/>
    <rect x="16" y="656" width="358" height="40" rx="6"/>
  </g>
  <rect x="16" y="726" width="358" height="46" rx="6" fill="${grigioScuro}"/>
  <rect x="0" y="800" width="${BW}" height="44" fill="${grigio}"/>
</svg>`;

const dopo = `
<svg xmlns="http://www.w3.org/2000/svg" width="${BW}" height="${BH}" viewBox="0 0 ${BW} ${BH}">
  <rect width="${BW}" height="${BH}" fill="${T.cream}"/>
  <rect x="0" y="0" width="${BW}" height="54" fill="${T.cream2}"/>
  <rect x="16" y="19" width="70" height="16" rx="8" fill="${T.ink}"/>
  <rect x="16" y="70" width="358" height="330" rx="12" fill="${T.cream2}" stroke="${T.ink}" stroke-width="3"/>
  <circle cx="195" cy="222" r="86" fill="${T.cream}" stroke="${T.ink}" stroke-width="3"/>
  <g fill="${T.ink}" opacity="0.18">
    <circle cx="150" cy="378" r="6"/><circle cx="174" cy="378" r="6"/>
    <circle cx="198" cy="378" r="6"/><circle cx="222" cy="378" r="6"/>
  </g>
  <rect x="16" y="424" width="240" height="22" rx="11" fill="${T.ink}"/>
  <rect x="16" y="458" width="110" height="30" rx="15" fill="${T.arancio}"/>
  <rect x="16" y="506" width="130" height="30" rx="15" fill="${T.cream2}" stroke="${T.ink}" stroke-width="3"/>
  <rect x="158" y="506" width="130" height="30" rx="15" fill="${T.cream2}" stroke="${T.ink}" stroke-width="3"/>
  <g fill="${T.ink}" opacity="0.28">
    <rect x="16" y="566" width="358" height="10" rx="5"/>
    <rect x="16" y="586" width="300" height="10" rx="5"/>
    <rect x="16" y="606" width="330" height="10" rx="5"/>
  </g>
  <rect x="16" y="646" width="358" height="1.5" fill="${T.ink}" opacity="0.25"/>
  <g fill="${T.ink}" opacity="0.28">
    <rect x="16" y="668" width="150" height="10" rx="5"/>
    <rect x="16" y="690" width="210" height="10" rx="5"/>
  </g>
  <rect x="0" y="746" width="${BW}" height="98" fill="${T.cream2}"/>
  <rect x="0" y="746" width="${BW}" height="3" fill="${T.ink}"/>
  <rect x="16" y="772" width="358" height="52" rx="26" fill="${T.arancio}" stroke="${T.ink}" stroke-width="3"/>
</svg>`;

await mkdir(OUT, { recursive: true });

const immagini = [
  ["caso-reale.png", casoReale],
  ["pizzeria.png", pizzeria],
  ["scheda-prima.png", prima],
  ["scheda-dopo.png", dopo],
];

for (const [nome, svg] of immagini) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(OUT, nome));
  console.log(`ok ${nome}`);
}
