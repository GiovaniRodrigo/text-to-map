# TextMap Studio 🎨

An interactive single-page React web application that transforms Mermaid flowchart configurations, Markdown outlines, or raw unstructured text (via Gemini AI) into visual, interactive concept maps powered by React Flow.

---

## Features

- **Format Routing**: Automatically parses structured Mermaid code or Markdown hierarchy outlines locally, falling back to Gemini-powered semantic parsing for raw text.
- **Interactive Canvas**: Pan, zoom, drag nodes, and explore layouts (Hierarchical Top-Down, Hierarchical Left-to-Right, or Radial Mind Map).
- **Edit Wizard Flow**: A 3-step wizard flow allowing users to clean, segment, and relate concepts before final canvas rendering.
- **Collapsible Inspector Panel**: Dedicated right-hand panel for exploring node descriptions and local context details.
- **Site-Wide Map Heuristics**: Automatic validation checks evaluating map quality and structural health in real time.

---

## Map Heuristics Engine ⚠️

To ensure concept maps are readable, logical, and high quality, TextMap Studio runs client-side graph heuristics in a debounced background loop:

1. **Orphan Node Detection**: Flags any nodes that are completely disconnected from the rest of the map.
2. **Self-Loop Check**: Prevents nodes from having redundant relationships linking directly back to themselves.
3. **Circular Cycles Check**: Uses directed cycle detection (3-coloring DFS) to flag circular dependency loops.
4. **Category Alignment Check**: Validates that nodes marked as `Warning` or `Action` contain matching lexical cues in their label/description (e.g., action verbs or failure/not indicators).

Clicking on any validation issue in the heuristics panel focuses and temporarily pulses the affected element on the canvas.

---

## Development & Testing

### Run locally
```bash
npm run dev
```

### Run tests
```bash
npm run test
```

