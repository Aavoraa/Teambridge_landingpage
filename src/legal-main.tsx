import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './landing/styles/base.css';
import './landing/styles/flow.css';
import './landing/styles/legal.css';
import { LegalLayout } from './landing/legal/LegalLayout';
import { LEGAL_DOCS } from './landing/legal/docs';

/** Entry for the policy pages. Each page's HTML names its document in data-doc on #root. */
const root = document.getElementById('root')!;
const key = (root.dataset.doc ?? 'privacy') as keyof typeof LEGAL_DOCS;

createRoot(root).render(
  <StrictMode>
    <LegalLayout doc={LEGAL_DOCS[key] ?? LEGAL_DOCS.privacy} />
  </StrictMode>,
);
