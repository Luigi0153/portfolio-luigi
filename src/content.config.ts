import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Progetti / case study.
 *
 * I capitoli del case study stanno nel frontmatter e non nel corpo: la pagina
 * deve poterci intercalare componenti dati (grafico, funnel, before/after) e
 * immagini, cosa che in Markdown puro non si può fare senza MDX. Ogni progetto
 * dichiara i suoi capitoli, con titolo e ordine propri: il caso reale ne ha
 * sette, un concept altri. Il corpo dei file non viene usato.
 */
/** I blocchi dati disponibili: componenti veri, non nomi liberi. */
const BLOCCHI = z.enum(["ramp", "funnel", "statistiche", "before-after"]);

/** Righe di testo di un capitolo: poche e brevi, al massimo 3. */
const RIGHE = z.array(z.string()).max(3);

/** Passi in ordine (numerato) o punti: per quando tre righe non bastano. */
const ELENCO = z.object({
  numerato: z.boolean().default(false),
  voci: z.array(z.string()).min(2).max(6),
});

const progetti = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/progetti" }),
  schema: ({ image }) => {
    const IMMAGINE = z.object({ src: image(), alt: z.string() });
    /** `mobile`: versione ricomposta per gli schermi sotto i 768px, stesso alt. */
    const FIGURA = IMMAGINE.extend({ mobile: image().optional() });
    /** Schermate affiancate su desktop, scorrevoli su mobile. */
    const GALLERIA = z.array(IMMAGINE.extend({ etichetta: z.string() }));

    return z.object({
      titolo: z.string(),
      slug: z.string(),
      /** Il tipo di progetto (per esempio "Branding concept"): sta prima della lente, in card e in pagina. */
      tipo: z.string().optional(),
      /** Riga sotto il titolo della pagina (per esempio: progetto inventato, foto generate con l'AI). */
      nota: z.string().optional(),
      /** La lente con cui si legge il progetto: dà il taglio al racconto. */
      lente: z.enum(["flusso", "sistema", "vincolo", "decisione", "rimozione"]),
      /** A chi parla: filtra nulla, decide solo l'ordine e l'accento. */
      target: z.enum(["dev", "business", "both"]),
      tags: z.array(z.string()).min(1),
      cover: image(),
      /** Testo alternativo della cover: le cover sono decorative ma non vuote. */
      coverAlt: z.string(),
      /**
       * Una riga sulla card, nel percorso dev e senza JavaScript. Serve anche
       * come description della pagina.
       */
      sommario: z.string(),
      /** La riga sulla card nel percorso business. Senza, vale `sommario`. */
      sommario_business: z.string().optional(),
      /**
       * Riga sotto il titolo della pagina, solo nel percorso business: il
       * risultato in breve, con un link al capitolo che lo racconta.
       * Testo fisso, niente conteggi animati (vedi data-only in global.css).
       */
      sintesi_business: z
        .object({
          testo: z.string(),
          /** Id del capitolo di destinazione: il link porta a `#sez-<id>`. */
          capitolo: z.string(),
          link: z.string(),
        })
        .optional(),
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
            elenco: ELENCO.optional(),
            /** Un'immagine a tutta colonna, sotto le righe. */
            figura: FIGURA.optional(),
            dati: z.array(BLOCCHI).default([]),
            /**
             * Parti del capitolo con un titolo proprio. Dentro, in quest'ordine:
             * righe, elenco, blocchi dati, immagini. `etichetta` sta sopra il
             * titolo (per esempio "Proposta", per il lavoro non ancora fatto).
             * `immagini` è una sequenza libera di figure e gallerie.
             */
            sottosezioni: z
              .array(
                z.object({
                  titolo: z.string(),
                  etichetta: z.string().optional(),
                  righe: RIGHE.min(1),
                  elenco: ELENCO.optional(),
                  dati: z.array(BLOCCHI).default([]),
                  immagini: z
                    .array(z.union([FIGURA, z.object({ galleria: GALLERIA.min(1) })]))
                    .default([]),
                }),
              )
              .default([]),
            galleria: GALLERIA.default([]),
          }),
        )
        .min(1),
    }).refine(
      (d) => !d.sintesi_business || d.capitoli.some((c) => c.id === d.sintesi_business?.capitolo),
      { message: "sintesi_business.capitolo: nessun capitolo con questo id", path: ["sintesi_business"] },
    );
  },
});

/**
 * Loghi: un file per marchio, il corpo non viene usato.
 * L'alt dell'immagine principale non sta qui: lo compone la pagina da nome e
 * tipo, così non può restare indietro quando uno dei due cambia.
 */
const loghi = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/loghi" }),
  schema: ({ image }) =>
    z.object({
      nome: z.string(),
      tipo: z.enum(["progetto", "esercizio", "rebranding", "esplorazione"]),
      /** Uno stile per logo: i filtri di /loghi nascono dagli stili usati. */
      stile: z.string(),
      /** Fondo del riquadro: un hex, oppure un token del sito (cream, cream-2). */
      fondo: z.union([
        z.enum(["cream", "cream-2"]),
        z.string().regex(/^#[0-9a-fA-F]{6}$/, "fondo: hex a 6 cifre, per esempio #F3EEE4"),
      ]),
      immagine: image(),
      /** Posizione in /loghi e nella striscia della home (1 = primo). */
      ordine: z.number().int().positive(),
      /** Il marchio originale, per il prima e dopo. */
      prima: image().optional(),
      /** La bozza a mano, per il passaggio dallo schizzo al finale. */
      schizzo: image().optional(),
      /** Il marchio applicato: insegna, busta, packaging. Da due a tre foto. */
      applicazioni: z.array(z.object({ src: image(), alt: z.string() })).max(3).default([]),
      testo: z.string().optional(),
      /** Percorso della pagina progetto da cui viene il logo. */
      progetto: z.string().startsWith("/").optional(),
    }),
});

export const collections = { progetti, loghi };
