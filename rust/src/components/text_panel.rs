use ratatui::{
    layout::Rect,
    style::Style,
    text::Line,
    widgets::{Block, Borders, Paragraph, Wrap},
    Frame,
};

use crate::theme::THEME;

/// Render a text panel with a title and content
pub fn render_text_panel(
    frame: &mut Frame,
    area: Rect,
    title: &str,
    content: &str,
    focused: bool,
    placeholder: &str,
) {
    let border_color = if focused {
        THEME.border_focused
    } else {
        THEME.border
    };

    let title_style = if focused {
        Style::default().fg(THEME.blue)
    } else {
        Style::default().fg(THEME.subtext0)
    };

    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::default().fg(border_color))
        .title(Line::styled(format!(" {} ", title), title_style));

    let (display_text, text_style) = if content.is_empty() {
        (placeholder, Style::default().fg(THEME.overlay0))
    } else {
        (content, Style::default().fg(THEME.text))
    };

    let paragraph = Paragraph::new(display_text)
        .block(block)
        .style(text_style)
        .wrap(Wrap { trim: false });

    frame.render_widget(paragraph, area);
}
