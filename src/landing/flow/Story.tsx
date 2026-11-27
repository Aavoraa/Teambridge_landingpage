import { Fragment, useState } from 'react';
import { ArrowUpRight, Briefcase, Building2, UserRound } from 'lucide-react';
import { useInterval } from '../components/hooks';
import { Tile, type TileKind } from './Scene';
import { Count, MOTION_Q, MaskText, useHere, useMedia } from './motion';

/* ───────── Teams: big line settles at the top, three stepped cards rise ───────── */

const WORDS = ['Sales', 'HR', 'Finance', 'Managers', 'Employees'];

const STEPS: { label: string; title: string; kind: TileKind; tone: string }[] = [
  { title: 'Capture Leads,\nClose Deals', label: 'CRM & Pipeline', kind: 'funnel', tone: 'navy' },
  { title: 'Assign Tasks,\nRun Meetings', label: 'Projects, Tasks & Meetings', kind: 'calendar', tone: 'royal' },
  { title: 'Track Attendance,\nApprove Expenses', label: 'HR & Finance', kind: 'badge', tone: 'steel' },
];

export function Connected() {
  const animated = useMedia(MOTION_Q);
  const [ref, here] = useHere<HTMLElement>();
  const [word, setWord] = useState(0);

  useInterval(() => setWord((w) => (w + 1) % WORDS.length), 1700, animated);

  return (
    <section ref={ref} className={`f-page f-con ${here ? 'is-in' : ''}`} id="modules" aria-labelledby="con-title" data-page>
      <div className="f-con__big">
        <div className="f-con__sticker" aria-hidden="true">
          <Tile kind="bubble" />
        </div>
        <h2 id="con-title">
          Built For
          <span className="f-roller" aria-hidden="true">
            <span className="f-roller__track" style={{ transform: `translateY(${(-word * 100) / WORDS.length}%)` }}>
              {WORDS.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </span>
          </span>
          <span className="sr-only">: sales, HR, finance, managers and employees</span>
        </h2>
      </div>

      <ol className="f-steps">
        {STEPS.map((s, i) => (
          <li key={s.label} className={`f-step f-step--${i}`}>
            <h3>{s.title}</h3>
            <div className={`f-step__card f-step__card--${s.tone}`}>
              <span className="f-step__label">{s.label}</span>
              <Tile kind={s.kind} bare className="f-step__art" />
              <strong>0{i + 1}</strong>
              <ArrowUpRight className="f-step__arrow" aria-hidden="true" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────── Why: statement with inline tiles, then three figures ───────── */

const STATEMENT: (string | { tile: TileKind })[] = [
  'From', 'The', 'First', 'Lead', { tile: 'funnel' }, 'To', 'The', 'Final', 'Invoice,',
  'Your', 'Whole', 'Office', { tile: 'team' }, 'Works', 'In', 'One', 'System.',
];

const FACTS: { n: string; unit: string; tag: string; kind: TileKind; tone: string; text: string }[] = [
  {
    n: '8',
    unit: 'Modules',
    tag: 'One workspace',
    kind: 'chart',
    tone: 'royal',
    text: 'CRM, projects, tasks, meetings, finance, HR, chat and reports work from the same information.',
  },
  {
    n: '3',
    unit: 'Role Views',
    tag: 'Role-based access',
    kind: 'team',
    tone: 'navy',
    text: 'Owners, managers and employees each see what their role allows, based on the permissions you configure.',
  },
  {
    n: '1',
    unit: 'Office System',
    tag: 'AI reviewed by people',
    kind: 'badge',
    tone: 'steel',
    text: 'AI proposes tasks from voice notes and meetings. A person reviews them before they take effect.',
  },
];

function Fact({ fact, active }: { fact: (typeof FACTS)[number]; active: boolean }) {
  return (
    <li className="f-fact">
      <Tile kind={fact.kind} className="f-fact__tile" />
      <div className="f-fact__num">
        <span className={`f-fact__tag f-fact__tag--${fact.tone}`}>{fact.tag}</span>
        <strong>
          <Count value={fact.n} active={active} duration={1100} /> {fact.unit}
        </strong>
      </div>
      <p>{fact.text}</p>
    </li>
  );
}

export function Why() {
  const [ref, here] = useHere<HTMLElement>();
  return (
    <section ref={ref} className={`f-page f-why ${here ? 'is-in' : ''}`} id="why" aria-label="Why TeamBridge" data-page>
      <p className={`mask f-state__text ${here ? 'is-in' : ''}`}>
        {STATEMENT.map((w, i) => (
          <Fragment key={i}>
            <span className={typeof w === 'string' ? 'mw' : 'mw mw--tile'}>
              <span style={{ '--i': i } as React.CSSProperties}>{typeof w === 'string' ? w : <Tile kind={w.tile} />}</span>
            </span>{' '}
          </Fragment>
        ))}
      </p>
      <ul className="f-facts">
        {FACTS.map((f) => (
          <Fact key={f.unit} fact={f} active={here} />
        ))}
      </ul>
    </section>
  );
}

/* ───────── Roles: three staggered columns ───────── */

const ROLE_ICONS = { Owner: Building2, Manager: Briefcase, Employee: UserRound };
type RoleName = keyof typeof ROLE_ICONS;

const COLUMNS: { role: RoleName; focus: string; text: string }[][] = [
  [
    { role: 'Owner', focus: 'Business overview', text: 'See company-wide performance, departments and business analytics from a single overview.' },
    { role: 'Owner', focus: 'Control', text: 'Keep finance and cost visibility close, and manage how the system is administered.' },
  ],
  [
    { role: 'Manager', focus: 'Delivery', text: 'Follow department performance, oversee projects and assign tasks with clear owners.' },
    { role: 'Manager', focus: 'Approvals', text: 'Run meetings, review team productivity and handle approvals in one place.' },
  ],
  [
    { role: 'Employee', focus: 'Daily work', text: 'Know what to work on with assigned tasks, personal projects and upcoming meetings.' },
    { role: 'Employee', focus: 'Staying in the loop', text: 'Mark attendance, submit reimbursements, and keep up with team chat and notifications.' },
  ],
];

export function Roles() {
  const [ref, here] = useHere<HTMLElement>();

  return (
    <section ref={ref} className={`f-page f-roles ${here ? 'is-in' : ''}`} id="roles" aria-labelledby="roles-title" data-page>
      <MaskText id="roles-title" className="f-title" active={here} text={'What Everyone In\nThe Office Gets'} />
      <p className="f-roles__note">Access and permissions depend on the roles your organisation configures.</p>
      <div className="f-roles__grid">
        {COLUMNS.map((col, i) => (
          <div key={i} className={`f-roles__col f-roles__col--${i}`}>
            {col.map((card, n) => {
              const Icon = ROLE_ICONS[card.role];
              return (
                <article key={card.focus} className="f-role" style={{ '--i': i * 2 + n } as React.CSSProperties}>
                  <Icon aria-hidden="true" />
                  <p>{card.text}</p>
                  <footer>
                    <b>{card.role}</b>
                    <span>{card.focus}</span>
                  </footer>
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
