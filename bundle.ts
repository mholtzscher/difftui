#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";
import solidPlugin from "@opentui/solid/bun-plugin";

const dir = process.cwd();

fs.rmSync(path.join(dir, "dist"), { recursive: true, force: true });

const result = await Bun.build({
	entrypoints: ["./src/index.tsx"],
	outdir: "./dist",
	target: "bun",
	sourcemap: "none",
	plugins: [solidPlugin],
});

if (!result.success) {
	console.error("bundle failed");
	for (const log of result.logs) console.error(log);
	process.exit(1);
}
