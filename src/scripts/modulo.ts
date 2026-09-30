/**
 * Pezzi in comune dei moduli di /contatti (a passi e corto): errori scritti a
 * parole vicino al campo, esito dell'invio e invio a Formspree. Nessuna
 * validazione qui dentro: ogni modulo sa quali campi gli servono.
 */

type Controllo = HTMLInputElement | HTMLTextAreaElement;

/** Tutti i controlli con quel nome: per i radio sono più d'uno. */
export function controlli(form: HTMLFormElement, nome: string): Controllo[] {
  return [...form.querySelectorAll<Controllo>(`[name="${nome}"]`)];
}

/** Scrive l'errore nel suo riquadro (data-errore-per) e marca i campi. */
export function segnala(form: HTMLFormElement, nome: string, testo: string) {
  const box = form.querySelector<HTMLElement>(`[data-errore-per="${nome}"]`);
  if (!box) return;
  box.textContent = testo;
  for (const el of controlli(form, nome)) el.setAttribute("aria-invalid", "true");
}

export function pulisci(form: HTMLFormElement, nome: string) {
  const box = form.querySelector<HTMLElement>(`[data-errore-per="${nome}"]`);
  if (box) box.textContent = "";
  for (const el of controlli(form, nome)) el.removeAttribute("aria-invalid");
}

/** L'errore sparisce mentre correggi, non al prossimo invio. */
export function pulisciCorreggendo(form: HTMLFormElement, nomi: string[]) {
  for (const nome of nomi) {
    for (const el of controlli(form, nome)) {
      el.addEventListener("input", () => pulisci(form, nome));
      el.addEventListener("change", () => pulisci(form, nome));
    }
  }
}

/** L'esito (live region) sotto il modulo: "ok", "ko" o vuoto. */
export function scrivi(esito: HTMLElement | null, tipo: "ok" | "ko" | "", testo: string) {
  if (!esito) return;
  esito.textContent = testo;
  if (tipo) esito.dataset.tipo = tipo;
  else delete esito.dataset.tipo;
}

export type EsitoInvio = "ok" | "rifiutato" | "rete";

/** Un solo POST a Formspree, in JSON: niente redirect alla loro pagina. */
export async function invia(form: HTMLFormElement, dati: FormData): Promise<EsitoInvio> {
  try {
    const risposta = await fetch(form.action, {
      method: "POST",
      body: dati,
      headers: { Accept: "application/json" },
    });
    return risposta.ok ? "ok" : "rifiutato";
  } catch {
    return "rete";
  }
}

export const MESSAGGI_ERRORE_INVIO = {
  rifiutato: "Non è partito. Riprova, o scrivimi direttamente via email.",
  rete: "Connessione assente. Riprova tra poco, o scrivimi via email.",
} as const;
