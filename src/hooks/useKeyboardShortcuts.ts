import { useKeyboard } from "@opentui/solid";
import type { View, KeyInfo, ActionHandlers } from "../types";
import { getShortcutAction } from "../config/shortcuts";

interface UseKeyboardShortcutsOptions {
  getView: () => View;
  actions: ActionHandlers;
}

/**
 * Hook to handle keyboard shortcuts based on current view
 * Uses declarative shortcuts config for cleaner, more maintainable code
 */
export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions): void {
  const { getView, actions } = options;

  useKeyboard((key: KeyInfo) => {
    // Skip if ctrl or meta is pressed (let system handle those)
    if (key.ctrl || key.meta) return;

    const view = getView();
    const hasShift = Boolean(key.shift);

    // Get the action for this key combination
    const action = getShortcutAction(view, key.name, hasShift);

    if (action && actions[action]) {
      const handler = actions[action];
      if (handler) {
        void handler();
      }
    }
  });
}
