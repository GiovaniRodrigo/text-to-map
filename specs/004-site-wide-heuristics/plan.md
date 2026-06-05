# Implementation Plan: Site-Wide Heuristics

**Branch**: `004-site-wide-heuristics` | **Date**: 2026-06-04 | **Spec**: [spec.md](file:///home/giovani/Documents/projects/text-map/specs/004-site-wide-heuristics/spec.md)

**Input**: Feature specification from `/specs/004-site-wide-heuristics/spec.md`

## Summary
Add client-side heuristics validation checks (orphans, cycles, self-loops, category alignment checks) to the concept map. The validation runs automatically in a debounced hook when nodes or edges change. Results are displayed in a collapsible "Heuristics" tab inside the right-hand panel, alongside a floating `⚠️ [N] Issues` status badge. Clicking an issue focuses and pulses the target elements on the interactive canvas.

## Technical Context

**Language/Version**: JavaScript (ES2022+), React 18+

**Primary Dependencies**: `react`, `reactflow`, `@reactflow/dagre`, `d3-hierarchy`, `tailwindcss`

**Storage**: React Application State (in-memory)

**Testing**: Vitest (unit tests for heuristics functions)

**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge)

**Project Type**: single-page-web-app

**Performance Goals**: Heuristics evaluation on up to 100 elements in under 10ms; viewport-focus animation lag under 16ms.

**Constraints**: Run client-side; debounce evaluations by 300ms to preserve UI performance; handle empty states gracefully.

**Scale/Scope**: Support checking up to 100 nodes/edges in real time.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Requirement | Status | Verification Method |
| --- | --- | --- | --- |
| I. Hybrid Text-to-Graph Conversion | Validates both text content and visual edges, ensuring semantic alignment | PASS | Unit tests for category keyword matching, manual validation |
| II. Multi-Layout Organization | Highlighted elements are compatible with all layouts | PASS | Verify highlighting in both hierarchical and force layouts |
| III. Explanatory Context Details | Tab integration in right details panel keeps context cohesive | PASS | Ensure DetailsPanel renders tabs cleanly |
| IV. Context-Driven Node Decoration | Pulse visual decoration applied to violating nodes | PASS | Inspect custom CSS class on canvas nodes |
| V. Zoomable, Interactive Canvas | Focus viewport coordinates centered on target elements | PASS | Test panning/zooming functions upon clicking issue |

## Project Structure

### Documentation (this feature)

```text
specs/004-site-wide-heuristics/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    └── validation-service.md
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── DetailsPanel.jsx      # Modify to support tab selection & heuristics tab
│   ├── HeuristicsPanel.jsx   # [NEW] Panel detailing the violations list
│   └── HeuristicsBadge.jsx   # [NEW] Floating status badge (e.g. ⚠️ 3 Issues)
├── utils/
│   └── heuristics.js         # [NEW] Graph algorithms and text validation functions
├── App.jsx                   # Add debounced validation loop and state propagation
├── index.css                 # Define .pulse-highlight class for temporary flashing
tests/
└── unit/
    └── heuristics.test.js    # [NEW] Unit tests for heuristics functions
```

**Structure Decision**: Option 1: Single project. Components and utils will reside inside the main `src/` directory.

## Complexity Tracking

*No violations identified. Design adheres strictly to project principles.*
