import { Show } from "solid-js";
import { theme } from "../theme";

interface HeaderProps {
	subtitle?: string;
}

export function Header(props: HeaderProps) {
	return (
		<box
			flexDirection="column"
			alignItems="center"
			paddingTop={1}
			paddingBottom={1}
			backgroundColor={theme.base}
		>
			<ascii_font font="tiny" text="difftui" />
			<Show when={props.subtitle}>
				<text fg={theme.subtext0}>{props.subtitle}</text>
			</Show>
		</box>
	);
}
