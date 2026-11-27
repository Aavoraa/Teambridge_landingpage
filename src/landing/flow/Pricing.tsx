import { useId, useState } from 'react';
import { ArrowRight, Check, Clock3, Minus, Plus } from 'lucide-react';
import { useCheckout } from '../components/Checkout';
import { useDemo } from '../components/DemoDialog';
import { planComparison, pricing, siteConfig, type Entitlement, type PricingPlan } from '../config';
import { MaskText, useHere } from './motion';

type Billing = 'monthly' | 'yearly';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Every figure shown on a card, from the plan, billing period and team size. */
export function quote(plan: PricingPlan, billing: Billing, employees: number) {
  const perEmployee = billing === 'yearly' ? plan.yearly : plan.monthly;
  const perMonth = perEmployee * employees;
  return {
    perEmployee,
    perMonth,
    perYear: perMonth * 12,
    minPerMonth: perEmployee * pricing.minEmployees,
    minPerYear: perEmployee * pricing.minEmployees * 12,
  };
}

function PlanCard({ plan, billing, employees, index }: { plan: PricingPlan; billing: Billing; employees: number; index: number }) {
  const { openDemo } = useDemo();
  const { openCheckout } = useCheckout();
  const q = quote(plan, billing, employees);
  const yearly = billing === 'yearly';
  const titleId = `plan-${plan.id}`;

  const choice = { plan: plan.id, billing, employees };

  return (
    <article
      className={`f-plan ${plan.popular ? 'f-plan--popular' : ''}`}
      aria-labelledby={titleId}
      style={{ '--i': index } as React.CSSProperties}
    >
      <div className="f-plan__head">
        <h3 id={titleId}>{plan.name}</h3>
        {plan.popular && <span className="f-plan__badge">Most Popular</span>}
      </div>
      <p className="f-plan__summary">{plan.summary}</p>

      <div className="f-plan__price">
        {/* Re-keyed so a changed figure eases in. */}
        <strong key={`${billing}-${q.perEmployee}`}>{inr(q.perEmployee)}</strong>
        <span>/ employee / month</span>
      </div>
      <p className="f-plan__billing">
        {yearly ? (
          <>
            Billed yearly upfront · <s>{inr(plan.monthly)}</s> monthly
          </>
        ) : (
          'Billed monthly'
        )}
      </p>

      <dl className="f-plan__total" aria-live="polite">
        <div>
          <dt>
            {employees} employees, {yearly ? 'per month equivalent' : 'per month'}
          </dt>
          <dd key={`m-${billing}-${employees}`}>{inr(q.perMonth)}</dd>
        </div>
        {yearly && (
          <div>
            <dt>Billed upfront for the year</dt>
            <dd key={`y-${employees}`}>{inr(q.perYear)}</dd>
          </div>
        )}
        <p>
          Minimum {pricing.minEmployees} employees ·{' '}
          {yearly ? `${inr(q.minPerYear)} / year` : `${inr(q.minPerMonth)} / month`} · Excl. GST
        </p>
      </dl>

      <div className="f-plan__ctas">
        <button
          type="button"
          className={`fbtn fbtn--lg f-plan__cta ${plan.popular ? 'fbtn--royal' : 'fbtn--ink'}`}
          onClick={() => openCheckout({ ...choice, mode: 'subscribe' })}
        >
          Subscribe to {plan.name} <ArrowRight aria-hidden="true" />
        </button>
        <button type="button" className="fbtn fbtn--line f-plan__trial" onClick={() => openCheckout({ ...choice, mode: 'trial' })}>
          Start {pricing.trialDays}-day free trial
        </button>
      </div>

      <ul className="f-plan__features">
        {plan.features.map((f) => (
          <li key={f}>
            <Check aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
      {plan.addOns && (
        <div className="f-plan__addons">
          <span>Available as add-ons</span>
          <ul>
            {plan.addOns.map((a) => (
              <li key={a}>
                <Plus aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
      {plan.id === 'business' && (
        <p className="f-plan__sales">
          Planning a larger rollout?{' '}
          <button type="button" onClick={openDemo}>
            Talk to sales
          </button>
        </p>
      )}
    </article>
  );
}

function Cell({ value }: { value: Entitlement }) {
  if (value === true) {
    return (
      <>
        <Check className="f-compare__yes" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus className="f-compare__no" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className={`f-compare__tag ${value === 'Add-on' ? 'is-addon' : ''}`}>{value}</span>;
}

/** Module-by-module entitlements for every plan. */
const hasAddOn = (row: (typeof planComparison)[number]) => Object.values(row.plans).includes('Add-on');

function CompareRow({ row }: { row: (typeof planComparison)[number] }) {
  return (
    <tr>
      <th scope="row">{row.module}</th>
      {pricing.plans.map((p) => (
        <td key={p.id} className={p.popular ? 'is-popular' : ''}>
          <Cell value={row.plans[p.id]} />
        </td>
      ))}
    </tr>
  );
}

function Compare() {
  // Rows that any plan can buy as an add-on are grouped at the bottom.
  const core = planComparison.filter((row) => !hasAddOn(row));
  const addOns = planComparison.filter(hasAddOn);
  return (
    <div className="f-compare">
      <h3>Compare plans</h3>
      <div className="f-compare__scroll" tabIndex={0} role="region" aria-label="Plan comparison table">
        <table>
          <caption className="sr-only">Modules included in each TeamBridge plan</caption>
          <thead>
            <tr>
              <th scope="col">Module</th>
              {pricing.plans.map((p) => (
                <th key={p.id} scope="col" className={p.popular ? 'is-popular' : ''}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {core.map((row) => (
              <CompareRow key={row.module} row={row} />
            ))}
          </tbody>
          {addOns.length > 0 && (
            <tbody className="f-compare__addons">
              <tr className="f-compare__group">
                <th scope="colgroup" colSpan={pricing.plans.length + 1}>
                  Add-on modules
                </th>
              </tr>
              {addOns.map((row) => (
                <CompareRow key={row.module} row={row} />
              ))}
            </tbody>
          )}
        </table>
      </div>
      <p className="f-compare__note">Add-ons are available on request. Ask our sales team for add-on pricing.</p>
    </div>
  );
}

export function Pricing() {
  const { openDemo } = useDemo();
  const [ref, here] = useHere<HTMLElement>();
  const [billing, setBilling] = useState<Billing>('monthly');
  const [employees, setEmployees] = useState(pricing.teamSizes[1]);
  const name = useId();

  return (
    <section ref={ref} className={`f-page f-pricing ${here ? 'is-in' : ''}`} id="pricing" aria-labelledby="pricing-title" data-page>
      <div className="f-pricing__top">
        <MaskText id="pricing-title" className="f-title" active={here} text={'Simple pricing.\nBetter teamwork.'} />
        <p className="f-pricing__lead">
          Choose a plan that fits your team’s size and business needs. Start small and scale as your business grows.
        </p>

        <div className="f-pricing__controls">
          <fieldset className="f-seg-ctl">
            <legend className="sr-only">Billing period</legend>
            {(['monthly', 'yearly'] as const).map((b) => (
              <label key={b} className={billing === b ? 'is-on' : ''}>
                <input type="radio" name={`${name}-billing`} value={b} checked={billing === b} onChange={() => setBilling(b)} />
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
                {b === 'yearly' && <em>{pricing.yearlySaving}</em>}
              </label>
            ))}
          </fieldset>

          <fieldset className="f-seg-ctl f-seg-ctl--team">
            <legend>Team size</legend>
            {pricing.teamSizes.map((n) => (
              <label key={n} className={employees === n ? 'is-on' : ''}>
                <input type="radio" name={`${name}-team`} value={n} checked={employees === n} onChange={() => setEmployees(n)} />
                {n}
                <span className="sr-only"> employees</span>
              </label>
            ))}
          </fieldset>
        </div>
        <p className="f-pricing__trial">
          <Clock3 aria-hidden="true" />
          Every plan includes a {pricing.trialDays}-day free trial
        </p>
      </div>

      <div className="f-plans">
        {pricing.plans.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} employees={employees} index={i} />
        ))}
      </div>

      <Compare />

      <div className="f-pricing__more">
        <div className="f-pricing__included">
          <h3>What’s included?</h3>
          <ul>
            {[
              'Secure cloud access',
              'Standard product updates',
              'Standard customer support',
              'Employee and team management features included in the selected plan',
            ].map((t) => (
              <li key={t}>
                <Check aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="f-pricing__custom">
          <h3>Need a customised solution?</h3>
          <p>
            Have specific business requirements, multiple locations, or a larger workforce? Let’s discuss a plan that works
            for your organisation.
          </p>
          <button type="button" className="fbtn fbtn--ink fbtn--lg" onClick={openDemo}>
            Talk to Sales
          </button>
        </div>
      </div>
      <p className="f-pricing__note">
        All prices are in INR and exclude applicable GST. Annual subscriptions are billed upfront. Custom integrations,
        dedicated hosting, and on-site deployment may be quoted separately. See our{' '}
        <a href={siteConfig.legal.cancellation}>Cancellation & Refund Policy</a> and{' '}
        <a href={siteConfig.legal.terms}>Terms & Conditions</a>.
      </p>
    </section>
  );
}
