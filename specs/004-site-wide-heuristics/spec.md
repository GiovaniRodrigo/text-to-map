# Feature Specification: Site-Wide Heuristics

**Feature Branch**: `004-site-wide-heuristics`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "Heuristica no site inteiro"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Map Structure and Quality Analysis (Priority: P1)

As a user generating or editing a concept map, I want the system to run automatic heuristic checks across all nodes and edges (site-wide map heuristics) and show me structural issues (like disconnected nodes or circular references) and category alignment issues, so that I can ensure my map is logical and high quality.

**Why this priority**: It is the core functional requirement of the heuristic feature, analyzing the graph data structure and providing real-time feedback.

**Independent Test**: Can be tested by generating a map with a disconnected node or a warning node that has no warning keywords, triggering the heuristics check, and verifying that the disconnected node is flagged with an appropriate warning.

**Acceptance Scenarios**:

1. **Given** a generated map, **When** the site-wide heuristics analysis runs, **Then** the system detects and lists any structural violations (e.g., orphan nodes, self-loops, circular cycles).
2. **Given** a generated map with categorized nodes, **When** the heuristics check runs, **Then** the system flags nodes where the content/text does not align with the chosen category.
3. **Given** a flagged heuristic issue, **When** I click on the issue in the list, **Then** the corresponding node/edge is highlighted on the canvas.

---

### User Story 2 - Real-Time Validation Panel (Priority: P2)

As a user working on the map or wizard steps, I want a dedicated collapsible sidebar panel to view active heuristics validation status at any time, so that I can monitor map quality as I edit nodes and relationships.

**Why this priority**: Provides the user interface container to display the heuristic results cleanly without cluttering the main canvas or details panel.

**Independent Test**: Can be tested by opening the application, identifying the heuristics indicator/panel, making a change that resolves a violation, and verifying that the panel updates automatically.

**Acceptance Scenarios**:

1. **Given** the canvas view, **When** I open the heuristics panel, **Then** I see a summary of map health (number of issues, severity, and recommendations).
2. **Given** the heuristics panel is open, **When** I fix a flagged issue (e.g. by linking an orphan node), **Then** the issue disappears from the panel in real time (debounced).

---

### Edge Cases

- **Empty Map**: If the canvas is empty, the heuristics panel should display a friendly message indicating no nodes are present yet, rather than erroring or showing blank metrics.
- **Extremely Large Map**: For maps with 50+ nodes and 75+ edges, the heuristic calculations must run efficiently in the background without freezing the UI thread or blocking canvas navigation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST evaluate the map structure against a set of predefined heuristic rules.
- **FR-002**: The heuristics evaluation MUST run on the entire map dataset (all active nodes and edges).
- **FR-003**: The system MUST evaluate the following specific heuristic rules:
  - **Orphan Node Check**: Flag any node that has no incoming or outgoing connections.
  - **Self-Loop Check**: Flag any edge where the source and target are the same node.
  - **Category Alignment Check**: Flag nodes categorized as "warning" or "action" that do not contain matching text cues (e.g. warning nodes must contain text like "not", "prevent", "danger", "error"; action nodes must contain action verbs).
  - **Circular Cycle Check**: Flag any directed cyclic dependencies (e.g., A -> B -> C -> A).
- **FR-004**: The system MUST present the heuristic validation results in a dedicated, collapsible sidebar panel. Clicking an issue focuses/highlights the target node on the canvas.
- **FR-005**: The system MUST run the heuristics analysis automatically (debounced by 300ms) whenever nodes, segments, or relationships are modified.
- **FR-006**: The system MUST allow the user to easily identify and locate the source of each heuristic warning on the canvas by visually styling the flagged element.

### Key Entities *(include if feature involves data)*

- **HeuristicRule**: Represents a single validation rule (e.g., "No orphan nodes").
  - `id`: unique rule identifier
  - `name`: user-friendly name of the rule
  - `description`: explanation of why this rule is important
  - `severity`: error, warning, or info
- **HeuristicViolation**: An instance of a rule failing on specific map elements.
  - `id`: unique violation identifier
  - `ruleId`: reference to the violated HeuristicRule
  - `targetIds`: list of node/edge IDs involved in the violation
  - `message`: contextual warning message for the user

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Map-wide heuristic calculations for up to 100 elements complete in less than 10 milliseconds.
- **SC-002**: Dynamic updates to the heuristics list occur within 16 milliseconds of the debounced execution finishing.
- **SC-003**: 100% of detected violations clearly link back to their target nodes/edges on click.

## Assumptions

- Heuristics run entirely on the client side using the React state of nodes and edges.
- Out of scope: auto-fixing issues automatically (recommending fixes is in-scope, but the user must make the edits).
