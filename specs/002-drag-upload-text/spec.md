# Feature Specification: Drag/Upload Text

**Feature Branch**: `002-drag-upload-text`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "drag/upload text"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Drag and Drop File Selection (Priority: P1)

As a user with text or outline files saved locally, I want to drag and drop a plain text file directly onto the source input area to quickly load my content without copy-pasting.

**Why this priority**: It is the core interaction method for the drag-and-drop capability.

**Independent Test**: Drag a valid text file containing a Mermaid diagram over the textarea, release it, and verify that the textarea populates with the file's text contents.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** I drag a file over the source input textarea, **Then** the textarea displays a prominent drag-and-drop overlay encouraging me to release the file.
2. **Given** I drag a file over the input area, **When** I release the file (drop), **Then** the overlay disappears and the textarea is populated with the exact text content of the file.
3. **Given** I drag a file over the input area, **When** I drag it out of the textarea boundaries without releasing it, **Then** the drag-and-drop overlay disappears and the previous textarea content is preserved.

---

### User Story 2 - File Upload via Button (Priority: P2)

As a user who prefers standard file selectors, I want to click a dedicated "Upload file" button to select a plain text file from my system's file browser and load its content.

**Why this priority**: Serves as an essential accessibility and compatibility fallback for users or devices where drag-and-drop is not convenient.

**Independent Test**: Click the upload button, select a valid file, and verify the text is loaded into the textarea.

**Acceptance Scenarios**:

1. **Given** the Control Panel is visible, **When** I click the "Upload file" icon/button at the top-right of the input area, **Then** the system opens the native file explorer filtered for plain text files.
2. **Given** the file explorer is open, **When** I select a valid text file, **Then** the file contents are loaded into the textarea.

---

### User Story 3 - File Validation and Size Limits (Priority: P3)

As a user loading files, I want the system to check that my file is within size limits (<= 100KB) and is a valid text format, so that I don't cause performance issues or load binary/unreadable data.

**Why this priority**: Ensures application stability, prevents browser hangs, and guides the user with clear error feedback.

**Independent Test**: Try dropping a 200KB file or a binary image file and verify that a clear error message is displayed and the textarea remains unchanged.

**Acceptance Scenarios**:

1. **Given** a file larger than 100KB, **When** I drop it or select it via the upload button, **Then** the system displays an error alert indicating the file exceeds the 100KB limit.
2. **Given** a non-text binary file, **When** I drop or upload it, **Then** the system displays an error alert and does not change the textarea.

---

### Edge Cases

- **Drag and Drop of Text Snippets**: If the user highlights text from another browser window and drags the text itself (rather than a file) into the textarea, the default browser text insert behavior should occur normally without showing file upload overlays.
- **Empty Files**: If the user drops an empty text file, the system should show a warning or clear the input area, prompting that the file contains no text.
- **Multiple Files**: If the user drags and drops multiple files at once, the system should only parse the first file and display a warning toast/banner about ignoring the extra files.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST detect when a file is dragged over the source text area and render a dynamic, visually distinct drop-zone overlay.
- **FR-002**: The system MUST support dropping plain text files (`.txt`, `.md`, `.mermaid`, `.json`, etc.) onto the drop-zone.
- **FR-003**: The system MUST provide an "Upload file" icon/button at the top-right of the source text area.
- **FR-004**: The system MUST trigger the native file selection dialog when the "Upload file" button is clicked.
- **FR-005**: The system MUST read the contents of the dropped or uploaded file and replace the current textarea value with the file contents.
- **FR-006**: The system MUST validate that the file size does not exceed 100KB (102,400 bytes).
- **FR-007**: The system MUST validate that the file is a readable plain text format.
- **FR-008**: The system MUST display a clear error message/alert if the file is invalid or exceeds the size limit.
- **FR-009**: The system MUST NOT auto-trigger map generation after a file is successfully loaded, leaving the user to click "Generate Map" manually.

### Key Entities *(include if feature involves data)*

- **UploadedFile**: Represents a file selected by the user. Attributes: `name` (string), `size` (number, bytes), `type` (string, mime-type), `content` (string, decoded text).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dropping or selecting a valid file of up to 100KB loads and displays its text content in the textarea in under 100 milliseconds.
- **SC-002**: Dragging a file over the textarea displays the drop-zone overlay instantly (under 50 milliseconds).
- **SC-003**: Error alerts for invalid files or files exceeding the 100KB limit are displayed within 100 milliseconds of the drop/upload action.

## Assumptions

- Files are encoded in UTF-8 or standard ASCII text.
- Drag-and-drop is supported by the user's browser (HTML5 Drag and Drop API).
- Mobile devices may not support drag-and-drop but can use the file upload button.
