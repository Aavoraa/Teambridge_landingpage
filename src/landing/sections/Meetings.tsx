import {
  ArrowRight,
  CalendarPlus,
  CircleDot,
  FileText,
  ListChecks,
  MessageSquare,
  MonitorUp,
  ScrollText,
  UserPlus,
  Video,
  Zap,
} from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { ScaledFrame } from '../components/ScaledFrame';
import { SectionHead } from '../components/SectionHead';
import { MeetingMockup } from '../mockups/MeetingMockup';

const FEATURES = [
  { icon: Zap, label: 'Instant meetings' },
  { icon: CalendarPlus, label: 'Scheduled meetings' },
  { icon: UserPlus, label: 'Employee invitations' },
  { icon: Video, label: 'Video & audio conferencing' },
  { icon: MonitorUp, label: 'Screen sharing' },
  { icon: MessageSquare, label: 'Meeting chat' },
  { icon: CircleDot, label: 'Recording with consent' },
  { icon: ScrollText, label: 'AI-generated transcripts' },
  { icon: FileText, label: 'Meeting summaries' },
  { icon: ListChecks, label: 'Action item extraction' },
];

export function Meetings() {
  return (
    <section className="section meetings" aria-labelledby="meetings-title">
      <div className="container">
        <SectionHead
          id="meetings-title"
          eyebrow="Meetings"
          center
          title="Meet, collaborate and turn conversations"
          accent="into action."
          lead="A meeting space built into your workspace — so every call knows who’s in it, what it’s about and where the follow-up work should go."
        />

        <Reveal className="meetings__frame">
          <div className="product-frame product-frame--dark">
            <ScaledFrame
              width={1180}
              height={640}
              label="TeamBridge meeting room with four participants, a shared screen, recording indicator and an AI meeting intelligence panel showing transcript and proposed action items"
            >
              <MeetingMockup />
            </ScaledFrame>
          </div>
        </Reveal>

        <div className="meetings__bottom">
          <ul className="meetings__features">
            {FEATURES.map((f, i) => (
              <Reveal as="li" key={f.label} delay={(i % 5) * 40}>
                <f.icon aria-hidden="true" />
                {f.label}
              </Reveal>
            ))}
          </ul>

          <Reveal className="meetings__link" delay={120}>
            <h3>Meetings that update your CRM.</h3>
            <p>
              Action items from a meeting become tasks linked to the customer, project and conversation they came from —
              so context never gets lost between the call and the work.
            </p>
            <div className="meetings__chain" aria-label="Meeting to task flow">
              <span>Meeting</span>
              <ArrowRight aria-hidden="true" />
              <span>Action item</span>
              <ArrowRight aria-hidden="true" />
              <span>Approved task</span>
              <ArrowRight aria-hidden="true" />
              <span>Customer record</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
