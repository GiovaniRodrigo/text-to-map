# Tasks: Drag/Upload Text

**Input**: Design documents from `/specs/002-drag-upload-text/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- File paths are specified for each task.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project verification and setup

- [X] T001 Verify project environment and run existing test suite with `npm test`
- [X] T002 Create a mock file data helper in `tests/file-upload.test.js` to simulate DragEvents and File objects for unit testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that must be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete

- [X] T003 Create file reader and validation helpers in `src/utils/fileUpload.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Drag and Drop File Selection (Priority: P1) 🎯 MVP

**Goal**: Enable users to drag and drop plain text files onto the textarea to load text content.

**Independent Test**: Drag a local file over the textarea, release it, and verify that the textarea populates with the file's text contents.

### Tests for User Story 1
- [X] T004 [P] [US1] Write unit tests in `tests/file-upload.test.js` verifying FileReader logic and drag event handler state transitions

### Implementation for User Story 1
- [X] T005 [US1] Add drag event handlers (`onDragOver`, `onDragEnter`, `onDragLeave`, `onDrop`) and state `isDragging` in `src/components/ControlPanel.jsx`
- [X] T006 [US1] Render a styled absolute glassmorphic drop overlay over the textarea in `src/components/ControlPanel.jsx` when `isDragging` is true
- [X] T007 [US1] Implement `onDrop` handler to read dropped file content and update input state in `src/components/ControlPanel.jsx` using the `src/utils/fileUpload.js` helper

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - File Upload via Button (Priority: P2)

**Goal**: Click a dedicated "Upload file" button to select a file from native browser explorer and load content.

**Independent Test**: Click upload icon, select a text file, and verify text loads.

### Tests for User Story 2
- [X] T008 [P] [US2] Write unit tests in `tests/file-upload.test.js` verifying native file input selection triggers change handlers and populates input area state

### Implementation for User Story 2
- [X] T009 [US2] Add the "Upload file" icon button and a hidden `<input type="file" />` in the top-right label of `src/components/ControlPanel.jsx`
- [X] T010 [US2] Implement `onChange` handler for file input to read the file and update `rawInput` in `src/components/ControlPanel.jsx` using the `src/utils/fileUpload.js` helper

**Checkpoint**: User Stories 1 and 2 are both functional and testable.

---

## Phase 5: User Story 3 - File Validation and Size Limits (Priority: P3)

**Goal**: Limit file size to 100KB and verify text format, displaying validation errors.

**Independent Test**: Drag/upload a file > 100KB or a binary PNG and verify that the file is rejected and an error alert is displayed.

### Tests for User Story 3
- [X] T011 [P] [US3] Write unit tests in `tests/file-upload.test.js` verifying size validation (rejecting >100KB) and MIME type validation

### Implementation for User Story 3
- [X] T012 [US3] Implement validation functions inside `src/utils/fileUpload.js` to check file size and extension/MIME type
- [X] T013 [US3] Update drop and upload handlers in `src/components/ControlPanel.jsx` to execute validation, reject invalid files, and pass error message to the parent error state

**Checkpoint**: All user stories are fully complete and validated.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Styling adjustments, docs, and final verification

- [X] T014 [P] Verify UI layout responsiveness and glassmorphism styling of the drop overlay in `src/components/ControlPanel.jsx`
- [X] T015 Run full manual validation scenario checklists as detailed in `specs/002-drag-upload-text/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion.
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion (can run in parallel with US1).
- **User Story 3 (Phase 5)**: Depends on Phase 2 and respective story implementations (US1/US2) completion.
- **Polish (Phase 6)**: Depends on US1, US2, and US3 completion.

### Parallel Opportunities

- Unit test setup tasks (`T004`, `T008`, `T011`) can be prepared in parallel.
- Validation implementation (`T012`) can run in parallel with general story setups.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup and Foundational utilities.
2. Implement and test Drag-and-Drop capability (US1).
3. Validate drag-and-drop behaves correctly.

### Incremental Delivery
1. Deliver MVP (US1).
2. Integrate file upload button (US2).
3. Add strict size/type validations and error visual handling (US3).
4. Run final end-to-end verification.
