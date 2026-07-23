type HeroTitleProps = {
  lines: string[];
};

export function HeroTitle({ lines }: HeroTitleProps) {
  return (
    <h1
      className="hero-name hero-title font-display font-extrabold uppercase leading-[0.82] tracking-normal text-ink"
      aria-label={lines.join(" ")}
    >
      <span aria-hidden="true">
        {lines.map((line) => (
          <span className="block" key={line}>
            {[...line].map((letter, letterIndex) => (
              <span
                className="hero-letter"
                key={`${line}-${letter}-${letterIndex}`}
              >
                {letter}
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
