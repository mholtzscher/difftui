import clipboard from "clipboardy";

export interface ClipboardService {
	read(): Promise<string>;
}

export function createClipboardService(): ClipboardService {
	return {
		async read(): Promise<string> {
			return clipboard.read();
		},
	};
}

export const clipboardService = createClipboardService();
