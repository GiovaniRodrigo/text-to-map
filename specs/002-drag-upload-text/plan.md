# Implementation Plan: Drag/Upload Text

**Branch**: `002-drag-upload-text` | **Date**: 2026-06-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-drag-upload-text/spec.md`

## Summary

The goal is to implement the "Drag/Upload Text" feature, enabling users to load source text content (Mermaid diagrams, Markdown outlines, or raw text) into the application by:
1. Dragging and dropping plain text files directly onto the source textarea, triggering a dynamic visual overlay.
2. Clicking a new "Upload file" icon/button at the top-right of the input area to select a file via the browser's native file explorer.

The system will validate files against size (<= 100KB) and type constraints, display clear error feedback, and replace the textarea content without auto-triggering graph generation.

## Technical Context

**Language/Version**: Javascript (ES6+) / React 19+

**Primary Dependencies**: `react`, `react-dom`, `tailwindcss`, `vite`, `vitest`

**Storage**: Browser FileReader API / React Application State (in-memory)

**Testing**: Vitest (unit tests for file upload validation and content extraction)

**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge)

**Project Type**: single-page-web-app

**Performance Goals**: Text loading under 100ms, drag overlay transition under 50ms.

**Constraints**: File size limit of 100KB (102,400 bytes), plain text format validation.

**Scale/Scope**: HTML5 Drag and Drop API and standard browser file inputs.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Requirement | Status | Verification Method |
| --- | --- | --- | --- |
| I. Input Accessibility | Support drag/drop and file dialog fallback | PASS | Manual and automated component validation |
| II. Clear Error Feedback | Validation alerts for large/invalid files | PASS | Unit tests on validation helper |
| III. No Auto-Trigger | Load text into input area without immediately calling parser/Gemini | PASS | Component test verifying no handler is called on load |

## Project Structure

### Documentation (this feature)

```text
specs/002-drag-upload-text/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Specification Quality Checklist
```

### Source Code (repository root)

```text
src/
├── assets/              # Static assets and icons
├── components/          # React components
│   ├── Canvas.jsx
│   ├── ControlPanel.jsx # Will be updated to include drop zone overlays and file input button
│   ├── DetailsPanel.jsx
│   └── CustomNode.jsx
├── services/
│   └── gemini.js
├── utils/
│   ├── layout.js
│   ├── markdown.js
│   └── mermaid.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
tests/
├── file-upload.test.js  # [NEW] Tests for file loading, validation, and encoding checks
├── layout.test.js
├── parsing.test.js
└── service.test.js
```

**Structure Decision**: Single React web application scaffolded in the root folder with Vite.

## Complexity Tracking

*No violations identified.*

