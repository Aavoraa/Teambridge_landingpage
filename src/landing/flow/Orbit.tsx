import { LogoMark } from '../components/Logo';
import { NAV, type NavKey } from '../mockups/AppShell';

const RINGS: { keys: NavKey[]; name: string }[] = [
  { keys: ['crm', 'tasks', 'meetings'], name: 'inner' },
  { keys: ['dashboard', 'projects', 'finance', 'hr', 'chat'], name: 'outer' },
];

/** TeamBridge at the centre, with every CRM module circling it. */
export function Orbit() {
  let order = 0;
  return (
    <div className="f-orb" aria-hidden="true">
      <span className="f-orb__pulse" />
      <span className="f-orb__pulse f-orb__pulse--late" />
      <div className="f-orb__core">
        <LogoMark size={46} />
      </div>
      {RINGS.map((ring) => (
        <div key={ring.name} className={`f-orb__ring f-orb__ring--${ring.name}`}>
          {ring.keys.map((key, i) => {
            const nav = NAV.find((n) => n.key === key)!;
            const angle = (360 / ring.keys.length) * i;
            return (
              <div key={key} className="f-orb__seat" style={{ '--a': `${angle}deg` } as React.CSSProperties}>
                <div className="f-orb__upright">
                  <div className="f-orb__item" style={{ '--i': order++ } as React.CSSProperties}>
                    <span>
                      <nav.icon />
                    </span>
                    <b>{nav.label}</b>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
