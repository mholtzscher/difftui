#!/usr/bin/env bun

import { $ } from "bun";
import solidPlugin from "@opentui/solid/bun-plugin";

const bundleResult = await Bun.build({
	entrypoints: ["./src/index.tsx"],
	outdir: "./dist",
	target: "bun",
	plugins: [solidPlugin],
});

if (!bundleResult.success) {
	console.error("Bundle failed:");
	for (const log of bundleResult.logs) {
		console.error(log);
	}
	process.exit(1);
}

console.log("Bundle succeeded, compiling...");

await $`bun build --compile --target=bun ./dist/index.js --outfile=difftui`;
