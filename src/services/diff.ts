import { createPatch } from "diff";

export interface DiffService {
	generate(original: string, modified: string): string;
	hasChanges(original: string, modified: string): boolean;
	hasContent(original: string, modified: string): boolean;
}

export const diffService: DiffService = {
	generate(original: string, modified: string): string {
		if (!original && !modified) {
			return "";
		}
		return createPatch("file", original, modified, "original", "modified");
	},

	hasChanges(original: string, modified: string): boolean {
		return original !== modified;
	},

	hasContent(original: string, modified: string): boolean {
		return Boolean(original || modified);
	},
};
