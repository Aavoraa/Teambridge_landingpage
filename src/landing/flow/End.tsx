import type { PointerEvent as ReactPointerEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { Accordion, type AccordionItem } from '../components/Accordion';
import { useDemo } from '../components/DemoDialog';
import { Logo } from '../components/Logo';
import { siteConfig } from '../config';
import { Orbit } from './Orbit';
import { MaskText, useHere } from './motion';

const FAQ: AccordionItem[] = [
  {
    q: 'What is TeamBridge?',
    a: 'TeamBridge is an all-in-one office CRM. It combines leads and deals, projects, tasks, meetings, finance, HR and attendance, team chat, reporting and AI-powered automation in a single workspace.',
  },
  {
    q: 'Can I manage my entire team using this platform?',
    a: 'Yes. You can organise employees into departments, assign roles and permissions, track daily attendance and distribute work alongside your customer and project data.',
  },
  {
    q: 'Can I conduct meetings inside the CRM?',
    a: 'Yes. Start instant or scheduled internal meetings with video, audio, screen sharing and chat. With participants’ consent, meetings can be recorded and transcribed, and AI can summarise them and propose follow-up tasks.',
  },
  {
    q: 'How does AI automation work?',
    a: 'You can describe a task by voice or text and receive a draft to confirm, or let AI propose tasks from a meeting summary for a manager to approve. AI suggestions are always reviewed by a person before they take effect.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every plan includes a 7-day free trial. Choose a plan in the pricing section and select Start 7-day free trial, then enter your details to begin.',
  },
  {
    q: 'How is pricing decided?',
    a: 'Plans are priced per employee per month, with a minimum of 10 employees. Yearly billing saves about 17% and is billed upfront. All prices are in INR and exclude applicable GST. For custom requirements, talk to our sales team.',
  },
];

export function Faq() {
  const [ref, here] = useHere<HTMLElement>();
  return (
    <section ref={ref} className={`f-page f-faq ${here ? 'is-in' : ''}`} id="faq" aria-labelledby="faq-title" data-page>
      <MaskText id="faq-title" className="f-title" active={here} text={'Frequently Asked\nQuestions'} />
      <Accordion items={FAQ} />
    </section>
  );
}

function Footer() {
  const { openDemo } = useDemo();
  const legal = [
    { label: 'Privacy Policy', href: siteConfig.legal.privacy },
    { label: 'Terms & Conditions', href: siteConfig.legal.terms },
    { label: 'Cancellation & Refunds', href: siteConfig.legal.cancellation },
  ];

  return (
    <footer className="f-foot">
      <Logo />
      <nav aria-label="Footer">
        <a href="#platform">Reports</a>
        <a href="#modules">Teams</a>
        <a href="#roles">Roles</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
        <button type="button" onClick={openDemo}>
          Book a Demo
        </button>
        <a href={siteConfig.auth.signIn}>Log in</a>
        {legal.map((l) => (
          <a key={l.label} href={l.href}>
            {l.label}
          </a>
        ))}
        {siteConfig.social.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>
        ))}
      </nav>
      <span>
        © {new Date().getFullYear()} {siteConfig.brand.name}
      </span>
    </footer>
  );
}

/** The panel's soft glow follows the mouse. */
function followMouse(e: ReactPointerEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--px', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--py', `${e.clientY - rect.top}px`);
}

/** Last page: the closing panel and the footer share one screen. */
export function FinalPage() {
  const { openDemo } = useDemo();
  const [ref, here] = useHere<HTMLElement>();

  return (
    <section ref={ref} className={`f-page f-final ${here ? 'is-in' : ''}`} aria-labelledby="final-title" data-page>
      <div className="f-final__panel" onPointerMove={followMouse}>
        <span className="f-final__grid" aria-hidden="true" />
        <span className="f-final__glow" aria-hidden="true" />
        <div className="f-final__copy">
          <h2 id="final-title">
            <MaskText as="span" className="f-final__mask" active={here} text={'Run Your Whole\nOffice From'} />{' '}
            <span className="f-final__pill">One CRM.</span>
          </h2>
          <p className="f-final__lead">Leads, tasks, attendance, meetings and approvals, all in one connected workspace.</p>
          <div className="f-final__ctas">
            <a href={siteConfig.auth.getStarted} className="fbtn fbtn--white fbtn--lg fbtn--shine f-final__go">
              Get Started <ArrowRight aria-hidden="true" />
            </a>
            <button type="button" className="fbtn fbtn--ghost fbtn--lg" onClick={openDemo}>
              Book a Demo
            </button>
          </div>
        </div>
        <Orbit />
      </div>
      <Footer />
    </section>
  );
}
