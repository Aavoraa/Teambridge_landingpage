import { BarChart3, Building2, CheckSquare, FolderKanban, MessageSquare, UserCheck, Users, Video, Wallet, Workflow } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';

const MODULES = [
  { icon: Building2, title: 'CRM', text: 'Leads, contacts, companies and deals.' },
  { icon: Users, title: 'Employees', text: 'Departments, roles and permissions.' },
  { icon: FolderKanban, title: 'Projects', text: 'Milestones, owners and delivery.' },
  { icon: CheckSquare, title: 'Tasks', text: 'Assignments, deadlines and progress.' },
  { icon: Video, title: 'AI Meetings', text: 'Calls, summaries and action items.' },
  { icon: MessageSquare, title: 'Chat', text: 'Team messages and notifications.' },
  { icon: Wallet, title: 'Finance', text: 'Invoices, costs and reimbursements.' },
  { icon: UserCheck, title: 'HR & Attendance', text: 'Daily attendance and team directory.' },
  { icon: BarChart3, title: 'Reports', text: 'Dashboards on business performance.' },
  { icon: Workflow, title: 'Automation', text: 'Repeat processes and approvals.' },
];

export function Platform() {
  return (
    <section className="section section--alt" id="platform" aria-labelledby="platform-title">
      <div className="container">
        <SectionHead
          center
          id="platform-title"
          eyebrow="Platform"
          title="Everything your business needs"
          accent="to operate."
          lead="Ten modules on one shared data model, so customers, projects and people stay connected."
        />
        <div className="modules">
          {MODULES.map((m, i) => (
            <Reveal as="article" key={m.title} delay={(i % 5) * 40} className="module">
              <m.icon aria-hidden="true" />
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
