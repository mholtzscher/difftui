import { Show } from "solid-js";
import type { TextState, NavigationState, RefsState, ScrollboxRef } from "../types";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { EmptyDiffMessage, NoChangesMessage } from "../components/EmptyState";
import { diffService } from "../services/diff";
import { generateHints } from "../config/shortcuts";
import { theme } from "../theme";

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
