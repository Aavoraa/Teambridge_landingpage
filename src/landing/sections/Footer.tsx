import { Logo } from '../components/Logo';
import { useDemo } from '../components/DemoDialog';
import { siteConfig } from '../config';

type FooterLink = { label: string; href?: string; onClick?: () => void };

export function Footer() {
  const { openDemo } = useDemo();
  const year = new Date().getFullYear();

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Platform',
      links: [
        { label: 'Overview', href: '#platform' },
        { label: 'AI Automation', href: '#ai' },
        { label: 'Connected modules', href: '#integrations' },
        { label: 'Product tour', href: '#product' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'For owners', href: '#solutions' },
        { label: 'For managers', href: '#solutions' },
        { label: 'For employees', href: '#solutions' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'FAQ', href: '#resources' },
        { label: 'Pricing', href: '#pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Sign in', href: siteConfig.auth.signIn },
        { label: 'Get started', href: siteConfig.auth.getStarted },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: 'Book a demo', onClick: openDemo },
        { label: 'Talk to sales', onClick: openDemo },
        ...(siteConfig.demo.salesEmail ? [{ label: siteConfig.demo.salesEmail, href: `mailto:${siteConfig.demo.salesEmail}` }] : []),
      ],
    },
  ];

  const legal = [
    siteConfig.legal.privacy && { label: 'Privacy Policy', href: siteConfig.legal.privacy },
    siteConfig.legal.terms && { label: 'Terms of Service', href: siteConfig.legal.terms },
  ].filter(Boolean) as FooterLink[];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p>{siteConfig.brand.tagline} CRM, people, projects, meetings and AI automation in one workspace.</p>
          </div>
          <nav className="footer__cols" aria-label="Footer">
            {columns.map((c) => (
              <div key={c.title}>
                <h3>{c.title}</h3>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <a href={l.href}>{l.label}</a>
                      ) : (
                        <button type="button" onClick={l.onClick}>
                          {l.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {siteConfig.brand.name}. All rights reserved.
          </span>
          {(legal.length > 0 || siteConfig.social.length > 0) && (
            <ul className="footer__legal">
              {legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
              {siteConfig.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
