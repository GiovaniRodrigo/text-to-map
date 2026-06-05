# Data Model: E2E Tests with Screenshots

This document specifies the configurations, mock data structures, and output artifact metadata for the E2E screenshot tests.

## Entities

### `E2EConfig`
Defines the Playwright E2E runner configuration.

| Field | Type | Description |
|---|---|---|
| `baseURL` | String | URL of the local development server (e.g., `http://localhost:5173`) |
| `browser` | String | Target browser configuration (default: `'chromium'`) |
| `screenshotDir` | String | Absolute or relative path where screenshots are saved (`tests/e2e/screenshots/`) |
| `viewport` | Object | Target viewport resolution: `{ width: 1280, height: 720 }` |
| `webServer` | Object | Vite dev server launch details (command: `npm run dev`, port: `5173`) |

---

### `MockResponse`
Mocked data payload injected for intercepted Gemini API calls to `https://generativelanguage.googleapis.com/**`.

#### Map Generation Mock Payload
Matches the JSON schema for text-to-graph extraction:

```json
{
  "nodes": [
    {
      "id": "react-flow",
      "label": "React Flow",
      "category": "concept",
      "description": "A customizable React component for building node-based UIs."
    },
    {
      "id": "playwright",
      "label": "Playwright",
      "category": "action",
      "description": "E2E testing framework that runs in real browsers."
    },
    {
      "id": "screenshot-warning",
      "label": "Anti-aliasing Flakiness",
      "category": "warning",
      "description": "Visual comparison can fail due to minor system rendering discrepancies."
    }
  ],
  "edges": [
    {
      "source": "playwright",
      "target": "react-flow",
      "label": "tests"
    },
    {
      "source": "screenshot-warning",
      "target": "playwright",
      "label": "impacts"
    }
  ]
}
```

---

### `ScreenshotArtifact`
Metadata representing each captured screenshot image.

| Filename | Stage of Test | Description / Purpose |
|---|---|---|
| `01-initial.png` | Initial Page Load | Verifies a blank canvas, empty text area, and initial controls. |
| `02-mermaid.png` | Mermaid Parsing | Verifies local parser renders nodes/edges correctly without API calls. |
| `03-markdown.png` | Markdown Parsing | Verifies local hierarchical tree layout rendering. |
| `04-mock-ai.png` | Mocked AI Map | Verifies UI behavior when submitting raw text for AI generation. |
| `05-node-selection.png` | Node Selection | Verifies clicking a node opens the details panel with descriptions. |
| `06-layout-switch.png` | Layout Toggling | Verifies switching to Mind Map layout updates node positions. |
| `07-heuristics.png` | Heuristics Warnings | Verifies highlighting of invalid graph structures (e.g., self-loops, orphans). |
