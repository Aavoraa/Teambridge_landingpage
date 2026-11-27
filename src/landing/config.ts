/**
 * Central configuration for the public landing page.
 * Every outbound link, CTA target and plan detail lives here so the page can be
 * wired to the CRM (or changed by marketing) without touching section code.
 */

const env = import.meta.env;
const appUrl = (env.VITE_APP_URL ?? '').replace(/\/$/, '');

const orNull = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

export const siteConfig = {
  brand: {
    name: 'TeamBridge',
    tagline: 'The connected operating platform for customers, teams and work.',
  },

  /** Auth routes of the existing CRM application. */
  auth: {
    signIn: `${appUrl}${env.VITE_SIGN_IN_PATH || '/login'}`,
    getStarted: `${appUrl}${env.VITE_SIGN_UP_PATH || '/register'}`,
  },

  /** Demo request handling. Both are optional; the dialog explains when neither is set. */
  demo: {
    endpoint: orNull(env.VITE_DEMO_ENDPOINT),
    salesEmail: orNull(env.VITE_SALES_EMAIL),
  },

  /**
   * Plan checkout. Each endpoint receives the visitor's details and plan choice as JSON (POST).
   * trialEndpoint may answer { redirectUrl } to send the visitor into the app.
   * subscribeEndpoint must answer { url }: the payment provider's hosted checkout page.
   * Card details are only ever entered on that provider's page, never on this site.
   */
  checkout: {
    trialEndpoint: orNull(env.VITE_TRIAL_ENDPOINT),
    subscribeEndpoint: orNull(env.VITE_CHECKOUT_ENDPOINT),
    /**
     * Test-mode screens stand in for an endpoint that is not set yet: a simulated trial sign-up and
     * simulated Razorpay-style payment. On by default in local development (npm run dev);
     * in a production build only when VITE_PAYMENT_MOCK=true. No real payment is ever taken.
     */
    mock: env.DEV || env.VITE_PAYMENT_MOCK === 'true',
  },

  /**
   * Policy pages. They are built into this site (privacy/, terms/, cancellation-policy/);
   * set an env URL only to point a link somewhere else instead.
   */
  legal: {
    privacy: orNull(env.VITE_PRIVACY_URL) ?? '/privacy/',
    terms: orNull(env.VITE_TERMS_URL) ?? '/terms/',
    cancellation: orNull(env.VITE_CANCELLATION_URL) ?? '/cancellation-policy/',
    /** Shown as "Last updated" on every policy page. Change it whenever a policy changes. */
    updated: '25 November 2026',
  },

  /**
   * Business details used in the policy pages. Any value left empty shows as a highlighted
   * "to be added" note on the page, so the policies are never published with silent gaps.
   */
  company: {
    /** Product owner, as named in the product brief. */
    owner: 'Aavoraa',
    legalName: orNull(env.VITE_COMPANY_LEGAL_NAME),
    address: orNull(env.VITE_COMPANY_ADDRESS),
    supportEmail: orNull(env.VITE_SUPPORT_EMAIL),
    grievanceOfficer: orNull(env.VITE_GRIEVANCE_OFFICER),
    grievanceEmail: orNull(env.VITE_GRIEVANCE_EMAIL),
    /** City whose courts handle disputes, e.g. "Chennai". */
    jurisdiction: orNull(env.VITE_LEGAL_JURISDICTION),
  },

  /** Add real profiles only, e.g. { label: 'LinkedIn', href: 'https://linkedin.com/company/…' } */
  social: [] as { label: 'LinkedIn' | 'X' | 'YouTube' | 'GitHub'; href: string }[],
};

export type Plan = {
  id: string;
  name: string;
  audience: string;
  /** null renders "Pricing on request". Set e.g. '₹1,999' with `priceNote: 'per user / month'`. */
  price: string | null;
  priceNote?: string;
  highlights: string[];
  cta: 'getStarted' | 'demo';
  featured?: boolean;
};

/**
 * Plans are intentionally enquiry-based until packaging is confirmed.
 * `highlights` describe who the plan is for — not a confirmed feature allocation.
 */
export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    audience: 'For small teams bringing customers and work into one place.',
    price: null,
    highlights: [
      'Core CRM workspace',
      'Tasks and projects for a single team',
      'Guided setup',
    ],
    cta: 'getStarted',
  },
  {
    id: 'professional',
    name: 'Professional',
    audience: 'For growing companies running multiple departments.',
    price: null,
    highlights: [
      'Multiple departments and roles',
      'Meetings and AI-assisted workflows',
      'Reports across teams',
    ],
    cta: 'demo',
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    audience: 'For organisations with advanced control and rollout needs.',
    price: null,
    highlights: [
      'Custom roles and permission structures',
      'Configured onboarding plan',
      'Dedicated point of contact',
    ],
    cta: 'demo',
  },
];

/* ───────────────────────── Subscription pricing ───────────────────────── */

export type PlanId = 'starter' | 'growth' | 'business';

