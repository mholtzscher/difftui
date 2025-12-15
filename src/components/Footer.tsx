import { theme } from "../theme";
import { HelpBar, type HelpItem } from "./HelpBar";

interface FooterProps {
	items: HelpItem[];
}

export function Footer(props: FooterProps) {
	return (
		<box backgroundColor={theme.base} paddingLeft={2} flexShrink={0}>
			<HelpBar items={props.items} />
		</box>
	);
}
