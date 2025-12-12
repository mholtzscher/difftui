import { useRenderer } from "@opentui/solid";
import { createSignal, Show } from "solid-js";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { clipboard } from "./services/clipboard";
import { theme } from "./theme";
import type {
	ActionHandlers,
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
	// State signals - separated by concern
	const [originalText, setOriginalText] = createSignal("");
	const [modifiedText, setModifiedText] = createSignal("");
	const [view, setView] = createSignal<View>("input");
	const [diffMode, setDiffMode] = createSignal<DiffMode>("unified");
	const [focusedPanel, setFocusedPanel] = createSignal<FocusedPanel>("left");

	// Properly typed refs
	const leftTextareaRef = createRef<TextareaRef>();
	const rightTextareaRef = createRef<TextareaRef>();
	const scrollboxRef = createRef<ScrollboxRef>();

	// Get renderer for cleanup
	const renderer = useRenderer();

	// Action handlers - clean, testable functions
	const actions: ActionHandlers = {
		// Input view actions
		togglePanel: () => {
			setFocusedPanel((prev) => (prev === "left" ? "right" : "left"));
		},

		viewDiff: () => {
			setView("diff");
		},

		clear: () => {
			setOriginalText("");
			setModifiedText("");
			// Also clear the actual textarea content
			if (leftTextareaRef.current?.editBuffer) {
				leftTextareaRef.current.editBuffer.setText("");
			}
			if (rightTextareaRef.current?.editBuffer) {
				rightTextareaRef.current.editBuffer.setText("");
			}
		},

		paste: async () => {
			try {
				const text = await clipboard.read();
				const targetRef =
					focusedPanel() === "left" ? leftTextareaRef : rightTextareaRef;

				if (targetRef.current?.editBuffer) {
					targetRef.current.editBuffer.insertText(text);
					// Update state
					if (focusedPanel() === "left") {
						setOriginalText(targetRef.current.editBuffer.getText());
					} else {
						setModifiedText(targetRef.current.editBuffer.getText());
					}
				}
			} catch {
				// Ignore paste errors silently
			}
		},

		quit: () => {
			renderer.destroy();
			process.exit(0);
		},

		// Diff view actions
		back: () => {
			setView("input");
		},

		toggleDiffMode: () => {
			setDiffMode((prev) => (prev === "unified" ? "split" : "unified"));
		},

		scrollDown: () => {
			scrollboxRef.current?.scrollBy(3);
		},

		scrollUp: () => {
			scrollboxRef.current?.scrollBy(-3);
		},

		scrollToTop: () => {
			scrollboxRef.current?.scrollTo(0);
		},

		scrollToBottom: () => {
			if (scrollboxRef.current) {
				scrollboxRef.current.scrollTo(scrollboxRef.current.scrollHeight);
			}
		},
	};

	// Setup keyboard shortcuts with declarative config
	useKeyboardShortcuts({
		getView: view,
		actions,
	});

	// Compose state objects for views (Interface Segregation)
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
		view,
		setView,
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
				<InputView text={textState} focus={focusState} refs={refsState} />
			</Show>
			<Show when={view() === "diff"}>
				<DiffView
					text={textState}
					navigation={navigationState}
					refs={refsState}
				/>
			</Show>
		</box>
	);
}
