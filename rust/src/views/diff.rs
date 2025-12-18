use ratatui::{
    layout::{Constraint, Direction, Layout},
    style::Style,
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph, Scrollbar, ScrollbarOrientation, ScrollbarState, Wrap},
    Frame,
};
use similar::ChangeTag;

use crate::app::App;
use crate::components::footer::{footer_height, render_footer, KeyHint};
use crate::services::diff::{generate_diff, has_changes, has_content};
use crate::theme::THEME;

/// Diff view keybinding hints
const DIFF_HINTS: &[KeyHint] = &[
    KeyHint {
        key: "Esc",
        description: "Back",
    },
    KeyHint {
        key: "j/k",
        description: "Scroll",
    },
    KeyHint {
        key: "g/G",
        description: "Top/bottom",
    },
    KeyHint {
        key: "q",
        description: "Quit",
    },
];

/// Render the diff view
pub fn render_diff_view(frame: &mut Frame, app: &App) {
    let area = frame.area();

    // Main vertical layout: content, footer
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(3), Constraint::Length(footer_height())])
        .split(area);

    let content_area = chunks[0];

    // Check if there's content
    if !has_content(&app.original_text, &app.modified_text) {
        render_empty_message(frame, content_area);
    } else if !has_changes(&app.original_text, &app.modified_text) {
        render_no_changes_message(frame, content_area);
    } else {
        render_diff_content(frame, content_area, app);
    }

    // Render footer
    render_footer(frame, chunks[1], DIFF_HINTS);
}

/// Render the "no content" message
fn render_empty_message(frame: &mut Frame, area: Rect) {
    let message = Paragraph::new("No content to diff. Add text to both panels.")
        .style(Style::default().fg(THEME.overlay0))
        .centered()
        .block(
            Block::default()
                .borders(Borders::ALL)
                .border_style(Style::default().fg(THEME.border))
                .title(" Diff "),
        );
    frame.render_widget(message, area);
}

/// Render the "no changes" message
fn render_no_changes_message(frame: &mut Frame, area: Rect) {
    let message = Paragraph::new("No changes detected. The texts are identical.")
        .style(Style::default().fg(THEME.overlay0))
        .centered()
        .block(
            Block::default()
                .borders(Borders::ALL)
                .border_style(Style::default().fg(THEME.border))
                .title(" Diff "),
        );
    frame.render_widget(message, area);
}

/// Render the actual diff content
fn render_diff_content(frame: &mut Frame, area: Rect, app: &App) {
    let diff_lines = generate_diff(&app.original_text, &app.modified_text);

    let lines: Vec<Line> = diff_lines
        .iter()
        .map(|diff_line| {
            let (prefix, style) = match diff_line.tag {
                ChangeTag::Insert => (
                    "+ ",
                    Style::default().fg(THEME.diff_added).bg(THEME.diff_added_bg),
                ),
                ChangeTag::Delete => (
                    "- ",
                    Style::default().fg(THEME.diff_removed).bg(THEME.diff_removed_bg),
                ),
                ChangeTag::Equal => (
                    "  ",
                    Style::default().fg(THEME.diff_context),
                ),
            };

            // Remove trailing newline for display
            let content = diff_line.content.trim_end_matches('\n');
            Line::from(vec![
                Span::styled(prefix, style),
                Span::styled(content, style),
            ])
        })
        .collect();

    let total_lines = lines.len();
    let visible_height = area.height.saturating_sub(2) as usize; // Account for borders

    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::default().fg(THEME.border_focused))
        .title(Line::styled(" Diff ", Style::default().fg(THEME.blue)));

    let paragraph = Paragraph::new(lines)
        .block(block)
        .scroll((app.scroll_offset as u16, 0))
        .wrap(Wrap { trim: false });

    frame.render_widget(paragraph, area);

    // Render scrollbar if needed
    if total_lines > visible_height {
        let scrollbar = Scrollbar::new(ScrollbarOrientation::VerticalRight)
            .begin_symbol(Some("↑"))
            .end_symbol(Some("↓"));

        let mut scrollbar_state = ScrollbarState::new(total_lines.saturating_sub(visible_height))
            .position(app.scroll_offset);

        frame.render_stateful_widget(
            scrollbar,
            area.inner(ratatui::layout::Margin {
                vertical: 1,
                horizontal: 0,
            }),
            &mut scrollbar_state,
        );
    }
}

use ratatui::layout::Rect;
