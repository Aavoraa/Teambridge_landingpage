import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';

export type AccordionItem = { q: string; a: ReactNode };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={item.q} className={`accordion__item ${isOpen ? 'is-open' : ''}`}>
            <h3>
              <button
                id={btnId}
                type="button"
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <Plus className="accordion__icon" aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className="accordion__panel">
              <div className="accordion__panel-inner">
                <div className="accordion__content">{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
