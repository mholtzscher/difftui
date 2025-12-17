#!/usr/bin/env bun

import solidPlugin from "@opentui/solid/bun-plugin";

const forCompile = process.argv.includes("--compile");

if (forCompile) {
	await Bun.build({
		entrypoints: ["./src/index.tsx"],
		target: "bun",
		plugins: [solidPlugin],
		compile: {
			autoloadBunfig: false,
			outfile: "./difftui",
		},
	});
} else {
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
}
