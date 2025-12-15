import { theme } from "../theme";

export function Header() {
	return (
		<box
			flexDirection="column"
			alignItems="center"
			paddingTop={1}
			paddingBottom={1}
			backgroundColor={theme.base}
			flexShrink={0}
		>
			<box flexDirection="row" columnGap={1}>
				<ascii_font font="tiny" text="diff" color={theme.blue} />
				<ascii_font font="tiny" text="tui" color={theme.mauve} />
			</box>
		</box>
	);
}
