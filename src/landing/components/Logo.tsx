type LogoProps = { inverted?: boolean; className?: string };

/**
 * TeamBridge mark — approximation of the in-app logo (two linked rings over two linked rings).
 * Replace with the official SVG from the CRM codebase when available.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <g stroke="#2563EB" strokeWidth="3">
        <circle cx="10" cy="8.5" r="5" />
        <circle cx="22" cy="8.5" r="5" />
        <circle cx="9.5" cy="22.5" r="6.5" />
        <circle cx="22.5" cy="22.5" r="6.5" />
      </g>
    </svg>
  );
}

export function Logo({ inverted, className = '' }: LogoProps) {
  return (
    <span className={`logo ${inverted ? 'logo--inverted' : ''} ${className}`}>
      <LogoMark size={30} />
      <span className="logo__word">TeamBridge</span>
    </span>
  );
}
