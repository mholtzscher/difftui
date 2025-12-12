import { theme } from "../theme";

interface FooterProps {
	hints: string;
}

export function Footer(props: FooterProps) {
	return (
		<box
			backgroundColor={theme.footerBg}
			paddingLeft={2}
			paddingRight={2}
			height={1}
		>
			<text fg={theme.overlay1}>{props.hints}</text>
		</box>
	);
}
