import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  CalendarClock,
  Check,
  CheckCircle2,
  FileAudio,
  FileText,
  FolderPlus,
  GitBranch,
  ListChecks,
  Mic,
  PenLine,
  Play,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap,
} from 'lucide-react';
import { prefersReducedMotion, useInView } from '../components/hooks';
import { Avatar } from './AppShell';

/* ───────────────────────── Voice task creation (interactive demo) ───────────────────────── */

type Part = string | { m: string };
type Command = {
  label: string;
  parts: Part[];
  assignee: string;
  dept: string;
  fields: { k: string; v: string }[];
};

const COMMANDS: Command[] = [
  {
    label: 'Onboarding for Priya',
    parts: ['Assign ', { m: 'Priya' }, ' the ', { m: 'client onboarding' }, ' task and set the deadline for ', { m: 'Friday' }, '.'],
    assignee: 'Priya Sharma',
    dept: 'Customer Success',
    fields: [
      { k: 'Task', v: 'Client onboarding' },
      { k: 'Assignee', v: 'Priya Sharma · Customer Success' },
      { k: 'Due', v: 'Friday, 7 November' },
      { k: 'Project', v: 'Client onboarding — Brightline' },
    ],
  },
  {
    label: 'Proposal for Vikram',
    parts: ['Ask ', { m: 'Vikram' }, ' to send the ', { m: 'revised Acme proposal' }, ' by ', { m: 'Thursday' }, '.'],
    assignee: 'Vikram Shah',
    dept: 'Sales',
    fields: [
      { k: 'Task', v: 'Send revised Acme proposal' },
      { k: 'Assignee', v: 'Vikram Shah · Sales' },
      { k: 'Due', v: 'Thursday, 6 November' },
      { k: 'Project', v: 'Acme Corp renewal' },
    ],
  },
  {
    label: 'Checklist for Rahul',
    parts: ['Remind ', { m: 'Rahul' }, ' to review the ', { m: 'rollout checklist' }, ' on ', { m: 'Monday' }, ', ', { m: 'high priority' }, '.'],
    assignee: 'Rahul Mehta',
    dept: 'Engineering',
    fields: [
      { k: 'Task', v: 'Review rollout checklist' },
      { k: 'Assignee', v: 'Rahul Mehta · Engineering' },
      { k: 'Due', v: 'Monday, 10 November · High priority' },
      { k: 'Project', v: 'Platform rollout' },
    ],
  },
];

const plain = (parts: Part[]) => parts.map((p) => (typeof p === 'string' ? p : p.m)).join('');

type Phase = 'idle' | 'listening' | 'parsing' | 'draft' | 'done';

