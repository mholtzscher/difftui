import { randomUUID } from "node:crypto";
import { unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface EditorResult {
	success: boolean;
	content: string;
}

export interface EditorService {
	edit(content: string): Promise<EditorResult>;
}

function getEditor(): string {
	return process.env.VISUAL || process.env.EDITOR || "vi";
}

function createTempFilePath(): string {
	return join(tmpdir(), `difftui-${randomUUID()}.txt`);
}

export function createEditorService(): EditorService {
	return {
		async edit(content: string): Promise<EditorResult> {
			const editor = getEditor();
			const tempFile = createTempFilePath();

			try {
				await Bun.write(tempFile, content);

				const [command = "vi", ...args] = editor.split(/\s+/);
				const result = Bun.spawnSync([command, ...args, tempFile], {
					stdin: "inherit",
					stdout: "inherit",
					stderr: "inherit",
				});

				if (result.exitCode !== 0) {
					return { success: false, content };
				}

				const editedContent = await Bun.file(tempFile).text();
				return { success: true, content: editedContent };
			} finally {
				try {
					unlinkSync(tempFile);
				} catch {
					// File may not exist if write failed
				}
			}
		},
	};
}

export const editorService = createEditorService();
