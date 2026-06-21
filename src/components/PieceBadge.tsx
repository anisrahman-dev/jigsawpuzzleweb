import './PieceBadge.css';

/**
 * PieceBadge - a small decorative corner badge: an accent-colored jigsaw-piece
 * silhouette with the piece `count` overlaid in bold, with a soft warm shadow so
 * it reads on top of a photo. Drop it in the corner of a card.
 */
export function PieceBadge(props: { count: number; size?: number }): React.ReactElement {
  const { count } = props;
  const size = props.size ?? 44;
  // Keep the number legible inside the piece even for large counts.
  const fontSize = Math.max(10, Math.round(size * (count >= 1000 ? 0.3 : 0.38)));

  return (
    <span
      className="pbadge-root"
      style={{ width: size, height: size, fontSize }}
      role="img"
      aria-label={`${count} pieces`}
    >
      <svg
        className="pbadge-svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
      >
        {/*
          Classic jigsaw piece silhouette. Square body spanning 22-78 on each
          axis; each edge carries a centered rounded tab that bulges outward
          (top & right) or a blank that dips inward (bottom & left) for that
          recognisable interlocking look.
        */}
        <path
          className="pbadge-piece"
          d="M22 22
             L40 22
             C40 12 60 12 60 22
             L78 22
             L78 40
             C88 40 88 60 78 60
             L78 78
             L60 78
             C60 68 40 68 40 78
             L22 78
             L22 60
             C32 60 32 40 22 40
             Z"
        />
      </svg>
      <span className="pbadge-count">{count}</span>
    </span>
  );
}
