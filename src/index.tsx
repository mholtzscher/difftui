import { render } from "@opentui/solid";
import { App } from "./App";
import { loadFileContents, parseArgs } from "./cli";
import { syntaxService } from "./services/syntax";

const args = await parseArgs(process.argv.slice(2));
const initialContent = await loadFileContents(args);

// Initialize syntax highlighting in the background
syntaxService.initialize().catch(() => {
	// Syntax highlighting is optional, continue without it
});

render(() => <App initialContent={initialContent} />);
