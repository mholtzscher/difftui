import { command, optional, positional, run, string } from "cmd-ts";
import { version } from "../package.json";

interface CliArgs {
	originalFile?: string;
	modifiedFile?: string;
}

const app = command({
	name: "difftui",
	description: "A terminal UI for comparing text and viewing diffs",
	version,
	args: {
		file1: positional({
			type: optional(string),
			displayName: "file1",
			description: "First file (original if two files, modified if one)",
		}),
		file2: positional({
			type: optional(string),
			displayName: "file2",
			description: "Second file (modified)",
		}),
	},
	handler: async (args) => args,
});

async function assertFileExists(path: string): Promise<void> {
	if (!(await Bun.file(path).exists())) {
		console.error(`Error: File not found: ${path}`);
		process.exit(1);
	}
}

export async function parseArgs(argv: string[]): Promise<CliArgs> {
	const result = await run(app, argv);

	if (result.file1) await assertFileExists(result.file1);
	if (result.file2) await assertFileExists(result.file2);

	// Two files: file1 is original, file2 is modified
	if (result.file1 && result.file2) {
		return { originalFile: result.file1, modifiedFile: result.file2 };
	}

	// One file: treat as modified (diff against empty)
	if (result.file1) {
		return { modifiedFile: result.file1 };
	}

	return {};
}

export async function loadFileContents(
	args: CliArgs,
): Promise<{ originalText: string; modifiedText: string } | undefined> {
	if (!args.modifiedFile) return undefined;

	let originalText = "";
	if (args.originalFile) {
		originalText = await Bun.file(args.originalFile).text();
	}

	const modifiedText = await Bun.file(args.modifiedFile).text();

	return { originalText, modifiedText };
}
