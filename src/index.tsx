import { render } from "@opentui/solid";
import { App } from "./App";
import { loadFileContents, parseArgs } from "./cli";

const args = await parseArgs();
const initialContent = await loadFileContents(args);

render(() => <App initialContent={initialContent} />);
