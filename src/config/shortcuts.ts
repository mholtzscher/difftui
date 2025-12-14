import type { HelpItem } from "../components/HelpBar";
import type { View } from "../types";

const hints: Record<View, HelpItem[]> = {
	input: [
		{ key: "Tab", description: "switch panel" },
		{ key: "d", description: "view diff" },
		{ key: "c", description: "clear panel" },
		{ key: "p", description: "paste" },
		{ key: "q", description: "quit" },
	],
	diff: [
		{ key: "Esc", description: "back" },
		{ key: "Tab", description: "toggle view" },
		{ key: "j/k", description: "scroll" },
		{ key: "g/G", description: "top/bottom" },
		{ key: "q", description: "quit" },
	],
};

export function getHints(view: View): HelpItem[] {
	return hints[view];
}
