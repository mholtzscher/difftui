use similar::{ChangeTag, TextDiff};

/// Represents a line in the diff output
#[derive(Debug, Clone)]
pub struct DiffLine {
    pub tag: ChangeTag,
    pub content: String,
}

/// Generate a diff between original and modified text
/// Returns a vector of DiffLines for rendering
pub fn generate_diff(original: &str, modified: &str) -> Vec<DiffLine> {
    let diff = TextDiff::from_lines(original, modified);
    let mut lines = Vec::new();

    for change in diff.iter_all_changes() {
        lines.push(DiffLine {
            tag: change.tag(),
            content: change.to_string(),
        });
    }

    lines
}

/// Generate a unified diff string (for display purposes)
#[allow(dead_code)]
pub fn generate_unified_diff(original: &str, modified: &str) -> String {
    let diff = TextDiff::from_lines(original, modified);
    diff.unified_diff()
        .context_radius(3)
        .header("original", "modified")
        .to_string()
}

/// Check if there are any changes between original and modified text
pub fn has_changes(original: &str, modified: &str) -> bool {
    original != modified
}

/// Check if either text has content
pub fn has_content(original: &str, modified: &str) -> bool {
    !original.is_empty() || !modified.is_empty()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_has_changes() {
        assert!(has_changes("hello", "world"));
        assert!(!has_changes("same", "same"));
    }

    #[test]
    fn test_has_content() {
        assert!(has_content("hello", ""));
        assert!(has_content("", "world"));
        assert!(has_content("hello", "world"));
        assert!(!has_content("", ""));
    }

    #[test]
    fn test_generate_diff() {
        let lines = generate_diff("hello\n", "world\n");
        assert!(!lines.is_empty());
    }
}
