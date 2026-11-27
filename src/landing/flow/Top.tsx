import { useEffect, useRef, useState, type ComponentType, type PointerEvent as ReactPointerEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { useDemo } from '../components/DemoDialog';
import { useInterval } from '../components/hooks';
import { Logo } from '../components/Logo';
import { ScaledFrame } from '../components/ScaledFrame';
import { siteConfig } from '../config';
import { VoiceTaskPanel } from '../mockups/AiPanels';
import { NAV, type NavKey } from '../mockups/AppShell';
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
import { GeoLines } from './Scene';
import { Count, MOTION_Q, MaskText, docTop, easeInOut, easeOut, lerp, seg, useMedia, useScrollFrame } from './motion';

const LINKS = [
  { href: '#platform', label: 'Reports' },
  { href: '#modules', label: 'Teams' },
  { href: '#why', label: 'Why TeamBridge' },
  { href: '#roles', label: 'Roles' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [mark, setMark] = useState({ left: 0, width: 0 });
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useScrollFrame(() => {
    const y = window.scrollY;
    const h = window.innerHeight;
    const max = document.documentElement.scrollHeight - h;
    if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    let current = -1;
    LINKS.forEach((l, i) => {
      const target = document.querySelector<HTMLElement>(l.href);
      if (target && docTop(target) - y <= h * 0.5) current = i;
    });
    // The closing page has no nav link of its own.
    const last = document.querySelector<HTMLElement>('.f-final');
    if (last && docTop(last) - y <= h * 0.5) current = -1;
    setActive(current);
  });

  // The highlight slides to the link for the page on screen.
  useEffect(() => {
    const link = links.current[active];
    if (link) setMark({ left: link.offsetLeft, width: link.offsetWidth });
  }, [active]);

  return (
    <header className={`fnav ${open ? 'is-open' : ''}`}>
      <div className="fnav__inner">
        <a href="#top" className="fnav__brand" aria-label="TeamBridge home" onClick={() => setOpen(false)}>
          <Logo />
        </a>
        <nav className="fnav__pill" aria-label="Primary">
          <span className={`fnav__mark ${active >= 0 ? 'is-on' : ''}`} style={{ left: mark.left, width: mark.width }} aria-hidden="true" />
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              ref={(n) => {
                links.current[i] = n;
              }}
              className={active === i ? 'is-active' : ''}
              aria-current={active === i ? 'true' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="fnav__actions">
          <a href={siteConfig.auth.signIn} className="fnav__login">
            Log in
          </a>
          <a href={siteConfig.auth.getStarted} className="fbtn fbtn--ink fbtn--sm">
            Get Started
          </a>
        </div>
        <button
          type="button"
          className="fnav__toggle"
          aria-expanded={open}
          aria-controls="f-mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <span ref={progress} className="fnav__progress" aria-hidden="true" />
      <div id="f-mobile-menu" className="fnav__mobile" hidden={!open}>
        <nav aria-label="Mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href={siteConfig.auth.signIn}>Log in</a>
          <a href={siteConfig.auth.getStarted} className="fbtn fbtn--royal fbtn--lg">
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}

const VIEWS: Record<NavKey, ComponentType> = {
  dashboard: DashboardMockup,
  crm: PipelineMockup,
  projects: ProjectsMockup,
  tasks: TasksMockup,
  finance: FinanceMockup,
  hr: HrMockup,
  meetings: MeetingsListMockup,
  chat: ChatMockup,
};

const TOUR_MS = 3800;
const INTRO_MS = 1500;

export function Hero() {
  const { openDemo } = useDemo();
  const animated = useMedia(MOTION_Q);
  const [view, setView] = useState<NavKey>('dashboard');
  const [voice, setVoice] = useState(false);
  const [opened, setOpened] = useState(false);
  const [touring, setTouring] = useState(true);
  const View = VIEWS[view];
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const back1 = useRef<HTMLDivElement>(null);
  const back2 = useRef<HTMLDivElement>(null);
  const product = useRef<HTMLDivElement>(null);
  const note = useRef<HTMLParagraphElement>(null);
  const geo = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLDivElement>(null);
  const intro = useRef(0);

  const go = (key: NavKey) => {
    setView(key);
    setVoice(false);
  };

  // Until someone takes over, the opened CRM walks through its own modules.
  useInterval(
    () => setView((v) => NAV[(NAV.findIndex((n) => n.key === v) + 1) % NAV.length].key),
    TOUR_MS,
    opened && touring && animated && !voice,
  );

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

  const draw = () => {
    const el = root.current;
    if (!el || !copy.current || !front.current || !back1.current || !back2.current) return;
    if (!product.current || !note.current || !chips.current) return;
    const h = window.innerHeight;
    const w = window.innerWidth;
    const range = Math.max(1, el.offsetHeight - 2 * h);
    const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / range));

    const rise = easeInOut(seg(p, 0, 0.6));
    const grow = easeInOut(seg(p, 0.35, 1));
    // On load the card stack flies up from below the screen, one card after another.
    const inFront = easeOut(seg(intro.current, 0.15, 1));
    const inBack = easeOut(seg(intro.current, 0, 0.8));

    copy.current.style.transform = `translate3d(0, ${-rise * h * 0.55}px, 0)`;
    const fade = 1 - seg(rise, 0.3, 0.72);
    copy.current.style.opacity = String(fade);
    copy.current.style.visibility = fade <= 0 ? 'hidden' : 'visible';

    const narrow = w < 700;
    const mx = lerp(w * (narrow ? 0.04 : 0.085), 0, grow);
    const radius = lerp(narrow ? 24 : 40, 0, grow);
    const startY = h * (narrow ? 0.68 : 0.6);
    const y = lerp(lerp(startY, h * 0.13, rise), 0, grow) + (1 - inFront) * h * 0.5;
    const rot = lerp(narrow ? -3 : -4.4, 0, rise) + (1 - inFront) * 7;
    front.current.style.transform = `translate3d(0, ${y}px, 0) rotate(${rot}deg)`;
    front.current.style.clipPath = `inset(0px ${mx}px 0px ${mx}px round ${radius}px)`;

    const backFade = 1 - seg(rise, 0.45, 0.8);
    const backDrop = (1 - inBack) * h * 0.5;
    back1.current.style.transform = `translate3d(0, ${lerp(startY - h * 0.028, h * 0.3, rise) + backDrop}px, 0) rotate(${lerp(-2.2, 0, rise) - (1 - inBack) * 6}deg)`;
    back1.current.style.opacity = String(backFade);
    back2.current.style.transform = `translate3d(0, ${lerp(startY - h * 0.024, h * 0.34, rise) + backDrop}px, 0) rotate(${lerp(0.4, 0, rise) + (1 - inBack) * 8}deg)`;
    back2.current.style.opacity = String(backFade);

    product.current.style.transform = `translate3d(-50%, ${lerp(-124, 0, grow)}px, 0) scale(${lerp(0.94, 1, grow)})`;
    note.current.style.opacity = String(seg(grow, 0.6, 1));
    if (geo.current) geo.current.style.opacity = String(seg(grow, 0.25, 1) * 0.3);
    chips.current.style.opacity = String(1 - seg(rise, 0, 0.3));
    chips.current.style.visibility = rise >= 0.3 ? 'hidden' : 'visible';
    // The preview can only be used once it has fully opened.
    front.current.inert = grow < 0.98;
    setOpened(grow >= 0.98 && p < 1.01 && el.getBoundingClientRect().top > -(range + h * 0.6));

    const next = el.nextElementSibling;
    const dark = grow > 0.62 && !!next && next.getBoundingClientRect().top > 44;
    document.documentElement.dataset.fnav = dark ? 'dark' : 'light';
  };

  useScrollFrame(draw, animated);

  // Entrance of the card stack on page load.
  const drawRef = useRef(draw);
  drawRef.current = draw;
  useEffect(() => {
    if (!animated) {
      document.documentElement.dataset.fnav = 'light';
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      intro.current = Math.min(1, (now - start) / INTRO_MS);
      drawRef.current();
      if (intro.current < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated]);

  // Cards drift slightly with the mouse.
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !stage.current) return;
    stage.current.style.setProperty('--mx', String((e.clientX / window.innerWidth - 0.5) * 2));
    stage.current.style.setProperty('--my', String((e.clientY / window.innerHeight - 0.5) * 2));
  };

  return (
    <section ref={root} className="f-hero" id="top" aria-labelledby="hero-title" data-page>
      <span className="f-hero__mark" data-page aria-hidden="true" />
      <div ref={stage} className="f-hero__stage" onPointerMove={onPointerMove}>
        <div ref={copy} className="f-hero__copy">
          <MaskText as="h1" id="hero-title" active text={'The Office CRM\nFor Your Entire Team.'} />
          <p className="f-hero__lead">Manage leads and deals, assign tasks, track attendance, run meetings and approve expenses in one place.</p>
          <div className="f-hero__ctas">
            <a href={siteConfig.auth.getStarted} className="fbtn fbtn--royal fbtn--lg fbtn--shine">
              Get Started
            </a>
            <button type="button" className="fbtn fbtn--line fbtn--lg" onClick={openDemo}>
              Book a Demo
            </button>
          </div>
        </div>

        <div ref={back2} className="f-back f-back--2" aria-hidden="true" />
        <div ref={back1} className="f-back f-back--1" aria-hidden="true" />
        <div ref={front} className="f-front">
          <div ref={geo} className="f-geo" aria-hidden="true">
            <GeoLines />
          </div>
          <div ref={product} className="f-product" onPointerDown={() => setTouring(false)} onKeyDown={() => setTouring(false)}>
            <div className="f-product__frame">
              <ShellContext.Provider value={{ interactive: true, compact: true, onNavigate: go, onVoice: () => setVoice(true), overlay }}>
                <ScaledFrame width={1280} height={760} interactive label="Interactive TeamBridge CRM preview">
                  <div key={view} className="f-view">
                    <View />
                  </div>
                </ScaledFrame>
              </ShellContext.Provider>
            </div>
            <p ref={note} className="f-product__note">Sample data</p>
          </div>
        </div>

        <div ref={chips} className="f-chips" aria-hidden="true">
          <div className="f-chip f-chip--l">
            <span>Deal won</span>
            <b>Halcyon Retail</b>
            <strong>
              <Count value="₹21.4L" active duration={1800} />
            </strong>
          </div>
          <div className="f-chip f-chip--r">
            <span>Attendance today</span>
            <strong>
              <Count value="64" active duration={1800} /> of 72
            </strong>
            <i>
              <u />
            </i>
          </div>
          <div className="f-chip f-chip--l2">
            <span>Task assigned</span>
            <b>Acme renewal proposal</b>
            <em>Vikram · Due Thu</em>
          </div>
          <div className="f-chip f-chip--r2">
            <span>Up next · 10:30</span>
            <b>Brightline kick-off</b>
            <em>
              <small />
              AI summary after the call
            </em>
          </div>
        </div>
      </div>
    </section>
  );
}
