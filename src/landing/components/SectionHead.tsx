import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionHeadProps = {
  eyebrow: string;
  title: ReactNode;
  /** Trailing phrase rendered in the brand gradient, matching the hero headline. */
  accent?: string;
  lead?: ReactNode;
  center?: boolean;
  id?: string;
};

export function SectionHead({ eyebrow, title, accent, lead, center, id }: SectionHeadProps) {
  return (
    <Reveal className={`section-head ${center ? 'section-head--center' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>
        {title}
        {accent && (
          <>
            {' '}
            <span className="grad">{accent}</span>
          </>
        )}
      </h2>
      {lead && <p>{lead}</p>}
    </Reveal>
  );
}
