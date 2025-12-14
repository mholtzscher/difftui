import { theme } from "../theme";

export interface HelpItem {
	key: string;
	description: string;
}

export interface HelpBarProps {
	items: HelpItem[];
}

/**
 * HelpBar - Horizontal bar of key hints
 *
 * Renders key hints inline with double-space separation.
 * Use this for status bars and dialog footers.
 *
 * @example
 * <HelpBar items={[
 *   { key: 'j/k', description: 'navigate' },
 *   { key: 'Enter', description: 'select' },
 *   { key: 'Esc', description: 'cancel' },
 * ]} />
 * // Renders: "j/k navigate  Enter select  Esc cancel"
 */
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
