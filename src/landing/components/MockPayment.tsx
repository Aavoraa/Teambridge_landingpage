import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Building, CheckCircle2, CreditCard, FlaskConical, Smartphone, Wallet, XCircle } from 'lucide-react';
import { siteConfig } from '../config';

/** What the payment step needs to know. A real Razorpay order carries the same facts. */
export type PaymentOrder = {
  orderId: string;
  planName: string;
  billing: 'monthly' | 'yearly';
  employees: number;
  pricePerEmployee: number;
  /** Amount before GST, in rupees. */
  subtotal: number;
  gst: number;
  gstRate: number;
  total: number;
  company: string;
  email: string;
};

type Stage = 'choose' | 'processing' | 'paid' | 'failed';
type Method = 'upi' | 'card' | 'netbanking' | 'wallet';

const METHODS: { id: Method; label: string; icon: typeof CreditCard; live: string }[] = [
  { id: 'upi', label: 'UPI', icon: Smartphone, live: 'pay with any UPI app or UPI ID' },
  { id: 'card', label: 'Card', icon: CreditCard, live: 'pay with a debit or credit card' },
  { id: 'netbanking', label: 'Netbanking', icon: Building, live: 'pay through your bank' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, live: 'pay with a supported wallet' },
];

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const testId = (prefix: string) => `${prefix}_TEST${Math.random().toString(36).slice(2, 12).toUpperCase()}`;

/**
 * Test-mode stand-in for Razorpay Checkout. It never asks for card, UPI or bank details
 * and never moves money: it only simulates the outcome so the flow can be designed and reviewed.
 */
export function MockPayment({ order, onBack }: { order: PaymentOrder; onBack: () => void }) {
  const [stage, setStage] = useState<Stage>('choose');
  const [method, setMethod] = useState<Method>('upi');
  const [paymentId, setPaymentId] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const name = useId();
  const chosen = METHODS.find((m) => m.id === method)!;

  useEffect(() => {
    headingRef.current?.focus();
  }, [stage]);

  const simulate = (outcome: 'paid' | 'failed') => {
    setStage('processing');
    window.setTimeout(() => {
      if (outcome === 'paid') setPaymentId(testId('pay'));
      setStage(outcome);
    }, 1400);
  };

  const testBanner = (
    <p className="mp__test" role="note">
      <FlaskConical aria-hidden="true" />
      Test mode · No real payment is taken
    </p>
  );

  if (stage === 'processing') {
    return (
      <div className="mp mp--center" aria-live="polite">
        {testBanner}
        <span className="mp__spinner" aria-hidden="true" />
        <h2 ref={headingRef} tabIndex={-1}>
          Processing payment…
        </h2>
        <p>Paying {inr(order.total)} by {chosen.label}. Please don’t close this window.</p>
      </div>
    );
  }

  if (stage === 'paid') {
    return (
      <div className="mp mp--center">
        {testBanner}
        <CheckCircle2 className="mp__state mp__state--ok" aria-hidden="true" />
        <h2 ref={headingRef} tabIndex={-1}>
          Payment successful
        </h2>
        <p>
          {order.company} is subscribed to <b>{order.planName}</b> for {order.employees} employees, billed {order.billing}.
          We’ll send the invoice to <b>{order.email}</b>.
        </p>
        <dl className="mp__ids">
          <div>
            <dt>Amount paid</dt>
            <dd>{inr(order.total)}</dd>
          </div>
          <div>
            <dt>Payment ID</dt>
            <dd>{paymentId}</dd>
          </div>
          <div>
            <dt>Order ID</dt>
            <dd>{order.orderId}</dd>
          </div>
        </dl>
        <a href={siteConfig.auth.signIn} className="fbtn fbtn--royal fbtn--lg">
          Go to TeamBridge <ArrowRight aria-hidden="true" />
        </a>
      </div>
    );
  }

  if (stage === 'failed') {
    return (
      <div className="mp mp--center">
        {testBanner}
        <XCircle className="mp__state mp__state--fail" aria-hidden="true" />
        <h2 ref={headingRef} tabIndex={-1}>
          Payment didn’t go through
        </h2>
        <p>
          No money was taken. Try again, or choose a different payment method.
          <br />
          Order {order.orderId}
        </p>
        <div className="mp__row">
          <button type="button" className="fbtn fbtn--line fbtn--lg" onClick={() => setStage('choose')}>
            Choose another method
          </button>
          <button type="button" className="fbtn fbtn--royal fbtn--lg" onClick={() => simulate('paid')}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mp">
      {testBanner}
      <h2 ref={headingRef} tabIndex={-1} className="mp__title">
        Complete your payment
      </h2>
      <p className="mp__order">Order {order.orderId}</p>

      <div className="mp__grid">
        <dl className="mp__bill">
          <div>
            <dt>
              {order.planName} · {order.employees} employees
            </dt>
            <dd />
          </div>
          <div>
            <dt>
              {inr(order.pricePerEmployee)} × {order.employees} × {order.billing === 'yearly' ? '12 months' : '1 month'}
            </dt>
            <dd>{inr(order.subtotal)}</dd>
          </div>
          <div>
            <dt>GST ({Math.round(order.gstRate * 100)}%)</dt>
            <dd>{inr(order.gst)}</dd>
          </div>
          <div className="mp__total">
            <dt>Total</dt>
            <dd>{inr(order.total)}</dd>
          </div>
        </dl>

        <div className="mp__pay">
          <fieldset className="mp__methods">
            <legend>Payment method</legend>
            {METHODS.map((m) => (
              <label key={m.id} className={m.id === method ? 'is-on' : ''}>
                <input type="radio" name={`${name}-method`} value={m.id} checked={m.id === method} onChange={() => setMethod(m.id)} />
                <m.icon aria-hidden="true" />
                {m.label}
              </label>
            ))}
          </fieldset>
          <p className="mp__explain">
            In live mode, the payment partner’s secure window opens here to {chosen.live}. In test mode, nothing is entered or
            charged.
          </p>
          <button type="button" className="fbtn fbtn--royal fbtn--lg mp__paybtn" onClick={() => simulate('paid')}>
            Pay {inr(order.total)}
          </button>
          <button type="button" className="mp__fail" onClick={() => simulate('failed')}>
            Simulate a failed payment
          </button>
        </div>
      </div>

      <button type="button" className="mp__back" onClick={onBack}>
        <ArrowLeft aria-hidden="true" /> Back to review
      </button>
    </div>
  );
}
