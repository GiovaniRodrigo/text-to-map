# Feature Specification: Clean and Segment Text

**Feature Branch**: `003-clean-segment-text`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "clean and segmentation text to generate map"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Cleaning and Semantic Segmentation Wizard (Priority: P1)

As a user with raw, unorganized text (such as raw transcripts, articles, or copied notes), I want the system to clean the text and divide it semantically into logical, thematic segments that I can preview, edit, add, delete, or merge before the map is generated, so that I have complete control over the map's structural content.

**Why this priority**: It is the foundation of the interactive step-by-step workflow, enabling user validation and correction of AI-generated content before rendering.

**Independent Test**: Can be tested by pasting raw text, clicking "Analyze Text", and verifying that a list of segment cards is displayed with input fields for editing titles/content, along with "Add", "Delete", and "Merge" controls.

**Acceptance Scenarios**:

1. **Given** the raw text input screen, **When** I click "Analyze Text", **Then** the application calls the analysis engine and displays the "Clean & Segment" screen showing distinct editable segment cards.
2. **Given** the list of segment cards, **When** I edit a segment's Title or Content, **Then** the local application state is updated with the new text.
3. **Given** the list of segment cards, **When** I click "Delete" on a card, **Then** the card is removed from the segments list.
4. **Given** two selected segment cards, **When** I click "Merge", **Then** they are combined into a single segment card with concatenated text.

---

### User Story 2 - Relationship Extraction and Editing (Priority: P2)

As a user reviewing my segmented text, I want the system to automatically suggest relationships (edges) between my segments and allow me to add, edit, or delete these relationships in a table/list view, so that I can define how the concepts connect before drawing the graph.

**Why this priority**: Crucial for enabling rich, interconnected visual maps instead of simple linear node structures, satisfying core principle I (Hybrid Text-to-Graph Conversion).

**Independent Test**: Can be tested by checking that a list of relationships is rendered, and that adding a new relationship or editing a relationship label updates the relationship list state.

**Acceptance Scenarios**:

1. **Given** the reviewed segments, **When** I proceed to the "Review Relationships" screen, **Then** I see a list of suggested relationships showing source segment, connection type/label, and target segment.
2. **Given** the relationship list, **When** I click "Add Relationship", **Then** a new relationship row is created where I can select source and target nodes from dropdowns and type a relationship label.
3. **Given** the relationship list, **When** I click "Delete" on a relationship row, **Then** the relationship is removed from the list.

---

### User Story 3 - Map Generation on Interactive Canvas (Priority: P3)

As a user who has finalized my segments and relationships, I want to click "Generate Map" to instantly render the map on the React Flow canvas, decorated by categories and organized by my chosen layout style, so that I can visually interact with the final result.

**Why this priority**: Completes the end-to-end user journey by transforming the structured tabular data into the final interactive visual graph.

**Independent Test**: Can be tested by clicking "Generate Map" after editing segments and verifying that the exact count of nodes and edges matches the reviewed state.

**Acceptance Scenarios**:

1. **Given** the finalized segments and relationships, **When** I click "Generate Map", **Then** the system renders the React Flow canvas with the specified nodes, visual decorators, and connections.

---

### Edge Cases

- **Gemini API Failure / Offline State**: If the Gemini API fails, is rate-limited, or has no connection, the system MUST fallback to a local paragraph-based parser (double-newlines as segment boundaries) and default all node categories to "concept", creating sequential connections (Segment 1 -> Segment 2) to prevent user blocking.
- **Extremely Long Inputs**: If the input text exceeds 10,000 words, the system MUST show a warning suggesting to truncate or split the text to prevent browser crash, or perform batch segmentation.
- **Empty or Irrelevant Input**: If the user submits empty text, the "Analyze Text" button remains disabled. If the input contains no clear semantic structure (e.g. random letters), a single fallback segment containing the raw input is created.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST implement a step-by-step Wizard flow: Input -> Clean & Segment -> Review Relationships -> Generate Canvas.
- **FR-002**: The system MUST call the Gemini API to clean the text and segment it semantically into logical thematic sections.
- **FR-003**: The system MUST structure each segment with attributes: `id`, `title`, `content` (summary), and `category` (concept, action, warning, question).
- **FR-004**: The system MUST allow the user to edit, delete, add, and merge segments on the "Clean & Segment" screen.
- **FR-005**: The system MUST call the Gemini API to extract semantic relationships (edges) between the identified segments.
- **FR-006**: The system MUST provide an interface for adding, editing, and deleting relationships before map generation.
- **FR-007**: The system MUST implement a local fallback processor that cleans whitespace and splits text by paragraphs if the Gemini API is unavailable.
- **FR-008**: The system MUST render the final segments and relationships on the React Flow canvas.
- **FR-009**: The system MUST apply node styling dynamically based on the category (concept, action, warning, question).

### Key Entities *(include if feature involves data)*

- **Segment (Node candidate)**: Represents a semantic block of the cleaned text.
  - `id`: unique identifier
  - `title`: short title of the concept/segment
  - `content`: brief summary or details of the segment
  - `category`: one of `concept`, `action`, `warning`, `question`
- **Relationship (Edge candidate)**: Represents a semantic connection between two segments.
  - `id`: unique identifier
  - `sourceSegmentId`: source segment reference
  - `targetSegmentId`: target segment reference
  - `label`: text describing the relation type

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of text submissions that trigger local fallback segment in under 100 milliseconds.
- **SC-002**: Gemini-powered cleaning and segmentation completes and presents editable cards in under 5 seconds.
- **SC-003**: User can perform segment operations (edit, delete, merge) with zero interface lag (under 16 milliseconds).
- **SC-004**: The canvas renders up to 50 nodes and 75 edges from the reviewed segments in under 200 milliseconds.

## Assumptions

- The Gemini API connection is available or falls back to development mocks/local parser.
- All session data is stored in-memory; map state persistence is out of scope.
- Desktop resolution is optimized for the wizard; mobile users will see stacked scrollable panels.
