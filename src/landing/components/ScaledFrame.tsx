import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

type ScaledFrameProps = {
  /** Width the mockup is designed at, in px. */
  width: number;
  /** Fixed design height in px. Omit to use the mockup's natural height. */
  height?: number;
  className?: string;
  label: string;
  /** When true the preview contains real controls, so it is exposed to assistive tech instead of hidden. */
  interactive?: boolean;
  children: ReactNode;
};

/**
 * Renders a product mockup at a fixed design width and scales it to fit its container,
 * so the UI keeps realistic proportions from desktop down to mobile.
 */
export function ScaledFrame({ width, height, className = '', label, interactive, children }: ScaledFrameProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [naturalH, setNaturalH] = useState(height ?? 0);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const update = () => {
      setScale(Math.min(1, o.clientWidth / width));
      if (height === undefined) setNaturalH(i.offsetHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width, height]);

  return (
    <div
      ref={outer}
      className={`scaled-frame ${className}`}
      style={{ height: naturalH * scale }}
      role={interactive ? 'region' : 'img'}
      aria-label={label}
    >
      <div
        ref={inner}
        className="scaled-frame__inner"
        style={{ width, height: height ?? 'auto', transform: `scale(${scale})` }}
        aria-hidden={interactive ? undefined : true}
        // Static previews must not expose focusable controls.
        {...(!interactive && { inert: '' as unknown as boolean })}
      >
        {children}
      </div>
    </div>
  );
}
