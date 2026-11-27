import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useDemo } from '../components/DemoDialog';
import { siteConfig } from '../config';

export const NAV_LINKS = [
  { href: '#platform', label: 'Platform' },
  { href: '#solutions', label: 'Solutions' },
  { href: '#ai', label: 'AI Automation' },
  { href: '#integrations', label: 'Integrations' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#resources', label: 'Resources' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { openDemo } = useDemo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav item for the section currently in view.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('main > section, footer'));
    const navHrefs = new Set(NAV_LINKS.map((l) => l.href));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const href = `#${e.target.id}`;
          setActive(navHrefs.has(href) ? href : null);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, []);

  return (
    <header className={`nav ${scrolled || open ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" aria-label="TeamBridge home" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={active === l.href ? 'is-active' : ''}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a href={siteConfig.auth.signIn} className="btn btn--ghost btn--sm">
            Sign in
          </a>
          <button type="button" className="btn btn--secondary btn--sm" onClick={openDemo}>
            Book a demo
          </button>
          <a href={siteConfig.auth.getStarted} className="btn btn--primary btn--sm">
            Get started
          </a>
        </div>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div id="mobile-menu" className="nav__mobile" hidden={!open}>
        <nav className="container" aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="nav__mobile-cta">
            <a href={siteConfig.auth.getStarted} className="btn btn--primary btn--lg">
              Get started
            </a>
            <button
              type="button"
              className="btn btn--secondary btn--lg"
              onClick={() => {
                setOpen(false);
                openDemo();
              }}
            >
              Book a demo
            </button>
            <a href={siteConfig.auth.signIn} className="btn btn--ghost btn--lg">
              Sign in
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
