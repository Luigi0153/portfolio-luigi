/*
  Verifica etichette della scena scrivania a 768/1024/1280:
  - a riposo: tutte nascoste (contesto hover-capable);
  - su hover di ciascun oggetto: etichetta visibile, dentro il contenitore,
    mai sovrapposta alle ALTRE illustrazioni (tolleranza 2px, parallax incluso);
  - il burst visibile non tocca le altre illustrazioni;
  - screenshot della scena con hover attivo su ogni oggetto, a ogni viewport.
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

    // Burst acceso e visibile davvero: sta dietro la propria illustrazione,
    // quindi se il quadrato non supera la sagoma i raggi restano sepolti.
    const burst = page.locator(`.burst--${chiave}`);
    const burstAcceso = await burst
      .locator(".fx--burst")
      .evaluate((b) => getComputedStyle(b).opacity === "1");
    if (!burstAcceso) problemi.push("burst spento su hover");

    const boxBurst = await burst.locator(".fx--burst").boundingBox();
    const boxImg = await hotspot.locator(".hotspot__img").boundingBox();
    if (boxBurst && boxImg) {
      // i raggi arrivano al 92% del semilato, la maschera è ancora piena al 68%
      const semi = boxBurst.width / 2;
      const latoMaggiore = Math.max(boxImg.width, boxImg.height) / 2;
      if (semi * 0.92 < latoMaggiore + 6)
        problemi.push(
          `burst sepolto sotto l'illustrazione (punte a ${Math.round(semi * 0.92)}px, sagoma ${Math.round(latoMaggiore)}px)`,
        );
    }

    // Occlusione: in nessun punto di un'altra illustrazione il burst deve
    // risultare l'elemento in cima. Campiona una griglia sul box di ogni
    // vicino; i pointer-events servono solo alla misura, non al sito.
    const sopraVicini = await page.evaluate((c) => {
      const layer = document.querySelector(".desk__fx");
      const prima = layer.style.pointerEvents;
      layer.style.pointerEvents = "auto";
      for (const b of document.querySelectorAll(".burst, .fx--burst"))
        b.style.pointerEvents = "auto";

      const colpe = [];
      const vicini = [...document.querySelectorAll(".desk__scena .hotspot")].filter(
        (h) => !h.classList.contains(`hotspot--${c}`),
      );
      for (const v of vicini) {
        const r = v.querySelector(".hotspot__img").getBoundingClientRect();
        for (let i = 1; i <= 6; i++) {
          for (let j = 1; j <= 6; j++) {
            const el = document.elementFromPoint(
              r.x + (r.width * i) / 7,
              r.y + (r.height * j) / 7,
            );
            if (el?.closest(".burst")) {
              colpe.push(v.getAttribute("aria-label"));
              i = j = 99;
            }
          }
        }
      }

      layer.style.pointerEvents = prima;
      for (const b of document.querySelectorAll(".burst, .fx--burst"))
        b.style.removeProperty("pointer-events");
      return colpe;
    }, chiave);

    for (const vicino of sopraVicini) problemi.push(`burst sopra "${vicino}"`);

    if (problemi.length > 0) {
      fallimenti++;
      console.error(`✗ ${vp}px ${chiave}: ${problemi.join("; ")}`);
      console.error(
        `  etichetta ${JSON.stringify(boxEtichetta)} contenitore ${JSON.stringify(contenitore)}`,
      );
    } else {
      console.log(`✓ ${vp}px ${chiave}: hover ok`);
    }

    const scena = await page.locator(".desk__scena").boundingBox();
    const margine = 80; // il burst sporge oltre la scena (misurato: max ~68px)
    await page.screenshot({
      path: `screenshots/hover-${chiave}-${vp}.png`,
      clip: {
        x: Math.max(0, scena.x - margine),
        y: Math.max(0, scena.y - margine),
        width: Math.min(vp, scena.width + margine * 2),
        height: scena.height + margine * 2,
      },
    });
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
