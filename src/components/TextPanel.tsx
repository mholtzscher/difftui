import type { Accessor } from "solid-js";
import { theme } from "../theme";
import type { TextareaRef } from "../types";

interface TextPanelProps {
	title: string;
	value: Accessor<string>;
	focused: boolean;
	placeholder: string;
	textareaRef: { current: TextareaRef | null };
}

export function TextPanel(props: TextPanelProps) {
	return (
		<box
			flexDirection="column"
			flexGrow={1}
			flexBasis={0}
			border
			borderStyle="rounded"
			borderColor={props.focused ? theme.borderFocused : theme.border}
			title={props.title}
		>
			<textarea
				ref={(el: TextareaRef) => {
					props.textareaRef.current = el;
				}}
				flexGrow={1}
				initialValue={props.value()}
				placeholder={props.placeholder}
				textColor={theme.text}
				focusedTextColor={theme.text}
			/>
		</box>
	);
}
