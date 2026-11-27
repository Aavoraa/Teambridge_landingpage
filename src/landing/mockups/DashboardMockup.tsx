import { useMemo, useState, type MouseEvent } from 'react';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  Layers,
  MoreHorizontal,
  Plus,
  Sparkles,
  UserPlus,
  Users,
  Video,
} from 'lucide-react';
import { useCountUp, useInView } from '../components/hooks';
import { AppShell, Avatar } from './AppShell';
import { useShell } from './ShellContext';

/* Illustrative sample data — mirrors the layout of the TeamBridge "Dashboard Overview" screen. */

const METRICS = [
  { icon: BarChart3, tone: 'green', label: 'Total revenue', value: '₹48.2L', note: '+12.4% vs previous 30 days' },
  { icon: Users, tone: 'violet', label: 'Conversion rate', value: '18.4%', note: '142 proposals sent in 30 days' },
  { icon: Check, tone: 'amber', label: 'Active leads', value: '1,284', note: '86 new in 30 days' },
  { icon: Layers, tone: 'blue', label: 'Pipeline value', value: '₹1.9Cr', note: '62 open deals' },
];

const FUNNEL = [
  { stage: 'Leads', count: 1284, pct: 100 },
  { stage: 'Qualified', count: 486, pct: 38 },
  { stage: 'Proposal', count: 142, pct: 11 },
  { stage: 'Negotiation', count: 61, pct: 4.8 },
  { stage: 'Won', count: 38, pct: 3 },
];

/* ───────── Revenue series (values in ₹ thousands) ───────── */

type Range = '1M' | '3M' | '6M' | '1Y';
const END = new Date(2026, 10, 5);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayLabel = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

function wave(n: number, base: number, growth: number, seed: number) {
  return Array.from({ length: n }, (_, i) => {
    const trend = 1 + (growth * i) / n;
    const wobble = 1 + 0.16 * Math.sin(i * 1.7 + seed) + 0.07 * Math.sin(i * 0.55 + seed * 2);
    return Math.round(base * trend * wobble);
  });
}

const RANGES: Record<Range, { total: string; caption: string; step: 'day' | 'week' | 'month'; n: number; base: number }> = {
  '1M': { total: '₹48.2L', caption: 'collected, last 30 days', step: 'day', n: 30, base: 130 },
  '3M': { total: '₹1.38Cr', caption: 'collected, last 3 months', step: 'week', n: 13, base: 920 },
  '6M': { total: '₹2.71Cr', caption: 'collected, last 6 months', step: 'week', n: 26, base: 880 },
  '1Y': { total: '₹6.74Cr', caption: 'collected, last 12 months', step: 'month', n: 12, base: 4600 },
};

function buildSeries(range: Range) {
  const r = RANGES[range];
  const now = wave(r.n, r.base, 0.45, 1);
  const before = wave(r.n, r.base * 0.82, 0.3, 2.4);
  const labels = Array.from({ length: r.n }, (_, i) => {
    const back = r.n - 1 - i;
    const d = new Date(END);
    if (r.step === 'day') d.setDate(d.getDate() - back);
    if (r.step === 'week') d.setDate(d.getDate() - back * 7);
    if (r.step === 'month') d.setMonth(d.getMonth() - back);
    return r.step === 'month' ? `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}` : dayLabel(d);
  });
  const max = Math.max(...now, ...before) * 1.15;
  return { now, before, labels, max };
}

const fmtK = (k: number) => (k <= 0 ? '₹0' : k >= 10000 ? `₹${(k / 10000).toFixed(2)}Cr` : k >= 100 ? `₹${(k / 100).toFixed(1)}L` : `₹${Math.round(k)}K`);

