# Tasks: Clean and Segment Text

**Input**: Design documents from `/specs/003-clean-segment-text/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included as we have specified testing requirements in the spec and quickstart.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project folders and verify spec workspace files in `specs/003-clean-segment-text/`
- [x] T002 [P] Verify dev server dependencies and scripts in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core parser utilities and API services that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create the local fallback segment parser utility in `src/utils/segmentParser.js`
- [x] T004 [P] Add the `segmentTextWithAI` API function in `src/services/gemini.js` to call the Gemini API with structured JSON output schema
- [x] T005 [P] Define Tailwind and custom CSS glassmorphism styles and border colors for categories in `src/index.css`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Interactive Cleaning and Semantic Segmentation Wizard (Priority: P1) 🎯 MVP

**Goal**: Pasting raw text moves to a "Clean & Segment" screen where users can preview, edit, add, delete, or merge segments.

**Independent Test**: Paste raw text, click "Analyze Text" to switch to Step 2, edit segment text, delete cards, merge cards, and verify changes update the local state.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US1] Create unit tests for local fallback parser and merge/delete helpers in `tests/unit/segmentation.test.js`

### Implementation for User Story 1

- [x] T007 [P] [US1] Create the `SegmentEditor` component in `src/components/SegmentEditor.jsx` to render editable segment cards
- [x] T008 [US1] Update `src/App.jsx` state to support wizard steps, parsing input, editing segments, deleting segments, and merging segments
- [x] T009 [US1] Integrate `SegmentEditor` into `src/App.jsx` to render when wizard step is `'segments'`
- [x] T010 [US1] Add progress navigation indicator at the top of the interface in `src/App.jsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Relationship Extraction and Editing (Priority: P2)

**Goal**: Suggest relationships between segments and allow users to add, edit, or delete these relationships.

**Independent Test**: Navigate to Step 3 "Review Relationships", verify that relationship rows are visible, add a connection, delete a connection, edit labels, and check state.

### Implementation for User Story 2

- [x] T011 [P] [US2] Create the `RelationshipEditor` component in `src/components/RelationshipEditor.jsx` to display and edit relationships in a table/list view
- [x] T012 [US2] Update `src/App.jsx` with handlers to add, delete, and edit relationships, ensuring deleting a segment automatically cascades and deletes related relationships
- [x] T013 [US2] Integrate `RelationshipEditor` into `src/App.jsx` to render when wizard step is `'relationships'`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Map Generation on Interactive Canvas (Priority: P3)

**Goal**: Render the map on the React Flow canvas decorated by categories and layout style.

**Independent Test**: Click "Generate Map" from Step 3, verify that React Flow canvas renders the correct count of nodes and edges, and verify layout transitions.

### Implementation for User Story 3

- [x] T014 [US3] Update `src/App.jsx` to map the finalized segments and relationships into React Flow nodes and edges, applying Dagre/D3 layout
- [x] T015 [US3] Update `src/components/ControlPanel.jsx` to show wizard navigation controls, back buttons, and analyze triggers
- [x] T016 [US3] Add category-based node decoration borders and styling in `src/components/CustomNode.jsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T017 [P] Resolve linting and formatting issues in all modified files
- [ ] T018 Refine visual adjustments, transitions, and loading skeleton states in `src/App.jsx`
- [ ] T019 Run quickstart validation guide scenarios in `specs/003-clean-segment-text/quickstart.md`

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

---

## Parallel Example: User Story 1

```bash
# Run unit tests and setup segment editor component in parallel
Task: "Create unit tests for local fallback parser and merge/delete helpers in tests/unit/segmentation.test.js"
Task: "Create the SegmentEditor component in src/components/SegmentEditor.jsx to render editable segment cards"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
