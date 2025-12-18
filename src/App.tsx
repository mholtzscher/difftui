import { pathToFiletype } from "@opentui/core";
import { useRenderer } from "@opentui/solid";
import { createSignal, Show } from "solid-js";
import { syntaxService } from "./services/syntax";
import { theme } from "./theme";
import type {
	DiffMode,
	FocusedPanel,
	ScrollboxRef,
	TextareaRef,
	View,
} from "./types";
import { createRef } from "./types";
import { DiffView } from "./views/DiffView";
import { InputView } from "./views/InputView";

export interface AppProps {
	initialContent?: {
		originalText: string;
		modifiedText?: string;
		/** File path for filetype detection */
		filePath?: string;
	};
}

export function App(props: AppProps) {
	const [originalText, setOriginalText] = createSignal(
		props.initialContent?.originalText ?? "",
	);
	const [modifiedText, setModifiedText] = createSignal(
		props.initialContent?.modifiedText ?? "",
	);
	const [view, setView] = createSignal<View>(
		props.initialContent?.modifiedText !== undefined ? "diff" : "input",
	);
	const [diffMode, setDiffMode] = createSignal<DiffMode>("unified");
	const [focusedPanel, setFocusedPanel] = createSignal<FocusedPanel>("left");

	const leftTextareaRef = createRef<TextareaRef>();
	const rightTextareaRef = createRef<TextareaRef>();
	const scrollboxRef = createRef<ScrollboxRef>();

	const renderer = useRenderer();

	const handleQuit = () => {
		renderer.destroy();
		process.exit(0);
	};

	const textState = {
		originalText,
		setOriginalText,
		modifiedText,
		setModifiedText,
	};

	const focusState = {
		focusedPanel,
		setFocusedPanel,
	};

	const navigationState = {
		diffMode,
		setDiffMode,
	};

	const refsState = {
		leftTextareaRef,
		rightTextareaRef,
		scrollboxRef,
	};

	// Detect filetype from file path for syntax highlighting
	const filetype = props.initialContent?.filePath
		? pathToFiletype(props.initialContent.filePath)
		: undefined;

	return (
		<box flexDirection="column" flexGrow={1} backgroundColor={theme.base}>
			<Show when={view() === "input"}>
				<InputView
					text={textState}
					focus={focusState}
					refs={refsState}
					onViewDiff={() => setView("diff")}
					onQuit={handleQuit}
				/>
			</Show>
			<Show when={view() === "diff"}>
				<DiffView
					text={textState}
					navigation={navigationState}
					refs={refsState}
					filetype={filetype}
					syntaxStyle={syntaxService.getStyle()}
					treeSitterClient={syntaxService.getClient()}
					onBack={() => setView("input")}
					onQuit={handleQuit}
				/>
			</Show>
		</box>
	);
}
