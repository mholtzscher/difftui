// Theme abstraction for difftui
// Currently using Catppuccin Mocha palette

use ratatui::style::Color;

#[allow(dead_code)]
pub struct Theme {
    // Base colors
    pub base: Color,
    pub mantle: Color,
    pub crust: Color,
    pub surface0: Color,
    pub surface1: Color,
    pub surface2: Color,

    // Text colors
    pub text: Color,
    pub subtext0: Color,
    pub subtext1: Color,
    pub overlay0: Color,
    pub overlay1: Color,
    pub overlay2: Color,

    // Accent colors
    pub blue: Color,
    pub lavender: Color,
    pub sapphire: Color,
    pub sky: Color,
    pub teal: Color,
    pub green: Color,
    pub yellow: Color,
    pub peach: Color,
    pub maroon: Color,
    pub red: Color,
    pub mauve: Color,
    pub pink: Color,
    pub flamingo: Color,
    pub rosewater: Color,

    // Semantic colors
    pub primary: Color,
    pub secondary: Color,
    pub success: Color,
    pub warning: Color,
    pub error: Color,

    // Diff-specific colors
    pub diff_added: Color,
    pub diff_added_bg: Color,
    pub diff_removed: Color,
    pub diff_removed_bg: Color,
    pub diff_context: Color,
    pub diff_context_bg: Color,

    // UI element colors
    pub border: Color,
    pub border_focused: Color,
}

// Catppuccin Mocha palette
pub const THEME: Theme = Theme {
    // Base colors
    base: Color::Rgb(27, 27, 41),
    mantle: Color::Rgb(24, 24, 37),
    crust: Color::Rgb(17, 17, 27),
    surface0: Color::Rgb(49, 50, 68),
    surface1: Color::Rgb(69, 71, 90),
    surface2: Color::Rgb(88, 91, 112),

    // Text colors
    text: Color::Rgb(205, 214, 244),
    subtext0: Color::Rgb(166, 173, 200),
    subtext1: Color::Rgb(186, 194, 222),
    overlay0: Color::Rgb(108, 112, 134),
    overlay1: Color::Rgb(127, 132, 156),
    overlay2: Color::Rgb(147, 153, 178),

    // Accent colors
    blue: Color::Rgb(137, 180, 250),
    lavender: Color::Rgb(180, 190, 254),
    sapphire: Color::Rgb(116, 199, 236),
    sky: Color::Rgb(137, 220, 235),
    teal: Color::Rgb(148, 226, 213),
    green: Color::Rgb(166, 227, 161),
    yellow: Color::Rgb(249, 226, 175),
    peach: Color::Rgb(250, 179, 135),
    maroon: Color::Rgb(235, 160, 172),
    red: Color::Rgb(243, 139, 168),
    mauve: Color::Rgb(203, 166, 247),
    pink: Color::Rgb(245, 194, 231),
    flamingo: Color::Rgb(242, 205, 205),
    rosewater: Color::Rgb(245, 224, 220),

    // Semantic colors
    primary: Color::Rgb(137, 180, 250),
    secondary: Color::Rgb(203, 166, 247),
    success: Color::Rgb(166, 227, 161),
    warning: Color::Rgb(249, 226, 175),
    error: Color::Rgb(243, 139, 168),

    // Diff-specific colors
    diff_added: Color::Rgb(166, 227, 161),
    diff_added_bg: Color::Rgb(30, 58, 47),
    diff_removed: Color::Rgb(243, 139, 168),
    diff_removed_bg: Color::Rgb(62, 42, 53),
    diff_context: Color::Rgb(205, 214, 244),
    diff_context_bg: Color::Rgb(30, 30, 46),

    // UI element colors
    border: Color::Rgb(69, 71, 90),
    border_focused: Color::Rgb(137, 180, 250),
};
