/**
 * GrainOverlay — the page's material tooth.
 *
 * A fixed, pointer-transparent whisper of paper grain over the whole site.
 * Deliberately near-invisible (~5% opacity, multiply): it is only felt when
 * the eye stops on a large flat ivory field. Not a film-grain filter.
 */
export function GrainOverlay() {
  return <div aria-hidden="true" className="grain-overlay" />;
}