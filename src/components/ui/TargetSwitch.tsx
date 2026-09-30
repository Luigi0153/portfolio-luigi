import { useEffect, useState } from "react";
import "./TargetSwitch.css";

type Target = "dev" | "business";

const OPZIONI: { value: Target; label: string }[] = [
  { value: "dev", label: "Cerchi uno sviluppatore" },
  { value: "business", label: "Vuoi vendere online" },
];

interface Props {
  /**
   * Per /contatti: senza una scelta salvata nessuna voce risulta premuta,
   * invece di partire da "dev". Nell'hero la scelta di partenza è "dev".
   */
  chiediScelta?: boolean;
}

/**
 * Switch dei due percorsi del sito. Lo stato visivo (thumb e colori) è guidato
 * dal CSS su html[data-target], così è corretto anche prima dell'idratazione:
 * qui si gestiscono solo click, aria-pressed e persistenza. Lo stato parte da
 * null (uguale sul server e sul client) per evitare mismatch di idratazione.
 * html[data-scelto] dice se la scelta esiste davvero (lo scrive lo script in
 * Base.astro, leggendo localStorage).
 */
export default function TargetSwitch({ chiediScelta = false }: Props) {
  const [target, setTarget] = useState<Target | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (chiediScelta && html.dataset.scelto !== "si") return;
    setTarget(html.dataset.target === "business" ? "business" : "dev");
  }, [chiediScelta]);

  function scegli(t: Target) {
    setTarget(t);
    document.documentElement.dataset.target = t;
    document.documentElement.dataset.scelto = "si";
    try {
      localStorage.setItem("target", t);
    } catch {
      // storage non disponibile (es. navigazione privata): vale per la sessione
    }
  }

  return (
    <div
      className={chiediScelta ? "tswitch tswitch--chiedi" : "tswitch"}
      role="group"
      aria-label="Scegli il percorso"
    >
      {OPZIONI.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className="tswitch__opt"
          data-value={value}
          aria-pressed={target === null ? undefined : target === value}
          onClick={() => scegli(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
