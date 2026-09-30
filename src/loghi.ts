import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Regole condivise dei loghi: etichette dei tipi, frase di non affiliazione,
 * fondo del riquadro, ordine. Le usano /loghi, /loghi/[slug] e la striscia
 * della home: una sola fonte, così le tre viste non possono divergere.
 */

export type Logo = CollectionEntry<"loghi">;

export const TIPI = {
  progetto: "Progetto",
  esercizio: "Esercizio",
  rebranding: "Rebranding",
  esplorazione: "Esplorazione",
} as const satisfies Record<Logo["data"]["tipo"], string>;

/**
 * Etichetta del tipo che si vede in card e nel dettaglio. Il tipo "progetto" è
 * il caso normale e non ne ha: il campo resta nei dati e nell'alt, e le altre
 * etichette (per esempio "Esercizio di stile") si vedono.
 */
export const etichettaTipo = (logo: Logo) =>
  logo.data.tipo === "progetto" ? null : TIPI[logo.data.tipo];

/** Frase fissa sotto i lavori su marchi esistenti (vedi docs/FASE_LOGHI.md). */
export const NON_AFFILIATO =
  "Esercizio di stile. Non affiliato ai marchi citati, nessun uso commerciale.";

export const nonAffiliato = (logo: Logo) =>
  logo.data.tipo === "rebranding" || logo.data.tipo === "esplorazione";

/** I fondi "cream" e "cream-2" puntano ai token, gli hex restano come sono. */
export const fondo = (logo: Logo) =>
  logo.data.fondo.startsWith("#") ? logo.data.fondo : `var(--color-${logo.data.fondo})`;

export const altLogo = (logo: Logo) => `Logo di ${logo.data.nome} (${TIPI[logo.data.tipo]})`;

/** Chiave dello stile per i filtri: "Monogramma" → "monogramma". */
export const chiaveStile = (stile: string) =>
  stile
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Loghi in ordine: esplicito, perché l'ordine del loader non è garantito. */
export const getLoghi = async () =>
  (await getCollection("loghi")).toSorted(
    (a, b) => a.data.ordine - b.data.ordine || a.data.nome.localeCompare(b.data.nome, "it"),
  );
