import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LandingPage } from './landing';

// Policy pages live at /privacy/, /terms/ and /cancellation-policy/. If a host serves this page
// for the address without the trailing slash, send the visitor to the right page.
const policy = window.location.pathname.match(/^\/(privacy|terms|cancellation-policy)$/);
if (policy) {
  window.location.replace(`/${policy[1]}/${window.location.search}${window.location.hash}`);
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LandingPage />
    </StrictMode>,
  );
}
