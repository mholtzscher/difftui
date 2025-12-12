import { createPatch } from "diff";

export interface DiffService {
	generate(original: string, modified: string): string;
	hasChanges(original: string, modified: string): boolean;
	hasContent(original: string, modified: string): boolean;
}

export const diffService: DiffService = {
	/**
	 * Generate a unified diff patch from two text inputs
	 */
	generate(original: string, modified: string): string {
		if (!original && !modified) {
			return "";
		}
		return createPatch("file", original, modified, "original", "modified");
	},

	/**
	 * Check if there are any differences between the two texts
	 */
	hasChanges(original: string, modified: string): boolean {
		return original !== modified;
	},

	/**
	 * Check if either text has content
	 */
	hasContent(original: string, modified: string): boolean {
		return Boolean(original || modified);
	},
};
