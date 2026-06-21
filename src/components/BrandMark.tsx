import './BrandMark.css';

interface BrandMarkProps {
  /** Glyph height in px (the wordmark scales with it). Default ~30. */
  size?: number;
  /** Show the "JigsawJam" serif wordmark beside the glyph. Default true. */
  showText?: boolean;
}

// Logo lives in /public so it's served from the site root (works under BASE_URL).
const LOGO_SRC = `${import.meta.env.BASE_URL}logo.png`;

/**
 * BrandMark - the JigsawJam identity: the jigsaw-piece logo image, optionally
 * paired with the serif wordmark.
 */
export function BrandMark({ size = 30, showText = true }: BrandMarkProps = {}) {
  // The rendered glyph is much larger than the wordmark cap-height reads.
  const glyphSize = Math.round(size * 2.1);
  return (
    <span
      className="brand"
      style={{ ['--brand-size' as string]: `${size}px` }}
    >
      <img
        className="brand-glyph"
        src={LOGO_SRC}
        width={glyphSize}
        height={glyphSize}
        alt="JigsawJam"
        decoding="async"
        draggable={false}
        // If the logo asset is missing, hide it rather than show a broken image.
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      {showText && (
        <span className="brand-text" aria-hidden="true">
          <span className="brand-word brand-word--jigsaw">Jigsaw</span>
          <span className="brand-word brand-word--jam">Jam</span>
        </span>
      )}
    </span>
  );
}
