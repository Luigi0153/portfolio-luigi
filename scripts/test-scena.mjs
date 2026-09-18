// Test una tantum Fase 2.5: tab order, reduced-motion, easter egg, errori console
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
    if (fuochi.length === 5) break;
  }
  esito.tabOrder = fuochi.map((f) => f.aria);
  esito.focusVisibile = fuochi.every((f) => f.outline === "solid");

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

console.log(JSON.stringify(esito, null, 2));
await browser.close();
