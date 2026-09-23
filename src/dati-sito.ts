/**
 * Dati di contatto e identità del sito, in un posto solo.
 *
 * Il dominio NON sta qui: sta in `astro.config.mjs` come `site`, perché è da lì
 * che lo prendono le View Transitions, il canonical e la sitemap. Se serve in
 * una pagina, si legge da `import.meta.env.SITE`.
 *
 * I valori marcati DA COMPILARE sono segnaposto: il sito compila e funziona,
 * ma prima del deploy vanno sostituiti con quelli veri.
 */

export const EMAIL = "luigi4375@gmail.com";

export const LINKEDIN = "https://www.linkedin.com/in/luigi-romano-951806377";

export const GITHUB = "https://github.com/luigi0153";

/**
 * Id del form Formspree: l'ultima parte dell'endpoint
 * `https://formspree.io/f/<id>`.
 * Se torna al segnaposto (solo "x"), il form non finge un invio riuscito:
 * lo dichiara e rimanda all'email. Vedi FORM_ATTIVO.
 */
export const FORMSPREE_ID = "xkjgoowv";

export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;

/** Vero quando il form è davvero collegato: usato per non fingere un invio. */
export const FORM_ATTIVO = !/^x+$/.test(FORMSPREE_ID);

/** Voci social del footer e della pagina contatti. */
export const SOCIAL = [
  { nome: "LinkedIn", href: LINKEDIN, handle: "Parliamo di lavoro" },
  { nome: "GitHub", href: GITHUB, handle: "Guarda il mio codice" },
] as const;
