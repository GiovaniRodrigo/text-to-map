# Implementation Plan: Ad Spaces

**Branch**: `005-ad-spaces` | **Date**: 2026-06-05 | **Spec**: [spec.md](file:///home/giovani/Documents/projects/text-map/specs/005-ad-spaces/spec.md)

**Input**: Feature specification from `/specs/005-ad-spaces/spec.md`

## Summary
Add dynamic, session-dismissible third-party advertisement slots to the application. The slots are visually integrated into the bottom of the left `ControlPanel` and inside the right `DetailsPanel`. Both slots can be dismissed using a close (X) button, which hides them for the duration of the browser session. If third-party scripts/iframes fail to load or are blocked, a beautiful fallback banner (e.g. "Sponsor this project") will render.

## Technical Context

**Language/Version**: JavaScript (ES2022+), React 19+

**Primary Dependencies**: `react`, `reactflow`, `@tailwindcss/vite`, `vitest`, `@playwright/test`

**Storage**: Browser `sessionStorage` (in-memory per session)

**Testing**: Vitest (for utility function unit tests), Playwright (for End-to-End browser tests and UI validation)

**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge)

**Project Type**: single-page-web-app

**Performance Goals**: Ad space render load under 300ms; UI layout reflows/animations under 16ms.

**Constraints**: Handle ad blocking scripts gracefully, align with the premium dark theme (harmonious HSL colors, no stark bright overlays), avoid blocking the canvas space.

**Scale/Scope**: Session-based client state tracking for dismissed ads.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Requirement | Status | Verification Method |
| --- | --- | --- | --- |
| I. Hybrid Text-to-Graph Conversion | Ad slots do not interfere with text parsing or graph mapping engine | PASS | Verify canvas functions properly with ads active |
| II. Multi-Layout Organization | Panel integration (left sidebar and right details) preserves layout organization | PASS | Inspect layout integrity across hierarchical and force layouts |
| III. Explanatory Context Details | Ad inside DetailsPanel opens only when a node is selected, matching context | PASS | Verify ad renders within DetailsPanel dynamically |
| IV. Context-Driven Node Decoration | Ad components are style-isolated and do not decorate/affect canvas nodes | PASS | Ensure CSS/Tailwind classes do not leak onto Canvas |
| V. Zoomable, Interactive Canvas | Sidebar/panel placements preserve canvas viewport space for zooming/panning | PASS | Verify canvas interaction is completely unblocked by ads |

## Project Structure

### Documentation (this feature)

```text
specs/005-ad-spaces/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ControlPanel.jsx      # Modify to embed AdSlot at bottom
│   ├── DetailsPanel.jsx      # Modify to embed AdSlot inside details
│   └── AdSlot.jsx            # [NEW] Reusable component for rendering ad iframe/script/fallback
├── utils/
│   └── adBlocker.js          # [NEW] Utility to detect if ad blockers are active
tests/
├── e2e/
│   └── ad-spaces.spec.js     # [NEW] Playwright E2E tests for ad slots
```

**Structure Decision**: Option 1: Single project. All React components and helper files will reside in the main `src/` directory, and test files in `tests/`.

## Complexity Tracking

*No violations identified. Design adheres strictly to project principles.*
