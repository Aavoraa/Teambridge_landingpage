import { useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Logo';
import { siteConfig } from '../config';

export type LegalSection = { id: string; title: string; body: ReactNode };
export type LegalDoc = { slug: 'privacy' | 'terms' | 'cancellation'; title: string; intro: ReactNode; sections: LegalSection[] };

type CompanyKey = 'legalName' | 'address' | 'supportEmail' | 'grievanceOfficer' | 'grievanceEmail' | 'jurisdiction';

const MISSING: Record<CompanyKey, string> = {
  legalName: 'registered company name',
  address: 'registered office address',
  supportEmail: 'support email address',
  grievanceOfficer: 'Grievance Officer name',
  grievanceEmail: 'Grievance Officer email',
  jurisdiction: 'city for jurisdiction',
};

/** A business detail from config, or a highlighted gap until it is filled in. */
export function Fill({ k }: { k: CompanyKey }) {
  const value = siteConfig.company[k];
  if (value) {
    return k.toLowerCase().includes('email') ? <a href={`mailto:${value}`}>{value}</a> : <>{value}</>;
  }
  return <mark className="lg-missing">[{MISSING[k]} — to be added]</mark>;
}

/** "Aavoraa (Registered Name)" when the legal name is known, otherwise the owner plus a gap. */
export function Owner() {
  return (
    <>
      {siteConfig.company.owner} (<Fill k="legalName" />)
    </>
  );
}

const DOCS = [
  { slug: 'privacy', label: 'Privacy Policy', href: siteConfig.legal.privacy },
  { slug: 'terms', label: 'Terms & Conditions', href: siteConfig.legal.terms },
  { slug: 'cancellation', label: 'Cancellation & Refund Policy', href: siteConfig.legal.cancellation },
] as const;

export function LegalLayout({ doc }: { doc: LegalDoc }) {
  const [active, setActive] = useState(doc.sections[0]?.id);

  useEffect(() => {
    document.title = `${doc.title} — ${siteConfig.brand.name}`;
  }, [doc.title]);

  // Highlight the contents entry for the section being read.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-20% 0px -70% 0px' },
    );
    doc.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [doc.sections]);

  return (
    <>
      <a href="#legal-main" className="skip-link">
        Skip to content
      </a>
      <header className="lg-top">
        <a href="/" aria-label="TeamBridge home">
          <Logo />
        </a>
        <a href="/" className="lg-top__back">
          <ArrowLeft aria-hidden="true" /> Back to home
        </a>
      </header>

      {import.meta.env.DEV && (
        <p className="lg-draft" role="note">
          Draft for review: have these policies checked by your legal adviser and fill in every highlighted gap before launch.
          This note only appears in development.
        </p>
      )}

      <div className="lg">
        <aside className="lg__side">
          <nav aria-label="Policies" className="lg__docs">
            {DOCS.map((d) => (
              <a key={d.slug} href={d.href} aria-current={d.slug === doc.slug ? 'page' : undefined}>
                {d.label}
              </a>
            ))}
          </nav>
          <nav aria-label="On this page" className="lg__toc">
            <span>On this page</span>
            <ol>
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={active === s.id ? 'is-on' : ''}>
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <main id="legal-main" className="lg__main">
          <h1>{doc.title}</h1>
          <p className="lg__updated">Last updated: {siteConfig.legal.updated}</p>
          <div className="lg__intro">{doc.intro}</div>
          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>
                {i + 1}. {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </main>
      </div>

      <footer className="lg-foot">
        <span>
          © {new Date().getFullYear()} {siteConfig.brand.name} · {siteConfig.company.owner}
        </span>
        <nav aria-label="Footer">
          {DOCS.map((d) => (
            <a key={d.slug} href={d.href}>
              {d.label}
            </a>
          ))}
          <a href="/">Home</a>
        </nav>
      </footer>
    </>
  );
}
