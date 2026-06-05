# Tasks: E2E Tests with Screenshots

**Input**: Design documents from `/specs/006-e2e-tests-screenshots/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: E2E screenshot validation tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install E2E testing dependencies (@playwright/test) in package.json
- [x] T002 Add E2E test execution script in package.json
- [x] T003 [P] Configure Playwright settings in playwright.config.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create E2E screenshot output folder tests/e2e/screenshots/
- [ ] T005 Initialize basic E2E test shell structure in tests/e2e/text-map.spec.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Local Flowchart Rendering (Priority: P1) 🎯 MVP

**Goal**: Test local rendering paths (Mermaid and Markdown outlines) and capture screenshots of initial states and canvas renders.

**Independent Test**: Verify E2E tests pass for local inputs and that screenshots `01-initial.png`, `02-mermaid.png`, and `03-markdown.png` exist in `tests/e2e/screenshots/`.

### Implementation for User Story 1

- [ ] T006 [US1] Write test for initial blank canvas state in tests/e2e/text-map.spec.js
- [ ] T007 [US1] Write test for local Mermaid flowchart rendering in tests/e2e/text-map.spec.js
- [ ] T008 [US1] Write test for local Markdown tree rendering in tests/e2e/text-map.spec.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Mocked AI Extraction Testing (Priority: P2)

**Goal**: Test AI-powered map generation by mocking Gemini API calls, capturing a screenshot of the generated map and node selection details panel.

**Independent Test**: Intercept network calls and verify that `04-mock-ai.png` and `05-node-selection.png` screenshots exist in `tests/e2e/screenshots/`.

### Implementation for User Story 2

- [ ] T009 [US2] Implement Playwright network interception to mock Gemini API calls in tests/e2e/text-map.spec.js
- [ ] T010 [US2] Write test for AI map generation rendering in tests/e2e/text-map.spec.js
- [ ] T011 [US2] Write test for node selection and details panel rendering in tests/e2e/text-map.spec.js

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Layout Toggling & Heuristics Validation (Priority: P3)

**Goal**: Test layout switching and client-side heuristics validation, capturing screenshots.

**Independent Test**: Verify layout-switch and heuristics warnings screenshots `06-layout-switch.png` and `07-heuristics.png` exist in `tests/e2e/screenshots/`.

### Implementation for User Story 3

- [ ] T012 [US3] Write test for layout toggling to Mind Map in tests/e2e/text-map.spec.js
- [ ] T013 [US3] Write test for client-side heuristics validation rendering in tests/e2e/text-map.spec.js

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T014 Document E2E testing commands and configurations in README.md
- [ ] T015 Run validation scenarios and verify screenshots against quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed).
  - Or sequentially in priority order (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable.
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready
