import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Filter,
  Flag,
  LayoutGrid,
  List,
  Plus,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { AppShell, Avatar, Pill } from './AppShell';
import { useShell } from './ShellContext';

/* ───────────────────────── CRM pipeline ───────────────────────── */

const STAGES = [
  {
    name: 'New',
    total: '₹18.4L',
    color: '#98A2B3',
    deals: [
      { co: 'Brightline Health', v: '₹6.2L', who: 'Lena Ortiz', tag: 'Inbound', days: '2d' },
      { co: 'Kestrel Logistics', v: '₹4.8L', who: 'Vikram Shah', tag: 'Referral', days: '1d' },
      { co: 'Orbit Education', v: '₹7.4L', who: 'Sam Lee', tag: 'Event', days: '4d' },
    ],
  },
  {
    name: 'Qualified',
    total: '₹31.0L',
    color: '#2450C8',
    deals: [
      { co: 'Halden Foods', v: '₹12.5L', who: 'Ananya Rao', tag: 'Enterprise', days: '6d' },
      { co: 'Pinecrest Realty', v: '₹9.1L', who: 'Lena Ortiz', tag: 'Inbound', days: '3d' },
      { co: 'Morrow Studio', v: '₹9.4L', who: 'Sam Lee', tag: 'Partner', days: '5d' },
    ],
  },
  {
    name: 'Proposal',
    total: '₹42.7L',
    color: '#3F72E6',
    deals: [
      { co: 'Acme Corp', v: '₹24.0L', who: 'Vikram Shah', tag: 'Renewal', days: '9d' },
      { co: 'Novaline Energy', v: '₹18.7L', who: 'Ananya Rao', tag: 'Enterprise', days: '7d' },
    ],
  },
  {
    name: 'Negotiation',
    total: '₹29.3L',
    color: '#8FB2F5',
    deals: [
      { co: 'Granite Partners', v: '₹16.8L', who: 'Lena Ortiz', tag: 'Outbound', days: '12d' },
      { co: 'Tidewater Media', v: '₹12.5L', who: 'Sam Lee', tag: 'Inbound', days: '8d' },
    ],
  },
  {
    name: 'Won',
    total: '₹58.1L',
    color: '#1C3FA3',
    deals: [
      { co: 'Halcyon Retail', v: '₹21.4L', who: 'Lena Ortiz', tag: 'Enterprise', days: 'Today' },
      { co: 'Fernway Clinics', v: '₹14.2L', who: 'Vikram Shah', tag: 'Referral', days: '2d' },
    ],
  },
];

