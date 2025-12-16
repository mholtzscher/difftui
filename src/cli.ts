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
			description: "Original file (opens in input view if file2 not provided)",
		}),
		file2: positional({
			type: optional(string),
			displayName: "file2",
			description: "Modified file (shows diff view when both files provided)",
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

	return {
		originalFile: result.file1,
		modifiedFile: result.file2,
	};
}

export async function loadFileContents(args: CliArgs): Promise<
	| {
			originalText: string;
			modifiedText?: string;
	  }
	| undefined
> {
	if (!args.originalFile && !args.modifiedFile) return undefined;

	let originalText = "";
	if (args.originalFile) {
		originalText = await Bun.file(args.originalFile).text();
	}

	let modifiedText: string | undefined;
	if (args.modifiedFile) {
		modifiedText = await Bun.file(args.modifiedFile).text();
	}

	return { originalText, modifiedText };
}
