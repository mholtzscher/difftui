import clipboard from "clipboardy";

export interface ClipboardService {
	read(): Promise<string>;
}

export const clipboardService: ClipboardService = {
	async read(): Promise<string> {
		return clipboard.read();
	},
};
