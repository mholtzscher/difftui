// Theme abstraction for simple-diff
// Currently using Catppuccin Mocha palette
// Replace this file to change the color scheme

export interface Theme {
	// Base colors
	base: string;
	mantle: string;
	crust: string;
	surface0: string;
	surface1: string;
	surface2: string;

	// Text colors
	text: string;
	subtext0: string;
	subtext1: string;
	overlay0: string;
	overlay1: string;
	overlay2: string;

	// Accent colors
	blue: string;
	lavender: string;
	sapphire: string;
	sky: string;
	teal: string;
	green: string;
	yellow: string;
	peach: string;
	maroon: string;
	red: string;
	mauve: string;
	pink: string;
	flamingo: string;
	rosewater: string;

	// Semantic colors (derived from accent colors)
	primary: string;
	secondary: string;
	success: string;
	warning: string;
	error: string;

	// Diff-specific colors
	diffAdded: string;
	diffAddedBg: string;
	diffRemoved: string;
	diffRemovedBg: string;
	diffContext: string;
	diffContextBg: string;

	// UI element colors
	border: string;
	borderFocused: string;
	inputBg: string;
	inputFocusedBg: string;
	headerBg: string;
	footerBg: string;
}

// Catppuccin Mocha palette
export const catppuccinMocha: Theme = {
	// Base colors
	base: "#1e1e2e",
	mantle: "#181825",
	crust: "#11111b",
	surface0: "#313244",
	surface1: "#45475a",
	surface2: "#585b70",

	// Text colors
	text: "#cdd6f4",
	subtext0: "#a6adc8",
	subtext1: "#bac2de",
	overlay0: "#6c7086",
	overlay1: "#7f849c",
	overlay2: "#9399b2",

	// Accent colors
	blue: "#89b4fa",
	lavender: "#b4befe",
	sapphire: "#74c7ec",
	sky: "#89dceb",
	teal: "#94e2d5",
	green: "#a6e3a1",
	yellow: "#f9e2af",
	peach: "#fab387",
	maroon: "#eba0ac",
	red: "#f38ba8",
	mauve: "#cba6f7",
	pink: "#f5c2e7",
	flamingo: "#f2cdcd",
	rosewater: "#f5e0dc",

	// Semantic colors
	primary: "#89b4fa",
	secondary: "#cba6f7",
	success: "#a6e3a1",
	warning: "#f9e2af",
	error: "#f38ba8",

	// Diff-specific colors
	diffAdded: "#a6e3a1",
	diffAddedBg: "#1e3a2f",
	diffRemoved: "#f38ba8",
	diffRemovedBg: "#3e2a35",
	diffContext: "#cdd6f4",
	diffContextBg: "#1e1e2e",

	// UI element colors
	border: "#45475a",
	borderFocused: "#89b4fa",
	inputBg: "#313244",
	inputFocusedBg: "#45475a",
	headerBg: "#181825",
	footerBg: "#181825",
};

// Export the active theme
export const theme: Theme = catppuccinMocha;
