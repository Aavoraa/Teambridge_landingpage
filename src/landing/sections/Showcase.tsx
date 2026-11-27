import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { ScaledFrame } from '../components/ScaledFrame';
import { SectionHead } from '../components/SectionHead';
import {
  FinanceMockup,
  HrMockup,
  MeetingsListMockup,
  OverviewMockup,
  PipelineMockup,
  ProjectsMockup,
  ReportsMockup,
  TasksMockup,
} from '../mockups/ProductMockups';

type Block = {
  key: string;
  label: string;
  title: string;
  text: string;
  points: string[];
  mock: ReactNode;
  alt: string;
};

const BLOCKS: Block[] = [
  {
    key: 'dashboard',
    label: 'Main dashboard',
    title: 'The state of your business, the moment you sign in.',
    text: 'Revenue, delivery and department health in one view — so leaders spend time on decisions, not on assembling status updates.',
    points: ['Company and department KPIs', 'Department health at a glance', 'Performance by department'],
    mock: <OverviewMockup />,
    alt: 'Company overview showing revenue, active projects, on-time delivery and a department performance table',
  },
  {
    key: 'pipeline',
    label: 'CRM pipeline',
    title: 'A pipeline your whole team can read.',
    text: 'Track every deal by stage, owner and value. Move deals between stages and see exactly where revenue is coming from.',
    points: ['Visual stage-by-stage board', 'Deal owners and values', 'Filter by owner, source or stage'],
    mock: <PipelineMockup />,
    alt: 'CRM pipeline board with deals arranged across New, Qualified, Proposal, Negotiation and Won stages',
  },
  {
    key: 'projects',
    label: 'Project management',
    title: 'Plan delivery and see risk early.',
    text: 'Timelines, milestones and progress for every project, with owners and status that update as tasks are completed.',
    points: ['Timeline view with milestones', 'Progress driven by real tasks', 'Status flags for at-risk work'],
    mock: <ProjectsMockup />,
    alt: 'Project timeline with five projects, progress bars, status labels and upcoming milestones',
  },
  {
    key: 'tasks',
    label: 'Task management',
    title: 'Clear ownership for every piece of work.',
    text: 'Assign tasks with priorities and deadlines, then track progress across your team and your own work.',
    points: ['Assignees, priorities and due dates', 'Progress tracking for every task', 'Team and personal filters'],
    mock: <TasksMockup />,
    alt: 'Task list with assignees, due dates, priorities and statuses',
  },
  {
    key: 'meetings',
    label: 'Meetings',
    title: 'Every meeting ends with a clear next step.',
    text: 'Schedule or start meetings, then review the summary, decisions and proposed tasks before approving them into your workspace.',
    points: ['Instant and scheduled meetings', 'Summaries and decisions', 'Approve proposed tasks in one click'],
    mock: <MeetingsListMockup />,
    alt: 'Meetings list alongside an AI summary with key points, decisions and proposed tasks awaiting approval',
  },
  {
    key: 'finance',
    label: 'Finance',
    title: 'Money in, money out — under control.',
    text: 'Raise invoices, track cost and profit, and handle expense reports. Employees submit reimbursements; finance reviews and approves them in one place.',
    points: ['Invoices and cost & profit', 'Reimbursement requests and history', 'Pending approvals and finance review'],
    mock: <FinanceMockup />,
    alt: 'Finance pending approvals screen with invoiced, cost, profit and reimbursement totals, and reimbursement requests to approve or reject',
  },
  {
    key: 'hr',
    label: 'HR & attendance',
    title: 'Know who’s in, and how your team is organised.',
    text: 'See daily attendance across departments and keep every team member’s department and role up to date.',
    points: ['Daily attendance at a glance', 'Team directory by department and role', 'Same workspace as your CRM and projects'],
    mock: <HrMockup />,
    alt: 'HR and attendance screen showing present, not marked and absent counts and a team list with today’s attendance',
  },
  {
    key: 'reports',
    label: 'Reports & analytics',
    title: 'Reports that build themselves.',
    text: 'Because every module shares the same data, revenue, conversion and delivery reports stay current without manual exports.',
    points: ['Revenue and conversion trends', 'Department delivery metrics', 'Always-current data'],
    mock: <ReportsMockup />,
    alt: 'Reports dashboard with monthly revenue chart, lead conversion funnel and department delivery bars',
  },
];

export function Showcase() {
  return (
    <section className="section section--alt showcase" id="product" aria-labelledby="showcase-title">
      <div className="container">
        <SectionHead
          center
          id="showcase-title"
          eyebrow="Product"
          title="Powerful capabilities."
          accent="One intuitive interface."
          lead="One consistent design language across every module — so learning one part of TeamBridge means you already know the rest."
        />

        <div className="showcase__list">
          {BLOCKS.map((b, i) => (
            <article key={b.key} className={`showcase__block ${i % 2 ? 'is-flipped' : ''}`} aria-labelledby={`sc-${b.key}`}>
              <Reveal className="showcase__copy">
                <span className="showcase__label">{b.label}</span>
                <h3 id={`sc-${b.key}`}>{b.title}</h3>
                <p>{b.text}</p>
                <ul className="check-list">
                  {b.points.map((p) => (
                    <li key={p}>
                      <Check aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="showcase__media" delay={100}>
                <div className="product-frame">
                  <ScaledFrame width={980} label={b.alt}>
                    {b.mock}
                  </ScaledFrame>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
        <p className="showcase__footnote">Product previews use illustrative sample data.</p>
      </div>
    </section>
  );
}
