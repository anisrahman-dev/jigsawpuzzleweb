import './Spinner.css'

export function Spinner(props?: { size?: number }): React.ReactElement {
  const size = props?.size ?? 36
  const stroke = Math.max(2, Math.round(size / 9))

  return (
    <span
      className="spinner-root"
      role="status"
      style={
        {
          '--spinner-size': `${size}px`,
          '--spinner-stroke': `${stroke}px`,
        } as React.CSSProperties
      }
    >
      <span className="spinner-ring" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </span>
  )
}
