/*
  Verifica dell'isola TargetSwitch: idratazione senza errori console,
  cambio target al click, persistenza della scelta dopo un refresh.
  Uso: node scripts/test-switch.mjs   (server attivo su BASE_URL o :4321)
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

const errori = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errori.push(msg.text());
});
page.on("pageerror", (err) => errori.push(String(err)));

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const esito = { errori: [...errori] };

if (errori.length === 0) {
  await page.getByRole("button", { name: "Vuoi vendere online" }).click();
  await page.waitForTimeout(400);
  esito.dopoClick = await page.evaluate(() => document.documentElement.dataset.target);
  esito.salvato = await page.evaluate(() => localStorage.getItem("target"));

  // refresh: la scelta deve sopravvivere
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  esito.dopoRefresh = await page.evaluate(() => document.documentElement.dataset.target);
  esito.rigaVisibile = await page
    .locator(".hero__riga--business:visible")
    .textContent()
    .catch(() => null);
  esito.erroriDopoRefresh = [...errori];
}

console.log(JSON.stringify(esito, null, 2));
await browser.close();

const ok =
  esito.errori.length === 0 &&
  esito.dopoClick === "business" &&
  esito.salvato === "business" &&
  esito.dopoRefresh === "business";
process.exitCode = ok ? 0 : 1;
