/*
  Verifica etichette della scena scrivania a 768/1024/1280:
  - a riposo: tutte nascoste (contesto hover-capable);
  - su hover di ciascun oggetto: etichetta visibile, dentro il contenitore,
    mai sovrapposta alle ALTRE illustrazioni (tolleranza 2px, parallax incluso);
  - screenshot dell'hero con hover attivo su ogni oggetto (solo a 1280).
  Uso: node scripts/test-etichette.mjs   (server su BASE_URL o :4321)
*/
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const TOLLERANZA = 2;
const browser = await chromium.launch();
await mkdir("screenshots", { recursive: true });

const interseca = (a, b, tol) =>
  a.x + tol < b.x + b.width &&
  b.x + tol < a.x + a.width &&
  a.y + tol < b.y + b.height &&
  b.y + tol < a.y + a.height;

const dentro = (a, b, tol) =>
  a.x >= b.x - tol &&
  a.y >= b.y - tol &&
  a.x + a.width <= b.x + b.width + tol &&
  a.y + a.height <= b.y + b.height + tol;

let fallimenti = 0;

for (const vp of [768, 1024, 1280]) {
  const page = await browser.newPage({ viewport: { width: vp, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  // lo scroll smooth del sito farebbe "planare" gli auto-scroll di hover():
  // l'elemento scivola via da sotto il mouse e l'hover si perde
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await page.waitForTimeout(1600); // entrata finita
  await page.locator(".desk__scena").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  // a riposo: nessuna etichetta visibile
  const visibiliARiposo = await page.evaluate(() =>
    [...document.querySelectorAll(".desk__scena .hotspot__label")].filter(
      (l) => getComputedStyle(l).visibility !== "hidden",
    ).length,
  );
  if (visibiliARiposo > 0) {
    fallimenti++;
    console.error(`✗ ${vp}px: ${visibiliARiposo} etichette visibili a riposo`);
  } else {
    console.log(`✓ ${vp}px: etichette nascoste a riposo`);
  }

  const chiavi = ["computer", "taccuino", "telefono", "tabellino"];

  for (const chiave of chiavi) {
    const hotspot = page.locator(`.hotspot--${chiave}`);
    await hotspot.hover();
    await page.waitForTimeout(1000); // parallax a regime (lerp 0.06 ≈ 0,85s)
    // misurato QUI, nello stesso frame di scroll delle etichette
    const contenitore = await page.locator(".desk__scena").boundingBox();

    const etichetta = hotspot.locator(".hotspot__label");
    const visibile = await etichetta.evaluate(
      (l) => getComputedStyle(l).visibility === "visible" && getComputedStyle(l).opacity === "1",
    );
    const boxEtichetta = await etichetta.boundingBox();

    const altre = await page.evaluate((c) => {
      return [...document.querySelectorAll(".desk__scena .hotspot")]
        .filter((h) => !h.classList.contains(`hotspot--${c}`))
        .map((h) => h.querySelector(".hotspot__img").getBoundingClientRect().toJSON());
    }, chiave);

    const problemi = [];
    if (!visibile) problemi.push("non visibile su hover");
    if (!boxEtichetta || !dentro(boxEtichetta, contenitore, TOLLERANZA))
      problemi.push("fuori dal contenitore");
    for (const [i, box] of altre.entries()) {
      if (boxEtichetta && interseca(boxEtichetta, box, TOLLERANZA))
        problemi.push(`sovrapposta all'illustrazione ${i}`);
    }

    if (problemi.length > 0) {
      fallimenti++;
      console.error(`✗ ${vp}px ${chiave}: ${problemi.join("; ")}`);
      console.error(
        `  etichetta ${JSON.stringify(boxEtichetta)} contenitore ${JSON.stringify(contenitore)}`,
      );
    } else {
      console.log(`✓ ${vp}px ${chiave}: hover ok`);
    }

    if (vp === 1280) {
      const hero = await page.locator(".hero").boundingBox();
      await page.screenshot({ path: `screenshots/hover-${chiave}-1280.png`, clip: hero });
    }
  }

  await page.close();
}

await browser.close();
if (fallimenti > 0) {
  console.error(`\n${fallimenti} verifiche fallite`);
  process.exitCode = 1;
} else {
  console.log("\nTutte le verifiche etichette passate");
}
