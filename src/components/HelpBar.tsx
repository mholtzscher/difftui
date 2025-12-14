import { theme } from "../theme";

export interface HelpItem {
	key: string;
	description: string;
}

export interface HelpBarProps {
	items: HelpItem[];
}

export function HelpBar({ items }: HelpBarProps) {
	return (
		<box flexDirection="row">
			{items.map((item, index) => (
				<box flexDirection="row">
					{index > 0 && <text fg={theme.overlay0}>{"  "}</text>}
					<text fg={theme.text}>{item.key}</text>
					<text fg={theme.overlay0}> {item.description}</text>
				</box>
			))}
		</box>
	);
}
