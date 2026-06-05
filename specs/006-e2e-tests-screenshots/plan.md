# Implementation Plan: E2E Tests with Screenshots

**Branch**: `006-e2e-tests-screenshots` | **Date**: 2026-06-04 | **Spec**: [spec.md](file:///home/giovani/Documents/projects/text-map/specs/006-e2e-tests-screenshots/spec.md)

**Input**: Feature specification from `/specs/006-e2e-tests-screenshots/spec.md`

## Summary

Integrate Playwright as the E2E testing framework, configured to run Chromium in headless mode. The runner automatically launches the Vite dev server prior to tests. All Gemini API calls to `https://generativelanguage.googleapis.com/**` are intercepted and mocked. The suite executes tests covering the entire user journey (Initial state, Mermaid parsing, Markdown parsing, AI generation, details panel integration, layout toggling, and heuristics highlights) and captures corresponding PNG screenshots into the `tests/e2e/screenshots/` folder.

## Technical Context

**Language/Version**: JavaScript (ES2022+), Node.js (v18+)

**Primary Dependencies**: `@playwright/test`, `playwright`

**Storage**: Local Filesystem (`tests/e2e/screenshots/`)

**Testing**: Playwright Test Runner

**Target Platform**: Headless Chromium

**Project Type**: Web Application Testing

**Performance Goals**: Complete E2E execution under 15 seconds; screenshot capture latency under 500ms.

**Constraints**: Zero network calls to the actual Gemini API; automate Vite dev server start/stop during testing.

**Scale/Scope**: 7 specific stages captured as high-quality PNG screenshots.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Requirement | Status | Verification Method |
| --- | --- | --- | --- |
| I. Hybrid Text-to-Graph Conversion | E2E tests cover both local (Mermaid/Markdown) and mock AI generation flows. | PASS | Run tests and inspect Mermaid, Markdown, and mock AI screenshots. |
| II. Multi-Layout Organization | E2E tests toggle layout styles and capture layout recalculation. | PASS | Run tests and inspect layout-switch screenshot. |
| III. Explanatory Context Details | E2E tests select nodes and capture details panel content. | PASS | Run tests and inspect node-selection screenshot. |
| IV. Context-Driven Node Decoration | E2E tests trigger heuristics violations and capture warnings. | PASS | Run tests and inspect heuristics screenshot. |
| V. Zoomable, Interactive Canvas | E2E tests verify canvas rendering and interact with canvas elements. | PASS | Run tests and ensure no browser crashes or canvas rendering errors. |

## Project Structure

### Documentation (this feature)

```text
specs/006-e2e-tests-screenshots/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    ├── cli.md
    └── api-mock.json
```

### Source Code & Test Files (repository root)

```text
playwright.config.js       # [NEW] Playwright configuration file
package.json               # Modify to add "test:e2e" script
tests/
└── e2e/                   # [NEW] E2E test folder
    ├── text-map.spec.js   # [NEW] Playwright E2E test suite
    └── screenshots/       # [NEW] Directory for captured screenshots
```

**Structure Decision**: E2E test folder created under `tests/e2e/` to keep test modules clean and separate from unit tests. Playwright config placed at repository root.

## Complexity Tracking

*No violations identified. Design adheres strictly to project principles.*
