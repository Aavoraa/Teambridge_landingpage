import { createContext, useCallback, useContext, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { siteConfig } from '../config';

type DemoContextValue = { openDemo: () => void };
const DemoContext = createContext<DemoContextValue>({ openDemo: () => {} });

export const useDemo = () => useContext(DemoContext);

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Provides a single "Book a demo" dialog that any CTA on the page can open. */
export function DemoProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>('idle');

  const openDemo = useCallback(() => {
    setStatus('idle');
    dialogRef.current?.showModal();
  }, []);

  const close = () => dialogRef.current?.close();

  const { endpoint, salesEmail } = siteConfig.demo;
  const configured = Boolean(endpoint || salesEmail);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    if (endpoint) {
      setStatus('sending');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, source: 'landing-page' }),
        });
        setStatus(res.ok ? 'sent' : 'error');
      } catch {
        setStatus('error');
      }
      return;
    }

    if (salesEmail) {
      const body = [
        `Name: ${data.name}`,
        `Work email: ${data.email}`,
        `Company: ${data.company}`,
        `Team size: ${data.size}`,
        '',
        data.message || '',
      ].join('\n');
      window.location.href = `mailto:${salesEmail}?subject=${encodeURIComponent(
        `TeamBridge demo request — ${data.company}`,
      )}&body=${encodeURIComponent(body)}`;
      setStatus('sent');
    }
  }

  return (
    <DemoContext.Provider value={{ openDemo }}>
      {children}
      <dialog
        ref={dialogRef}
        className="demo-dialog"
        aria-labelledby="demo-title"
        onClick={(e) => e.target === dialogRef.current && close()}
      >
        <div className="demo-dialog__panel">
          <button type="button" className="demo-dialog__close" onClick={close} aria-label="Close">
            <X />
          </button>

          {status === 'sent' ? (
            <div className="demo-dialog__done">
              <CheckCircle2 aria-hidden="true" />
              <h2 id="demo-title">Request received</h2>
              <p>Thanks for your interest in TeamBridge. Our team will reach out to schedule a walkthrough.</p>
              <button type="button" className="btn btn--primary" onClick={close}>
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 id="demo-title">Book a demo</h2>
              <p className="demo-dialog__lead">
                See how TeamBridge connects your customers, people and operations — tailored to how your business works.
              </p>
              <form className="demo-form" onSubmit={handleSubmit}>
                <label>
                  <span>Full name</span>
                  <input name="name" required autoComplete="name" />
                </label>
                <label>
                  <span>Work email</span>
                  <input name="email" type="email" required autoComplete="email" />
                </label>
                <label>
                  <span>Company</span>
                  <input name="company" required autoComplete="organization" />
                </label>
                <label>
                  <span>Team size</span>
                  <select name="size" required defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option>1–10</option>
                    <option>11–50</option>
                    <option>51–200</option>
                    <option>201–1,000</option>
                    <option>1,000+</option>
                  </select>
                </label>
                <label className="demo-form__full">
                  <span>What would you like to see? (optional)</span>
                  <textarea name="message" rows={3} />
                </label>

                {!configured && (
                  <p className="demo-form__note demo-form__full" role="status">
                    Online demo requests are not connected yet. Set <code>VITE_DEMO_ENDPOINT</code> or{' '}
                    <code>VITE_SALES_EMAIL</code> to enable this form.
                  </p>
                )}
                {status === 'error' && (
                  <p className="demo-form__note demo-form__note--error demo-form__full" role="alert">
                    Something went wrong sending your request. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn--primary btn--lg demo-form__full"
                  disabled={!configured || status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Request demo'}
                </button>
              </form>
            </>
          )}
        </div>
      </dialog>
    </DemoContext.Provider>
  );
}
