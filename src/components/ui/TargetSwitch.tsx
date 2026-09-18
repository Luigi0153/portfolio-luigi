import { useEffect, useState } from "react";

type Target = "dev" | "business";

const OPZIONI: { value: Target; label: string }[] = [
  { value: "dev", label: "Cerchi uno sviluppatore" },
  { value: "business", label: "Vuoi vendere online" },
];

/**
 * Switch dei due percorsi del sito. Lo stato visivo (thumb e colori) è guidato
 * dal CSS su html[data-target], così è corretto anche prima dell'idratazione:
 * qui si gestiscono solo click, aria-pressed e persistenza. Lo stato parte da
 * null (uguale sul server e sul client) per evitare mismatch di idratazione.
 */
export default function TargetSwitch() {
  const [target, setTarget] = useState<Target | null>(null);

  useEffect(() => {
    setTarget(
      document.documentElement.dataset.target === "business" ? "business" : "dev",
    );
  }, []);

  function scegli(t: Target) {
    setTarget(t);
    document.documentElement.dataset.target = t;
    try {
      localStorage.setItem("target", t);
    } catch {
      // storage non disponibile (es. navigazione privata): vale per la sessione
    }
  }

  return (
    <div className="tswitch" role="group" aria-label="Scegli il percorso">
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
