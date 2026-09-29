/*
  Verifica dell'isola TargetSwitch: idratazione senza errori console,
  cambio target al click, persistenza della scelta dopo un refresh, e i
  testi che cambiano col percorso in home: riga e bottone dell'invito al
  contatto, sommari delle card.
  Uso: node scripts/test-switch.mjs   (server attivo su BASE_URL o :4321)
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";

/* I testi attesi per percorso. I sommari seguono l'ordine della griglia
   nel percorso: dev caso reale, Fornace, pizzeria; business caso reale,
   pizzeria, Fornace. */
const ATTESI = {
  dev: {
    invitoRiga: "Cerchi uno sviluppatore per il tuo team o per un progetto? Scrivimi, ti rispondo io.",
    invitoBottone: "Scrivimi",
    sommari: [
      "Boutique di borse e accessori. Prima due mesi di dati, poi quattro interventi su Shopify, con il redesign in pausa.",
      "Branding concept con negozio Shopify per un laboratorio di ceramica. Pezzi unici con giacenza 1, tre stati del prodotto e collezioni automatiche.",
      "Branding concept con landing page per una pizzeria. Prenotazione con un messaggio WhatsApp già scritto, senza portale né gestionale.",
    ],
  },
  business: {
    invitoRiga:
      "Dimmi cosa vendi e a chi. Lo costruiamo insieme, e dopo il lancio resto al tuo fianco.",
    invitoBottone: "Parliamone",
    sommari: [
      "Boutique di borse e accessori. Da giugno a luglio il fatturato è cresciuto dell'86%, senza rifare la grafica.",
      "Branding concept per una pizzeria di quartiere. Dal reel su Instagram al tavolo prenotato in tre tocchi, senza commissioni.",
      "Branding concept per un laboratorio di ceramica. Ogni pezzo è unico, e chi arriva tardi può chiederne uno simile.",
    ],
  },
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

const errori = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errori.push(msg.text());
});
page.on("pageerror", (err) => errori.push(String(err)));

/** Solo quello che si vede: le varianti dell'altro percorso sono display:none. */
const leggiVarianti = () =>
  page.evaluate(() => {
    const visibili = (sel) =>
      [...document.querySelectorAll(sel)]
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => el.textContent.replace(/\s+/g, " ").trim());
    return {
      invitoTitoli: visibili(".invito h2"),
      invitoRiga: visibili(".invito__riga"),
      invitoBottone: visibili(".invito .btn"),
      sommari: visibili(".progetti__sommario"),
    };
  });

/** Confronta quello che si vede con i testi attesi del percorso. */
const confronta = (letto, target) => {
  const a = ATTESI[target];
  return (
    letto.invitoTitoli.length === 1 &&
    letto.invitoTitoli[0] === "Raccontami il progetto" &&
    letto.invitoRiga.length === 1 &&
    letto.invitoRiga[0] === a.invitoRiga &&
    letto.invitoBottone.length === 1 &&
    letto.invitoBottone[0] === a.invitoBottone &&
    letto.sommari.join("|") === a.sommari.join("|")
  );
};

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const esito = { errori: [...errori] };
esito.variantiDev = await leggiVarianti();
esito.variantiDevOk = confronta(esito.variantiDev, "dev");

if (errori.length === 0) {
  await page.getByRole("button", { name: "Vuoi vendere online" }).click();
  await page.waitForTimeout(400);
  esito.dopoClick = await page.evaluate(() => document.documentElement.dataset.target);
  esito.salvato = await page.evaluate(() => localStorage.getItem("target"));
  esito.variantiBusiness = await leggiVarianti();
  esito.variantiBusinessOk = confronta(esito.variantiBusiness, "business");

  // refresh: la scelta deve sopravvivere
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  esito.dopoRefresh = await page.evaluate(() => document.documentElement.dataset.target);
  esito.rigaVisibile = await page
    .locator(".hero__riga--business:visible")
    .textContent()
    .catch(() => null);
  esito.variantiDopoRefreshOk = confronta(await leggiVarianti(), "business");
  esito.erroriDopoRefresh = [...errori];
}

console.log(JSON.stringify(esito, null, 2));
await browser.close();

const ok =
  esito.errori.length === 0 &&
  esito.variantiDevOk &&
  esito.dopoClick === "business" &&
  esito.salvato === "business" &&
  esito.variantiBusinessOk &&
  esito.dopoRefresh === "business" &&
  esito.variantiDopoRefreshOk &&
  esito.erroriDopoRefresh.length === 0;
console.log(ok ? "\nTutte le verifiche dello switch passate" : "\nVerifiche dello switch fallite");
process.exitCode = ok ? 0 : 1;
