import { useRef, useState, type KeyboardEvent } from 'react';
import { Mic, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { MeetingPipelinePanel, VoiceTaskPanel, WorkflowPanel } from '../mockups/AiPanels';

const CAPABILITIES = [
  {
    key: 'voice',
    icon: Mic,
    label: 'AI Voice Task Creation',
    title: 'Speak a task. Review it. Assign it.',
    text: 'Describe work in plain language — by voice or text. TeamBridge AI interprets the request, matches the right employee from your directory, fills in the due date and project, and prepares a draft task for you to confirm.',
    points: ['Understands names, dates and projects', 'Matches people from your employee directory', 'Nothing is assigned until you confirm'],
    panel: <VoiceTaskPanel />,
  },
  {
    key: 'meetings',
    icon: Sparkles,
    label: 'AI Meeting Intelligence',
    title: 'From conversation to committed work.',
    text: 'With participants’ consent, meetings are recorded and transcribed. AI produces a summary, captures the decisions made and proposes tasks with owners — which a manager reviews before anything is assigned.',
    points: ['Recording only with consent', 'Summaries, decisions and proposed tasks', 'Manager approval before tasks go live'],
    panel: <MeetingPipelinePanel />,
  },
  {
    key: 'workflow',
    icon: Workflow,
    label: 'Intelligent Workflow Automation',
    title: 'Automate the processes you repeat every week.',
    text: 'Build configurable workflows from triggers, conditions and actions. When a deal is won, a project can be created, kick-off tasks assigned and the right team notified — with approval steps wherever you need them.',
    points: ['Triggers, conditions and actions', 'Approval steps built into the flow', 'Configured to match your processes'],
    panel: <WorkflowPanel />,
  },
];

export function AiAutomation() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = CAPABILITIES[active];

  const onKeyDown = (e: KeyboardEvent) => {
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + CAPABILITIES.length) % CAPABILITIES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="section section--dark ai" id="ai" aria-labelledby="ai-title">
      <div className="ai__glow" aria-hidden="true" />
      <div className="container">
        <SectionHead
          id="ai-title"
          eyebrow="AI Automation"
          center
          title="Let AI handle"
          accent="the work behind the work."
          lead="TeamBridge AI takes care of the coordination that slows teams down — turning instructions and conversations into structured, assignable work, while people stay in control of every decision."
        />

        <div className="ai__layout">
          <div className="ai__tabs" role="tablist" aria-label="AI capabilities" aria-orientation="vertical" onKeyDown={onKeyDown}>
            {CAPABILITIES.map((c, i) => (
              <button
                key={c.key}
                ref={(el) => (tabs.current[i] = el)}
                role="tab"
                type="button"
                id={`ai-tab-${c.key}`}
                aria-selected={i === active}
                aria-controls={`ai-panel-${c.key}`}
                tabIndex={i === active ? 0 : -1}
                className={`ai__tab ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="ai__tab-head">
                  <span className="ai__tab-letter">{String.fromCharCode(65 + i)}</span>
                  <c.icon aria-hidden="true" />
                  <b>{c.label}</b>
                </span>
                <span className="ai__tab-body">
                  <span className="ai__tab-title">{c.title}</span>
                  <span className="ai__tab-text">{c.text}</span>
                  <span className="ai__tab-points">
                    {c.points.map((p) => (
                      <span key={p}>{p}</span>
                    ))}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <Reveal className="ai__stage">
            <div
              key={current.key}
              role="tabpanel"
              id={`ai-panel-${current.key}`}
              aria-labelledby={`ai-tab-${current.key}`}
              className="ai__panel"
            >
              {current.panel}
            </div>
          </Reveal>
        </div>

        <Reveal className="ai__principle">
          <ShieldCheck aria-hidden="true" />
          <p>
            <strong>AI drafts. People decide.</strong> AI suggestions are proposals — tasks, assignments and approvals are
            always confirmed by someone with the right permissions.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
