export function HeroScrollIndicator() {
  return (
    <a
      href="#main"
      aria-label="Scroll to featured content"
      className="hero-scroll-indicator group hidden flex-col items-center gap-4 lg:flex"
    >
      <span className="type-metadata text-ivory-secondary transition-colors duration-standard ease-standard group-hover:text-ivory">
        Scroll
      </span>
      <span className="relative h-16 w-px overflow-hidden bg-ivory/25">
        <span className="hero-scroll-cue absolute inset-x-0 top-0 h-9 bg-ivory/60" />
      </span>
    </a>
  );
}