import { useEffect, useRef, useState } from 'react';
import { useInterval } from '../components/hooks';
import { Count, MOTION_Q, MaskText, clamp, lerp, useHere, useMedia } from './motion';

const PILE = [
  { t: 'Leads', x: 6, y: 66, r: -14 },
  { t: 'Deals', x: 30, y: 74, r: 8 },
  { t: 'Tasks', x: 60, y: 70, r: -8 },
  { t: 'Invoices', x: 74, y: 56, r: 22 },
  { t: 'Contacts', x: 4, y: 44, r: 18 },
  { t: 'Meetings', x: 28, y: 50, r: -12 },
  { t: 'Attendance', x: 50, y: 44, r: 12 },
  { t: 'Expenses', x: 70, y: 32, r: -20 },
  { t: 'Follow-ups', x: 12, y: 22, r: -6 },
  { t: 'Approvals', x: 44, y: 24, r: 16 },
  { t: 'Team chat', x: 30, y: 4, r: 10 },
];

const STAGES = [
  { name: 'New', pct: 100, value: '46' },
  { name: 'Qualified', pct: 78, value: '36' },
  { name: 'Proposal', pct: 60, value: '28' },
  { name: 'Negotiation', pct: 41, value: '19' },
  { name: 'Won', pct: 26, value: '12' },
];

const SLIDES = ['Everything Your Office Tracks', 'Deals By Stage', 'Monthly Revenue'];

const RANGES: { label: string; points: number[] }[] = [
  { label: '7 days', points: [62, 54, 58, 40, 30, 46, 22] },
  { label: '1 month', points: [58, 30, 38, 52, 66, 40, 12] },
  { label: '3 months', points: [70, 58, 44, 50, 36, 24, 18] },
  { label: '6 months', points: [46, 60, 34, 42, 56, 30, 14] },
  { label: '1 year', points: [76, 66, 60, 44, 38, 26, 10] },
];

function Pile() {
  return (
    <div className="f-pile" aria-hidden="true">
      {PILE.map((p, i) => (
        <span key={p.t} style={{ left: `${p.x}%`, top: `${p.y}%`, '--r': `${p.r}deg`, '--i': i } as React.CSSProperties}>
          {p.t}
        </span>
      ))}
    </div>
  );
}

function FunnelBars() {
  return (
    <ul className="f-bars">
      {STAGES.map((s, i) => (
        <li key={s.name} style={{ '--i': i } as React.CSSProperties}>
          <span className="f-bars__track">
            <i style={{ width: `${s.pct}%`, opacity: 1 - i * 0.14 }}>{s.value}</i>
          </span>
          <b>{s.name}</b>
        </li>
      ))}
    </ul>
  );
}

function Trend() {
  const d = 'M0 118C34 118 44 66 78 62S128 112 164 104S214 40 250 48S296 112 332 94S376 34 420 28';
  return (
    <div className="f-trend">
      <div className="f-trend__tabs" aria-hidden="true">
        <span className="is-on">This quarter</span>
        <span>Last quarter</span>
      </div>
      <svg viewBox="0 0 420 150" preserveAspectRatio="none" aria-hidden="true">
        {[30, 70, 110].map((y) => (
          <line key={y} x1="0" x2="420" y1={y} y2={y} stroke="#E6EBF3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={d} fill="none" stroke="#2450C8" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="f-trend__tag">₹12.8L</span>
      <div className="f-trend__axis" aria-hidden="true">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function LineChart({ points }: { points: number[] }) {
  const [shown, setShown] = useState(points);
  const current = useRef(points);
  const animated = useMedia(MOTION_Q);

  useEffect(() => {
    if (!animated) {
      current.current = points;
      setShown(points);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = clamp((now - start) / 650);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from.map((v, i) => lerp(v, points[i], eased));
      current.current = next;
      setShown(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points, animated]);

  const X = (i: number) => (i / (shown.length - 1)) * 100;
  const line = shown.map((v, i) => `${X(i)},${v}`).join(' ');
  const low = shown.reduce((best, v, i) => (v > shown[best] ? i : best), 0);
  const mark = 1;

  return (
    <div className="f-line">
      <svg viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true">
        {[20, 40, 60].map((y) => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#E0E6F0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1={X(low)} x2={X(low)} y1="0" y2="80" stroke="#C2CCDD" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <polyline points={line} fill="none" stroke="#2450C8" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {[mark, low].map((i, n) => (
        <span key={n} className="f-line__pt" style={{ left: `${X(i)}%`, top: `${(shown[i] / 80) * 100}%` }}>
          <em>{n === 0 ? '+24%' : '-8%'}</em>
        </span>
      ))}
    </div>
  );
}

const SLIDE_MS = 5000;

export function Analytics() {
  const animated = useMedia(MOTION_Q);
  const [root, here] = useHere<HTMLElement>();
  const [slide, setSlide] = useState(0);
  const [range, setRange] = useState(1);
  const [autoRange, setAutoRange] = useState(true);

  // Every visit starts from the first chart.
  useEffect(() => {
    if (here) setSlide(0);
  }, [here]);

  // Charts advance on their own while this page is on screen.
  useInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS, here && animated);
  useInterval(() => setRange((r) => (r + 1) % RANGES.length), 3400, here && animated && autoRange);

  return (
    <section ref={root} className={`f-page f-an ${here ? 'is-in' : ''}`} id="platform" aria-labelledby="an-title" data-page>
      <MaskText id="an-title" className="f-title" active={here} text={'Know How Your\nOffice Is Performing'} />

      <div className="f-an__grid">
        <div className="f-box f-box--left">
          <div className="f-slides">
            {SLIDES.map((title, i) => (
              <div key={title} className={`f-slide ${i === slide ? 'is-on' : ''}`} aria-hidden={i !== slide}>
                <h3>{title}</h3>
                <div className="f-slide__card">
                  {i === 0 && <Pile />}
                  {i === 1 && <FunnelBars />}
                  {i === 2 && <Trend />}
                </div>
              </div>
            ))}
          </div>
          <div className="f-seg" role="group" aria-label="Choose a chart">
            {SLIDES.map((title, i) => (
              <button
                key={title}
                type="button"
                aria-label={title}
                aria-pressed={i === slide}
                className={i === slide ? 'is-on' : i < slide ? 'is-past' : ''}
                onClick={() => setSlide(i)}
              >
                {/* Re-keyed so the bar restarts whenever this slide opens. */}
                <i key={`${slide}-${here}`} style={{ '--ms': `${SLIDE_MS}ms` } as React.CSSProperties} />
              </button>
            ))}
          </div>
        </div>

        <div className="f-box f-box--right">
          <h3>Sales And Delivery</h3>
          <div className="f-perf">
            <div className="f-metrics">
              <div className="f-metric f-metric--navy">
                <span>Lead conversion</span>
                <strong>
                  <Count value="+60%" active={here} />
                </strong>
              </div>
              <div className="f-metric f-metric--royal">
                <span>On-time delivery</span>
                <strong>
                  <Count value="+68%" active={here} />
                </strong>
              </div>
            </div>
            <div className="f-chart">
              <div className="f-ranges" role="group" aria-label="Choose a date range">
                {RANGES.map((r, i) => (
                  <button key={r.label} type="button" aria-pressed={range === i} className={range === i ? 'is-on' : ''} onClick={() => {
                      setRange(i);
                      setAutoRange(false);
                    }}>
                    {r.label}
                  </button>
                ))}
              </div>
              <LineChart points={RANGES[range].points} />
            </div>
          </div>
        </div>
      </div>
      <p className="f-an__note">Previews use illustrative sample data.</p>
    </section>
  );
}
