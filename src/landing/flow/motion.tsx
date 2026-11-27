import { Fragment, useEffect, useRef, useState, type ElementType } from 'react';
import { useCountUp } from '../components/hooks';

export const MOTION_Q = '(prefers-reduced-motion: no-preference)';
/** Scroll-pinned sections only run on larger screens with motion allowed. */
export const PIN_Q = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';

export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progress of p through the a to b window, as 0 to 1. */
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function useMedia(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Runs `fn` at most once per animation frame while the page scrolls or resizes. */
export function useScrollFrame(fn: () => void, enabled = true) {
  const saved = useRef(fn);
  saved.current = fn;
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        saved.current();
      });
    };
    saved.current();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [enabled]);
}

/** Top of an element in the document, ignoring any transform on it. */
export function docTop(el: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/**
 * True while the page is arriving or on screen. It turns false once the page has fully
 * left, so its entrance animations play again on every visit.
 */
export function useHere<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [here, setHere] = useState(false);
  useScrollFrame(() => {
    const el = ref.current;
    if (!el) return;
    const h = window.innerHeight;
    const top = docTop(el) - window.scrollY;
    const start = window.innerWidth < 900 ? 0.8 : 0.97;
    setHere(top < h * start && top + el.offsetHeight > h * 0.03);
  });
  return [ref, here] as const;
}

/** A figure that counts up from zero each time `active` turns on. */
function CountInner({ value, active, duration }: { value: string; active: boolean; duration: number }) {
  return <>{useCountUp(value, active, duration)}</>;
}
export function Count({ value, active, duration = 1300 }: { value: string; active: boolean; duration?: number }) {
  return <CountInner key={String(active)} value={value} active={active} duration={duration} />;
}

/**
 * Page-by-page navigation: one wheel tick (or arrow / Page key) glides to the next
 * `[data-page]` element, and the page being left recedes while the next slides over it.
 * Desktop only; phones and reduced motion keep normal scrolling.
 */
export function Pager() {
  const enabled = useMedia(PIN_Q);

  useScrollFrame(() => {
    const h = window.innerHeight;
    document.querySelectorAll<HTMLElement>('.f-page').forEach((page) => {
      const d = (docTop(page) - window.scrollY) / h;
      // A page taller than the screen only starts to recede once its bottom edge passes the bottom of the screen.
      const overflow = Math.max(0, page.offsetHeight - h) / h;
      const leaving = clamp(-d - overflow);
      page.style.visibility = -d - overflow >= 1 ? 'hidden' : 'visible';
      page.style.transform = leaving > 0 && leaving < 1 ? `translate3d(0, ${leaving * h}px, 0) scale(${1 - leaving * 0.1})` : '';
      page.style.opacity = leaving > 0 ? String(1 - leaving * 0.65) : '';
      const arriving = d > 0 && d < 1;
      page.style.borderRadius = arriving ? `${Math.min(36, d * 220)}px ${Math.min(36, d * 220)}px 0 0` : '';
      page.style.boxShadow = arriving ? '0 -24px 60px -24px rgba(8, 21, 52, 0.45)' : '';
    });
  }, enabled);

  useEffect(() => {
    if (enabled) return;
    document.querySelectorAll<HTMLElement>('.f-page').forEach((page) => {
      page.removeAttribute('style');
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let busy = false;
    let lastWheel = 0;
    let raf = 0;

    const stops = () => {
      const h = window.innerHeight;
      const max = document.documentElement.scrollHeight - h;
      const list: number[] = [];
      document.querySelectorAll<HTMLElement>('[data-page]').forEach((el) => {
        const top = docTop(el);
        list.push(top);
        // A page taller than the screen gets extra stops, one screen at a time, down to its lower edge.
        if (el.matches('.f-page') && el.offsetHeight > h + 8) {
          const last = top + el.offsetHeight - h;
          for (let y = top + h * 0.85; y < last - h * 0.2; y += h * 0.85) list.push(y);
          list.push(last);
        }
      });
      return list
        .map((y) => Math.min(max, Math.round(y)))
        .sort((a, b) => a - b)
        .filter((y, i, all) => i === 0 || y - all[i - 1] > 4);
    };

    const glide = (target: number) => {
      const from = window.scrollY;
      const start = performance.now();
      const duration = 950;
      busy = true;
      cancelAnimationFrame(raf);
      const tick = (now: number) => {
        const t = clamp((now - start) / duration);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo({ top: lerp(from, target, eased), behavior: 'instant' });
        if (t < 1) raf = requestAnimationFrame(tick);
        else busy = false;
      };
      raf = requestAnimationFrame(tick);
    };

    const step = (direction: 1 | -1) => {
      const y = window.scrollY;
      const list = stops();
      const target = direction > 0 ? list.find((s) => s > y + 4) : [...list].reverse().find((s) => s < y - 4);
      if (target !== undefined) glide(target);
    };

    const blocked = () => !!document.querySelector('dialog[open], .fnav.is-open');

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || blocked()) return;
      e.preventDefault();
      const now = performance.now();
      const quiet = now - lastWheel > 140; // Ignores the trailing inertia of a trackpad swipe.
      lastWheel = now;
      if (busy || !quiet || Math.abs(e.deltaY) < 2) return;
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (blocked() || target.closest('input, textarea, select, [contenteditable]')) return;
      const isControl = !!target.closest('button, a');
      const forward = e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !isControl && !e.shiftKey);
      const back = e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && !isControl && e.shiftKey);
      if (!forward && !back) return;
      e.preventDefault();
      if (!busy) step(forward ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [enabled]);

  return null;
}

type MaskTextProps = {
  as?: ElementType;
  /** A new line in the text forces a line break. */
  text: string;
  id?: string;
  className?: string;
  /** Plays the reveal; turning it off resets it for the next visit. */
  active: boolean;
};

/** Headline reveal: every word rises out of its own clipped line. */
export function MaskText({ as: Tag = 'h2', text, id, className = '', active }: MaskTextProps) {
  let index = 0;
  const lines = text.split('\n');
  return (
    <Tag id={id} className={`mask ${active ? 'is-in' : ''} ${className}`}>
      {lines.map((line, l) => (
        <span key={l} className="mask__line">
          {line.split(' ').map((word, w) => (
            <Fragment key={w}>
              <span className="mw">
                <span style={{ '--i': index++ } as React.CSSProperties}>{word}</span>
              </span>{' '}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
