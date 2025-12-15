import { command, optional, positional, run, string } from "cmd-ts";
import { version } from "../package.json";

export type CliArgs =
	| { originalFile: string; modifiedFile: string }
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

	// Validate: if one file is provided, both must be provided
	if (
		(result.original && !result.modified) ||
		(!result.original && result.modified)
	) {
		console.error("Error: Please provide both original and modified files");
		process.exit(1);
	}

	// Verify files exist if provided
	if (result.original && result.modified) {
		const originalFile = Bun.file(result.original);
		if (!(await originalFile.exists())) {
			console.error(`Error: File not found: ${result.original}`);
			process.exit(1);
		}
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

	return {};
}

export interface FileContents {
	originalText: string;
	modifiedText: string;
}

export async function loadFileContents(
	args: CliArgs,
): Promise<FileContents | undefined> {
	if (!args.originalFile || !args.modifiedFile) {
		return undefined;
	}

	const [originalText, modifiedText] = await Promise.all([
		Bun.file(args.originalFile).text(),
		Bun.file(args.modifiedFile).text(),
	]);

	return { originalText, modifiedText };
}
