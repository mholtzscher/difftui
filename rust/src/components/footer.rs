use ratatui::{
    layout::Rect,
    style::Style,
    text::{Line, Span},
    widgets::Paragraph,
    Frame,
};

use crate::theme::THEME;

/// A keybinding hint to display in the footer
pub struct KeyHint {
    pub key: &'static str,
    pub description: &'static str,
}

/// Render the footer with keybinding hints
pub fn render_footer(frame: &mut Frame, area: Rect, hints: &[KeyHint]) {
    let key_style = Style::default().fg(THEME.blue);
    let desc_style = Style::default().fg(THEME.subtext0);
    let separator_style = Style::default().fg(THEME.surface2);

    let mut spans = Vec::new();

    for (i, hint) in hints.iter().enumerate() {
        if i > 0 {
            spans.push(Span::styled(" │ ", separator_style));
        }
        spans.push(Span::styled(hint.key, key_style));
        spans.push(Span::styled(" ", desc_style));
        spans.push(Span::styled(hint.description, desc_style));
    }

    let line = Line::from(spans);
    let paragraph = Paragraph::new(line).centered();
    frame.render_widget(paragraph, area);
}

/// Get the height needed for the footer
pub fn footer_height() -> u16 {
    1
}
