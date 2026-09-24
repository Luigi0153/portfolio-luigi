import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Progetti / case study.
 *
 * I capitoli del case study stanno nel frontmatter e non nel corpo: la pagina
 * deve poterci intercalare componenti dati (grafico, funnel, before/after) e
 * immagini, cosa che in Markdown puro non si può fare senza MDX. Ogni progetto
 * dichiara i suoi capitoli, con titolo e ordine propri: il caso reale ne ha
 * quattro, un concept può averne altri. Il corpo dei file non viene usato.
 */
/** I blocchi dati disponibili: componenti veri, non nomi liberi. */
const BLOCCHI = z.enum(["ramp", "funnel", "statistiche", "before-after"]);

/** Righe di testo di un capitolo: poche e brevi, al massimo 3. */
const RIGHE = z.array(z.string()).max(3);

const progetti = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/progetti" }),
  schema: ({ image }) => {
    const IMMAGINE = z.object({ src: image(), alt: z.string() });

    return z.object({
      titolo: z.string(),
      slug: z.string(),
      /** Riga sotto il titolo della pagina (per esempio: progetto concept). */
      nota: z.string().optional(),
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
      /**
       * I capitoli, nell'ordine in cui si leggono. Dentro ogni capitolo la
       * pagina monta, in quest'ordine: righe, elenco, figura, blocchi dati,
       * sottosezioni, galleria di schermate.
       */
      capitoli: z
        .array(
          z.object({
            /** Ancora del capitolo: diventa l'id `sez-<id>` del titolo. */
            id: z.string(),
            titolo: z.string(),
            righe: RIGHE.default([]),
            /** Passi in ordine (numerato) o punti: per quando tre righe non bastano. */
            elenco: z
              .object({
                numerato: z.boolean().default(false),
                voci: z.array(z.string()).min(2).max(6),
              })
              .optional(),
            /**
             * Un'immagine a tutta colonna, sotto le righe. `mobile` è una
             * versione ricomposta per gli schermi sotto i 768px, con lo stesso alt.
             */
            figura: IMMAGINE.extend({ mobile: image().optional() }).optional(),
            dati: z.array(BLOCCHI).default([]),
            sottosezioni: z
              .array(z.object({ titolo: z.string(), righe: RIGHE.min(1) }))
              .default([]),
            /** Schermate affiancate su desktop, scorrevoli su mobile. */
            galleria: z.array(IMMAGINE.extend({ etichetta: z.string() })).default([]),
          }),
        )
        .min(1),
    });
  },
});

export const collections = { progetti };
