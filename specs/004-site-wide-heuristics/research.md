# Research: Site-Wide Heuristics

This document outlines the technical research, algorithms, and design choices for implementing site-wide validation heuristics on generated concept maps.

## 1. Heuristics Algorithms

We will implement client-side graph algorithms to validate map structure and semantics.

### Orphan Node Detection
- **Algorithm**: Given a set of nodes $N$ and edges $E$, a node $n \in N$ is an orphan if:
  $$\forall e \in E, e.\text{source} \neq n.\text{id} \land e.\text{target} \neq n.\text{id}$$
- **Complexity**: $O(|N| + |E|)$ using a hash set of connected node IDs.

### Self-Loop Detection
- **Algorithm**: An edge $e \in E$ is a self-loop if:
  $$e.\text{source} = e.\text{target}$$
- **Complexity**: $O(|E|)$ simple iteration.

### Circular Cycle Detection
- **Algorithm**: Directed cycle detection using Depth-First Search (DFS) with node coloring (white/gray/black tracking) to detect back-edges.
  - White (unvisited): Node has not been processed.
  - Gray (visiting): Node is in the current recursion stack (if we see a gray node, a cycle exists).
  - Black (visited): Node and all its descendants have been fully processed.
- **Complexity**: $O(|N| + |E|)$.

### Category Alignment Check
- **Algorithm**: Text matching against regex arrays representing expected lexical cues:
  - `warning` category: Requires text to contain warning keywords (e.g., `not`, `prevent`, `danger`, `error`, `fail`, `warn`, `avoid`, `no`, `never`, `restrict`).
  - `action` category: Requires text to contain action terms (e.g., `run`, `execute`, `do`, `create`, `call`, `build`, `process`, `start`, `stop`, `handle`, `use`, `make`, `perform`).
- **Complexity**: $O(|N|)$ regex tests.

---

## 2. UI/UX Design & Sidebar Tab Integration

To maintain a clean and uncluttered workspace, we will integrate the heuristics panel into the existing right-hand sidebar (`DetailsPanel.jsx`):

1. **Tabbed Sidebar**: The right sidebar will now support two tabs at the top:
   - **Details**: Displays the selected node's properties, description, and local relationships (previous functionality).
   - **Heuristics**: Displays the list of active map violations, categorized by severity (Error, Warning).
2. **Floating Indicator Badge**: A floating button `⚠️ [N] Issues` will be added in the bottom-right corner of the canvas.
   - If there are 0 issues, the badge will show a green checkmark `✅ Map Healthy`.
   - Clicking this badge will open the right sidebar and set the active tab to **Heuristics**.
3. **Canvas Interaction (Focusing)**:
   - When a user clicks a violation, the sidebar will fire a callback that:
     1. Sets `selectedNodeId` (if the target is a node) to open details or focus.
     2. Highlights the node/edge with a temporary CSS class that triggers a custom CSS pulsing animation (`pulse-highlight`).
     3. Adjusts the React Flow canvas viewport to center on the target node.

---

## 3. Real-Time Debounced Execution

To guarantee a fluid UI (60 FPS) even when editing maps with many nodes, validation will run inside a debounced `useEffect`:
- Whenever `nodes` or `edges` changes, a timer is set.
- If no further updates happen for 300ms, the validation functions are executed.
- Results are stored in an array of `violations` in `App.jsx` and passed down to the components.
