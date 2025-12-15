import { theme } from "../theme";

export function EmptyDiffMessage() {
	return (
		<box
			flexGrow={1}
			alignItems="center"
			justifyContent="center"
			backgroundColor={theme.base}
			border
			borderStyle="rounded"
			borderColor={theme.warning}
		>
			<box flexDirection="column" alignItems="center">
				<text fg={theme.warning}>No content to diff</text>
				<text fg={theme.overlay0}>
					Press [Esc] to go back and add some text
				</text>
			</box>
		</box>
	);
}

export function NoChangesMessage() {
	return (
		<box
			flexGrow={1}
			alignItems="center"
			justifyContent="center"
			backgroundColor={theme.base}
			border
			borderStyle="rounded"
			borderColor={theme.success}
		>
			<box flexDirection="column" alignItems="center">
				<text fg={theme.success}>No differences found</text>
				<text fg={theme.overlay0}>The texts are identical</text>
			</box>
		</box>
	);
}
