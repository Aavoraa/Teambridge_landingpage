import { useState, type ComponentType } from 'react';
import { ArrowRight, MousePointerClick, X } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { ScaledFrame } from '../components/ScaledFrame';
import { useDemo } from '../components/DemoDialog';
import { siteConfig } from '../config';
import { NAV, type NavKey } from '../mockups/AppShell';
import { VoiceTaskPanel } from '../mockups/AiPanels';
import { ChatMockup } from '../mockups/ChatMockup';
import { DashboardMockup } from '../mockups/DashboardMockup';
import {
  FinanceMockup,
  HrMockup,
  MeetingsListMockup,
  PipelineMockup,
  ProjectsMockup,
  TasksMockup,
} from '../mockups/ProductMockups';
import { ShellContext } from '../mockups/ShellContext';

const VIEWS: Record<NavKey, ComponentType> = {
  dashboard: DashboardMockup,
  projects: ProjectsMockup,
  tasks: TasksMockup,
  crm: PipelineMockup,
  finance: FinanceMockup,
  hr: HrMockup,
  meetings: MeetingsListMockup,
  chat: ChatMockup,
};

const MODULES = ['CRM', 'Projects', 'Tasks', 'Meetings', 'Finance', 'HR', 'Chat', 'Reports', 'Automation'];

/* Sample content for the cards around the headline. */
const TASKS = [
  { title: 'Brightline onboarding plan', date: 'Fri', pct: 60, who: 'Priya' },
  { title: 'Acme renewal proposal', date: 'Thu', pct: 85, who: 'Vikram' },
];

function Cards() {
  return (
    <>
      <div className="hcol hcol--l" aria-hidden="true">
        <div className="hcard">
          <span className="hcard__label">Deal won</span>
          <b>Halcyon Retail</b>
          <strong className="hcard__num">₹21.4L</strong>
        </div>
        <div className="hcard">
          <span className="hcard__label">Today’s tasks</span>
          {TASKS.map((t) => (
            <div key={t.title} className="hcard__task">
              <b>{t.title}</b>
              <span className="hcard__bar">
                <i style={{ width: `${t.pct}%` }} />
              </span>
              <small>
                {t.who} · {t.date} · {t.pct}%
              </small>
            </div>
          ))}
        </div>
      </div>

      <div className="hcol hcol--r" aria-hidden="true">
        <div className="hcard">
          <span className="hcard__label">Up next · 10:30</span>
          <b>Acme renewal review</b>
          <small>AI summary after the call</small>
        </div>
        <div className="hcard">
          <span className="hcard__label">Attendance today</span>
          <strong className="hcard__num">
            64 <small>of 72 present</small>
          </strong>
          <span className="hcard__bar">
            <i style={{ width: '89%' }} />
          </span>
        </div>
      </div>
    </>
  );
}

export function Hero() {
  const [view, setView] = useState<NavKey>('dashboard');
  const [voice, setVoice] = useState(false);
  const { openDemo } = useDemo();
  const View = VIEWS[view];

  const go = (key: NavKey) => {
    setView(key);
    setVoice(false);
  };

  const overlay = voice ? (
    <div className="app-overlay" onClick={() => setVoice(false)}>
      <div className="app-overlay__panel" role="dialog" aria-label="Assign by voice demo" onClick={(e) => e.stopPropagation()}>
        <div className="app-overlay__head">
          <b>Assign by voice</b>
          <button type="button" onClick={() => setVoice(false)} aria-label="Close voice demo">
            <X />
          </button>
        </div>
        <VoiceTaskPanel autoStart />
      </div>
    </div>
  ) : null;

  return (
    <section className="hero hero--v2" id="top" aria-labelledby="hero-title">
      <div className="hpanel">
        <Cards />

        <div className="hpanel__center">
          <Reveal delay={80}>
            <h1 id="hero-title">
              Your Entire Business.
              <br />
              <span>One Intelligent Workspace.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="hpanel__lead">
              Manage customers, teams, projects, tasks and meetings from one connected platform. Automate everyday
              operations and give your organisation the clarity to move faster.
            </p>
          </Reveal>
          <Reveal delay={200} className="hpanel__ctas">
            <div className="hpanel__btns">
              <a href={siteConfig.auth.getStarted} className="btn btn--primary btn--lg">
                Get Started <ArrowRight className="btn__arrow" />
              </a>
              <a href="#platform" className="btn btn--secondary btn--lg">
                Explore the Platform
              </a>
            </div>
            <p className="hero__trust">
              Everything your team needs. Connected in one place. ·{' '}
              <button type="button" className="hpanel__link" onClick={openDemo}>
                Book a demo
              </button>
            </p>
          </Reveal>
        </div>

      </div>

      <div className="container" id="preview">
        <Reveal delay={120} className="hero__product">
          <div className="hero__demo-bar">
            <span className="hero__hint">
              <MousePointerClick aria-hidden="true" />
              Interactive preview — click around or try <b>Assign by voice</b>
            </span>
            <div className="hero__tabs" role="group" aria-label="Preview a module">
              {NAV.map((n) => (
                <button key={n.key} type="button" aria-pressed={view === n.key} className={view === n.key ? 'is-active' : ''} onClick={() => go(n.key)}>
                  <n.icon aria-hidden="true" />
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          <div className="product-frame hero__frame">
            <ShellContext.Provider value={{ interactive: true, compact: false, onNavigate: go, onVoice: () => setVoice(true), overlay }}>
              <ScaledFrame width={1440} height={940} interactive label="Interactive TeamBridge product preview">
                <View key={view} />
              </ScaledFrame>
            </ShellContext.Provider>
          </div>
        </Reveal>

        <Reveal className="hero__modules" delay={80}>
          <span>One platform for</span>
          <ul>
            {MODULES.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
