import { useId, useState } from "react";

interface Props {
  primaSrc: string;
  primaAlt: string;
  dopoSrc: string;
  dopoAlt: string;
  larghezza: number;
  altezza: number;
  etichetta: string;
}

/**
 * Slider prima/dopo.
 *
 * Il comando è un <input type="range"> vero, non un div con onMouseMove: così
 * arrivano gratis tastiera (frecce, Home, End, PageUp/PageDown), touch, screen
 * reader e stati di focus, che a mano si sbagliano quasi sempre. La traccia è
 * invisibile e resta visibile solo il pollice, allineato alla linea di taglio.
 */
export default function BeforeAfter({
  primaSrc,
  primaAlt,
  dopoSrc,
  dopoAlt,
  larghezza,
  altezza,
  etichetta,
}: Props) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <figure className="ba">
      <div
        className="ba__quadro"
        style={
          {
            "--pos": `${pos}%`,
            aspectRatio: `${larghezza} / ${altezza}`,
          } as React.CSSProperties
        }
      >
        <img className="ba__img" src={primaSrc} alt={primaAlt} width={larghezza} height={altezza} />
        <img
          className="ba__img ba__img--dopo"
          src={dopoSrc}
          alt={dopoAlt}
          width={larghezza}
          height={altezza}
        />

        <span className="ba__linea" aria-hidden="true" />

        <span className="ba__tag ba__tag--prima" aria-hidden="true">
          Prima
        </span>
        <span className="ba__tag ba__tag--dopo" aria-hidden="true">
          Dopo
        </span>

        <label className="ba__label" htmlFor={id}>
          {etichetta}
        </label>
        <input
          id={id}
          className="ba__range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${pos}% della versione nuova`}
        />
      </div>
    </figure>
  );
}
