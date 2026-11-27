import { Check } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';

const ROLES = [
  {
    name: 'Owner',
    summary: 'See the whole business and control how it runs.',
    items: ['Business overview', 'Company-wide performance', 'Employee and department visibility', 'Finance and cost visibility', 'System administration', 'Business analytics'],
  },
  {
    name: 'Manager',
    summary: 'Run your department and keep projects on track.',
    items: ['Department performance', 'Project oversight', 'Task assignment', 'Team productivity', 'Meeting management', 'Approvals'],
  },
  {
    name: 'Employee',
    summary: 'Know what to work on and stay in the loop.',
    items: ['Assigned tasks', 'Personal projects', 'Upcoming meetings', 'Attendance and reimbursements', 'Team chat', 'Notifications'],
  },
];

export function Roles() {
  return (
    <section className="section roles" id="solutions" aria-labelledby="roles-title">
      <div className="container">
        <SectionHead
          center
          id="roles-title"
          eyebrow="Built for every role"
          title="Everyone gets"
          accent="the visibility they need."
          lead="Access and permissions depend on the roles your organisation configures."
        />
        <div className="roles__grid">
          {ROLES.map((r, i) => (
            <Reveal as="article" key={r.name} delay={i * 60} className="role">
              <h3>{r.name}</h3>
              <p>{r.summary}</p>
              <ul className="check-list">
                {r.items.map((it) => (
                  <li key={it}>
                    <Check aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
