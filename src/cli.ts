import { command, optional, positional, run, string } from "cmd-ts";
import { version } from "../package.json";

export type CliArgs =
	| { originalFile: string; modifiedFile: string }
	| { originalFile?: undefined; modifiedFile: string }
	| { originalFile?: undefined; modifiedFile?: undefined };

const app = command({
	name: "difftui",
	description: "A terminal UI for comparing text and viewing diffs",
	version,
	args: {
		original: positional({
			type: optional(string),
			displayName: "original",
			description: "Path to the original file",
		}),
		modified: positional({
			type: optional(string),
			displayName: "modified",
			description: "Path to the modified file",
		}),
	},
	handler: async (args) => args,
});

export async function parseArgs(): Promise<CliArgs> {
	const result = await run(app, process.argv.slice(2));

	// Verify files exist if provided
	if (result.original) {
		const originalFile = Bun.file(result.original);
		if (!(await originalFile.exists())) {
			console.error(`Error: File not found: ${result.original}`);
			process.exit(1);
		}
	}
	if (result.modified) {
		const modifiedFile = Bun.file(result.modified);
		if (!(await modifiedFile.exists())) {
			console.error(`Error: File not found: ${result.modified}`);
			process.exit(1);
		}
	}

	if (result.original && result.modified) {
		return {
			originalFile: result.original,
			modifiedFile: result.modified,
		};
	}

	// Single file provided - treat as modified file (diff against empty)
	if (result.original) {
		return {
			modifiedFile: result.original,
		};
	}

	return {};
}

export interface FileContents {
	originalText: string;
	modifiedText: string;
}

export async function loadFileContents(
	args: CliArgs,
): Promise<FileContents | undefined> {
	if (!args.modifiedFile) {
		return undefined;
	}

	const modifiedText = await Bun.file(args.modifiedFile).text();
	const originalText = args.originalFile
		? await Bun.file(args.originalFile).text()
		: "";

	return { originalText, modifiedText };
}
