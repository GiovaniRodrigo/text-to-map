# Implementation Plan: Clean and Segment Text

**Branch**: `003-clean-segment-text` | **Date**: 2026-06-04 | **Spec**: [spec.md](file:///home/giovani/Documents/projects/text-map/specs/003-clean-segment-text/spec.md)

**Input**: Feature specification from `/specs/003-clean-segment-text/spec.md`

## Summary
Add a multi-step Wizard flow (`Input` -> `Clean & Segment` -> `Review Relationships` -> `Generate Canvas`) when segmenting raw text into maps. The system calls Gemini to clean and segment the text and relationships in a single pass, falling back to local paragraph-splitting and sequential edge linking if offline/API fails. The user can review, edit, add, delete, or merge segments and relationships before the final map renders.

## Technical Context

**Language/Version**: JavaScript (ES2022+), React 18+

**Primary Dependencies**: `react`, `reactflow`, `@reactflow/dagre`, `d3-hierarchy`, `@google/generative-ai`, `tailwindcss`

**Storage**: React Application State (in-memory)

**Testing**: Vitest (unit tests for text segmentation and relationship operations)

**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge)

**Project Type**: single-page-web-app

**Performance Goals**: Local segmentation execution under 100ms, AI segmentation completion under 5s, transition step lag under 16ms.

**Constraints**: API failure graceful degradation, unique segment ID generation, automatically cascade relationship deletions when deleting a segment.

**Scale/Scope**: Support editing up to 50 segments and 75 relationships.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Requirement | Status | Verification Method |
| --- | --- | --- | --- |
| I. Hybrid Text-to-Graph Conversion | Support parsing outline formats and AI extraction with local paragraph splitting fallback | PASS | Unit tests for local parser and mock helper, manual validation |
| II. Multi-Layout Organization | Recalculate layout dynamically when loading finalized map | PASS | Verify Dagre/D3 force layout toggling |
| III. Explanatory Context Details | Store description context in collapsible details panel | PASS | Ensure selected node details render side panel |
| IV. Context-Driven Node Decoration | Style nodes visually based on their categories | PASS | Validate visual border classes matching categories |
| V. Zoomable, Interactive Canvas | Zoom, pan, and drag controls functional | PASS | Validate React Flow interaction on generated nodes |

## Project Structure

### Documentation (this feature)

```text
specs/003-clean-segment-text/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    ├── README.md
    └── gemini-schema.json
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ControlPanel.jsx      # Wizard layout and controllers
│   ├── Canvas.jsx            # React Flow canvas
│   ├── DetailsPanel.jsx      # Sidebar details panel
│   ├── SegmentEditor.jsx     # [NEW] Grid of editable segment cards
│   └── RelationshipEditor.jsx# [NEW] List/table of editable relations
├── services/
│   └── gemini.js             # Extend with segmentTextWithAI API call
├── utils/
│   └── segmentParser.js      # [NEW] Local fallback parser
├── App.jsx                   # Central wizard state management
├── index.css                 # Glassmorphic style definitions
tests/
└── unit/
    └── segmentation.test.js  # [NEW] Unit tests for local parsing and edit state helpers
```

**Structure Decision**: Option 1: Single project. Components and utils will reside inside the main `src/` directory.

## Complexity Tracking

*No violations identified. Design adheres strictly to project principles.*
