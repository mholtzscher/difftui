import { render, useKeyboard, useRenderer } from "@opentui/solid";
import { createSignal, Show, type Accessor, type Setter } from "solid-js";
import { createPatch } from "diff";
import { theme } from "./theme";

// Types
type View = "input" | "diff";
type DiffMode = "unified" | "split";
type FocusedPanel = "left" | "right";

// App state interface for passing to child components
interface AppState {
  originalText: Accessor<string>;
  setOriginalText: Setter<string>;
  modifiedText: Accessor<string>;
  setModifiedText: Setter<string>;
  view: Accessor<View>;
  setView: Setter<View>;
  diffMode: Accessor<DiffMode>;
  setDiffMode: Setter<DiffMode>;
  focusedPanel: Accessor<FocusedPanel>;
  setFocusedPanel: Setter<FocusedPanel>;
  leftTextareaRef: { current: any };
  rightTextareaRef: { current: any };
  scrollboxRef: { current: any };
}

// Generate unified diff from two text inputs
function generateDiff(original: string, modified: string): string {
  if (!original && !modified) {
    return "";
  }
  return createPatch("file", original, modified, "original", "modified");
}

// Header component with ASCII art title
function Header(props: { subtitle?: string }) {
  return (
    <box
      flexDirection="column"
      alignItems="center"
      paddingTop={1}
      paddingBottom={1}
      backgroundColor={theme.headerBg}
    >
      <ascii_font font="tiny" text="simple-diff" />
      <Show when={props.subtitle}>
        <text fg={theme.subtext0}>{props.subtitle}</text>
      </Show>
    </box>
  );
}

// Footer component with keyboard hints
function Footer(props: { hints: string }) {
  return (
    <box
      backgroundColor={theme.footerBg}
      paddingLeft={2}
      paddingRight={2}
      height={1}
    >
      <text fg={theme.overlay1}>{props.hints}</text>
    </box>
  );
}

