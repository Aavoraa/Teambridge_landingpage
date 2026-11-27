import { useEffect, useRef, useState } from 'react';
import { BarChart3, Building2, CheckSquare, FolderKanban, Sparkles, Video } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';

const NODES = [
  {
    icon: Building2,
    name: 'CRM',
    team: 'Sales',
    flow: 'A deal is marked Won. The customer, contacts and agreed scope are ready to hand over.',
    carries: ['Customer record', 'Deal value', 'Key contacts'],
  },
  {
    icon: FolderKanban,
    name: 'Projects',
    team: 'Delivery',
    flow: 'An onboarding project is created for the customer, with milestones and an owner.',
    carries: ['Linked customer', 'Milestones', 'Project owner'],
  },
  {
    icon: CheckSquare,
    name: 'Tasks',
    team: 'Every team',
    flow: 'Work is broken down into tasks with assignees and deadlines across departments.',
    carries: ['Assignees', 'Due dates', 'Priority'],
  },
  {
    icon: Video,
    name: 'Meetings',
    team: 'Cross-functional',
    flow: 'Kick-off and review meetings capture decisions — and propose follow-up tasks.',
    carries: ['Transcript', 'Decisions', 'Proposed tasks'],
  },
  {
    icon: Sparkles,
    name: 'AI Automation',
    team: 'Operations',
    flow: 'Workflows route approvals, assign repeat work and notify the right people automatically.',
    carries: ['Approvals', 'Assignments', 'Notifications'],
  },
  {
    icon: BarChart3,
    name: 'Reports',
    team: 'Leadership',
    flow: 'Revenue, delivery and productivity roll up into live reports — no manual assembly.',
    carries: ['Revenue', 'Delivery status', 'Team performance'],
  },
];

export function Connected() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance only while visible and not being interacted with.
  useEffect(() => {
    if (paused || !inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % NODES.length), 3200);
    return () => window.clearInterval(id);
  }, [paused, inView]);

  const node = NODES[active];

  return (
    <section ref={sectionRef} className="section section--alt connected" id="integrations" aria-labelledby="connected-title">
      <div className="container">
        <SectionHead
          center
          id="connected-title"
          eyebrow="Connected modules"
          title="Every department works better when"
          accent="everything is connected."
          lead="Information moves forward automatically — from the first customer conversation to the report on your desk."
        />

        <Reveal className="flowmap">
          <div
            className="flowmap__track"
            role="tablist"
            aria-label="How information moves between modules"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <span className="flowmap__rail" aria-hidden="true">
              <i style={{ width: `${(active / (NODES.length - 1)) * 100}%` }} />
            </span>
            {NODES.map((n, i) => (
              <button
                key={n.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="flowmap-detail"
                className={`flowmap__node ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="flowmap__icon">
                  <n.icon aria-hidden="true" />
                </span>
                <b>{n.name}</b>
                <small>{n.team}</small>
              </button>
            ))}
          </div>

          <div id="flowmap-detail" role="tabpanel" className="flowmap__detail" aria-live="polite">
            <div key={node.name} className="flowmap__detail-inner">
              <div className="flowmap__step">
                Step {active + 1} of {NODES.length}
              </div>
              <h3>{node.name}</h3>
              <p>{node.flow}</p>
              <div className="flowmap__carries">
                <span>Passes forward</span>
                <ul>
                  {node.carries.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
