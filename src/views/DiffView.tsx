import { Show } from "solid-js";
import { EmptyDiffMessage, NoChangesMessage } from "../components/EmptyState";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { generateHints } from "../config/shortcuts";
import { diffService } from "../services/diff";
import { theme } from "../theme";
import type {
	NavigationState,
	RefsState,
	ScrollboxRef,
	TextState,
} from "../types";

// DiffView only needs text (read-only), navigation (for mode), and scrollbox ref
interface DiffViewProps {
	text: Pick<TextState, "originalText" | "modifiedText">;
	navigation: Pick<NavigationState, "diffMode">;
	refs: Pick<RefsState, "scrollboxRef">;
}

export function DiffView(props: DiffViewProps) {
	const { text, navigation, refs } = props;

	const diffContent = () =>
		diffService.generate(text.originalText(), text.modifiedText());

	const hasContent = () =>
		diffService.hasContent(text.originalText(), text.modifiedText());

	const hasChanges = () =>
		diffService.hasChanges(text.originalText(), text.modifiedText());

	return (
		<box flexDirection="column" flexGrow={1}>
			<Header
				subtitle={`View: ${navigation.diffMode() === "unified" ? "Unified" : "Split"}`}
			/>
			<box flexGrow={1} padding={1}>
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
						borderColor={theme.border}
						overflow="hidden"
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
			<Footer hints={generateHints("diff")} />
		</box>
	);
}
