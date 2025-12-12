import type { View } from "../types";

// Shortcut definition with action name and description for help text
export interface ShortcutDef {
  action: string;
  description: string;
  shift?: boolean; // Requires shift modifier
}

// Shortcuts organized by view
export interface ShortcutConfig {
  input: Record<string, ShortcutDef>;
  diff: Record<string, ShortcutDef>;
}

export const shortcuts: ShortcutConfig = {
  input: {
    tab: { action: "togglePanel", description: "Switch panel" },
    d: { action: "viewDiff", description: "View diff" },
    r: { action: "clear", description: "Clear" },
    p: { action: "paste", description: "Paste" },
    q: { action: "quit", description: "Quit" },
  },
  diff: {
    escape: { action: "back", description: "Back to input" },
    tab: { action: "toggleDiffMode", description: "Toggle unified/split" },
    j: { action: "scrollDown", description: "Scroll down" },
    down: { action: "scrollDown", description: "Scroll down" },
    k: { action: "scrollUp", description: "Scroll up" },
    up: { action: "scrollUp", description: "Scroll up" },
    g: { action: "scrollToTop", description: "Scroll to top" },
    G: { action: "scrollToBottom", description: "Scroll to bottom", shift: true },
    q: { action: "quit", description: "Quit" },
  },
} as const;

// Generate footer hints from shortcuts config
export function generateHints(view: View): string {
  const viewShortcuts = shortcuts[view];
  const hints: string[] = [];

  // Track actions we've already added to avoid duplicates (j/down both scroll)
  const addedActions = new Set<string>();

  for (const [key, def] of Object.entries(viewShortcuts)) {
    if (addedActions.has(def.action)) continue;
    addedActions.add(def.action);

    // Format key display
    let keyDisplay = key;
    if (def.shift) {
      keyDisplay = `Shift+${key.toLowerCase()}`;
    }
    // Handle special keys
    if (key === "escape") keyDisplay = "Esc";
    if (key === "tab") keyDisplay = "Tab";
    if (key === "down" || key === "up") continue; // Skip arrow key duplicates

    hints.push(`[${keyDisplay}] ${def.description}`);
  }

  return hints.join("  ");
}

// Get shortcut action for a given key and view
export function getShortcutAction(
  view: View,
  keyName: string,
  hasShift: boolean,
): string | null {
  const viewShortcuts = shortcuts[view];
  const shortcut = viewShortcuts[keyName];

  if (!shortcut) return null;

  // Check if shift requirement matches
  if (shortcut.shift && !hasShift) return null;
  if (!shortcut.shift && hasShift && keyName !== "G") return null;

  return shortcut.action;
}
