# Feature Specification: Generate Map

**Feature Branch**: `001-generate-map`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "generate map"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Local Parsing of Structured Formats (Priority: P1)

As a user with structured notes (Markdown outlines or Mermaid diagram code), I want the system to parse my input locally and immediately render a matching interactive map, so that I don't need network/AI resources for already-structured content.

**Why this priority**: It serves as the baseline MVP that does not depend on external APIs, ensuring offline reliability and immediate visual validation of the core React Flow layout engine.

**Independent Test**: Can be fully tested by pasting a valid three-node Mermaid graph or indented Markdown outline and verifying that three connected nodes render on the React Flow canvas.

**Acceptance Scenarios**:

1. **Given** a blank canvas and the input area containing a valid Mermaid flowchart, **When** I click "Generate Map", **Then** the canvas renders corresponding React Flow nodes and edges using the default layout.
2. **Given** the input area containing a nested Markdown list with tab indentations, **When** I click "Generate Map", **Then** the canvas renders a hierarchical tree representing the list structure.
3. **Given** a malformed Mermaid diagram, **When** I click "Generate Map", **Then** the system displays a clear error warning instead of crashing or showing a blank screen.

---

### User Story 2 - AI-Powered Extraction from Raw Text (Priority: P2)

As a user with unformatted text (paragraphs of notes, transcripts, or articles), I want the system to use the Gemini API to extract key nodes, categories, descriptions, and relationships, rendering them as a structured map.

**Why this priority**: This fulfills the core constitution principle of hybrid text-to-graph conversion, making map creation accessible for non-technical users who don't write Mermaid/Markdown outlines.

**Independent Test**: Can be tested by submitting a paragraph of narrative text (e.g., "A database stores tables. Tables contain columns.") and verifying that appropriate nodes ("Database", "Tables", "Columns") and edges ("stores", "contain") are created and displayed.

**Acceptance Scenarios**:

1. **Given** a paragraph of raw unstructured text, **When** I request AI map generation, **Then** the system calls the Gemini API to extract nodes, relationships, categories, and descriptions, and renders the graph on the canvas.
2. **Given** a successful AI extraction, **When** I select or hover over a node on the canvas, **Then** the collapsible right-hand details panel displays the detailed description extracted for that node.

---

### User Story 3 - Interactive Canvas & Layout Toggling (Priority: P3)

As a user viewing a generated map, I want to toggle between different layouts (Hierarchical vs. Mind Map) and interact with the canvas (zoom, pan, drag), so that I can organize the information in the way that makes the most sense to me.

**Why this priority**: Enhances usability and satisfies principles II (Multi-Layout Organization) and V (Zoomable, Interactive Canvas).

**Independent Test**: Can be tested by generating a map, switching layout from "Hierarchical" to "Mind Map", and verifying that node positions recalculate using d3-hierarchy/force instead of Dagre.

**Acceptance Scenarios**:

1. **Given** a rendered map in Hierarchical layout, **When** I switch the layout setting to "Mind Map", **Then** the canvas nodes rearrange smoothly into a radial/force layout.
2. **Given** a rendered map, **When** I drag a node, zoom in/out, or pan the canvas, **Then** the canvas updates responsively.

---

### Edge Cases

- **Large Graphs**: What happens when the input text generates 50+ nodes? The canvas must remain readable, using clustering or auto-fitting the zoom to display the entire graph.
- **API Failures**: How does the system handle network timeouts or rate limits when communicating with the Gemini API? It must degrade gracefully to local extraction rules or mock fallbacks.
- **Empty / Irrelevant Text**: If the input text has no extractable entities or relations, the system should show a friendly prompt suggesting how to structure the input.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an input interface (text area) to receive raw text or structured diagram code.
- **FR-002**: The system MUST render nodes and edges using React Flow on an interactive canvas.
- **FR-003**: The system MUST determine the parsing method automatically (parse locally if valid Mermaid/Markdown outline format is detected, and fallback to AI-powered extraction for raw text).
- **FR-004**: The system MUST handle errors during generation by displaying an inline alert in the input area and presenting detailed logs/errors in a collapsible debug panel.
- **FR-005**: The system MUST handle updating an existing map by overwriting the current canvas state completely with the newly generated graph.
- **FR-006**: The system MUST parse valid Mermaid code block structures locally without sending data to the AI.
- **FR-007**: The system MUST parse indented Markdown outlines locally to establish hierarchical parent-child node relationships.
- **FR-008**: The system MUST display a collapsible right-hand details panel that shows the selected node's full description and category.
- **FR-009**: The system MUST support dynamic recalculation of node positions when toggling between Hierarchical (Dagre) and Mind Map (D3) styles.

### Key Entities *(include if feature involves data)*

- **Node**: Represents a single entity or concept. Has attributes: `id`, `label`, `category` (concept, action, warning, question), `description` (long text), and rendering position.
- **Edge**: Represents a relationship between two nodes. Has attributes: `id`, `source` (Node ID), `target` (Node ID), and optional `label` (relation type/name).
- **MapConfig**: Configures layout options. Attributes: `layoutStyle` (hierarchical-top-down, hierarchical-left-right, mind-map), `parserType` (local-mermaid, local-markdown, ai-gemini).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid local Mermaid or Markdown inputs render a graph within 200 milliseconds.
- **SC-002**: AI map generation from paragraphs of up to 1,000 words completes extraction and renders the graph in under 5 seconds (assuming standard API latency).
- **SC-003**: Switching layouts (e.g., Hierarchical to Mind Map) updates the node positions and redraws the canvas in under 100 milliseconds.
- **SC-004**: System supports rendering and navigating up to 100 nodes and 150 edges without any canvas stutter (minimum 60 FPS during zooming/panning).

## Assumptions

- Users will mostly provide English text for AI extraction, though the Gemini API should handle other languages as supported by the LLM.
- Canvas state is kept in-memory for the current session; persistent storage (save/load) is out of scope for the initial version.
- Mobile layout will stack the input text area and the canvas/panel, but the primary target environment is desktop monitors.
