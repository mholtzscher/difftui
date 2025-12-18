use arboard::Clipboard;

/// Read text from the system clipboard
/// Returns Ok(String) on success, Err on failure
pub fn read_clipboard() -> Result<String, String> {
    let mut clipboard = Clipboard::new().map_err(|e| format!("Failed to access clipboard: {}", e))?;
    clipboard
        .get_text()
        .map_err(|e| format!("Failed to read clipboard: {}", e))
}
