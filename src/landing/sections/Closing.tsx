import { ArrowRight, Check, ClipboardCheck, History, KeyRound, LockKeyhole, ShieldCheck, UsersRound } from 'lucide-react';
import { Accordion, type AccordionItem } from '../components/Accordion';
import { useDemo } from '../components/DemoDialog';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { plans, siteConfig } from '../config';

/* ───────────────────────── Security ───────────────────────── */

const SECURITY = [
  { icon: UsersRound, title: 'Role-based access control', text: 'Owners, managers and employees each see what their role allows — nothing more.' },
  { icon: KeyRound, title: 'Permission management', text: 'Decide who can view, edit, assign and approve across every module.' },
  { icon: LockKeyhole, title: 'Secure authentication', text: 'Every session starts with authenticated sign-in to your organisation’s workspace.' },
  { icon: History, title: 'Activity tracking', text: 'A clear record of who changed what, and when — across customers, projects and tasks.' },
  { icon: ClipboardCheck, title: 'Controlled approvals', text: 'AI-proposed tasks and reimbursement requests wait for an authorised approver.' },
  { icon: ShieldCheck, title: 'Secure meeting access', text: 'Meetings are internal to your workspace, and recording requires participant consent.' },
];

export function Security() {
  return (
    <section className="section section--dark security" aria-labelledby="security-title">
      <div className="container">
        <div className="security__layout">
          <SectionHead
            id="security-title"
            eyebrow="Security & control"
            title="Your business data."
            accent="Your control."
            lead="TeamBridge is built around permissions from the ground up, so the right people have access to the right information — and every important action is accountable."
          />
          <div className="security__grid">
            {SECURITY.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 60} className="security__item">
                <s.icon aria-hidden="true" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Pricing ───────────────────────── */

export function Pricing() {
  const { openDemo } = useDemo();
  return (
    <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <SectionHead
          center
          id="pricing-title"
          eyebrow="Pricing"
          title="Plans that grow"
          accent="with your business."
          lead="Every organisation is structured differently. Tell us about your team and we’ll recommend the right plan and rollout."
        />
        <div className="plans">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 80} className={`plan ${p.featured ? 'plan--featured' : ''}`}>
              {p.featured && <span className="plan__tag">Recommended</span>}
              <h3>{p.name}</h3>
              <p className="plan__aud">{p.audience}</p>
              <div className="plan__price">
                {p.price ? (
                  <>
                    <strong>{p.price}</strong>
                    {p.priceNote && <span>{p.priceNote}</span>}
                  </>
                ) : (
                  <>
                    <strong>Custom</strong>
                    <span>Pricing on request</span>
                  </>
                )}
              </div>
              {p.cta === 'getStarted' ? (
                <a href={siteConfig.auth.getStarted} className={`btn ${p.featured ? 'btn--accent' : 'btn--secondary'} btn--lg plan__cta`}>
                  Get started
                </a>
              ) : (
                <button type="button" onClick={openDemo} className={`btn ${p.featured ? 'btn--accent' : 'btn--secondary'} btn--lg plan__cta`}>
                  Contact sales
                </button>
              )}
              <ul className="check-list">
                {p.highlights.map((h) => (
                  <li key={h}>
                    <Check aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <p className="pricing__note">Plan contents and pricing are confirmed with our team based on your organisation’s requirements.</p>
        <Reveal className="pricing__sales">
          <div>
            <b>Not sure which plan fits?</b>
            <span>Our team will walk you through the platform and help you plan your rollout.</span>
          </div>
          <button type="button" className="btn btn--primary" onClick={openDemo}>
            Talk to sales <ArrowRight className="btn__arrow" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

const FAQ: AccordionItem[] = [
  {
    q: 'What is TeamBridge?',
    a: 'TeamBridge is an all-in-one business management platform. It combines CRM, projects, tasks, meetings, finance, HR and attendance, team chat, reporting and AI-powered automation in a single workspace, so your teams work from the same information.',
  },
  {
    q: 'Can I manage my entire team using this platform?',
    a: 'Yes. You can organise employees into departments, assign roles and permissions, track daily attendance, distribute work and follow productivity — all alongside your customer and project data.',
  },
  {
    q: 'Does TeamBridge handle finance, HR and team chat?',
    a: 'Yes. Finance covers invoices, cost and profit, expense reports and reimbursements, with pending approvals and finance review. HR covers attendance and your team directory. Chat keeps employees talking in the same workspace as their work.',
  },
  {
    q: 'Does it support project and task management?',
    a: 'Yes. Plan projects with milestones and owners, break work into tasks with assignees, priorities and deadlines, and follow progress as work gets done.',
  },
  {
    q: 'Can I conduct meetings inside the CRM?',
    a: 'Yes. Start instant or scheduled internal meetings with video, audio, screen sharing and chat. With participants’ consent, meetings can be recorded and transcribed, and AI can summarise them and propose follow-up tasks.',
  },
  {
    q: 'How does AI automation work?',
    a: 'AI turns instructions and conversations into structured work. You can describe a task by voice or text and receive a draft to confirm, or let AI propose tasks from a meeting summary for a manager to approve. Configurable workflows automate repeat processes. AI suggestions are always reviewed by a person before they take effect.',
  },
  {
    q: 'Can managers control employee permissions?',
    a: 'Permissions follow the roles your organisation configures. Owners define what each role can see and do, and can delegate management of teams and departments to managers.',
  },
  {
    q: 'Can I customise the platform for my business?',
    a: 'TeamBridge is designed to adapt to how you work — including your departments, roles, pipeline stages and workflows. Book a demo to discuss your specific requirements.',
  },
  {
    q: 'Is onboarding support available?',
    a: 'Yes. Our team helps you plan your setup and rollout. The level of onboarding support depends on your plan — contact sales for details.',
  },
];

export function Faq() {
  const { openDemo } = useDemo();
  return (
    <section className="section section--alt faq" id="resources" aria-labelledby="faq-title">
      <div className="container faq__layout">
        <div className="faq__intro">
          <SectionHead
            id="faq-title"
            eyebrow="Resources · FAQ"
            title="Questions,"
            accent="answered."
            lead="Everything you need to know about getting started with TeamBridge."
          />
          <Reveal className="faq__help">
            <b>Still have questions?</b>
            <p>We’re happy to walk you through the platform.</p>
            <button type="button" className="btn btn--secondary" onClick={openDemo}>
              Book a demo
            </button>
          </Reveal>
        </div>
        <Reveal>
          <Accordion items={FAQ} />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Final CTA ───────────────────────── */

export function FinalCta() {
  const { openDemo } = useDemo();
  return (
    <section className="final" aria-labelledby="final-title">
      <div className="container final__inner">
        <Reveal delay={60}>
          <h2 id="final-title">
            Bring your entire business <span className="grad">into one workspace.</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p>
            Connect your people, customers and operations. Spend less time managing tools and more time moving your
            business forward.
          </p>
        </Reveal>
        <Reveal delay={180} className="final__ctas">
          <a href={siteConfig.auth.getStarted} className="btn btn--light btn--lg">
            Get Started <ArrowRight className="btn__arrow" />
          </a>
          <button type="button" className="btn btn--outline-light btn--lg" onClick={openDemo}>
            Book a Demo
          </button>
        </Reveal>
      </div>
    </section>
  );
}
