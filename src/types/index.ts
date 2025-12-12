import type { Accessor, Setter } from "solid-js";

// Core application types
export type View = "input" | "diff";
export type DiffMode = "unified" | "split";
export type FocusedPanel = "left" | "right";

// Properly typed refs for OpenTUI components
export interface EditBuffer {
	getText(): string;
	setText(text: string): void;
	insertText(text: string): void;
}

export interface TextareaRef {
	editBuffer?: EditBuffer;
}

export interface ScrollboxRef {
	scrollBy(amount: number): void;
	scrollTo(position: number): void;
	scrollHeight: number;
}

// Create a typed ref helper
export function createRef<T>(): { current: T | null } {
	return { current: null };
}

// Focused state context - only what components need to know about focus
export interface FocusState {
	focusedPanel: Accessor<FocusedPanel>;
	setFocusedPanel: Setter<FocusedPanel>;
}

// Text content state - for components that deal with text
export interface TextState {
	originalText: Accessor<string>;
	setOriginalText: Setter<string>;
	modifiedText: Accessor<string>;
	setModifiedText: Setter<string>;
}

// Navigation state - for view/mode switching
export interface NavigationState {
	view: Accessor<View>;
	setView: Setter<View>;
	diffMode: Accessor<DiffMode>;
	setDiffMode: Setter<DiffMode>;
}

// Refs state - for textarea and scrollbox refs
export interface RefsState {
	leftTextareaRef: { current: TextareaRef | null };
	rightTextareaRef: { current: TextareaRef | null };
	scrollboxRef: { current: ScrollboxRef | null };
}

// Complete app state - composed from smaller interfaces
export interface AppState
	extends TextState,
		NavigationState,
		FocusState,
		RefsState {}

// Keyboard key info from OpenTUI
export interface KeyInfo {
	name: string;
	ctrl?: boolean;
	meta?: boolean;
	shift?: boolean;
}

// Action handlers for keyboard shortcuts
export type ActionHandler = () => void | Promise<void>;

export interface ActionHandlers {
	[key: string]: ActionHandler;
}
