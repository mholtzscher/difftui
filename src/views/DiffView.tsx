import { useKeyboard } from "@opentui/solid";
import { createMemo, Show } from "solid-js";
import { EmptyDiffMessage, NoChangesMessage } from "../components/EmptyState";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { getHints } from "../config/shortcuts";
import { diffService } from "../services/diff";
import { theme } from "../theme";
import type {
	KeyInfo,
	NavigationState,
	RefsState,
	ScrollboxRef,
	TextState,
} from "../types";

interface DiffViewProps {
	text: Pick<TextState, "originalText" | "modifiedText">;
	navigation: Pick<NavigationState, "diffMode" | "setDiffMode">;
	refs: Pick<RefsState, "scrollboxRef">;
	onBack: () => void;
	onQuit: () => void;
}

export function DiffView(props: DiffViewProps) {
	const { text, navigation, refs } = props;

	useKeyboard((key: KeyInfo) => {
		if (key.ctrl || key.meta) return;

		switch (key.name) {
			case "escape":
				props.onBack();
				break;
			case "tab":
				navigation.setDiffMode((prev) =>
					prev === "unified" ? "split" : "unified",
				);
				break;
			case "j":
			case "down":
				refs.scrollboxRef.current?.scrollBy(3);
				break;
			case "k":
			case "up":
				refs.scrollboxRef.current?.scrollBy(-3);
				break;
			case "g":
				if (key.shift) {
					// Shift+G: scroll to bottom
					refs.scrollboxRef.current?.scrollTo(Number.MAX_SAFE_INTEGER);
				} else {
					// g: scroll to top
					refs.scrollboxRef.current?.scrollTo(0);
				}
				break;
			case "q":
				props.onQuit();
				break;
		}
	});

	const hasContent = createMemo(() =>
		diffService.hasContent(text.originalText(), text.modifiedText()),
	);

	const hasChanges = createMemo(() =>
		diffService.hasChanges(text.originalText(), text.modifiedText()),
	);

	const diffContent = createMemo(() =>
		hasChanges()
			? diffService.generate(text.originalText(), text.modifiedText())
			: "",
	);

	return (
		<box flexDirection="column" flexGrow={1}>
			<Header />
			<box flexGrow={1}>
				<Show when={!hasContent()}>
					<EmptyDiffMessage />
				</Show>
				<Show when={hasContent() && !hasChanges()}>
					<NoChangesMessage />
				</Show>
				<Show when={hasContent() && hasChanges()}>
					<box
						flexGrow={1}
						border={true}
						borderStyle="rounded"
						borderColor={theme.borderFocused}
						overflow="hidden"
						title={`View: ${navigation.diffMode() === "unified" ? "Unified" : "Split"}`}
					>
						<scrollbox
							ref={(el: ScrollboxRef) => {
								refs.scrollboxRef.current = el;
							}}
							flexGrow={1}
						>
							<diff
								diff={diffContent()}
								view={navigation.diffMode()}
								showLineNumbers={true}
								addedBg={theme.diffAddedBg}
								removedBg={theme.diffRemovedBg}
								contextBg={theme.diffContextBg}
								addedSignColor={theme.diffAdded}
								removedSignColor={theme.diffRemoved}
								lineNumberFg={theme.overlay0}
								lineNumberBg={theme.mantle}
								fg={theme.text}
							/>
						</scrollbox>
					</box>
				</Show>
			</box>
			<Footer items={getHints("diff")} />
		</box>
	);
}
