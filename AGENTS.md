# AGENTS.md

## Build & Lint Commands
- `bun run dev` - Run development server with hot reload
- `bun run build` - Build the project
- `bun run lint` - Check for linting/formatting issues
- `bun run lint:fix` - Auto-fix linting/formatting issues
- No test suite configured

## Code Style (Biome)
- **Indentation**: Tabs
- **Quotes**: Double quotes for strings
- **Imports**: Auto-organized by Biome; use path aliases (`@/*`, `@components/*`, `@services/*`, etc.)
- **Types**: Import types with `import type { ... }`; strict TypeScript with `noUncheckedIndexedAccess`

## Architecture
- **Framework**: OpenTUI (`@opentui/core`) with SolidJS binding (`@opentui/solid`) for terminal UI rendering
- **Structure**: Components in `src/components/`, views in `src/views/`, services in `src/services/`
- **Patterns**: Use signals (`createSignal`) for state; define interfaces for service objects

## Conventions
- PascalCase for components/types, camelCase for functions/variables
- Export interfaces alongside implementations (e.g., `DiffService` interface with `diffService` object)
- JSDoc comments for public service methods
