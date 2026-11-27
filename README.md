# TeamBridge — Public Landing Page

Marketing landing page for the TeamBridge all-in-one CRM platform.
Built with **Vite + React 18 + TypeScript** and plain CSS design tokens. The only runtime dependency beyond React is `lucide-react` for icons.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
```

## Structure

```
src/landing/
  index.tsx          LandingPage component (mount this on the public route)
  config.ts          All CTA targets, demo handling, legal/social links, pricing plans
  components/        Logo, Reveal, ScaledFrame, SectionHead, Accordion, DemoDialog
  legal/             Policy pages: LegalLayout (page frame, contents, gaps) and docs (policy text)
  flow/              The live page: Top (Nav, Hero), Analytics, Story (Connected, Why, Roles), End (FAQ,
                     final page), Scene (illustrations), motion (Pager: one wheel tick per [data-page])
  mockups/           CRM screens shown in the hero's interactive preview
  styles/            base.css (tokens), mockups.css, interactive.css, sections.css (dialog, accordion, logo),
                     flow.css (live page). minimal.css belongs to the previous design
  sections/          Previous design, not imported by index.tsx. Safe to delete once no longer needed
```

## Policy pages

The build produces `privacy/index.html`, `terms/index.html` and `cancellation-policy/index.html` next to the landing page (see `vite.config.ts`). Deploy the whole `dist` folder. If your host serves the landing page for `/privacy` without the slash, the page redirects to `/privacy/` itself.

## Integrating with the CRM app

The landing page is self-contained and does not depend on CRM state, auth context or routing.

1. Copy `src/landing/` into the CRM frontend.
2. Mount `<LandingPage />` on the public route (e.g. `/`) **outside** any auth guard; leave existing dashboard routes untouched.
3. Set the auth paths so CTAs point at the CRM's real routes (see `.env.example`):
   - `VITE_APP_URL` — leave empty when served from the same origin as the CRM
   - `VITE_SIGN_IN_PATH` (default `/login`), `VITE_SIGN_UP_PATH` (default `/register`)

## Configuration still needed before launch

| Item | Where | Current state |
| --- | --- | --- |
| Sign in / Get started routes | `.env` | Default to `/login` and `/register`; confirm against the CRM |
| Demo requests | `VITE_DEMO_ENDPOINT` or `VITE_SALES_EMAIL` | Not set; the form shows a "not connected" note and submit is disabled |
| Free trial sign-up | `VITE_TRIAL_ENDPOINT` | Not set; the checkout shows a "not connected" note with a link to the sign-up page. Receives JSON (mode, plan, billing, employees, price, contact details); may return `{ redirectUrl }` |
| Paid subscription | `VITE_CHECKOUT_ENDPOINT` | Not set; same fallback. Must create a payment session with your provider (e.g. Razorpay or Stripe) and return `{ url }` of its hosted checkout page (https). Card details are never collected on this site |
| Policy pages | `/privacy/`, `/terms/`, `/cancellation-policy/` (built in) | Drafts written to match the pricing, trial and Razorpay set-up. Have a lawyer review them; set `legal.updated` in `config.ts` when they change |
| Business details in the policies | `VITE_COMPANY_LEGAL_NAME`, `VITE_COMPANY_ADDRESS`, `VITE_SUPPORT_EMAIL`, `VITE_GRIEVANCE_OFFICER`, `VITE_GRIEVANCE_EMAIL`, `VITE_LEGAL_JURISDICTION` | Not set; each shows as a highlighted "to be added" gap on the policy pages |
| Social profiles | `siteConfig.social` in `config.ts` | Empty; nothing rendered |
| Pricing | `pricing` and `planComparison` in `config.ts` | Starter ₹49, Growth ₹79, Business ₹119 per employee per month (yearly ₹41 / ₹66 / ₹99), 7-day trial. The comparison table is a proposed packaging; confirm each module is live before launch |

## Payments: test mode now, Razorpay later

The plan checkout (`src/landing/components/Checkout.tsx`) ends in one of two places:

- **Test mode** (`src/landing/components/MockPayment.tsx`): a simulated order summary, payment method choice, processing, success and failure screens, with test order and payment IDs. It never asks for card, UPI or bank details and never takes money. It runs when no endpoint is set and either `npm run dev` is used or `VITE_PAYMENT_MOCK=true`. Every screen is labelled "Test mode".
- **Live** (once `VITE_CHECKOUT_ENDPOINT` / `VITE_TRIAL_ENDPOINT` are set): details are posted to your server.

### Razorpay integration

The hook-up point is marked `Razorpay hook-up` in `Checkout.tsx` (inside `submit()`).

1. **Server: create the order or subscription.** From your backend, with your Razorpay key secret (never in this front end), call the Orders API, or the Subscriptions API for recurring billing. Use the amount in paise including GST, and receipt and notes such as plan, billing, employees and company. Return `order_id` (or `subscription_id`), the amount and your public `key_id`.
2. **Front end: open Razorpay Checkout.** Load `https://checkout.razorpay.com/v1/checkout.js` and open it with `key`, `order_id` (or `subscription_id`), `name: 'TeamBridge'`, and `prefill` from the details step (name, email, contact). This replaces the test screen.
3. **Server: verify the payment.** Send `razorpay_payment_id`, `razorpay_order_id` and `razorpay_signature` from Checkout's handler to your server, verify the signature, then activate the subscription. Also handle Razorpay webhooks (`payment.captured`, `subscription.charged` and so on) so activation does not depend on the browser.
4. **Front end: show the result.** Reuse the success and failure screens in `MockPayment.tsx` for the verified outcome.

Prices on the page are in rupees and exclude GST. The test screen adds GST at `pricing.gstRate` (18%) in `config.ts`; confirm the rate and invoicing with your accountant.

## Content notes

- Product previews are HTML/CSS mockups with illustrative sample data (noted under the showcase). Review them against the shipped CRM and remove anything not yet implemented.
- AI copy deliberately states that AI output is a proposal confirmed by a person, and that recording requires consent.
- No customer logos, testimonials, certifications, integrations or contact details are included.
