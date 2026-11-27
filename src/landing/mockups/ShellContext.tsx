import { createContext, useContext, type ReactNode } from 'react';
import type { NavKey } from './AppShell';

/**
 * Lets a host (the hero) turn the static product previews into an interactive demo:
 * full sidebar, clickable navigation, a working "Assign by voice" button and an overlay slot.
 */
export type ShellOverrides = {
  interactive?: boolean;
  compact?: boolean;
  onNavigate?: (key: NavKey) => void;
  onVoice?: () => void;
  overlay?: ReactNode;
};

export const ShellContext = createContext<ShellOverrides>({});
export const useShell = () => useContext(ShellContext);
