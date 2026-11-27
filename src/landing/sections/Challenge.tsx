import { ArrowDown, Clock3, EyeOff, Layers, MessagesSquare, Shuffle } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const PROBLEMS = [
  {
    icon: Layers,
    title: 'Customer information is scattered',
    text: 'Contacts in one tool, deals in a spreadsheet, conversations in someone’s inbox.',
  },
  {
    icon: Shuffle,
    title: 'Tasks get lost between departments',
    text: 'Handoffs happen in chat threads — and nobody owns what happens next.',
  },
  {
    icon: MessagesSquare,
    title: 'Meetings end without outcomes',
    text: 'Decisions are made, then forgotten before anyone turns them into work.',
  },
  {
    icon: EyeOff,
    title: 'Managers lack real-time visibility',
    text: 'Status is assembled by hand, so problems surface after they become expensive.',
  },
  {
    icon: Clock3,
    title: 'Repetitive work eats the week',
    text: 'Updating records, chasing approvals and copying data between systems.',
  },
];

export function Challenge() {
  return (
    <section className="section challenge" aria-labelledby="challenge-title">
      <div className="container">
        <div className="challenge__layout">
          <Reveal className="challenge__intro">
            <span className="eyebrow">The problem</span>
            <h2 id="challenge-title">
              Your business shouldn’t operate across <span className="grad">disconnected tools.</span>
            </h2>
            <p>
              Most teams run on a patchwork of apps that were never designed to work together. The cost is not the
              subscriptions — it’s the context lost every time work moves between them.
            </p>
          </Reveal>

          <ol className="challenge__grid">
            {PROBLEMS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 60} className="challenge__item">
                <span className="challenge__num">0{i + 1}</span>
                <p.icon className="challenge__icon" aria-hidden="true" />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
            <Reveal as="li" delay={300} className="challenge__item challenge__item--resolve">
              <ArrowDown aria-hidden="true" />
              <p>There’s a better way to run a business.</p>
            </Reveal>
          </ol>
        </div>

        <Reveal className="challenge__bridge">
          <span className="challenge__line" aria-hidden="true" />
          <p>
            Bring your entire business together in <strong>one connected workspace.</strong>
          </p>
          <span className="challenge__line" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}
