use ratatui::{
    layout::Rect,
    style::Style,
    text::{Line, Span},
    widgets::Paragraph,
    Frame,
};

use crate::theme::THEME;

// ASCII art for "diff" and "tui"
const DIFF_ART: &[&str] = &[
    " ██████╗ ██╗███████╗███████╗",
    " ██╔══██╗██║██╔════╝██╔════╝",
    " ██║  ██║██║█████╗  █████╗  ",
    " ██║  ██║██║██╔══╝  ██╔══╝  ",
    " ██████╔╝██║██║     ██║     ",
    " ╚═════╝ ╚═╝╚═╝     ╚═╝     ",
];

const TUI_ART: &[&str] = &[
    "████████╗██╗   ██╗██╗",
    "╚══██╔══╝██║   ██║██║",
    "   ██║   ██║   ██║██║",
    "   ██║   ██║   ██║██║",
    "   ██║   ╚██████╔╝██║",
    "   ╚═╝    ╚═════╝ ╚═╝",
];

/// Render the header with ASCII art title
pub fn render_header(frame: &mut Frame, area: Rect) {
    let diff_style = Style::default().fg(THEME.blue);
    let tui_style = Style::default().fg(THEME.mauve);

    let lines: Vec<Line> = DIFF_ART
        .iter()
        .zip(TUI_ART.iter())
        .map(|(diff_line, tui_line)| {
            Line::from(vec![
                Span::styled(*diff_line, diff_style),
                Span::styled(*tui_line, tui_style),
            ])
        })
        .collect();

    let paragraph = Paragraph::new(lines).centered();
    frame.render_widget(paragraph, area);
}

/// Get the height needed for the header
pub fn header_height() -> u16 {
    DIFF_ART.len() as u16
}
