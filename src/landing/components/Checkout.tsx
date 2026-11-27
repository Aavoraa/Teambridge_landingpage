import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, X } from 'lucide-react';
import { pricing, signupUrl, siteConfig, type PlanId } from '../config';
import { MockPayment, testId, type PaymentOrder } from './MockPayment';

export type CheckoutMode = 'trial' | 'subscribe';
export type Billing = 'monthly' | 'yearly';
export type CheckoutStart = { mode: CheckoutMode; plan: PlanId; billing: Billing; employees: number };

type CheckoutContextValue = { openCheckout: (start: CheckoutStart) => void };
const CheckoutContext = createContext<CheckoutContextValue>({ openCheckout: () => {} });
export const useCheckout = () => useContext(CheckoutContext);

type Details = { name: string; email: string; phone: string; company: string };
type Errors = Partial<Record<keyof Details | 'agree' | 'employees', string>>;
type Status = 'idle' | 'sending' | 'done' | 'error';

const STEPS = ['Your details', 'Plan', 'Review'] as const;
const MAX_EMPLOYEES = 100000;
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function validateDetails(d: Details, agree: boolean): Errors {
  const e: Errors = {};
  if (d.name.trim().length < 2) e.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = 'Enter a valid work email, like name@company.com.';
  if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(d.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a 10-digit mobile number.';
  if (d.company.trim().length < 2) e.company = 'Enter your company name.';
  if (!agree) e.agree = 'Please accept to continue.';
  return e;
}

function parseEmployees(raw: string): number | null {
  if (!/^\d+$/.test(raw.trim())) return null;
  const n = Number(raw);
  return n >= pricing.minEmployees && n <= MAX_EMPLOYEES ? n : null;
}

/** Only follow links to secure pages, or back to this site. */
function safeUrl(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  try {
    const url = new URL(raw, window.location.href);
    return url.protocol === 'https:' || url.origin === window.location.origin ? url.href : null;
  } catch {
    return null;
  }
}

/** Provides the plan checkout (details, plan, review) that any pricing CTA can open. */
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formId = useId();
  const [mode, setMode] = useState<CheckoutMode>('trial');
  const [plan, setPlan] = useState<PlanId>('growth');
  const [billing, setBilling] = useState<Billing>('monthly');
  const [employeesRaw, setEmployeesRaw] = useState('25');
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<Details>({ name: '', email: '', phone: '', company: '' });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [doneLink, setDoneLink] = useState<string | null>(null);
  const [payOrder, setPayOrder] = useState<PaymentOrder | null>(null);

  const openCheckout = useCallback((start: CheckoutStart) => {
    setMode(start.mode);
    setPlan(start.plan);
    setBilling(start.billing);
    setEmployeesRaw(String(start.employees));
    setStep(0);
    setErrors({});
    setStatus('idle');
    setPayOrder(null);
    dialogRef.current?.showModal();
  }, []);

  const close = () => dialogRef.current?.close();

  // Move focus to the step heading so keyboard and screen reader users land on the new step.
  useEffect(() => {
    if (dialogRef.current?.open) headingRef.current?.focus();
  }, [step, status]);

  const planInfo = pricing.plans.find((p) => p.id === plan)!;
  const employees = parseEmployees(employeesRaw);
  const perEmployee = billing === 'yearly' ? planInfo.yearly : planInfo.monthly;
  const perMonth = employees ? perEmployee * employees : null;
  const perYear = perMonth !== null ? perMonth * 12 : null;
  const dueNow = billing === 'yearly' ? perYear : perMonth;
  const trial = mode === 'trial';
  const endpoint = trial ? siteConfig.checkout.trialEndpoint : siteConfig.checkout.subscribeEndpoint;
  // With no endpoint yet, development (or VITE_PAYMENT_MOCK) runs the test-mode screens instead.
  const testMode = !endpoint && siteConfig.checkout.mock;

  const set = (key: keyof Details) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails((d) => ({ ...d, [key]: e.target.value }));
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const focusFirstError = (found: Errors) => {
    const first = Object.keys(found)[0];
    if (first) dialogRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
  };

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      const found = validateDetails(details, agree);
      setErrors(found);
      if (Object.keys(found).length) return focusFirstError(found);
    }
    if (step === 1 && !employees) {
      const found = { employees: `Enter a whole number from ${pricing.minEmployees} to ${MAX_EMPLOYEES.toLocaleString('en-IN')}.` };
      setErrors(found);
      return focusFirstError(found);
    }
    if (step < 2) return setStep(step + 1);
    void submit();
  };

  async function submit() {
    if (!employees || dueNow === null) return;

    if (testMode && trial) {
      setStatus('sending');
      await new Promise((r) => window.setTimeout(r, 900));
      setDoneLink(siteConfig.auth.signIn);
      setStatus('done');
      return;
    }
    if (testMode) {
      // Razorpay hook-up: create the order on your server here, then open Razorpay Checkout
      // with its order_id instead of this test screen. See "Razorpay integration" in README.md.
      const gst = Math.round(dueNow * pricing.gstRate);
      setPayOrder({
        orderId: testId('order'),
        planName: planInfo.name,
        billing,
        employees,
        pricePerEmployee: perEmployee,
        subtotal: dueNow,
        gst,
        gstRate: pricing.gstRate,
        total: dueNow + gst,
        company: details.company.trim(),
        email: details.email.trim(),
      });
      return;
    }
    if (!endpoint) return;
    setStatus('sending');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          plan,
          billing,
          employees,
          trialDays: trial ? pricing.trialDays : undefined,
          pricePerEmployee: perEmployee,
          amountExclGst: trial ? 0 : dueNow,
          currency: 'INR',
          name: details.name.trim(),
          email: details.email.trim(),
          phone: details.phone.trim(),
          company: details.company.trim(),
          source: 'landing-page',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error('request failed');
      if (trial) {
        setDoneLink(safeUrl(data.redirectUrl) ?? siteConfig.auth.signIn);
        setStatus('done');
        return;
      }
      const payUrl = safeUrl(data.url);
      if (!payUrl) throw new Error('no payment page');
      window.location.assign(payUrl);
    } catch {
      setStatus('error');
    }
  }

  const fieldProps = (key: keyof Details) => ({
    id: `${formId}-${key}`,
    'data-field': key,
    value: details[key],
    onChange: set(key),
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${formId}-${key}-err` : undefined,
  });
  const fieldError = (key: keyof Errors) =>
    errors[key] ? (
      <span id={`${formId}-${key}-err`} className="co__error">
        {errors[key]}
      </span>
    ) : null;

  const title = trial ? `Start your ${pricing.trialDays}-day free trial` : `Subscribe to ${planInfo.name}`;

  return (
    <CheckoutContext.Provider value={{ openCheckout }}>
      {children}
      <dialog ref={dialogRef} className={`co ${payOrder ? 'co--wide' : ''}`} aria-labelledby={payOrder ? undefined : `${formId}-title`} aria-label={payOrder ? 'Payment' : undefined} onClick={(e) => e.target === dialogRef.current && close()}>
        <div className="co__panel">
          <button type="button" className="co__close" onClick={close} aria-label="Close">
            <X />
          </button>

          {payOrder ? (
            <MockPayment order={payOrder} onBack={() => setPayOrder(null)} />
          ) : status === 'done' ? (
            <div className="co__done">
              <CheckCircle2 aria-hidden="true" />
              <h2 id={`${formId}-title`} ref={headingRef} tabIndex={-1}>
                Your free trial request is in
              </h2>
              <p>
                We’re setting up a {pricing.trialDays}-day {planInfo.name} trial for {details.company.trim()}. Use{' '}
                <b>{details.email.trim()}</b> to sign in.
              </p>
              {testMode && <p className="co__test">Test mode: this was simulated, and no account was created.</p>}
              <a href={doneLink ?? siteConfig.auth.signIn} className="fbtn fbtn--royal fbtn--lg">
                Go to TeamBridge <ArrowRight aria-hidden="true" />
              </a>
            </div>
          ) : (
            <form noValidate onSubmit={next}>
              <p className="co__eyebrow">{title}</p>
              <ol className="co__steps" aria-label="Checkout steps">
                {STEPS.map((s, i) => (
                  <li key={s} className={i === step ? 'is-on' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
                    <span>{i < step ? '✓' : i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>

              <h2 id={`${formId}-title`} ref={headingRef} tabIndex={-1} className="co__title">
                {step === 0 && 'Tell us about you and your company'}
                {step === 1 && 'Choose your plan and team size'}
                {step === 2 && (trial ? 'Review and start your trial' : 'Review and continue to payment')}
              </h2>

              {step === 0 && (
                <div className="co__grid">
                  <label htmlFor={`${formId}-name`}>
                    <span>Full name</span>
                    <input {...fieldProps('name')} autoComplete="name" />
                    {fieldError('name')}
                  </label>
                  <label htmlFor={`${formId}-email`}>
                    <span>Work email</span>
                    <input {...fieldProps('email')} type="email" autoComplete="email" inputMode="email" />
                    {fieldError('email')}
                  </label>
                  <label htmlFor={`${formId}-phone`}>
                    <span>Mobile number</span>
                    <input {...fieldProps('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder="10-digit number" />
                    {fieldError('phone')}
                  </label>
                  <label htmlFor={`${formId}-company`}>
                    <span>Company name</span>
                    <input {...fieldProps('company')} autoComplete="organization" />
                    {fieldError('company')}
                  </label>
                  <label className="co__check co__full">
                    <input
                      type="checkbox"
                      data-field="agree"
                      checked={agree}
                      onChange={(e) => {
                        setAgree(e.target.checked);
                        if (errors.agree) setErrors((x) => ({ ...x, agree: undefined }));
                      }}
                      aria-invalid={errors.agree ? true : undefined}
                      aria-describedby={errors.agree ? `${formId}-agree-err` : undefined}
                    />
                    <span>
                      I agree to the{' '}
                      <a href={siteConfig.legal.terms} target="_blank" rel="noopener noreferrer">
                        Terms & Conditions
                      </a>
                      ,{' '}
                      <a href={siteConfig.legal.privacy} target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a href={siteConfig.legal.cancellation} target="_blank" rel="noopener noreferrer">
                        Cancellation & Refund Policy
                      </a>
                      .
                    </span>
                  </label>
                  <div className="co__full">{fieldError('agree')}</div>
                </div>
              )}

              {step === 1 && (
                <div className="co__plan">
                  <fieldset className="co__plans">
                    <legend className="sr-only">Plan</legend>
                    {pricing.plans.map((p) => (
                      <label key={p.id} className={p.id === plan ? 'is-on' : ''}>
                        <input type="radio" name={`${formId}-plan`} value={p.id} checked={p.id === plan} onChange={() => setPlan(p.id)} />
                        <b>
                          {p.name}
                          {p.popular && <em>Most Popular</em>}
                        </b>
                        <span>
                          {inr(billing === 'yearly' ? p.yearly : p.monthly)} / employee / month
                        </span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="co__row">
                    <fieldset className="f-seg-ctl">
                      <legend className="sr-only">Billing period</legend>
                      {(['monthly', 'yearly'] as const).map((b) => (
                        <label key={b} className={billing === b ? 'is-on' : ''}>
                          <input type="radio" name={`${formId}-billing`} value={b} checked={billing === b} onChange={() => setBilling(b)} />
                          {b === 'monthly' ? 'Monthly' : 'Yearly'}
                          {b === 'yearly' && <em>{pricing.yearlySaving}</em>}
                        </label>
                      ))}
                    </fieldset>
                    <label className="co__count" htmlFor={`${formId}-employees`}>
                      <span>Employees</span>
                      <input
                        id={`${formId}-employees`}
                        data-field="employees"
                        type="number"
                        inputMode="numeric"
                        min={pricing.minEmployees}
                        step={1}
                        value={employeesRaw}
                        onChange={(e) => {
                          setEmployeesRaw(e.target.value);
                          if (errors.employees) setErrors((x) => ({ ...x, employees: undefined }));
                        }}
                        aria-invalid={errors.employees ? true : undefined}
                        aria-describedby={`${formId}-employees-hint${errors.employees ? ` ${formId}-employees-err` : ''}`}
                      />
                    </label>
                  </div>
                  <p id={`${formId}-employees-hint`} className="co__hint">
                    Minimum {pricing.minEmployees} employees.
                  </p>
                  {fieldError('employees')}
                </div>
              )}

              {step === 2 && (
                <div className="co__review">
                  <dl className="co__lines">
                    <div>
                      <dt>Plan</dt>
                      <dd>
                        {planInfo.name}, billed {billing}
                        <button type="button" className="co__edit" onClick={() => setStep(1)}>
                          Edit
                        </button>
                      </dd>
                    </div>
                    <div>
                      <dt>Team size</dt>
                      <dd>{employees} employees</dd>
                    </div>
                    <div>
                      <dt>Price per employee</dt>
                      <dd>{inr(perEmployee)} / month</dd>
                    </div>
                    <div>
                      <dt>{billing === 'yearly' ? 'Monthly equivalent' : 'Monthly total'}</dt>
                      <dd>{perMonth !== null && inr(perMonth)}</dd>
                    </div>
                    {billing === 'yearly' && (
                      <div>
                        <dt>Yearly total, billed upfront</dt>
                        <dd>{perYear !== null && inr(perYear)}</dd>
                      </div>
                    )}
                    <div>
                      <dt>Account</dt>
                      <dd>
                        {details.company.trim()} · {details.email.trim()}
                        <button type="button" className="co__edit" onClick={() => setStep(0)}>
                          Edit
                        </button>
                      </dd>
                    </div>
                  </dl>

                  <div className="co__due">
                    <span>Due today</span>
                    <strong>{trial ? inr(0) : dueNow !== null && inr(dueNow)}</strong>
                    <small>
                      {trial
                        ? `Free for ${pricing.trialDays} days. After the trial, ${planInfo.name} is ${perMonth !== null ? inr(perMonth) : ''} / month${billing === 'yearly' ? ' (billed yearly)' : ''} plus GST if you subscribe.`
                        : 'Plus applicable GST.'}
                    </small>
                  </div>

                  {!trial && (
                    <p className="co__secure">
                      <Lock aria-hidden="true" />
                      You’ll pay on our payment partner’s secure page. Card details are never entered on this site.
                    </p>
                  )}
                  {!trial && (
                    <p className="co__policy">
                      Your subscription renews each {billing === 'yearly' ? 'year' : 'month'} until you cancel. See our{' '}
                      <a href={siteConfig.legal.cancellation} target="_blank" rel="noopener noreferrer">
                        Cancellation & Refund Policy
                      </a>
                      .
                    </p>
                  )}
                  {testMode && (
                    <p className="co__test" role="note">
                      Test mode: {trial ? 'the trial sign-up is simulated.' : 'the next screen simulates payment. No real payment is taken.'}
                    </p>
                  )}
                  {!endpoint && !testMode && (
                    <div className="co__notice" role="status">
                      Online {trial ? 'trial sign-up' : 'payment'} is not connected yet. Set{' '}
                      <code>{trial ? 'VITE_TRIAL_ENDPOINT' : 'VITE_CHECKOUT_ENDPOINT'}</code> to enable it, or{' '}
                      <a href={signupUrl({ plan, billing, employees: employees ?? pricing.minEmployees, ...(trial ? { trial: pricing.trialDays } : {}) })}>
                        continue to sign-up
                      </a>
                      .
                    </div>
                  )}
                  {status === 'error' && (
                    <p className="co__notice co__notice--error" role="alert">
                      Something went wrong. Please check your connection and try again.
                    </p>
                  )}
                </div>
              )}

              <div className="co__foot">
                <div className="co__summary" aria-live="polite">
                  <b>{planInfo.name}</b>
                  <span>
                    {employees ? `${employees} employees · ${perMonth !== null ? inr(perMonth) : ''} / month` : 'Enter team size'}
                    {trial ? ` · ${pricing.trialDays}-day trial` : ''}
                  </span>
                </div>
                <div className="co__actions">
                  {step > 0 && (
                    <button type="button" className="fbtn fbtn--line" onClick={() => setStep(step - 1)}>
                      <ArrowLeft aria-hidden="true" /> Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="fbtn fbtn--royal"
                    disabled={step === 2 && ((!endpoint && !testMode) || status === 'sending')}
                  >
                    {step < 2 && (
                      <>
                        Continue <ArrowRight aria-hidden="true" />
                      </>
                    )}
                    {step === 2 && status === 'sending' && (trial ? 'Starting…' : 'Opening payment…')}
                    {step === 2 && status !== 'sending' && (trial ? 'Start free trial' : 'Continue to payment')}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </CheckoutContext.Provider>
  );
}
