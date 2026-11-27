import { useState, type FormEvent } from 'react';
import { Hash, Paperclip, SendHorizontal } from 'lucide-react';
import { AppShell, Avatar } from './AppShell';
import { useShell } from './ShellContext';

type ChatMsg = { who: string; me?: boolean; text: string; t: string };

const CHANNELS = ['general', 'sales', 'customer-success', 'engineering', 'finance'];
const DIRECT = ['Priya Sharma', 'Vikram Shah', 'Rahul Mehta'];
const SEED: ChatMsg[] = [
  { who: 'Vikram Shah', text: 'Revised Acme proposal is out — 180 seats, 24-month term.', t: '10:58' },
  { who: 'Priya Sharma', text: 'Great! I’ll prepare onboarding for their new team once it’s signed.', t: '11:02' },
  { who: 'Ananya Rao', me: true, text: 'Nice work both. Priya, can you share the onboarding plan by Friday?', t: '11:04' },
  { who: 'Priya Sharma', text: 'On it — it’s already a task on my list ✅', t: '11:05' },
];
const REPLIES = ['Sounds good 👍', 'Noted — I’ll update the task.', 'Thanks, will do!', 'Let’s cover it in tomorrow’s sync.'];

export function ChatMockup() {
  const { interactive } = useShell();
  const [msgs, setMsgs] = useState<ChatMsg[]>(SEED);
  const [draft, setDraft] = useState('');

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMsgs((m) => [...m, { who: 'Ananya Rao', me: true, text, t: 'now' }]);
    setDraft('');
    window.setTimeout(() => {
      setMsgs((m) => [...m.slice(-6), { who: 'Priya Sharma', text: REPLIES[m.length % REPLIES.length], t: 'now' }]);
    }, 1100);
  };

  return (
    <AppShell active="chat" compactNav title="Chat" subtitle="Team conversations, in the same place as the work">
      <div className="chat">
        <aside className="mcard chat__list">
          <small>Channels</small>
          {CHANNELS.map((c) => (
            <span key={c} className={`chat__chan ${c === 'customer-success' ? 'is-active' : ''}`}>
              <Hash /> {c}
              {c === 'sales' && <em>3</em>}
            </span>
          ))}
          <small>Direct messages</small>
          {DIRECT.map((d, i) => (
            <span key={d} className="chat__chan">
              <Avatar name={d} size="xs" i={i + 3} /> {d}
              <i className="chat__online" />
            </span>
          ))}
        </aside>
        <section className="mcard chat__thread">
          <header className="chat__head">
            <b>
              <Hash /> customer-success
            </b>
            <span className="stack">
              {['Priya Sharma', 'Vikram Shah', 'Ananya Rao', 'Meera Iyer'].map((n, i) => (
                <Avatar key={n} name={n} size="xs" i={i + 4} />
              ))}
            </span>
          </header>
          <div className="chat__msgs" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={`${i}-${m.text}`} className={`chat__msg ${m.me ? 'is-me' : ''}`}>
                {!m.me && <Avatar name={m.who} size="sm" i={m.who.length} />}
                <div>
                  <span className="chat__meta">
                    <b>{m.me ? 'You' : m.who}</b> {m.t}
                  </span>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form className="chat__composer" onSubmit={send}>
            <Paperclip />
            {interactive ? (
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Message #customer-success — try typing here"
                aria-label="Message"
              />
            ) : (
              <span>Message #customer-success</span>
            )}
            <button type="submit" className="mbtn mbtn--primary" disabled={!interactive} aria-label="Send">
              <SendHorizontal />
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