/** true = included, false = not included, or a short note such as 'Basic' or 'Add-on'. */
export type Entitlement = boolean | 'Basic' | 'Add-on' | 'Limited' | 'Advanced';

export type PricingPlan = {
  id: PlanId;
  name: string;
  summary: string;
  /** Price per employee per month, billed monthly (INR). */
  monthly: number;
  /** Monthly-equivalent price per employee when billed yearly (INR). */
  yearly: number;
  popular?: boolean;
  /** Highlights on the card, in line with the comparison table below. */
  features: string[];
  addOns?: string[];
};

/** Module entitlements per plan, shown as the "Compare plans" table. */
export const planComparison: { module: string; plans: Record<PlanId, Entitlement> }[] = [
  { module: 'Employee management', plans: { starter: true, growth: true, business: true } },
  { module: 'Attendance', plans: { starter: true, growth: true, business: true } },
  { module: 'Basic task management', plans: { starter: true, growth: true, business: true } },
  { module: 'Advanced task management', plans: { starter: false, growth: true, business: true } },
  { module: 'Department management', plans: { starter: 'Basic', growth: true, business: true } },
  { module: 'Leave management', plans: { starter: false, growth: true, business: true } },
  { module: 'Project management', plans: { starter: false, growth: true, business: true } },
  { module: 'Advanced reports', plans: { starter: false, growth: true, business: true } },
  { module: 'Customer & lead CRM', plans: { starter: false, growth: 'Add-on', business: true } },
  { module: 'Meetings', plans: { starter: false, growth: 'Add-on', business: 'Add-on' } },
  { module: 'AI meeting intelligence', plans: { starter: false, growth: 'Add-on', business: 'Add-on' } },
  { module: 'Workflow automation', plans: { starter: false, growth: 'Limited', business: 'Advanced' } },
  { module: 'Custom permissions', plans: { starter: false, growth: false, business: true } },
  { module: 'Multi-location management', plans: { starter: false, growth: false, business: true } },
  { module: 'Team chat', plans: { starter: 'Basic', growth: true, business: true } },
  { module: 'SOP management', plans: { starter: false, growth: true, business: true } },
  { module: 'Expense management', plans: { starter: false, growth: true, business: true } },
  { module: 'Performance management', plans: { starter: false, growth: 'Basic', business: true } },
  { module: 'Proposal management', plans: { starter: false, growth: 'Add-on', business: true } },
  { module: 'Invoice & finance management', plans: { starter: false, growth: 'Add-on', business: true } },
  { module: 'Recruitment management', plans: { starter: false, growth: false, business: true } },
  { module: 'Client portal', plans: { starter: false, growth: false, business: true } },
  { module: 'Marketing management', plans: { starter: false, growth: false, business: 'Add-on' } },
  { module: 'API & webhooks', plans: { starter: false, growth: false, business: true } },
  { module: 'Priority support', plans: { starter: false, growth: false, business: true } },
];

export const pricing = {
  minEmployees: 10,
  teamSizes: [10, 25, 50, 100, 200, 500],
  yearlySaving: 'Save ~17%',
  trialDays: 7,
  /** GST rate shown on the test payment screen. Confirm with your billing setup. */
  gstRate: 0.18,
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      summary: 'For small teams getting their people and work organised.',
      monthly: 49,
      yearly: 41,
      features: ['Employee management', 'Attendance', 'Basic task management', 'Basic department management', 'Basic team chat'],
    },
    {
      id: 'growth',
      name: 'Growth',
      summary: 'For growing teams that need more structure and visibility.',
      monthly: 79,
      yearly: 66,
      popular: true,
      features: [
        'Everything in Starter',
        'Advanced task management',
        'Department management',
        'Leave management',
        'Project management',
        'Advanced reports',
        'Team chat',
        'SOP management',
        'Expense management',
        'Performance management (basic)',
        'Workflow automation (limited)',
      ],
      addOns: [
        'Customer & lead CRM',
        'Proposal management',
        'Invoice & finance management',
        'Meetings',
        'AI meeting intelligence',
      ],
    },
    {
      id: 'business',
      name: 'Business',
      summary: 'For organisations running larger or more complex operations.',
      monthly: 119,
      yearly: 99,
      features: [
        'Everything in Growth',
        'Customer & lead CRM',
        'Proposal management',
        'Invoice & finance management',
        'Performance management (full)',
        'Recruitment management',
        'Client portal',
        'Workflow automation (advanced)',
        'Custom permissions',
        'Multi-location management',
        'API & webhooks',
        'Priority support',
      ],
      addOns: ['Meetings', 'AI meeting intelligence', 'Marketing management'],
    },
  ] satisfies PricingPlan[],
};

/**
 * Sign-up link that carries the visitor's pricing choices, e.g.
 * /register?plan=growth&billing=yearly&employees=25&trial=7
 * The CRM's sign-up page can read these to preselect the plan or start the trial.
 */
export function signupUrl(params: Record<string, string | number>) {
  const base = siteConfig.auth.getStarted;
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
  return `${base}${base.includes('?') ? '&' : '?'}${query}`;
}
