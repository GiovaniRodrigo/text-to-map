# Tasks: Generate Map

**Input**: Design documents from `/specs/001-generate-map/`

**Prerequisites**: [plan.md](file:///home/giovani/Documents/projects/text-map/specs/001-generate-map/plan.md) (required), [spec.md](file:///home/giovani/Documents/projects/text-map/specs/001-generate-map/spec.md) (required for user stories), [research.md](file:///home/giovani/Documents/projects/text-map/specs/001-generate-map/research.md), [data-model.md](file:///home/giovani/Documents/projects/text-map/specs/001-generate-map/data-model.md), [contracts/gemini-schema.json](file:///home/giovani/Documents/projects/text-map/specs/001-generate-map/contracts/gemini-schema.json)

**Tests**: Test tasks are included as requested by the test-first design gate in the project constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

## Path Conventions

- Single project React layout: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize React + Vite project in the repository root
- [x] T002 Install frontend dependencies (`reactflow`, `dagre`, `d3-hierarchy`, `@google/generative-ai`, `tailwindcss`, `postcss`, `autoprefixer`)
- [x] T003 [P] Configure Tailwind CSS (`tailwind.config.cjs` and `postcss.config.js` in root) and import directives in `src/index.css`
- [x] T004 [P] Configure Vitest testing configuration (`vite.config.js` and test setup files in root)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement canvas utility layout engine in `src/utils/layout.js` (positions nodes using Dagre and D3-hierarchy algorithms)
- [x] T006 [P] Create custom node registration wrapper in `src/components/Canvas.jsx`
- [x] T007 Setup collapsible details panel interface layout shell in `src/components/DetailsPanel.jsx`
- [x] T008 [P] Define core modern glassmorphic theme styling variables and node color schemas in `src/index.css`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Local Parsing of Structured Formats (Priority: P1) 🎯 MVP

**Goal**: Parse valid Mermaid flowchart code or indented Markdown outlines locally and render them instantly on the React Flow canvas.

**Independent Test**: Paste a valid Mermaid code block or indented Markdown outline, click Generate Map, and verify a correctly structured graph renders locally on the canvas in under 200ms without sending API calls.

### Tests for User Story 1
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T009 [P] [US1] Create local parsing unit tests for Mermaid and Markdown parsers in `tests/parsing.test.js`
- [x] T010 [P] [US1] Create layout recalculation unit tests for Dagre layout positioning in `tests/layout.test.js`

### Implementation for User Story 1

- [x] T011 [US1] Implement Mermaid string parser in `src/utils/mermaid.js` to extract nodes and edges from simple flowcharts
- [x] T012 [US1] Implement Markdown list parser in `src/utils/markdown.js` to construct parent-child nodes from indentations
- [x] T013 [US1] Create parser routing logic in `src/App.jsx` to select parsing method based on input text structure
- [x] T014 [US1] Create input text area and Generate Map button controls in `src/components/ControlPanel.jsx`
- [x] T015 [US1] Integrate control panel inputs, local parsers, and React Flow Canvas in `src/App.jsx` to render the local graph

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP ready)

---

## Phase 4: User Story 2 - AI-Powered Extraction from Raw Text (Priority: P2)

**Goal**: Send unstructured text to the Gemini API, extract nodes, categories, descriptions, and relationships, and render them as a styled graph.

**Independent Test**: Enter a raw narrative paragraph, click Generate Map, verify loading spinner is shown, and check that nodes render with dynamic colors matching their category, opening their detailed description in the side panel on hover/select.

### Tests for User Story 2
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T016 [P] [US2] Create schema validation tests and mock fallback tests for Gemini service mapping in `tests/service.test.js`

### Implementation for User Story 2

- [x] T017 [US2] Implement Gemini API client connection with schema enforcement and mock development fallbacks in `src/services/gemini.js`
- [x] T018 [US2] Implement selected node state and detailed descriptions list in the collapsible panel `src/components/DetailsPanel.jsx`
- [x] T019 [US2] Connect Gemini service wrapper, layout loading states, and category-driven styling node renderers to `src/App.jsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Interactive Canvas & Layout Toggling (Priority: P3)

**Goal**: Toggle layout styles dynamically between Dagre (Hierarchical) and D3 (Mind Map) and interact with the canvas smoothly.

**Independent Test**: Generate any graph, drag nodes, scroll to zoom, toggle layout selection dropdown, and verify node positions recalculate dynamically.

### Implementation for User Story 3

- [x] T020 [US3] Add layout selection dropdown/toggle buttons to the control interface in `src/components/ControlPanel.jsx`
- [x] T021 [US3] Integrate React Flow zoom, pan, and dragging controls on the canvas wrapper in `src/components/Canvas.jsx`
- [x] T022 [US3] Wire layout recalculation triggers and animation states into `src/App.jsx` using `src/utils/layout.js` D3 and Dagre engines

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Polishing UI, animations, error reporting, and finalizing documentation.

- [x] T023 [P] Add CSS transitions, micro-animations, and loading spinners in `src/index.css`
- [x] T024 Add viewport auto-fit/centering handler on new map generation in `src/components/Canvas.jsx`
- [x] T025 [P] Run all automated tests with `npm run test` and complete verification scenarios in [quickstart.md](file:///home/giovani/Documents/projects/text-map/specs/001-generate-map/quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independently testable

### Parallel Opportunities

- All Setup tasks marked `[P]` (T003, T004) can run in parallel
- All Foundational tasks marked `[P]` (T006, T008) can run in parallel
- Once Foundational phase completes:
  - Developer A can work on US1 (T009-T015)
  - Developer B can work on US2 (T016-T019)
  - Developer C can work on US3 (T020-T022)
- Unit tests `[P]` within each story can run in parallel (T009/T010, T016)

---

## Parallel Example: User Story 1

```bash
# Launch test tasks for User Story 1:
Task: "Create local parsing unit tests for Mermaid and Markdown parsers in tests/parsing.test.js"
Task: "Create layout recalculation unit tests for Dagre layout positioning in tests/layout.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test local parser capability on the canvas using custom test code
5. Deploy/Demo the local visual graph generator

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 (Local parsing MVP) → Test → Deploy
3. Add User Story 2 (Gemini AI parsing) → Test → Deploy
4. Add User Story 3 (Multi-layout + canvas interactivity) → Test → Deploy
5. Polish styling and optimize layout recalculation

---

## Notes

- `[P]` tasks = different files, no dependencies
- `[Story]` label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
