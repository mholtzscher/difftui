import { useRenderer } from "@opentui/solid";
import { createSignal, Show } from "solid-js";
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

export function App() {
	const [originalText, setOriginalText] = createSignal("");
	const [modifiedText, setModifiedText] = createSignal("");
	const [view, setView] = createSignal<View>("input");
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
					onBack={() => setView("input")}
					onQuit={handleQuit}
				/>
			</Show>
		</box>
	);
}
