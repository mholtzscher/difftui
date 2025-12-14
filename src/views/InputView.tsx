import { useKeyboard } from "@opentui/solid";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { TextPanel } from "../components/TextPanel";
import { generateHints } from "../config/shortcuts";
import { clipboard } from "../services/clipboard";
import type { FocusState, KeyInfo, RefsState, TextState } from "../types";

interface InputViewProps {
	text: TextState;
	focus: FocusState;
	refs: Pick<RefsState, "leftTextareaRef" | "rightTextareaRef">;
	onViewDiff: () => void;
	onQuit: () => void;
}

export function InputView(props: InputViewProps) {
	const { text, focus, refs } = props;

	const handlePaste = async () => {
		try {
			const pastedText = await clipboard.read();
			const targetRef =
				focus.focusedPanel() === "left"
					? refs.leftTextareaRef
					: refs.rightTextareaRef;

			if (targetRef.current?.editBuffer) {
				targetRef.current.editBuffer.insertText(pastedText);
				if (focus.focusedPanel() === "left") {
					text.setOriginalText(targetRef.current.editBuffer.getText());
				} else {
					text.setModifiedText(targetRef.current.editBuffer.getText());
				}
			}
		} catch {
			// Ignore paste errors silently
		}
	};

	const handleClear = () => {
		text.setOriginalText("");
		text.setModifiedText("");
		if (refs.leftTextareaRef.current?.editBuffer) {
			refs.leftTextareaRef.current.editBuffer.setText("");
		}
		if (refs.rightTextareaRef.current?.editBuffer) {
			refs.rightTextareaRef.current.editBuffer.setText("");
		}
	};

	useKeyboard((key: KeyInfo) => {
		if (key.ctrl || key.meta) return;

		switch (key.name) {
			case "tab":
				focus.setFocusedPanel((prev) => (prev === "left" ? "right" : "left"));
				break;
			case "d":
				props.onViewDiff();
				break;
			case "r":
				handleClear();
				break;
			case "p":
				void handlePaste();
				break;
			case "q":
				props.onQuit();
				break;
		}
	});

	return (
		<box flexDirection="column" flexGrow={1}>
			<Header />
			// TODO: is this paddingBottom needed?
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
