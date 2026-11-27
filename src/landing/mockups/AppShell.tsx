import type { ReactNode } from 'react';
import {
  Bell,
  CheckSquare,
  ChevronDown,
  FolderKanban,
  Home,
  MessageSquare,
  Presentation,
  Search,
  Sparkles,
  SquareUser,
  Sun,
  Users,
  Wallet,
} from 'lucide-react';
import { LogoMark } from '../components/Logo';
import { useShell } from './ShellContext';

export type NavKey = 'dashboard' | 'projects' | 'tasks' | 'crm' | 'finance' | 'hr' | 'meetings' | 'chat';

/** Mirrors the sidebar of the TeamBridge app. */
export const NAV: { key: NavKey; label: string; icon: typeof Users; group?: boolean }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'tasks', label: 'Tasks', icon: CheckSquare, group: true },
  { key: 'crm', label: 'CRM', icon: SquareUser, group: true },
  { key: 'finance', label: 'Finance', icon: Wallet, group: true },
  { key: 'hr', label: 'HR', icon: Users, group: true },
  { key: 'meetings', label: 'Meetings', icon: Presentation, group: true },
  { key: 'chat', label: 'Chat', icon: MessageSquare },
];

type AppShellProps = {
  active: NavKey;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  compactNav?: boolean;
};

/** Replica of the TeamBridge application chrome used inside product previews. */
export function AppShell({ active, title, subtitle, actions, children, compactNav }: AppShellProps) {
  const shell = useShell();
  const compact = shell.compact ?? compactNav;
  const { onNavigate, onVoice } = shell;

  return (
    <div className={`app ${compact ? 'app--compact' : ''} ${shell.interactive ? 'app--interactive' : ''}`}>
      <aside className="app__side">
        <div className="app__brand">
          <LogoMark size={compact ? 26 : 30} />
          {!compact && <span>TeamBridge</span>}
        </div>
        <nav className="app__nav" aria-label="Preview navigation">
          {NAV.map(({ key, label, icon: Icon, group }) => {
            const content = (
              <>
                <Icon aria-hidden="true" />
                {!compact && <span>{label}</span>}
                {!compact && group && <ChevronDown className="app__nav-chev" aria-hidden="true" />}
              </>
            );
            const cls = `app__nav-item ${key === active ? 'is-active' : ''}`;
            return onNavigate ? (
              <button
                key={key}
                type="button"
                className={cls}
                aria-current={key === active ? 'page' : undefined}
                aria-label={compact ? label : undefined}
                title={compact ? label : undefined}
                onClick={() => onNavigate(key)}
              >
                {content}
              </button>
            ) : (
              <span key={key} className={cls}>
                {content}
              </span>
            );
          })}
        </nav>
        <div className="app__user">
          <span className="app__user-avatar">A</span>
          {!compact && (
            <>
              <span className="app__user-name">
                <b>Ananya Rao</b>
                <small>Owner</small>
              </span>
              <ChevronDown className="app__nav-chev" />
            </>
          )}
        </div>
      </aside>

      <div className="app__main">
        <header className="app__top">
          <div className="app__search">
            <Search aria-hidden="true" />
            <span>Search anything... (⌘ + K)</span>
          </div>
          <div className="app__top-right">
            {onVoice ? (
              <button type="button" className="app__voice app__voice--live" onClick={onVoice}>
                <Sparkles aria-hidden="true" /> Assign by voice
              </button>
            ) : (
              <span className="app__voice">
                <Sparkles /> Assign by voice
              </span>
            )}
            <span className="app__icon-btn app__bell">
              <Bell />
              <i />
            </span>
            <span className="app__icon-btn">
              <Sun />
            </span>
            <span className="app__user-avatar app__user-avatar--top">A</span>
            <ChevronDown className="app__nav-chev" />
          </div>
        </header>
        <div className="app__body">
          <div className="app__head">
            <div>
              <h4>{title}</h4>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {actions && <div className="app__head-actions">{actions}</div>}
          </div>
          {children}
        </div>
      </div>
      {shell.overlay}
    </div>
  );
}

const AVATAR_COLORS = ['#2563EB', '#3478F6', '#E9A23B', '#7A5AF8', '#D9493E', '#0E9384', '#344054', '#DD2590'];

export function Avatar({ name, size = 'md', i }: { name: string; size?: 'xs' | 'sm' | 'md' | 'lg'; i?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
  const idx = i ?? name.charCodeAt(0) + name.length;
  return (
    <span className={`avatar avatar--${size}`} style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
      {initials}
    </span>
  );
}

export function Pill({ tone = 'neutral', children }: { tone?: 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'violet'; children: ReactNode }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}
