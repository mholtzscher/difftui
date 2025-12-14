import { theme } from "../theme";
import { HelpBar, type HelpItem } from "./HelpBar";

interface FooterProps {
	items: HelpItem[];
}

export function Footer(props: FooterProps) {
	return (
		<box
			backgroundColor={theme.base}
			paddingLeft={2}
			paddingRight={2}
			height={1}
		>
			<HelpBar items={props.items} />
		</box>
	);
}
