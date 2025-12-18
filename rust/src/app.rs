use crate::services::{clipboard::read_clipboard, diff::generate_diff};

/// The current view being displayed
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum View {
    Input,
    Diff,
}

/// Which panel is currently focused in the input view
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FocusedPanel {
    Left,
    Right,
}

/// Main application state
pub struct App {
    /// The original text (left panel)
    pub original_text: String,
    /// The modified text (right panel)
    pub modified_text: String,
    /// Current view
    pub view: View,
    /// Currently focused panel
    pub focused_panel: FocusedPanel,
    /// Scroll offset for diff view
    pub scroll_offset: usize,
    /// Total lines in diff (for scroll bounds)
    pub diff_line_count: usize,
    /// Whether the app should quit
    pub should_quit: bool,
}

impl App {
    /// Create a new App instance
    pub fn new() -> Self {
        Self {
            original_text: String::new(),
            modified_text: String::new(),
            view: View::Input,
            focused_panel: FocusedPanel::Left,
            scroll_offset: 0,
            diff_line_count: 0,
            should_quit: false,
        }
    }

    /// Create a new App with initial text content
    pub fn with_content(original: String, modified: String, start_in_diff: bool) -> Self {
        let mut app = Self {
            original_text: original,
            modified_text: modified,
            view: if start_in_diff { View::Diff } else { View::Input },
            focused_panel: FocusedPanel::Left,
            scroll_offset: 0,
            diff_line_count: 0,
            should_quit: false,
        };
        app.update_diff_line_count();
        app
    }

    /// Switch between left and right panels
    pub fn toggle_panel(&mut self) {
        self.focused_panel = match self.focused_panel {
            FocusedPanel::Left => FocusedPanel::Right,
            FocusedPanel::Right => FocusedPanel::Left,
        };
    }

    /// Clear the currently focused panel
    pub fn clear_focused_panel(&mut self) {
        match self.focused_panel {
            FocusedPanel::Left => self.original_text.clear(),
            FocusedPanel::Right => self.modified_text.clear(),
        }
    }

    /// Swap the contents of both panels
    pub fn swap_panels(&mut self) {
        std::mem::swap(&mut self.original_text, &mut self.modified_text);
    }

    /// Paste clipboard content into the focused panel
    pub fn paste_to_focused_panel(&mut self) {
        if let Ok(text) = read_clipboard() {
            match self.focused_panel {
                FocusedPanel::Left => self.original_text = text,
                FocusedPanel::Right => self.modified_text = text,
            }
        }
    }

    /// Switch to diff view
    pub fn view_diff(&mut self) {
        self.scroll_offset = 0;
        self.update_diff_line_count();
        self.view = View::Diff;
    }

    /// Switch back to input view
    pub fn back_to_input(&mut self) {
        self.view = View::Input;
    }

    /// Update the diff line count for scroll bounds
    fn update_diff_line_count(&mut self) {
        let diff_lines = generate_diff(&self.original_text, &self.modified_text);
        self.diff_line_count = diff_lines.len();
    }

    /// Scroll the diff view by a given amount
    pub fn scroll(&mut self, amount: i32, visible_height: usize) {
        let max_scroll = self.diff_line_count.saturating_sub(visible_height);
        if amount > 0 {
            self.scroll_offset = (self.scroll_offset + amount as usize).min(max_scroll);
        } else {
            self.scroll_offset = self.scroll_offset.saturating_sub((-amount) as usize);
        }
    }

    /// Scroll to the top of the diff
    pub fn scroll_to_top(&mut self) {
        self.scroll_offset = 0;
    }

    /// Scroll to the bottom of the diff
    pub fn scroll_to_bottom(&mut self, visible_height: usize) {
        self.scroll_offset = self.diff_line_count.saturating_sub(visible_height);
    }

    /// Quit the application
    pub fn quit(&mut self) {
        self.should_quit = true;
    }

    /// Handle character input in the input view
    pub fn handle_char_input(&mut self, c: char) {
        match self.focused_panel {
            FocusedPanel::Left => self.original_text.push(c),
            FocusedPanel::Right => self.modified_text.push(c),
        }
    }

    /// Handle backspace in the input view
    pub fn handle_backspace(&mut self) {
        match self.focused_panel {
            FocusedPanel::Left => {
                self.original_text.pop();
            }
            FocusedPanel::Right => {
                self.modified_text.pop();
            }
        }
    }

    /// Handle enter key in the input view
    pub fn handle_enter(&mut self) {
        match self.focused_panel {
            FocusedPanel::Left => self.original_text.push('\n'),
            FocusedPanel::Right => self.modified_text.push('\n'),
        }
    }
}

impl Default for App {
    fn default() -> Self {
        Self::new()
    }
}
