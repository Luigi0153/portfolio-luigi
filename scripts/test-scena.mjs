// Scena scrivania: tab order, reduced-motion, easter egg, errori console, tessere su telefono.
// Nato come test una tantum della Fase 2.5; dal 2026-11-19 esce con codice 1 se qualcosa non va.
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const browser = await chromium.launch();
const esito = {};

// --- 1. Tastiera + easter egg + console (desktop, motion normale) ---
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errori = [];
  page.on("console", (m) => m.type() === "error" && errori.push(m.text()));
  page.on("pageerror", (e) => errori.push(String(e)));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1600); // entrata finita

  // tab finché non abbiamo attraversato tutti gli hotspot
  const fuochi = [];
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        hotspot: el?.classList?.contains("hotspot") ?? false,
        aria: el?.getAttribute("aria-label"),
        outline: el ? getComputedStyle(el).outlineStyle : null,
      };
    });
    if (info.hotspot) fuochi.push({ aria: info.aria, outline: info.outline });
    if (fuochi.length === 4) break;
  }
  esito.tabOrder = fuochi.map((f) => f.aria);
  esito.focusVisibile = fuochi.every((f) => f.outline === "solid");
  // dal 2026-11-19 tre oggetti e la tazza, senza tabellino
  esito.tabOrdineGiusto =
    esito.tabOrder.join(" | ") ===
    "Computer: vai ai progetti | Taccuino: come lavoro | Telefono: contatti | Tazza di caffè";

  // easter egg: appare e sparisce dopo ~2s
  await page.locator(".hotspot--tazza").click();
  esito.eggVisibile = await page.locator(".desk__egg").isVisible();
  esito.eggTesto = await page.locator(".desk__egg").textContent();
  await page.waitForTimeout(2400);
  esito.eggSparito = await page.locator(".desk__egg").isHidden();

  // il titolo è tornato integro dopo il revert di SplitText
  esito.h1Integro = await page.evaluate(
    () => document.querySelectorAll("#hero-titolo div").length === 0,
  );
  esito.erroriConsole = errori;
  await page.close();
}

// --- 2. prefers-reduced-motion: statico ma funzionante ---
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  esito.rm = await page.evaluate(() => {
    const hotspot = [...document.querySelectorAll(".desk__scena .hotspot")];
    const forma = document.querySelector(".forma");
    return {
      h1SenzaSplit: document.querySelectorAll("#hero-titolo div").length === 0,
      hotspotSenzaTransform: hotspot.every((h) => !h.style.transform),
      formeSenzaTween: !forma?.style.transform,
      hrefValidi: hotspot
        .filter((h) => h.tagName === "A")
        .every((h) => h.getAttribute("href")),
      contenutoVisibile: getComputedStyle(document.querySelector(".hotspot__body")).opacity === "1",
    };
  });
  // egg funziona anche con reduced-motion
  await page.locator(".hotspot--tazza").click();
  esito.rm.eggVisibile = await page.locator(".desk__egg").isVisible();
  await ctx.close();
}

// --- 3. Telefono (390): tre tessere, Progetti a tutta riga, le altre due affiancate ---
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  esito.tessere = await page.$$eval(".desk__tiles .tile", (tiles) => {
    const lista = tiles[0].closest("ul").getBoundingClientRect();
    return tiles.map((t) => {
      const r = t.getBoundingClientRect();
      return { etichetta: t.textContent.trim(), larga: Math.abs(r.width - lista.width) < 2, top: Math.round(r.top) };
    });
  });
  const [p, c, t] = esito.tessere;
  esito.tessereGiuste =
    esito.tessere.map((x) => x.etichetta).join(" | ") === "Progetti | Come lavoro | Contatti" &&
    p.larga && !c.larga && !t.larga && c.top === t.top && c.top > p.top;
  await page.close();
}

console.log(JSON.stringify(esito, null, 2));
await browser.close();

// Verifiche bloccanti: prima il test stampava solo il rapporto
const controlli = {
  "ordine di tab": esito.tabOrdineGiusto,
  "focus visibile": esito.focusVisibile,
  "easter egg": esito.eggVisibile && esito.eggSparito,
  "nessun errore in console": esito.erroriConsole.length === 0,
  "reduced-motion": Object.values(esito.rm).every(Boolean),
  "tessere su telefono": esito.tessereGiuste,
};
const falliti = Object.entries(controlli).filter(([, ok]) => !ok).map(([n]) => n);
if (falliti.length) {
  console.error(`✗ test-scena: ${falliti.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`✓ test-scena: ${Object.keys(controlli).join(", ")}`);
}
