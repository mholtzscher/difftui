use ratatui::{
    layout::{Constraint, Direction, Layout},
    Frame,
};

use crate::app::{App, FocusedPanel};
use crate::components::{
    footer::{footer_height, render_footer, KeyHint},
    header::{header_height, render_header},
    text_panel::render_text_panel,
};

/// Input view keybinding hints
const INPUT_HINTS: &[KeyHint] = &[
    KeyHint {
        key: "Tab",
        description: "Switch panel",
    },
    KeyHint {
        key: "d",
        description: "View diff",
    },
    KeyHint {
        key: "c",
        description: "Clear panel",
    },
    KeyHint {
        key: "p",
        description: "Paste",
    },
    KeyHint {
        key: "s",
        description: "Swap panels",
    },
    KeyHint {
        key: "q",
        description: "Quit",
    },
];

/// Render the input view
pub fn render_input_view(frame: &mut Frame, app: &App) {
    let area = frame.area();

    // Main vertical layout: header, panels, footer
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(header_height()),
            Constraint::Min(5),
            Constraint::Length(footer_height()),
        ])
        .split(area);

    // Render header
    render_header(frame, chunks[0]);

    // Split the middle section into two panels
    let panel_chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
        .split(chunks[1]);

    // Render left panel (original)
    render_text_panel(
        frame,
        panel_chunks[0],
        "Original",
        &app.original_text,
        app.focused_panel == FocusedPanel::Left,
        "Paste or type original text...",
    );

    // Render right panel (modified)
    render_text_panel(
        frame,
        panel_chunks[1],
        "Modified",
        &app.modified_text,
        app.focused_panel == FocusedPanel::Right,
        "Paste or type modified text...",
    );

    // Render footer
    render_footer(frame, chunks[2], INPUT_HINTS);
}
