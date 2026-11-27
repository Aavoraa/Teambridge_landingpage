import './styles/base.css';
import './styles/mockups.css';
import './styles/sections.css';
import './styles/interactive.css';
import './styles/flow.css';

import { CheckoutProvider } from './components/Checkout';
import { DemoProvider } from './components/DemoDialog';
import { Analytics } from './flow/Analytics';
import { Faq, FinalPage } from './flow/End';
import { Pricing } from './flow/Pricing';
import { Connected, Roles, Why } from './flow/Story';
import { Hero, Nav } from './flow/Top';
import { Pager } from './flow/motion';

/**
 * Public marketing landing page. Self-contained: mount it on the public route
 * (e.g. "/") of the CRM router; it does not depend on any CRM state or auth context.
 */
export function LandingPage() {
  return (
    <DemoProvider>
      <CheckoutProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Pager />
      <Nav />
      <main id="main">
        <Hero />
        <div className="f-panel">
          <Analytics />
          <Connected />
          <Why />
          <Roles />
          <Pricing />
          <Faq />
          <FinalPage />
        </div>
      </main>
      </CheckoutProvider>
    </DemoProvider>
  );
}
