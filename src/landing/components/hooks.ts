import { useEffect, useRef, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True once (or while, with once=false) the element is in the viewport. */
export function useInView<T extends Element>({ threshold = 0.25, once = true } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return [ref, inView] as const;
}

/**
 * Animates a formatted figure such as "₹48.2L", "18.4%" or "1,284" from zero once `active` is true.
 * Returns the formatted string at each frame.
 */
export function useCountUp(value: string, active: boolean, duration = 1100) {
  const match = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  const [display, setDisplay] = useState(() => (match ? `${match[1]}0${match[3]}` : value));

  useEffect(() => {
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const grouped = num.includes(',');
    const fmt = (n: number) => {
      const fixed = n.toFixed(decimals);
      return grouped ? Number(fixed).toLocaleString('en-IN', { minimumFractionDigits: decimals }) : fixed;
    };
    if (!active) return;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${prefix}${fmt(target * eased)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, active, duration]);

  return display;
}

/** Calls `fn` every `ms` while `enabled`. */
export function useInterval(fn: () => void, ms: number, enabled = true) {
  const saved = useRef(fn);
  saved.current = fn;
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms, enabled]);
}
