import './BrandMark.css';

interface BrandMarkProps {
  /** Glyph height in px (the wordmark scales with it). Default ~30. */
  size?: number;
  /** Show the "JigsawJam" serif wordmark beside the glyph. Default true. */
  showText?: boolean;
}

/**
 * BrandMark - the JigsawJam identity: an inline-SVG interlocking-piece
 * glyph in the marigold→terracotta accent, optionally paired with the serif
 * wordmark. No external assets.
 */
export function BrandMark({ size = 30, showText = true }: BrandMarkProps = {}) {
  const gradId = 'brand-grad';
  return (
    <span
      className="brand"
      style={{ ['--brand-size' as string]: `${size}px` }}
    >
      <svg
        className="brand-glyph"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        role="img"
        aria-label="JigsawJam"
        focusable="false"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="55%" stopColor="var(--accent-strong)" />
            <stop offset="100%" stopColor="var(--accent-deep)" />
          </linearGradient>
        </defs>
        {/* Rounded paper tile behind the piece for a soft, premium feel */}
        <rect
          className="brand-tile"
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12"
        />
        {/*
          A single, well-formed jigsaw piece: square body with a knob on the
          top edge and a matching socket on the right edge - the classic
          interlocking silhouette, drawn with smooth bezier tabs.
        */}
        <path
          className="brand-piece"
          fill={`url(#${gradId})`}
          d="
            M14 13
            h6
            c0 -3 1.6 -5 4 -5
            s4 2 4 5
            h6
            v6
            c3 0 5 1.6 5 4
            s-2 4 -5 4
            v6
            h-6
            c0 3 -1.6 5 -4 5
            s-4 -2 -4 -5
            h-6
            v-6
            c-3 0 -5 -1.6 -5 -4
            s2 -4 5 -4
            z
          "
        />
        {/* Subtle glossy highlight on the piece */}
        <path
          className="brand-shine"
          d="M14 13 h6 c0 -3 1.6 -5 4 -5 s4 2 4 5 h6 v3 h-20 z"
        />
      </svg>

      {showText && (
        <span className="brand-text" aria-hidden="true">
          <span className="brand-word brand-word--jigsaw">Jigsaw</span>
          <span className="brand-word brand-word--jam">Jam</span>
        </span>
      )}
    </span>
  );
}
