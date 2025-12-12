import type { TextState, FocusState, RefsState } from "../types";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { TextPanel } from "../components/TextPanel";
import { generateHints } from "../config/shortcuts";

// InputView only needs text, focus, and refs - not navigation state
interface InputViewProps {
	text: TextState;
	focus: FocusState;
	refs: Pick<RefsState, "leftTextareaRef" | "rightTextareaRef">;
}

export function InputView(props: InputViewProps) {
	const { text, focus, refs } = props;

	return (
		<box flexDirection="column" flexGrow={1}>
			<Header />
			<box flexDirection="row" flexGrow={1} paddingBottom={1}>
				<TextPanel
					title="Original"
					value={text.originalText}
					setValue={text.setOriginalText}
					focused={focus.focusedPanel() === "left"}
					placeholder="Paste original text here..."
					textareaRef={refs.leftTextareaRef}
				/>
				<TextPanel
					title="Modified"
					value={text.modifiedText}
					setValue={text.setModifiedText}
					focused={focus.focusedPanel() === "right"}
					placeholder="Paste modified text here..."
					textareaRef={refs.rightTextareaRef}
				/>
			</box>
			<Footer hints={generateHints("input")} />
		</box>
	);
}
