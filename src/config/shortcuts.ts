import type { View } from "../types";

interface ShortcutHint {
	key: string;
	description: string;
}

const hints: Record<View, ShortcutHint[]> = {
	input: [
		{ key: "Tab", description: "Switch panel" },
		{ key: "d", description: "View diff" },
		{ key: "r", description: "Clear" },
		{ key: "p", description: "Paste" },
		{ key: "q", description: "Quit" },
	],
	diff: [
		{ key: "Esc", description: "Back to input" },
		{ key: "Tab", description: "Toggle unified/split" },
		{ key: "j/k", description: "Scroll" },
		{ key: "g", description: "Top" },
		{ key: "G", description: "Bottom" },
		{ key: "q", description: "Quit" },
	],
};

export function generateHints(view: View): string {
	return hints[view].map((h) => `[${h.key}] ${h.description}`).join("  ");
}
