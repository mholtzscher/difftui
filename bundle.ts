#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";
import solidPlugin from "@opentui/solid/bun-plugin";

const dir = process.cwd();

fs.rmSync(path.join(dir, "dist"), { recursive: true, force: true });

// When building for standalone compile (release builds), bundle everything.
// When building for runtime execution (nix), keep @opentui/core external
// so the native module's .ts import resolves correctly at runtime.
const forCompile = process.argv.includes("--compile");

const result = await Bun.build({
	entrypoints: ["./src/index.tsx"],
	outdir: "./dist",
	target: "bun",
	sourcemap: "none",
	plugins: [solidPlugin],
	external: forCompile ? [] : ["@opentui/core"],
});

if (!result.success) {
	console.error("bundle failed");
	for (const log of result.logs) console.error(log);
	process.exit(1);
}
