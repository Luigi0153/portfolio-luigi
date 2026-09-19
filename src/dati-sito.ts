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

/** DA COMPILARE — profilo LinkedIn pubblico. */
export const LINKEDIN = "https://www.linkedin.com/in/luigi";

/** DA COMPILARE — profilo GitHub pubblico. */
export const GITHUB = "https://github.com/luigi";

/**
 * DA COMPILARE — id del form Formspree (formspree.io → New Form → l'id
 * nell'endpoint `https://formspree.io/f/xxxxxxxx`).
 * Finché resta il segnaposto il form si comporta come in una demo: valida,
 * mostra il messaggio di esito, ma avvisa che l'invio non è configurato.
 */
export const FORMSPREE_ID = "xxxxxxxx";

export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;

/** Vero quando il form è davvero collegato: usato per non fingere un invio. */
export const FORM_ATTIVO = !/^x+$/.test(FORMSPREE_ID);

/** Voci social del footer e della pagina contatti. */
export const SOCIAL = [
  { nome: "LinkedIn", href: LINKEDIN, handle: "Parliamo di lavoro" },
  { nome: "GitHub", href: GITHUB, handle: "Il codice, quello vero" },
] as const;
