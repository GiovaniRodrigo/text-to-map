# Tasks: Site-Wide Heuristics

**Input**: Design documents from `/specs/004-site-wide-heuristics/`

**Prerequisites**: [plan.md](file:///home/giovani/Documents/projects/text-map/specs/004-site-wide-heuristics/plan.md) (required), [spec.md](file:///home/giovani/Documents/projects/text-map/specs/004-site-wide-heuristics/spec.md) (required for user stories), [research.md](file:///home/giovani/Documents/projects/text-map/specs/004-site-wide-heuristics/research.md), [data-model.md](file:///home/giovani/Documents/projects/text-map/specs/004-site-wide-heuristics/data-model.md), [contracts/validation-service.md](file:///home/giovani/Documents/projects/text-map/specs/004-site-wide-heuristics/contracts/validation-service.md)

**Tests**: Unit tests for heuristics functions will be written in `tests/unit/heuristics.test.js` to prevent regressions.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Set up styles and core highlight attributes

- [x] T001 Create pulsing highlight CSS styling for nodes and edges in `src/index.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core graph and text heuristics validator functions

- [x] T002 Implement `validateMap` function with orphan, self-loop, cycle, and category check logic in `src/utils/heuristics.js`
- [x] T003 [P] Create initial unit test file `tests/unit/heuristics.test.js` with basic assertion test blocks

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Map Structure and Quality Analysis (Priority: P1) 🎯 MVP

**Goal**: Implement real-time client-side graph verification and canvas element highlight integration.

**Independent Test**: Paste unlinked/cyclic code inputs, trigger the validation hook, and verify that target elements flash on the canvas when clicked.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Add exhaustive test assertions for orphans, loops, cycles, and category validations in `tests/unit/heuristics.test.js`

### Implementation for User Story 1

- [x] T005 [US1] Add a debounced validation effect hook in `src/App.jsx` to update violations state on changes
- [x] T006 [US1] Modify `src/components/Canvas.jsx` to support target element highlighting classes
- [x] T007 [US1] Add centering viewport camera focus callback on node click in `src/App.jsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Real-Time Validation Panel (Priority: P2)

**Goal**: Show floating health badge indicator and detailed list tab on the right sidebar panel.

**Independent Test**: Confirm floating badge visibility, click to open heuristics sidebar, and verify dynamically updated items count.

### Implementation for User Story 2

- [x] T008 [P] [US2] Create the heuristics violation list item layout in `src/components/HeuristicsPanel.jsx`
- [x] T009 [P] [US2] Create floating badge indicating issues summary in `src/components/HeuristicsBadge.jsx`
- [x] T010 [US2] Implement tab switching navigation (Details vs Heuristics) in `src/components/DetailsPanel.jsx`
- [x] T011 [US2] Update parent state in `src/App.jsx` to render the heuristics badge and pass state to DetailsPanel

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, validation, and documentation.

- [x] T012 Update documentation/README.md with heuristics overview
- [x] T013 Run manual validation scenarios from `specs/004-site-wide-heuristics/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User Story 1 (P1) is MVP and should be completed first.
  - User Story 2 (P2) depends on having the highlights and validations running (US1).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### Parallel Opportunities

- T003 can be worked on in parallel with T002.
- Once Phase 2 is complete, T008 and T009 can be built in parallel.

---

## Parallel Example: User Story 2

```bash
# Launch components creation in parallel:
Task: "Create the heuristics violation list item layout in src/components/HeuristicsPanel.jsx"
Task: "Create floating badge indicating issues summary in src/components/HeuristicsBadge.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify that the algorithms calculate validations and that canvas highlighting works.

### Incremental Delivery

1. Foundation ready.
2. Add User Story 1 -> Test locally -> MVP complete.
3. Add User Story 2 -> Integration complete -> Validate end-to-end.
