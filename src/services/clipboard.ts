// Platform-agnostic clipboard service

export interface ClipboardService {
	read(): Promise<string>;
	write(text: string): Promise<void>;
}

function getPlatform(): "darwin" | "win32" | "linux" {
	// Bun exposes process.platform
	const platform = process.platform;
	if (platform === "darwin" || platform === "win32") {
		return platform;
	}
	return "linux";
}

function getReadCommand(): string[] {
	const platform = getPlatform();

	switch (platform) {
		case "darwin":
			return ["pbpaste"];
		case "win32":
			return ["powershell", "-command", "Get-Clipboard"];
		case "linux":
			// Try xclip first, fallback handled in read()
			return ["xclip", "-selection", "clipboard", "-o"];
	}
}

function getWriteCommand(): string[] {
	const platform = getPlatform();

	switch (platform) {
		case "darwin":
			return ["pbcopy"];
		case "win32":
			return ["powershell", "-command", "Set-Clipboard"];
		case "linux":
			return ["xclip", "-selection", "clipboard"];
	}
}

async function tryLinuxClipboardRead(): Promise<string> {
	// Try xclip first
	try {
		const proc = Bun.spawn(["xclip", "-selection", "clipboard", "-o"], {
			stdout: "pipe",
			stderr: "pipe",
		});
		const text = await new Response(proc.stdout).text();
		await proc.exited;
		if (proc.exitCode === 0) {
			return text;
		}
	} catch {
		// xclip not available, try xsel
	}

	// Fallback to xsel
	try {
		const proc = Bun.spawn(["xsel", "--clipboard", "--output"], {
			stdout: "pipe",
			stderr: "pipe",
		});
		const text = await new Response(proc.stdout).text();
		await proc.exited;
		if (proc.exitCode === 0) {
			return text;
		}
	} catch {
		// xsel not available either
	}

	throw new Error(
		"No clipboard utility available. Install xclip or xsel on Linux.",
	);
}

async function tryLinuxClipboardWrite(text: string): Promise<void> {
	// Try xclip first
	try {
		const proc = Bun.spawn(["xclip", "-selection", "clipboard"], {
			stdin: "pipe",
			stderr: "pipe",
		});
		if (proc.stdin) {
			proc.stdin.write(text);
			proc.stdin.end();
		}
		await proc.exited;
		if (proc.exitCode === 0) {
			return;
		}
	} catch {
		// xclip not available, try xsel
	}

	// Fallback to xsel
	try {
		const proc = Bun.spawn(["xsel", "--clipboard", "--input"], {
			stdin: "pipe",
			stderr: "pipe",
		});
		if (proc.stdin) {
			proc.stdin.write(text);
			proc.stdin.end();
		}
		await proc.exited;
		if (proc.exitCode === 0) {
			return;
		}
	} catch {
		// xsel not available either
	}

	throw new Error(
		"No clipboard utility available. Install xclip or xsel on Linux.",
	);
}

export function createClipboardService(): ClipboardService {
	const platform = getPlatform();

	return {
		async read(): Promise<string> {
			// Linux needs special handling for fallback utilities
			if (platform === "linux") {
				return tryLinuxClipboardRead();
			}

			const command = getReadCommand();
			const proc = Bun.spawn(command, {
				stdout: "pipe",
				stderr: "pipe",
			});

			const text = await new Response(proc.stdout).text();
			await proc.exited;

			if (proc.exitCode !== 0) {
				throw new Error(
					`Clipboard read failed with exit code ${proc.exitCode}`,
				);
			}

			return text;
		},

		async write(text: string): Promise<void> {
			// Linux needs special handling for fallback utilities
			if (platform === "linux") {
				return tryLinuxClipboardWrite(text);
			}

			const command = getWriteCommand();
			const proc = Bun.spawn(command, {
				stdin: "pipe",
				stderr: "pipe",
			});

			if (proc.stdin) {
				proc.stdin.write(text);
				proc.stdin.end();
			}

			await proc.exited;

			if (proc.exitCode !== 0) {
				throw new Error(
					`Clipboard write failed with exit code ${proc.exitCode}`,
				);
			}
		},
	};
}

// Export a singleton instance for convenience
export const clipboard = createClipboardService();
