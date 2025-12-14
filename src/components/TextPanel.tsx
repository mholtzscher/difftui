import type { Accessor, Setter } from "solid-js";
import { theme } from "../theme";
import type { TextareaRef } from "../types";

interface TextPanelProps {
	title: string;
	value: Accessor<string>;
	setValue: Setter<string>;
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
			backgroundColor={theme.base}
			title={props.title}
		>
			<textarea
				ref={(el: TextareaRef) => {
					props.textareaRef.current = el;
				}}
				flexGrow={1}
				initialValue={props.value()}
				placeholder={props.placeholder}
				backgroundColor={props.focused ? theme.inputFocusedBg : theme.inputBg}
				textColor={theme.text}
				focusedBackgroundColor={theme.inputFocusedBg}
				focusedTextColor={theme.text}
				onContentChange={() => {
					// Update the value when content changes
					if (props.textareaRef.current?.editBuffer) {
						props.setValue(props.textareaRef.current.editBuffer.getText());
					}
				}}
			/>
		</box>
	);
}
