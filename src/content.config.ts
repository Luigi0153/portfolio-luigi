import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Progetti / case study.
 *
 * Le quattro sezioni del case study stanno nel frontmatter e non nel corpo:
 * sono al massimo 3 righe ciascuna (regola 5 di CLAUDE.md) e la pagina deve
 * poterci intercalare i componenti dati (grafico, funnel, before/after), cosa
 * che in Markdown puro non si può fare senza MDX. Il corpo resta per i testi
 * liberi dei progetti "in arrivo".
 */
/** I blocchi dati disponibili: componenti veri, non nomi liberi. */
const BLOCCHI = z.enum(["ramp", "funnel", "statistiche", "before-after"]);

const progetti = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/progetti" }),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      slug: z.string(),
      /** La lente con cui si legge il progetto: dà il taglio al racconto. */
      lente: z.enum(["flusso", "sistema", "vincolo", "decisione", "rimozione"]),
      /** A chi parla: filtra nulla, decide solo l'ordine e l'accento. */
      target: z.enum(["dev", "business", "both"]),
      tags: z.array(z.string()).min(1),
      cover: image(),
      /** Testo alternativo della cover: le cover sono decorative ma non vuote. */
      coverAlt: z.string(),
      /** Una riga sulla card. Serve anche come description della pagina. */
      sommario: z.string(),
      /** Posizione nella griglia per ciascun percorso (1 = primo). */
      ordine_dev: z.number().int().positive(),
      ordine_business: z.number().int().positive(),
      /** Card con tag giallo e nessun link al dettaglio. */
      in_arrivo: z.boolean().default(false),
      /* I default sono scritti per esteso: zod non ripassa il valore di
         .default() dentro lo schema, quindi un `.default({})` lascerebbe
         l'oggetto senza le sue chiavi e il template leggerebbe undefined. */

      /** Blocchi dati montati dal template, sotto la sezione che li nomina. */
      dati: z
        .object({
          contesto: z.array(BLOCCHI).default([]),
          decisione: z.array(BLOCCHI).default([]),
          risultato: z.array(BLOCCHI).default([]),
          imparato: z.array(BLOCCHI).default([]),
        })
        .default({ contesto: [], decisione: [], risultato: [], imparato: [] }),
      sezioni: z
        .object({
          contesto: z.array(z.string()).max(3).default([]),
          decisione: z.array(z.string()).max(3).default([]),
          risultato: z.array(z.string()).max(3).default([]),
          imparato: z.array(z.string()).max(3).default([]),
        })
        .default({ contesto: [], decisione: [], risultato: [], imparato: [] }),
    }),
});

export const collections = { progetti };
