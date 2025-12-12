import type { Accessor, Setter } from "solid-js";
import type { TextareaRef } from "../types";
import { theme } from "../theme";

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
			border={true}
			borderStyle="rounded"
			borderColor={props.focused ? theme.borderFocused : theme.border}
			backgroundColor={theme.base}
			marginLeft={1}
			marginRight={1}
		>
			<box
				backgroundColor={props.focused ? theme.surface1 : theme.surface0}
				paddingLeft={1}
				paddingRight={1}
				height={1}
			>
				<text fg={props.focused ? theme.primary : theme.subtext0}>
					{props.title}
				</text>
			</box>
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