// Text panel component for input view
function TextPanel(props: {
  title: string;
  value: Accessor<string>;
  setValue: Setter<string>;
  focused: boolean;
  placeholder: string;
  textareaRef: { current: any };
}) {
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
        ref={(el: any) => {
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

// Input view with side-by-side textareas
function InputView(props: { state: AppState }) {
  const { state } = props;

  return (
    <box flexDirection="column" flexGrow={1}>
      <Header />
      <box flexDirection="row" flexGrow={1} paddingBottom={1}>
        <TextPanel
          title="Original"
          value={state.originalText}
          setValue={state.setOriginalText}
          focused={state.focusedPanel() === "left"}
          placeholder="Paste original text here..."
          textareaRef={state.leftTextareaRef}
        />
        <TextPanel
          title="Modified"
          value={state.modifiedText}
          setValue={state.setModifiedText}
          focused={state.focusedPanel() === "right"}
          placeholder="Paste modified text here..."
          textareaRef={state.rightTextareaRef}
        />
      </box>
      <Footer hints="[Tab] Switch panel  [d] View diff  [r] Clear  [p] Paste  [q] Quit" />
    </box>
  );
}

// Empty state message for diff view
function EmptyDiffMessage() {
  return (
    <box
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={theme.base}
    >
      <box flexDirection="column" alignItems="center">
        <text fg={theme.overlay1}>No content to diff</text>
        <text fg={theme.overlay0}>
          Press [Esc] to go back and add some text
        </text>
      </box>
    </box>
  );
}

// No changes message
function NoChangesMessage() {
  return (
    <box
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={theme.base}
    >
      <box flexDirection="column" alignItems="center">
        <text fg={theme.success}>No differences found</text>
        <text fg={theme.overlay0}>The texts are identical</text>
      </box>
    </box>
  );
}

// Diff view component
function DiffView(props: { state: AppState }) {
  const { state } = props;

  const diffContent = () =>
    generateDiff(state.originalText(), state.modifiedText());
  const hasContent = () => state.originalText() || state.modifiedText();
  const hasChanges = () => state.originalText() !== state.modifiedText();

  return (
    <box flexDirection="column" flexGrow={1}>
      <Header
        subtitle={`View: ${state.diffMode() === "unified" ? "Unified" : "Split"}`}
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
              ref={(el: any) => {
                state.scrollboxRef.current = el;
              }}
              flexGrow={1}
            >
              <diff
                diff={diffContent()}
                view={state.diffMode()}
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
      <Footer hints="[j/k] Scroll  [Tab] Toggle unified/split  [Esc] Back  [q] Quit" />
    </box>
  );
}

// Main App component
function App() {
  // State signals
  const [originalText, setOriginalText] = createSignal("");
  const [modifiedText, setModifiedText] = createSignal("");
  const [view, setView] = createSignal<View>("input");
  const [diffMode, setDiffMode] = createSignal<DiffMode>("unified");
  const [focusedPanel, setFocusedPanel] = createSignal<FocusedPanel>("left");

  // Refs for textareas and scrollbox
  const leftTextareaRef = { current: null as any };
  const rightTextareaRef = { current: null as any };
  const scrollboxRef = { current: null as any };

  // Get renderer for cleanup
  const renderer = useRenderer();

  const state: AppState = {
    originalText,
    setOriginalText,
    modifiedText,
    setModifiedText,
    view,
    setView,
    diffMode,
    setDiffMode,
    focusedPanel,
    setFocusedPanel,
    leftTextareaRef,
    rightTextareaRef,
    scrollboxRef,
  };

  // Paste from clipboard into focused textarea
  const pasteFromClipboard = async () => {
    try {
      const proc = Bun.spawn(["pbpaste"], { stdout: "pipe" });
      const text = await new Response(proc.stdout).text();
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
      // Ignore paste errors
    }
  };

  // Global keyboard handler
  useKeyboard((key) => {
    // Skip if any modifier is pressed (let system handle those)
    const hasModifier = key.ctrl || key.meta || key.shift;

    if (view() === "input") {
      // Input view shortcuts (no modifiers)
      if (!hasModifier) {
        if (key.name === "tab") {
          // Toggle focus between panels
          setFocusedPanel((prev) => (prev === "left" ? "right" : "left"));
        } else if (key.name === "d") {
          // View diff
          setView("diff");
        } else if (key.name === "r") {
          // Clear both textareas
          setOriginalText("");
          setModifiedText("");
          // Also clear the actual textarea content
          if (leftTextareaRef.current?.editBuffer) {
            leftTextareaRef.current.editBuffer.setText("");
          }
          if (rightTextareaRef.current?.editBuffer) {
            rightTextareaRef.current.editBuffer.setText("");
          }
        } else if (key.name === "p") {
          // Paste from clipboard
          pasteFromClipboard();
        } else if (key.name === "q") {
          // Quit - destroy renderer first to clear screen
          renderer.destroy();
          process.exit(0);
        }
      }
    } else if (view() === "diff") {
      // Diff view shortcuts
      if (!hasModifier) {
        if (key.name === "escape") {
          // Back to input
          setView("input");
        } else if (key.name === "tab") {
          // Toggle diff mode
          setDiffMode((prev) => (prev === "unified" ? "split" : "unified"));
        } else if (key.name === "q") {
          // Quit - destroy renderer first to clear screen
          renderer.destroy();
          process.exit(0);
        } else if (key.name === "j" || key.name === "down") {
          // Scroll down
          if (scrollboxRef.current) {
            scrollboxRef.current.scrollBy(3);
          }
        } else if (key.name === "k" || key.name === "up") {
          // Scroll up
          if (scrollboxRef.current) {
            scrollboxRef.current.scrollBy(-3);
          }
        } else if (key.name === "g") {
          // Scroll to top
          if (scrollboxRef.current) {
            scrollboxRef.current.scrollTo(0);
          }
        } else if (key.name === "G") {
          // Scroll to bottom
          if (scrollboxRef.current) {
            scrollboxRef.current.scrollTo(scrollboxRef.current.scrollHeight);
          }
        }
      } else if (key.shift && key.name === "G") {
        // Shift+G - Scroll to bottom
        if (scrollboxRef.current) {
          scrollboxRef.current.scrollTo(scrollboxRef.current.scrollHeight);
        }
      }
    }
  });

  return (
    <box flexDirection="column" flexGrow={1} backgroundColor={theme.base}>
      <Show when={view() === "input"}>
        <InputView state={state} />
      </Show>
      <Show when={view() === "diff"}>
        <DiffView state={state} />
      </Show>
    </box>
  );
}

// Render the app
render(() => <App />);
