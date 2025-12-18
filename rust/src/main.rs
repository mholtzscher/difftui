mod app;
mod components;
mod services;
mod theme;
mod views;

use std::fs;
use std::io;
use std::path::PathBuf;

use clap::Parser;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode, KeyModifiers},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{backend::CrosstermBackend, Terminal};

use app::{App, View};
use views::{diff::render_diff_view, input::render_input_view};

/// A TUI for comparing and diffing text
#[derive(Parser, Debug)]
#[command(name = "difftui")]
#[command(version, about, long_about = None)]
struct Args {
    /// First file to compare (original)
    #[arg(value_name = "FILE1")]
    file1: Option<PathBuf>,

    /// Second file to compare (modified)
    #[arg(value_name = "FILE2")]
    file2: Option<PathBuf>,
}

fn main() -> io::Result<()> {
    let args = Args::parse();

    // Load file contents if provided
    let (original, modified, start_in_diff) = load_files(&args)?;

    // Create app with initial content
    let mut app = if original.is_some() || modified.is_some() {
        App::with_content(
            original.unwrap_or_default(),
            modified.unwrap_or_default(),
            start_in_diff,
        )
    } else {
        App::new()
    };

    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // Run the application
    let result = run_app(&mut terminal, &mut app);

    // Restore terminal
    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    result
}

/// Load files based on CLI arguments
fn load_files(args: &Args) -> io::Result<(Option<String>, Option<String>, bool)> {
    match (&args.file1, &args.file2) {
        (Some(file1), Some(file2)) => {
            let content1 = fs::read_to_string(file1)?;
            let content2 = fs::read_to_string(file2)?;
            Ok((Some(content1), Some(content2), true)) // Start in diff view
        }
        (Some(file1), None) => {
            let content1 = fs::read_to_string(file1)?;
            Ok((Some(content1), None, false)) // Start in input view
        }
        (None, None) => Ok((None, None, false)),
        (None, Some(_)) => {
            // This shouldn't happen with positional args, but handle it
            Ok((None, None, false))
        }
    }
}

/// Main application loop
fn run_app<B: ratatui::backend::Backend>(
    terminal: &mut Terminal<B>,
    app: &mut App,
) -> io::Result<()> {
    loop {
        // Draw the UI
        terminal.draw(|frame| {
            match app.view {
                View::Input => render_input_view(frame, app),
                View::Diff => render_diff_view(frame, app),
            }
        })?;

        // Handle events
        if let Event::Key(key) = event::read()? {
            // Handle Ctrl+C globally
            if key.modifiers.contains(KeyModifiers::CONTROL) && key.code == KeyCode::Char('c') {
                app.quit();
            }

            match app.view {
                View::Input => handle_input_view_keys(app, key.code, key.modifiers),
                View::Diff => {
                    let visible_height = terminal.size()?.height.saturating_sub(3) as usize;
                    handle_diff_view_keys(app, key.code, key.modifiers, visible_height);
                }
            }
        }

        if app.should_quit {
            break;
        }
    }

    Ok(())
}

/// Handle keyboard events in the input view
fn handle_input_view_keys(app: &mut App, code: KeyCode, modifiers: KeyModifiers) {
    match code {
        KeyCode::Tab => app.toggle_panel(),
        KeyCode::Char('q') if modifiers.is_empty() => app.quit(),
        KeyCode::Char('d') if modifiers.is_empty() => app.view_diff(),
        KeyCode::Char('c') if modifiers.is_empty() => app.clear_focused_panel(),
        KeyCode::Char('p') if modifiers.is_empty() => app.paste_to_focused_panel(),
        KeyCode::Char('s') if modifiers.is_empty() => app.swap_panels(),
        KeyCode::Backspace => app.handle_backspace(),
        KeyCode::Enter => app.handle_enter(),
        KeyCode::Char(c) if modifiers.is_empty() || modifiers == KeyModifiers::SHIFT => {
            // Only handle regular characters and shifted characters (for uppercase)
            // Skip single-letter shortcuts
            if !matches!(c, 'q' | 'd' | 'c' | 'p' | 's') {
                app.handle_char_input(c);
            }
        }
        _ => {}
    }
}

/// Handle keyboard events in the diff view
fn handle_diff_view_keys(
    app: &mut App,
    code: KeyCode,
    modifiers: KeyModifiers,
    visible_height: usize,
) {
    match code {
        KeyCode::Esc => app.back_to_input(),
        KeyCode::Char('q') => app.quit(),
        KeyCode::Char('j') | KeyCode::Down => app.scroll(3, visible_height),
        KeyCode::Char('k') | KeyCode::Up => app.scroll(-3, visible_height),
        KeyCode::Char('g') if modifiers.is_empty() => app.scroll_to_top(),
        KeyCode::Char('G') | KeyCode::Char('g') if modifiers.contains(KeyModifiers::SHIFT) => {
            app.scroll_to_bottom(visible_height)
        }
        KeyCode::PageDown => app.scroll(visible_height as i32, visible_height),
        KeyCode::PageUp => app.scroll(-(visible_height as i32), visible_height),
        KeyCode::Home => app.scroll_to_top(),
        KeyCode::End => app.scroll_to_bottom(visible_height),
        _ => {}
    }
}
