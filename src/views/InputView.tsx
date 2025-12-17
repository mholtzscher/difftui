import { useKeyboard } from "@opentui/solid";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { TextPanel } from "../components/TextPanel";
import { getHints } from "../config/shortcuts";
import { clipboardService } from "../services/clipboard";
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
			const pastedText = await clipboardService.read();
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
		if (focus.focusedPanel() === "left") {
			text.setOriginalText("");
			if (refs.leftTextareaRef.current?.editBuffer) {
				refs.leftTextareaRef.current.editBuffer.setText("");
			}
		} else {
			text.setModifiedText("");
			if (refs.rightTextareaRef.current?.editBuffer) {
				refs.rightTextareaRef.current.editBuffer.setText("");
			}
		}
	};

	const handleSwap = () => {
		const leftText = text.originalText();
		const rightText = text.modifiedText();

		text.setOriginalText(rightText);
		text.setModifiedText(leftText);

		if (refs.leftTextareaRef.current?.editBuffer) {
			refs.leftTextareaRef.current.editBuffer.setText(rightText);
		}
		if (refs.rightTextareaRef.current?.editBuffer) {
			refs.rightTextareaRef.current.editBuffer.setText(leftText);
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
			case "c":
				handleClear();
				break;
			case "p":
				void handlePaste();
				break;
			case "s":
				handleSwap();
				break;
			case "q":
				props.onQuit();
				break;
		}
	});

	return (
		<box flexDirection="column" flexGrow={1}>
			<Header />
			<box flexDirection="row" flexGrow={1}>
				<TextPanel
					title="Left"
					value={text.originalText}
					focused={focus.focusedPanel() === "left"}
					placeholder="Paste original text here..."
					textareaRef={refs.leftTextareaRef}
				/>
				<TextPanel
					title="Right"
					value={text.modifiedText}
					focused={focus.focusedPanel() === "right"}
					placeholder="Paste modified text here..."
					textareaRef={refs.rightTextareaRef}
				/>
			</box>
			<Footer items={getHints("input")} />
		</box>
	);
}