export function VoiceTaskPanel({ autoStart = false }: { autoStart?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.5 });
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [typed, setTyped] = useState('');
  const [filled, setFilled] = useState(0);
  const started = useRef(false);
  const cmd = COMMANDS[idx];
  const text = plain(cmd.parts);

  const run = (i: number) => {
    setIdx(i);
    setTyped('');
    setFilled(0);
    setPhase('listening');
  };

  // Play the first example automatically when the panel comes into view.
  useEffect(() => {
    if ((autoStart || inView) && !started.current) {
      started.current = true;
      run(0);
    }
  }, [autoStart, inView]);

  // "Speech" — type out the command.
  useEffect(() => {
    if (phase !== 'listening') return;
    if (prefersReducedMotion()) {
      setTyped(text);
      setPhase('parsing');
      return;
    }
    let n = 0;
    let done: number | undefined;
    const id = window.setInterval(() => {
      n += 1;
      setTyped(text.slice(0, n));
      if (n >= text.length) {
        window.clearInterval(id);
        done = window.setTimeout(() => setPhase('parsing'), 400);
      }
    }, 32);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(done);
    };
  }, [phase, text]);

  // AI parsing — fill the draft field by field.
  useEffect(() => {
    if (phase !== 'parsing') return;
    let k = 0;
    const id = window.setInterval(
      () => {
        k += 1;
        setFilled(k);
        if (k >= cmd.fields.length) {
          window.clearInterval(id);
          setPhase('draft');
        }
      },
      prefersReducedMotion() ? 1 : 280,
    );
    return () => window.clearInterval(id);
  }, [phase, cmd]);

  const listening = phase === 'listening';
  const status =
    phase === 'idle' ? 'Tap the mic to start' : listening ? 'Listening…' : phase === 'parsing' ? 'Understanding…' : 'Ready for review';

  return (
    <div ref={ref} className="ai-panel voice">
      <div className="voice__input">
        <button
          type="button"
          className={`voice__mic ${listening ? 'is-listening' : ''}`}
          onClick={() => run(phase === 'done' ? (idx + 1) % COMMANDS.length : idx)}
          aria-label="Speak a task"
        >
          <Mic />
        </button>
        <div className={`voice__wave ${listening ? 'is-live' : ''}`} aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${(i % 7) * 90}ms`, height: `${30 + ((i * 37) % 60)}%` }} />
          ))}
        </div>
        <span className="voice__status" aria-live="polite">
          {status}
        </span>
      </div>

      <p className="voice__quote">
        {phase === 'idle' ? (
          <span className="voice__placeholder">Say something like “Assign Priya the onboarding task for Friday”.</span>
        ) : listening ? (
          <>
            “{typed}
            <span className="voice__caret" />
          </>
        ) : (
          <>
            “
            {cmd.parts.map((p, i) => (typeof p === 'string' ? <span key={i}>{p}</span> : <mark key={i}>{p.m}</mark>))}”
          </>
        )}
      </p>

      <div className="voice__draft">
        <div className="voice__draft-head">
          <Sparkles /> Draft task — review before assigning
        </div>
        <dl>
          {cmd.fields.map((f, i) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              {i < filled ? (
                <dd className="is-filled">
                  {f.k === 'Assignee' && <Avatar name={cmd.assignee} size="xs" />}
                  {f.k === 'Due' && <CalendarClock />}
                  {f.v}
                </dd>
              ) : (
                <dd>
                  <span className="voice__skeleton" />
                </dd>
              )}
            </div>
          ))}
        </dl>
        {phase === 'done' ? (
          <div className="voice__done" role="status">
            <CheckCircle2 /> Task assigned to {cmd.assignee}
            <button type="button" onClick={() => run((idx + 1) % COMMANDS.length)}>
              Try another
            </button>
          </div>
        ) : (
          <div className="voice__btns">
            <button type="button" className="mbtn mbtn--ghost" disabled={phase !== 'draft'}>
              <PenLine /> Edit
            </button>
            <button type="button" className="mbtn mbtn--primary" disabled={phase !== 'draft'} onClick={() => setPhase('done')}>
              <Check /> Confirm &amp; assign
            </button>
          </div>
        )}
      </div>

      <div className="voice__examples">
        <span>Try an example:</span>
        {COMMANDS.map((c, i) => (
          <button key={c.label} type="button" className={i === idx && phase !== 'idle' ? 'is-active' : ''} onClick={() => run(i)}>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Meeting intelligence pipeline ───────────────────────── */

const STEPS = [
  { icon: FileAudio, label: 'Meeting', detail: 'Internal call starts' },
  { icon: ShieldCheck, label: 'Recording with consent', detail: 'Participants are notified' },
  { icon: FileText, label: 'Transcription', detail: 'Speaker-labelled transcript' },
  { icon: Sparkles, label: 'AI summary', detail: 'Key points in seconds' },
  { icon: GitBranch, label: 'Decisions', detail: 'What was agreed' },
  { icon: ListChecks, label: 'Proposed tasks', detail: 'Owners and due dates' },
  { icon: UserCheck, label: 'Manager approval', detail: 'Nothing assigned without sign-off' },
];

export function MeetingPipelinePanel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setActive(STEPS.length - 1);
      return;
    }
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % STEPS.length), 1600);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div className="ai-panel mpipe">
      <ol className="mpipe__steps" onMouseLeave={() => setPaused(false)}>
        {STEPS.map((s, i) => (
          <li key={s.label} className={i < active ? 'is-done' : i === active ? 'is-active' : ''}>
            <button
              type="button"
              className="mpipe__btn"
              onClick={() => {
                setPaused(true);
                setActive(i);
              }}
            >
              <span className="mpipe__dot">{i < active ? <Check /> : <s.icon />}</span>
              <span>
                <b>{s.label}</b>
                <small>{s.detail}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mpipe__summary">
        <div className="mpipe__summary-head">
          <Sparkles /> Summary · Acme renewal review
        </div>
        <p>Team agreed to proceed with the 180-seat renewal on a 24-month term. Revised proposal goes out Thursday.</p>
        <div className="mpipe__task">
          <CheckCircle2 />
          <span>
            <b>Send revised proposal</b> · Vikram Shah · Thu
          </span>
          <em>{active === STEPS.length - 1 ? 'Approved' : 'Pending approval'}</em>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Workflow automation (test run) ───────────────────────── */

const ACTIONS = [
  { icon: FolderPlus, t: 'Create onboarding project' },
  { icon: ListChecks, t: 'Assign kick-off task to CS lead' },
  { icon: UserCheck, t: 'Request manager approval' },
  { icon: Bell, t: 'Notify Customer Success team' },
];

export function WorkflowPanel() {
  const [step, setStep] = useState(-1);
  const [active, setActive] = useState(true);
  const running = step >= 0 && step < ACTIONS.length + 2;
  const total = ACTIONS.length + 2;

  useEffect(() => {
    if (step < 0 || step >= total) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), prefersReducedMotion() ? 1 : 550);
    return () => window.clearTimeout(id);
  }, [step, total]);

  const isRun = (i: number) => step > i;

  return (
    <div className="ai-panel flow">
      <div className="flow__toolbar">
        <button type="button" className="flow__toggle" aria-pressed={active} onClick={() => setActive((a) => !a)}>
          <span className="flow__switch" /> {active ? 'Active' : 'Paused'}
        </button>
        <button type="button" className="mbtn mbtn--primary flow__run" onClick={() => setStep(0)} disabled={running}>
          <Play /> {running ? 'Running…' : 'Run test'}
        </button>
      </div>
      <div className={`flow__node flow__node--trigger ${isRun(0) ? 'is-run' : ''}`}>
        <span className="flow__ico">
          <Zap />
        </span>
        <div>
          <small>When</small>
          <b>Deal stage changes to Won</b>
        </div>
        {isRun(0) && <CheckCircle2 className="flow__check" />}
      </div>
      <span className="flow__line" />
      <div className={`flow__node flow__node--cond ${isRun(1) ? 'is-run' : ''}`}>
        <span className="flow__ico">
          <GitBranch />
        </span>
        <div>
          <small>If</small>
          <b>Deal value is above ₹10L</b>
        </div>
        {isRun(1) && <CheckCircle2 className="flow__check" />}
      </div>
      <span className="flow__line" />
      <div className="flow__actions">
        {ACTIONS.map((a, i) => (
          <div key={a.t} className={`flow__node flow__node--action ${isRun(i + 2) ? 'is-run' : ''}`}>
            <span className="flow__ico">
              <a.icon />
            </span>
            <b>{a.t}</b>
            {isRun(i + 2) && <CheckCircle2 className="flow__check" />}
          </div>
        ))}
      </div>
      {step >= total && (
        <p className="flow__result" role="status">
          Test run complete — trigger matched and {ACTIONS.length} actions ran on sample data.
        </p>
      )}
    </div>
  );
}