export function PipelineMockup() {
  return (
    <AppShell
      active="crm"
      compactNav
      title="Sales pipeline"
      subtitle="62 open deals · ₹1.9Cr weighted value"
      actions={
        <>
          <span className="seg">
            <b>
              <LayoutGrid /> Board
            </b>
            <span>
              <List /> List
            </span>
          </span>
          <span className="mbtn mbtn--ghost">
            <Filter /> Owner: All
          </span>
          <span className="mbtn mbtn--primary">
            <Plus /> Deal
          </span>
        </>
      }
    >
      <div className="kanban">
        {STAGES.map((s) => (
          <div key={s.name} className="kanban__col">
            <div className="kanban__head">
              <i style={{ background: s.color }} />
              <b>{s.name}</b>
              <span>{s.deals.length}</span>
              <em>{s.total}</em>
            </div>
            {s.deals.map((d, i) => (
              <div key={d.co} className={`deal ${s.name === 'Proposal' && i === 0 ? 'is-lifted' : ''}`}>
                <div className="deal__top">
                  <span className="co-logo">{d.co[0]}</span>
                  <b>{d.co}</b>
                </div>
                <strong>{d.v}</strong>
                <div className="deal__meta">
                  <Pill>{d.tag}</Pill>
                  <span>
                    <Clock /> {d.days}
                  </span>
                  <Avatar name={d.who} size="xs" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AppShell>
  );
}

/* ───────────────────────── Projects ───────────────────────── */

const WEEKS = ['Oct 13', 'Oct 20', 'Oct 27', 'Nov 3', 'Nov 10', 'Nov 17', 'Nov 24', 'Dec 1'];
const PROJECTS = [
  { name: 'Client onboarding — Brightline', owner: 'Priya Sharma', start: 2, len: 4, pct: 35, color: '#2450C8', status: 'On track', tone: 'green' as const },
  { name: 'Platform rollout', owner: 'Rahul Mehta', start: 0, len: 6, pct: 62, color: '#3F72E6', status: 'On track', tone: 'green' as const },
  { name: 'Q4 brand refresh', owner: 'Aisha Khan', start: 1, len: 3, pct: 88, color: '#5F76A8', status: 'Review', tone: 'blue' as const },
  { name: 'Vendor consolidation', owner: 'Vikram Shah', start: 3, len: 4, pct: 20, color: '#8FB2F5', status: 'At risk', tone: 'amber' as const },
  { name: 'Support workflow migration', owner: 'Dev Patel', start: 4, len: 4, pct: 10, color: '#344054', status: 'Planned', tone: 'neutral' as const },
];

export function ProjectsMockup() {
  return (
    <AppShell
      active="projects"
      compactNav
      title="Projects"
      subtitle="14 active · 3 milestones due this week"
      actions={
        <>
          <span className="mbtn mbtn--ghost">
            <Users /> All departments <ChevronDown />
          </span>
          <span className="mbtn mbtn--primary">
            <Plus /> Project
          </span>
        </>
      }
    >
      <div className="mcard gantt">
        <div className="gantt__row gantt__row--head">
          <span>Project</span>
          <span>Progress</span>
          <div className="gantt__weeks">
            {WEEKS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </div>
        {PROJECTS.map((p) => (
          <div key={p.name} className="gantt__row">
            <span className="gantt__name">
              <Avatar name={p.owner} size="xs" />
              <span>
                <b>{p.name}</b>
                <Pill tone={p.tone}>{p.status}</Pill>
              </span>
            </span>
            <span className="gantt__pct">
              <span className="meter meter--thin">
                <i style={{ width: `${p.pct}%`, background: p.color }} />
              </span>
              {p.pct}%
            </span>
            <div className="gantt__track">
              <span className="gantt__today" style={{ left: `${(3.4 / 8) * 100}%` }} />
              <span
                className="gantt__bar"
                style={{ left: `${(p.start / 8) * 100}%`, width: `${(p.len / 8) * 100}%`, background: `${p.color}22`, borderColor: `${p.color}66` }}
              >
                <i style={{ width: `${p.pct}%`, background: p.color }} />
                <Flag style={{ color: p.color }} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="milestones">
        {[
          { t: 'Design sign-off', p: 'Platform rollout', d: 'Completed', ok: true },
          { t: 'Kick-off call with Brightline', p: 'Client onboarding', d: 'Thu, 6 Nov', ok: false },
          { t: 'Final vendor shortlist', p: 'Vendor consolidation', d: 'Fri, 7 Nov', ok: false },
        ].map((m) => (
          <div key={m.t} className="mcard milestone">
            {m.ok ? <CheckCircle2 className="ok" /> : <Flag />}
            <div>
              <b>{m.t}</b>
              <small>{m.p}</small>
            </div>
            <span>{m.d}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

/* ───────────────────────── Tasks ───────────────────────── */

const TASK_ROWS = [
  { t: 'Prepare Brightline onboarding plan', p: 'Client onboarding', who: 'Priya Sharma', due: 'Fri, 7 Nov', pr: 'High', st: 'In progress', stTone: 'blue' as const, prTone: 'red' as const },
  { t: 'Review renewal terms with legal', p: 'Acme Corp', who: 'Vikram Shah', due: 'Today', pr: 'High', st: 'In review', stTone: 'violet' as const, prTone: 'red' as const },
  { t: 'Configure department permissions', p: 'Platform rollout', who: 'Rahul Mehta', due: 'Mon, 10 Nov', pr: 'Medium', st: 'To do', stTone: 'neutral' as const, prTone: 'amber' as const },
  { t: 'Draft Q4 hiring brief', p: 'People Ops', who: 'Dev Patel', due: 'Wed, 12 Nov', pr: 'Medium', st: 'To do', stTone: 'neutral' as const, prTone: 'amber' as const },
  { t: 'Send November invoice batch', p: 'Finance', who: 'Aisha Khan', due: 'Done', pr: 'Low', st: 'Completed', stTone: 'green' as const, prTone: 'neutral' as const, done: true },
  { t: 'Update brand guidelines deck', p: 'Q4 brand refresh', who: 'Sam Lee', due: 'Thu, 13 Nov', pr: 'Low', st: 'In progress', stTone: 'blue' as const, prTone: 'neutral' as const },
];

export function TasksMockup() {
  const { interactive } = useShell();
  const [done, setDone] = useState<Set<string>>(() => new Set(TASK_ROWS.filter((r) => r.done).map((r) => r.t)));
  const toggle = (t: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  const open = TASK_ROWS.length - done.size;

  return (
    <AppShell
      active="tasks"
      compactNav
      title="Tasks"
      subtitle={`Team view · Customer Success · ${open} open`}
      actions={
        <>
          <span className="mbtn mbtn--ghost">
            <Filter /> Filters
          </span>
          <span className="mbtn mbtn--primary">
            <Plus /> Task
          </span>
        </>
      }
    >
      <div className="task-filters">
        <Pill tone="blue">Assigned to my team</Pill>
        <Pill>Due this week</Pill>
        <Pill>Priority: any</Pill>
      </div>
      <div className="mcard table">
        <div className="table__row table__row--head">
          <span>Task</span>
          <span>Assignee</span>
          <span>Due</span>
          <span>Priority</span>
          <span>Status</span>
        </div>
        {TASK_ROWS.map((r) => {
          const isDone = done.has(r.t);
          const icon = isDone ? <CheckCircle2 className="ok" /> : <Circle />;
          return (
          <div key={r.t} className={`table__row ${isDone ? 'is-done' : ''}`}>
            <span className="table__task">
              {interactive ? (
                <button
                  type="button"
                  className="task-check"
                  aria-pressed={isDone}
                  aria-label={`${isDone ? 'Reopen' : 'Complete'} ${r.t}`}
                  onClick={() => toggle(r.t)}
                >
                  {icon}
                </button>
              ) : (
                icon
              )}
              <span>
                <b>{r.t}</b>
                <small>{r.p}</small>
              </span>
            </span>
            <span className="table__who">
              <Avatar name={r.who} size="xs" />
              {r.who}
            </span>
            <span className={r.due === 'Today' ? 'is-today' : ''}>{r.due}</span>
            <span>
              <Pill tone={r.prTone}>{r.pr}</Pill>
            </span>
            <span>
              {isDone ? <Pill tone="green">Completed</Pill> : <Pill tone={r.stTone === 'green' ? 'blue' : r.stTone}>{r.st === 'Completed' ? 'To do' : r.st}</Pill>}
            </span>
          </div>
          );
        })}
      </div>
    </AppShell>
  );
}

/* ───────────────────────── Reports ───────────────────────── */

const REV = [42, 46, 44, 51, 55, 53, 60, 64, 61, 68, 72, 78];
const MONTHS = ['D', 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N'];

export function ReportsMockup() {
  const max = 90;
  const pts = REV.map((v, i) => `${(i / (REV.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ');
  return (
    <AppShell
      active="dashboard"
      compactNav
      title="Business performance"
      subtitle="Last 12 months · All departments"
      actions={
        <span className="mbtn mbtn--ghost">
          <CalendarDays /> Dec 2025 – Nov 2026 <ChevronDown />
        </span>
      }
    >
      <div className="reports">
        <div className="mcard reports__line">
          <div className="mcard__head">
            <span>Monthly revenue</span>
            <span className="kpi__delta is-up">+18.6% YoY</span>
          </div>
          <strong className="reports__big">₹6.74Cr</strong>
          <div className="line-chart">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#2450C8" stopOpacity=".18" />
                  <stop offset="1" stopColor="#2450C8" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[25, 50, 75].map((y) => (
                <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#EAECF0" strokeWidth=".4" vectorEffect="non-scaling-stroke" />
              ))}
              <polygon points={`0,100 ${pts} 100,100`} fill="url(#revFill)" />
              <polyline points={pts} fill="none" stroke="#2450C8" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
            <div className="line-chart__x">
              {MONTHS.map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mcard reports__funnel">
          <div className="mcard__head">
            <span>Lead conversion</span>
          </div>
          {[
            { l: 'Leads', v: 3420, w: 100 },
            { l: 'Qualified', v: 1286, w: 72 },
            { l: 'Proposal', v: 412, w: 48 },
            { l: 'Won', v: 168, w: 28 },
          ].map((f) => (
            <div key={f.l} className="funnel__row">
              <span>{f.l}</span>
              <span className="funnel__bar">
                <i style={{ width: `${f.w}%` }} />
              </span>
              <b>{f.v.toLocaleString('en-IN')}</b>
            </div>
          ))}
          <p className="reports__note">Lead → Won conversion: <b>4.9%</b></p>
        </div>

        <div className="mcard reports__dept">
          <div className="mcard__head">
            <span>Department delivery</span>
            <span className="legend">
              <i style={{ background: '#1C3FA3' }} /> On time
              <i style={{ background: '#8FB2F5' }} /> Late
            </span>
          </div>
          <div className="hbars">
            {[
              { d: 'Sales', a: 88, b: 12 },
              { d: 'Customer Success', a: 81, b: 19 },
              { d: 'Engineering', a: 74, b: 26 },
              { d: 'Operations', a: 69, b: 31 },
            ].map((r) => (
              <div key={r.d} className="hbars__row">
                <span>{r.d}</span>
                <span className="hbars__bar">
                  <i style={{ width: `${r.a}%`, background: '#1C3FA3' }} />
                  <i style={{ width: `${r.b}%`, background: '#8FB2F5' }} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="reports__stats">
          {[
            { l: 'Avg. deal cycle', v: '24 days' },
            { l: 'Tasks completed', v: '3,912' },
            { l: 'Meetings held', v: '486' },
          ].map((s) => (
            <div key={s.l} className="mcard stat">
              <small>{s.l}</small>
              <b>{s.v}</b>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

/* ───────────────────────── Owner overview ───────────────────────── */

export function OverviewMockup() {
  const depts = [
    { d: 'Sales', head: 'Lena Ortiz', people: 18, proj: 4, tasks: 92, health: 'Healthy', tone: 'green' as const },
    { d: 'Customer Success', head: 'Priya Sharma', people: 12, proj: 6, tasks: 84, health: 'Healthy', tone: 'green' as const },
    { d: 'Engineering', head: 'Rahul Mehta', people: 26, proj: 5, tasks: 78, health: 'Watch', tone: 'amber' as const },
    { d: 'Operations', head: 'Vikram Shah', people: 9, proj: 3, tasks: 71, health: 'Watch', tone: 'amber' as const },
    { d: 'Marketing', head: 'Aisha Khan', people: 7, proj: 2, tasks: 66, health: 'Needs attention', tone: 'red' as const },
  ];
  return (
    <AppShell active="dashboard" compactNav title="Company overview" subtitle="Owner view · 72 employees across 5 departments">
      <div className="overview__kpis">
        {[
          { l: 'Revenue (MTD)', v: '₹48.2L', d: '+12.4%' },
          { l: 'Active projects', v: '20', d: '3 at risk' },
          { l: 'On-time delivery', v: '81%', d: '+4 pts' },
          { l: 'Customers', v: '342', d: '+11 this month' },
        ].map((k) => (
          <div key={k.l} className="mcard stat">
            <small>{k.l}</small>
            <b>{k.v}</b>
            <span>{k.d}</span>
          </div>
        ))}
      </div>
      <div className="mcard table table--overview">
        <div className="table__row table__row--head">
          <span>Department</span>
          <span>Lead</span>
          <span>People</span>
          <span>Projects</span>
          <span>On-time tasks</span>
          <span>Health</span>
        </div>
        {depts.map((r) => (
          <div key={r.d} className="table__row">
            <b>{r.d}</b>
            <span className="table__who">
              <Avatar name={r.head} size="xs" />
              {r.head}
            </span>
            <span>{r.people}</span>
            <span>{r.proj}</span>
            <span className="table__meter">
              <span className="meter meter--thin">
                <i style={{ width: `${r.tasks}%` }} />
              </span>
              {r.tasks}%
            </span>
            <span>
              <Pill tone={r.tone}>{r.health}</Pill>
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

/* ───────────────────────── Meetings list + summary ───────────────────────── */

export function MeetingsListMockup() {
  const list = [
    { t: 'Acme Corp — renewal review', d: 'Today · 10:30', who: ['Ananya Rao', 'Vikram Shah', 'Priya Sharma', 'Lena Ortiz'], s: 'Summary ready', tone: 'green' as const, active: true },
    { t: 'Product squad weekly sync', d: 'Today · 13:00', who: ['Rahul Mehta', 'Priya Sharma', 'Sam Lee'], s: 'Scheduled', tone: 'blue' as const },
    { t: 'Q4 hiring plan', d: 'Today · 16:15', who: ['Ananya Rao', 'Dev Patel'], s: 'Scheduled', tone: 'blue' as const },
    { t: 'Brightline kick-off prep', d: 'Yesterday', who: ['Priya Sharma', 'Meera Iyer'], s: 'Summary ready', tone: 'green' as const },
  ];
  return (
    <AppShell
      active="meetings"
      compactNav
      title="Meetings"
      subtitle="3 today · 2 summaries ready for review"
      actions={
        <>
          <span className="mbtn mbtn--ghost">
            <CalendarDays /> Schedule
          </span>
          <span className="mbtn mbtn--accent">
            <Plus /> Instant meeting
          </span>
        </>
      }
    >
      <div className="mlist">
        <div className="mcard mlist__list">
          {list.map((m) => (
            <div key={m.t} className={`mlist__item ${m.active ? 'is-active' : ''}`}>
              <div>
                <b>{m.t}</b>
                <small>{m.d}</small>
              </div>
              <span className="stack">
                {m.who.map((w, i) => (
                  <Avatar key={w} name={w} size="xs" i={i + m.t.length} />
                ))}
              </span>
              <Pill tone={m.tone}>{m.s}</Pill>
            </div>
          ))}
        </div>
        <div className="mcard mlist__detail">
          <div className="mcard__head">
            <span>Summary · Acme Corp renewal review</span>
            <small>43 min · Recorded with consent</small>
          </div>
          <div className="mlist__section">
            <small>Key points</small>
            <ul>
              <li>Acme wants to expand from 120 to 180 seats.</li>
              <li>Preference for a 24-month term with quarterly reviews.</li>
              <li>Onboarding for the new team starts after signature.</li>
            </ul>
          </div>
          <div className="mlist__section">
            <small>Decisions</small>
            <ul>
              <li>Proceed with renewal on expanded seat count.</li>
            </ul>
          </div>
          <div className="mlist__section">
            <small>Proposed tasks</small>
            {[
              { t: 'Send revised proposal to Acme', who: 'Vikram Shah', d: 'Thu' },
              { t: 'Plan onboarding for new Acme team', who: 'Priya Sharma', d: 'After signature' },
            ].map((a) => (
              <div key={a.t} className="mlist__task">
                <Circle />
                <span>{a.t}</span>
                <Avatar name={a.who} size="xs" />
                <em>{a.d}</em>
              </div>
            ))}
            <div className="mlist__approve">
              <span className="mbtn mbtn--ghost mbtn--xs">Edit</span>
              <span className="mbtn mbtn--primary mbtn--xs">Approve tasks</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ───────────────────────── Finance: pending approvals ───────────────────────── */

export function FinanceMockup() {
  const rows = [
    { who: 'Priya Sharma', what: 'Client travel — Brightline kick-off', cat: 'Travel', amt: '₹8,400', when: 'Today' },
    { who: 'Dev Patel', what: 'Recruitment event booth', cat: 'Events', amt: '₹22,000', when: 'Yesterday' },
    { who: 'Sam Lee', what: 'Design software licence', cat: 'Software', amt: '₹6,750', when: '3 Nov' },
    { who: 'Meera Iyer', what: 'Team lunch — sprint review', cat: 'Meals', amt: '₹3,200', when: '2 Nov' },
  ];
  return (
    <AppShell
      active="finance"
      compactNav
      title="Pending approvals"
      subtitle="Finance · 4 reimbursement requests awaiting review"
      actions={
        <span className="mbtn mbtn--ghost">
          <Filter /> All categories <ChevronDown />
        </span>
      }
    >
      <div className="overview__kpis">
        {[
          { l: 'Invoiced (MTD)', v: '₹52.6L', d: '18 invoices' },
          { l: 'Costs (MTD)', v: '₹21.3L', d: 'Across 6 departments' },
          { l: 'Profit (MTD)', v: '₹31.3L', d: '59.5% margin' },
          { l: 'Pending reimbursements', v: '₹40,350', d: '4 requests' },
        ].map((k) => (
          <div key={k.l} className="mcard stat">
            <small>{k.l}</small>
            <b>{k.v}</b>
            <span className="stat__muted">{k.d}</span>
          </div>
        ))}
      </div>
      <div className="mcard table table--finance">
        <div className="table__row table__row--head">
          <span>Request</span>
          <span>Employee</span>
          <span>Category</span>
          <span>Amount</span>
          <span>Submitted</span>
          <span>Action</span>
        </div>
        {rows.map((r) => (
          <div key={r.what} className="table__row">
            <b>{r.what}</b>
            <span className="table__who">
              <Avatar name={r.who} size="xs" />
              {r.who}
            </span>
            <span>
              <Pill>{r.cat}</Pill>
            </span>
            <b>{r.amt}</b>
            <span>{r.when}</span>
            <span className="table__actions">
              <span className="mbtn mbtn--ghost mbtn--xs">Reject</span>
              <span className="mbtn mbtn--primary mbtn--xs">Approve</span>
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

/* ───────────────────────── HR & attendance ───────────────────────── */

export function HrMockup() {
  const team = [
    { n: 'Ananya Rao', d: 'Leadership', r: 'Owner', s: 'Present', t: 'green' as const },
    { n: 'Lena Ortiz', d: 'Sales', r: 'Account Executive', s: 'Present', t: 'green' as const },
    { n: 'Priya Sharma', d: 'Customer Success', r: 'CS Lead', s: 'Present', t: 'green' as const },
    { n: 'Rahul Mehta', d: 'Engineering', r: 'Engineering Manager', s: 'Present', t: 'green' as const },
    { n: 'Meera Iyer', d: 'Engineering', r: 'Developer', s: 'Not marked', t: 'neutral' as const },
    { n: 'Dev Patel', d: 'People Ops', r: 'HR Manager', s: 'Absent', t: 'red' as const },
  ];
  return (
    <AppShell
      active="hr"
      compactNav
      title="HR & attendance"
      subtitle="Wednesday, 5 November · 72 team members"
      actions={
        <span className="mbtn mbtn--ghost">
          <Users /> All departments <ChevronDown />
        </span>
      }
    >
      <div className="overview__kpis">
        {[
          { l: 'Present today', v: '64', d: '89% of team' },
          { l: 'Not marked yet', v: '5', d: 'As of 11:00' },
          { l: 'Absent', v: '3', d: 'Across 2 departments' },
          { l: 'Departments', v: '6', d: '72 team members' },
        ].map((k) => (
          <div key={k.l} className="mcard stat">
            <small>{k.l}</small>
            <b>{k.v}</b>
            <span className="stat__muted">{k.d}</span>
          </div>
        ))}
      </div>
      <div className="mcard table table--hr">
        <div className="table__row table__row--head">
          <span>Team member</span>
          <span>Department</span>
          <span>Role</span>
          <span>Today</span>
        </div>
        {team.map((p) => (
          <div key={p.n} className="table__row">
            <span className="table__who">
              <Avatar name={p.n} size="xs" />
              <b>{p.n}</b>
            </span>
            <span>{p.d}</span>
            <span>{p.r}</span>
            <span>
              <Pill tone={p.t}>{p.s}</Pill>
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
