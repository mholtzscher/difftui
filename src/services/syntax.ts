import {
	type StyleDefinition,
	type SyntaxStyle,
	type TreeSitterClient,
	RGBA,
	getTreeSitterClient,
} from "@opentui/core";
import { SyntaxStyle as SyntaxStyleClass } from "@opentui/core";
import { theme } from "../theme";

/**
 * Convert a hex color string to RGBA
 */
function hex(color: string): RGBA {
	return RGBA.fromHex(color);
}

/**
 * Catppuccin Mocha syntax highlighting theme
 * Based on the tree-sitter highlight capture names
 */
const catppuccinMochaSyntaxStyles: Record<string, StyleDefinition> = {
	// Keywords
	keyword: { fg: hex(theme.mauve) },
	"keyword.function": { fg: hex(theme.mauve) },
	"keyword.return": { fg: hex(theme.mauve) },
	"keyword.operator": { fg: hex(theme.sky) },
	"keyword.import": { fg: hex(theme.mauve) },
	"keyword.export": { fg: hex(theme.mauve) },
	"keyword.conditional": { fg: hex(theme.mauve) },
	"keyword.repeat": { fg: hex(theme.mauve) },
	"keyword.exception": { fg: hex(theme.mauve) },

	// Types
	type: { fg: hex(theme.yellow) },
	"type.builtin": { fg: hex(theme.yellow) },
	"type.definition": { fg: hex(theme.yellow) },

	// Functions
	function: { fg: hex(theme.blue) },
	"function.builtin": { fg: hex(theme.peach) },
	"function.call": { fg: hex(theme.blue) },
	"function.method": { fg: hex(theme.blue) },
	"function.method.call": { fg: hex(theme.blue) },
	method: { fg: hex(theme.blue) },
	"method.call": { fg: hex(theme.blue) },

	// Variables
	variable: { fg: hex(theme.text) },
	"variable.builtin": { fg: hex(theme.red) },
	"variable.parameter": { fg: hex(theme.maroon) },
	"variable.member": { fg: hex(theme.lavender) },
	parameter: { fg: hex(theme.maroon) },
	property: { fg: hex(theme.lavender) },

	// Constants
	constant: { fg: hex(theme.peach) },
	"constant.builtin": { fg: hex(theme.peach) },
	boolean: { fg: hex(theme.peach) },
	number: { fg: hex(theme.peach) },

	// Strings
	string: { fg: hex(theme.green) },
	"string.special": { fg: hex(theme.pink) },
	"string.escape": { fg: hex(theme.pink) },
	"string.regex": { fg: hex(theme.peach) },
	character: { fg: hex(theme.teal) },

	// Comments
	comment: { fg: hex(theme.overlay0), italic: true },
	"comment.documentation": { fg: hex(theme.overlay1), italic: true },

	// Punctuation
	punctuation: { fg: hex(theme.overlay2) },
	"punctuation.bracket": { fg: hex(theme.overlay2) },
	"punctuation.delimiter": { fg: hex(theme.overlay2) },
	"punctuation.special": { fg: hex(theme.sky) },

	// Operators
	operator: { fg: hex(theme.sky) },

	// Tags (HTML/JSX)
	tag: { fg: hex(theme.mauve) },
	"tag.attribute": { fg: hex(theme.yellow) },
	"tag.delimiter": { fg: hex(theme.overlay2) },

	// Markup
	"markup.heading": { fg: hex(theme.red), bold: true },
	"markup.bold": { bold: true },
	"markup.italic": { italic: true },
	"markup.link": { fg: hex(theme.blue) },
	"markup.list": { fg: hex(theme.teal) },
	"markup.quote": { fg: hex(theme.overlay1), italic: true },
	"markup.raw": { fg: hex(theme.green) },

	// Labels and namespaces
	label: { fg: hex(theme.sapphire) },
	namespace: { fg: hex(theme.lavender) },
	module: { fg: hex(theme.lavender) },

	// Constructor
	constructor: { fg: hex(theme.sapphire) },

	// Attributes and annotations
	attribute: { fg: hex(theme.yellow) },

	// Special
	"text.uri": { fg: hex(theme.rosewater) },
	"text.reference": { fg: hex(theme.lavender) },

	// Diff specific (if needed)
	"diff.plus": { fg: hex(theme.green) },
	"diff.minus": { fg: hex(theme.red) },
	"diff.delta": { fg: hex(theme.blue) },
};

export interface SyntaxService {
	/** Get or create the TreeSitterClient instance */
	getClient(): TreeSitterClient;
	/** Get or create the SyntaxStyle instance */
	getStyle(): SyntaxStyle;
	/** Initialize the syntax highlighting (call once at app start) */
	initialize(): Promise<void>;
	/** Check if the service is initialized */
	isInitialized(): boolean;
}

let treeSitterClient: TreeSitterClient | null = null;
let syntaxStyle: SyntaxStyle | null = null;
let initialized = false;

export const syntaxService: SyntaxService = {
	getClient(): TreeSitterClient {
		if (!treeSitterClient) {
			treeSitterClient = getTreeSitterClient();
		}
		return treeSitterClient;
	},

	getStyle(): SyntaxStyle {
		if (!syntaxStyle) {
			syntaxStyle = SyntaxStyleClass.fromStyles(catppuccinMochaSyntaxStyles);
		}
		return syntaxStyle;
	},

	async initialize(): Promise<void> {
		if (initialized) return;

		const client = this.getClient();
		await client.initialize();
		// Also initialize the style
		this.getStyle();

		initialized = true;
	},

	isInitialized(): boolean {
		return initialized;
	},
};
