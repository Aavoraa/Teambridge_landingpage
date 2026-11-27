import { useState } from 'react';
import {
  CheckSquare,
  Circle,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { prefersReducedMotion, useInView, useInterval } from '../components/hooks';
import { Avatar } from './AppShell';

const PEOPLE = [
  { n: 'Ananya Rao', role: 'Host' },
  { n: 'Vikram Shah', role: 'Sales' },
  { n: 'Priya Sharma', role: 'Customer Success', muted: true },
  { n: 'Lena Ortiz', role: 'Account Exec' },
];

const SCRIPT = [
  { who: 'Ananya Rao', text: 'Let’s close out the Acme renewal. Where did we land on seats?' },
  { who: 'Lena Ortiz', text: 'They want to move from 120 to 180 seats on a 24-month term.' },
  { who: 'Ananya Rao', text: 'So we agree the renewal moves forward with the expanded seat count.' },
  { who: 'Vikram Shah', text: 'Yes. I’ll send the revised proposal to Acme by Thursday.' },
  { who: 'Priya Sharma', text: 'I can run onboarding for the new team once the contract is signed.' },
  { who: 'Ananya Rao', text: 'Perfect — let’s capture both as actions.' },
];

const ACTIONS = [
  { at: 4, t: 'Send revised proposal to Acme', who: 'Vikram Shah', due: 'Thu' },
  { at: 5, t: 'Plan onboarding for new Acme team', who: 'Priya Sharma', due: 'After signature' },
];

const START = 43 * 60 + 18;
const fmt = (s: number) =>
  `00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function MeetingMockup() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
  const still = prefersReducedMotion();
  const [secs, setSecs] = useState(START);
  const [lines, setLines] = useState(still ? SCRIPT.length : 1);

  useInterval(() => setSecs((s) => s + 1), 1000, inView && !still);
  useInterval(() => setLines((l) => (l >= SCRIPT.length + 2 ? 1 : l + 1)), 2600, inView && !still);

  const shown = SCRIPT.slice(0, Math.min(lines, SCRIPT.length));
  const visible = shown.slice(-4);
  const speaker = shown[shown.length - 1]?.who;
  const actions = ACTIONS.filter((a) => lines >= a.at);

  return (
    <div ref={ref} className="meet">
      <div className="meet__stage">
        <header className="meet__top">
          <div>
            <b>Acme Corp — renewal review</b>
            <span>Internal · 4 participants</span>
          </div>
          <span className="meet__rec">
            <i /> Recording · consent confirmed
          </span>
          <span className="meet__timer">{fmt(secs)}</span>
        </header>

        <div className="meet__content">
          <div className="meet__share">
            <div className="meet__share-label">
              <MonitorUp /> Vikram Shah is presenting
            </div>
            <div className="share-doc">
              <b>Acme Corp · Renewal proposal</b>
              <div className="share-doc__cols">
                <div>
                  <small>Current plan</small>
                  <strong>120 seats</strong>
                </div>
                <div>
                  <small>Proposed</small>
                  <strong>180 seats</strong>
                </div>
                <div>
                  <small>Term</small>
                  <strong>24 months</strong>
                </div>
              </div>
              <div className="share-doc__bars">
                {[40, 55, 48, 70, 64, 82].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="meet__tiles">
            {PEOPLE.map((p, i) => (
              <div key={p.n} className={`tile ${p.n === speaker ? 'is-talking' : ''}`}>
                <Avatar name={p.n} size="lg" i={i + 2} />
                <span className="tile__name">
                  {p.muted && p.n !== speaker ? <MicOff /> : <Mic />}
                  {p.n.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <footer className="meet__controls">
          <span className="ctl">
            <Mic />
          </span>
          <span className="ctl">
            <Video />
          </span>
          <span className="ctl is-on">
            <MonitorUp />
          </span>
          <span className="ctl">
            <MessageSquare />
          </span>
          <span className="ctl">
            <Users />
          </span>
          <span className="ctl ctl--end">
            <PhoneOff />
          </span>
        </footer>
      </div>

      <aside className="meet__intel">
        <div className="intel__head">
          <Sparkles />
          <b>Meeting intelligence</b>
        </div>
        <div className="intel__tabs">
          <b>Transcript</b>
          <span>Summary</span>
          <span>Actions · {actions.length}</span>
        </div>
        <ul className="intel__transcript">
          {visible.map((l) => (
            <li key={l.text}>
              <Avatar name={l.who} size="xs" />
              <div>
                <span>
                  <b>{l.who}</b> <small>{fmt(secs).slice(3)}</small>
                </span>
                <p>{l.text}</p>
              </div>
            </li>
          ))}
        </ul>
        {lines < SCRIPT.length && (
          <span className="intel__typing" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
        <div className="intel__actions">
          <small>Proposed action items</small>
          {actions.length === 0 && <span className="intel__waiting">Listening for decisions…</span>}
          {actions.map((a) => (
            <div key={a.t} className="intel__item">
              <CheckSquare />
              <div>
                <b>{a.t}</b>
                <span>
                  {a.who} · {a.due}
                </span>
              </div>
            </div>
          ))}
          <div className="intel__approve">
            <Circle /> Awaiting manager approval
          </div>
        </div>
      </aside>
    </div>
  );
}