function RevenueCard({ inView }: { inView: boolean }) {
  const { interactive } = useShell();
  const [range, setRange] = useState<Range>('1M');
  const [hover, setHover] = useState<number | null>(null);
  const { now, before, labels, max } = useMemo(() => buildSeries(range), [range]);
  const total = useCountUp(RANGES[range].total, inView);

  const path = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'}${((i / (data.length - 1)) * 100).toFixed(2)},${(100 - (v / max) * 100).toFixed(2)}`).join(' ');
  const xTicks = labels.filter((_, i) => i % Math.ceil(labels.length / 12) === 0 || i === labels.length - 1);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setHover(Math.round(ratio * (now.length - 1)));
  };

  const hx = hover !== null ? (hover / (now.length - 1)) * 100 : 0;

  return (
    <section className="mcard ov__revenue">
      <div className="ov__rev-head">
        <h5 className="ov__title ov__title--icon">
          <BarChart3 /> Revenue
        </h5>
        <div className="ov__ranges" role={interactive ? 'group' : undefined} aria-label="Revenue range">
          {(Object.keys(RANGES) as Range[]).map((r) =>
            interactive ? (
              <button key={r} type="button" className={r === range ? 'is-active' : ''} aria-pressed={r === range} onClick={() => setRange(r)}>
                {r}
              </button>
            ) : (
              <span key={r} className={r === range ? 'is-active' : ''}>
                {r}
              </span>
            ),
          )}
          <MoreHorizontal />
        </div>
      </div>
      <p className="ov__collected">
        <strong>{total}</strong> {RANGES[range].caption}
      </p>
      <div className="ov__chart">
        <div className="ov__y">
          {[1, 0.75, 0.5, 0.25, 0].map((f) => (
            <span key={f}>{fmtK(max * f)}</span>
          ))}
        </div>
        <div className="ov__plot" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" key={range} className={inView ? 'is-drawn' : ''}>
            {[0, 25, 50, 75, 100].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#EEF0F2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
            <path d={path(before)} fill="none" stroke="#D0D5DD" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            <path d={path(now)} fill="none" stroke="#2450C8" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </svg>
          {hover !== null && (
            <>
              <span className="ov__cursor" style={{ left: `${hx}%` }} />
              <span className="ov__dot ov__dot--now" style={{ left: `${hx}%`, top: `${100 - (now[hover] / max) * 100}%` }} />
              <span className="ov__dot" style={{ left: `${hx}%`, top: `${100 - (before[hover] / max) * 100}%` }} />
              <div className={`ov__tip ${hx > 70 ? 'is-left' : ''}`} style={{ left: `${hx}%` }}>
                <b>{labels[hover]}</b>
                <span>
                  <i style={{ background: '#2450C8' }} /> This period <em>{fmtK(now[hover])}</em>
                </span>
                <span>
                  <i style={{ background: '#D0D5DD' }} /> Period before <em>{fmtK(before[hover])}</em>
                </span>
              </div>
            </>
          )}
          <div className="ov__x">
            {xTicks.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="ov__legend">
        <span>
          <i style={{ background: '#2450C8' }} /> This period
        </span>
        <span>
          <i style={{ background: '#D0D5DD' }} /> The period before
        </span>
      </div>
    </section>
  );
}

function Metric({ m, inView }: { m: (typeof METRICS)[number]; inView: boolean }) {
  const value = useCountUp(m.value, inView);
  return (
    <div className="ov__metric">
      <span className={`ov__chip ov__chip--${m.tone}`}>
        <m.icon />
      </span>
      <div>
        <small>{m.label}</small>
        <strong>{value}</strong>
        <em>{m.note}</em>
      </div>
    </div>
  );
}

const ACTIVITY = [
  { icon: CheckCircle2, tone: 'green', text: <><b>Lena Ortiz</b> moved <b>Halcyon Retail</b> to Won</>, t: '4 min ago' },
  { icon: Sparkles, tone: 'violet', text: <><b>AI</b> proposed 3 tasks from <b>Acme renewal</b></>, t: '18 min ago' },
  { icon: UserPlus, tone: 'blue', text: <><b>Dev Patel</b> added <b>Meera Iyer</b> to Engineering</>, t: '1 hr ago' },
];

const SCHEDULE = [
  { time: '10:30', title: 'Acme Corp — renewal review', who: ['Ananya Rao', 'Vikram Shah', 'Lena Ortiz'], live: true },
  { time: '13:00', title: 'Product squad weekly sync', who: ['Rahul Mehta', 'Priya Sharma', 'Sam Lee'] },
  { time: '16:15', title: 'Q4 hiring plan', who: ['Ananya Rao', 'Dev Patel'] },
];

export function DashboardMockup() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <AppShell
      active="dashboard"
      title="Dashboard Overview"
      subtitle="Good afternoon, Ananya · 5 November 2026"
      actions={
        <span className="mbtn mbtn--primary mbtn--lg">
          <Plus /> Quick add
        </span>
      }
    >
      <div ref={ref} className={`ov ${inView ? 'is-in' : ''}`}>
        <section className="mcard ov__analytics">
          <h5 className="ov__title">Overview Analytics</h5>
          <div className="ov__metrics">
            {METRICS.map((m) => (
              <Metric key={m.label} m={m} inView={inView} />
            ))}
          </div>
          <p className="ov__foot">Last 30 days compared with the 30 days before.</p>
        </section>

        <section className="mcard ov__funnel">
          <h5 className="ov__title">Sales Funnel</h5>
          <p className="ov__sub">Conversion at each stage</p>
          <ul>
            {FUNNEL.map((f, i) => (
              <li key={f.stage}>
                <div className="ov__funnel-row">
                  <span>{f.stage}</span>
                  <b>{f.count.toLocaleString('en-IN')}</b>
                </div>
                <span className="ov__funnel-bar">
                  <i style={{ width: `${Math.max(f.pct, 4)}%`, transitionDelay: `${i * 90}ms` }} />
                </span>
                <small>{f.pct}% of leads</small>
              </li>
            ))}
          </ul>
        </section>

        <RevenueCard inView={inView} />

        <div className="ov__bottom">
          <section className="mcard ov__activity">
            <div className="ov__card-head">
              <h5 className="ov__title">Recent Activity</h5>
              <span className="ov__link">
                View All <ArrowRight />
              </span>
            </div>
            <ul>
              {ACTIVITY.map((a, i) => (
                <li key={i}>
                  <span className={`ov__chip ov__chip--sm ov__chip--${a.tone}`}>
                    <a.icon />
                  </span>
                  <p>{a.text}</p>
                  <small>{a.t}</small>
                </li>
              ))}
            </ul>
          </section>

          <section className="mcard ov__schedule">
            <div className="ov__card-head">
              <h5 className="ov__title ov__title--icon">
                <CalendarDays /> Upcoming Schedule
              </h5>
              <span className="ov__link">
                View Calendar <ArrowRight />
              </span>
            </div>
            <ul>
              {SCHEDULE.map((m) => (
                <li key={m.title} className={m.live ? 'is-live' : ''}>
                  <span className="ov__time">{m.time}</span>
                  <p>{m.title}</p>
                  <span className="stack">
                    {m.who.map((w, i) => (
                      <Avatar key={w} name={w} size="xs" i={i + m.title.length} />
                    ))}
                  </span>
                  {m.live && (
                    <span className="mbtn mbtn--primary mbtn--xs">
                      <Video /> Join
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
