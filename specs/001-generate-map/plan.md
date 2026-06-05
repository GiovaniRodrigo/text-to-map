# Implementation Plan: Generate Map

**Branch**: `001-generate-map` | **Date**: 2026-06-04 | **Spec**: [spec.md](file:///home/giovani/Documents/projects/text-map/specs/001-generate-map/spec.md)

**Input**: Feature specification from `/specs/001-generate-map/spec.md`

## Summary
The goal is to implement the "Generate Map" feature which translates user text input (structured or unstructured) into a visual interactive map using React Flow.
The system will:
1. Detect input structure automatically. If it is valid Mermaid code or a Markdown outline, parse it locally.
2. If it is raw unstructured text, use the Gemini API to extract nodes, categories, descriptions, and relationships.
3. Layout nodes dynamically (Dagre for Hierarchical, D3 for Mind Map) and display the interactive map on a zoomable, pannable React Flow canvas.
4. Show a collapsible right-hand details panel when a node is hovered or selected.

## Technical Context

**Language/Version**: Javascript (ES6+) / React 18+

**Primary Dependencies**: `reactflow`, `dagre`, `d3-hierarchy`, `@google/generative-ai`, `tailwindcss`, `vite`, `vitest`

**Storage**: React Application State (in-memory, local state)

**Testing**: Vitest (unit tests for local parsers, layout utilities, and AI extraction mapping)

**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge)

**Project Type**: single-page-web-app

**Performance Goals**: Local parsing under 200ms; layout recalculation under 100ms; canvas zoom/pan rendering at 60 FPS.

**Constraints**: API calls completed or mock-fallback in under 5 seconds; fully offline-capable for structured formats.

**Scale/Scope**: Interactive render support for up to 100 nodes and 150 edges.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Requirement | Status | Verification Method |
| --- | --- | --- | --- |
| I. Hybrid Conversion | Parse Mermaid/Markdown locally; use Gemini for raw text | PASS | Unit tests on parsers and API schema transformer |
| II. Multi-Layout | Recalculate node positions for Dagre and D3-hierarchy | PASS | Unit tests on layout algorithms and responsive render |
| III. Explanatory Details | Side details panel on node hover/selection | PASS | Component validation in browser |
| IV. Dynamic Decoration | Styles/categories mapped to nodes (concept/action/etc.) | PASS | CSS styles and node attributes checked in render |
| V. Zoomable Canvas | Pan, zoom, and drag controls using React Flow | PASS | Manual canvas interaction validation |

## Project Structure

### Documentation (this feature)

```text
specs/001-generate-map/
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
│   ├── Canvas.jsx       # Zoomable React Flow Canvas
│   ├── ControlPanel.jsx # Input text area & layout selector
│   └── DetailsPanel.jsx # Collapsible right panel for node details
├── services/            # API services
│   └── gemini.js        # Gemini API client / mocked fallback helper
├── utils/               # Parsers and layout logic
│   ├── layout.js        # Dagre and D3 layout calculators
│   ├── markdown.js      # Local Markdown parser
│   └── mermaid.js       # Local Mermaid parser
├── App.jsx              # Main App entrypoint
├── index.css            # Styling and Tailwind configuration
└── main.jsx             # React DOM renderer
tests/                   # Testing directories
├── layout.test.js       # Layout recalculation tests
├── parsing.test.js      # Markdown and Mermaid parser tests
└── service.test.js      # API service mapping tests
```

**Structure Decision**: Single React web application project scaffolded in the root folder with Vite, featuring `src/` for source code and `tests/` for unit tests.

## Complexity Tracking

*No violations identified.*
