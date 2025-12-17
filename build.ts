#!/usr/bin/env bun

import solidPlugin from "@opentui/solid/bun-plugin";

const result = await Bun.build({
	entrypoints: ["./src/index.tsx"],
	outdir: "./dist",
	target: "bun",
	plugins: [solidPlugin],
	external: ["@opentui/core"],
});

if (!result.success) {
	console.error("bundle failed");
	for (const log of result.logs) console.error(log);
	process.exit(1);
}
