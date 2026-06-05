# Feature Specification: E2E Tests with Screenshots

**Feature Branch**: `006-e2e-tests-screenshots`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "testes e2e com print"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - E2E Testing of Local Flowchart Rendering with Screenshots (Priority: P1)

As a developer, I want to run E2E tests for the local rendering paths (Mermaid and Markdown outlines) and automatically save screenshots of the resulting canvas, so that I can visually verify that the layout and rendering of nodes/edges work correctly.

**Why this priority**: It tests the primary user capability (generating maps locally without API dependencies) and establishes the baseline screenshot generation structure.

**Independent Test**: Run a command to trigger E2E tests, verifying that tests pass for local inputs and that screenshots are generated in `tests/e2e/screenshots/initial.png`, `tests/e2e/screenshots/mermaid.png`, and `tests/e2e/screenshots/markdown.png`.

**Acceptance Scenarios**:

1. **Given** a clean environment, **When** I run the E2E test command, **Then** the tests start a headless browser, navigate to the application, paste a Mermaid flowchart, verify the canvas renders elements, capture a screenshot, and save it.
2. **Given** the E2E test suite running, **When** a Markdown outline is inputted and generated, **Then** the test verifies the hierarchical layout and captures a screenshot of the resulting canvas.

---

### User Story 2 - Mocked AI Extraction Testing (Priority: P2)

As a developer, I want to run E2E tests for AI-powered map generation by mocking Gemini API calls, capturing a screenshot of the generated map and node selection details panel, so that I can verify AI flow logic without hitting the live Gemini API.

**Why this priority**: Ensures we can test the AI extraction path reliably and deterministically, and verify that selecting nodes opens the details panel as expected.

**Independent Test**: Run E2E tests, intercepting Gemini API network calls, and verifying that the canvas renders the mocked node hierarchy and the details panel displays correct details when a node is clicked.

**Acceptance Scenarios**:

1. **Given** the E2E test is running, **When** unstructured text is entered and AI generation is triggered, **Then** the system intercepts the API call, injects a mock response, renders the map on the canvas, and captures a screenshot of the resulting canvas.
2. **Given** the rendered map from mock AI, **When** the test clicks/selects a node, **Then** the right-hand details panel displays the description, and a screenshot is saved showing the details panel open.

---

### User Story 3 - Interactive Canvas, Layout Toggling, and Heuristics Visual Verification (Priority: P3)

As a developer, I want to run E2E tests that toggle layouts and check heuristics warnings, capturing screenshots of the changes, so that I can verify that layout recalculation and heuristics highlights are rendered properly.

**Why this priority**: Focuses on advanced visual features like layout switching and client-side heuristics validation from the previous features.

**Independent Test**: Run E2E tests that generate a map, switch layouts, and trigger heuristics validation, verifying that the layout updates, heuristics status badge and panel render, and saving screenshots.

**Acceptance Scenarios**:

1. **Given** a rendered map, **When** the layout is toggled from Hierarchical to Mind Map, **Then** the node layout updates and a screenshot is saved.
2. **Given** a rendered map that triggers heuristics issues, **When** the heuristics badge appears, **Then** a screenshot is saved capturing the canvas highlighting and the heuristics details.

---

### Edge Cases

- **Loading Timeouts**: What happens when the app takes too long to load or fails? Playwright should wait for the canvas selector to be visible or time out gracefully.
- **Malformed Gemini Responses**: What happens if the mock API response contains malformed data? The tests should verify that the application displays a user-friendly error message, and a screenshot of the error is captured.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST implement Playwright E2E tests for the application.
- **FR-002**: The E2E tests MUST run in headless mode using Chromium by default.
- **FR-003**: The test runner MUST automatically launch the Vite dev server prior to running E2E tests (e.g., using Playwright's webServer configuration).
- **FR-004**: The test suite MUST intercept and mock all Gemini API calls to return a predefined JSON payload containing nodes and edges.
- **FR-005**: The tests MUST capture screenshots of the application at specific states: empty canvas, Mermaid rendered, Markdown rendered, AI extraction rendered, Details panel open, Mind Map layout toggled, and Heuristics warnings active.
- **FR-006**: Screenshots MUST be saved to a structured directory (`tests/e2e/screenshots/`) with clear descriptive file names.
- **FR-007**: The tests MUST run in a single terminal command (e.g., `npm run test:e2e` or `npx playwright test`).

### Key Entities *(include if feature involves data)*

- **E2EConfig**: Playwright configuration settings (browser: chromium, webServer configuration, viewport sizes, screenshot directories).
- **MockResponse**: Static mock data for Gemini API extraction requests, including list of nodes and edges matching typical layouts.
- **ScreenshotArtifact**: Generated image files representing the application states, saved in `.png` format.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The entire E2E test suite executes and passes in under 15 seconds.
- **SC-002**: Every test run produces exactly the expected set of screenshots with 100% reliability.
- **SC-003**: No live network requests are sent to the Gemini API during E2E test execution.
- **SC-004**: Running the E2E tests does not interfere with the existing `vitest` unit test suite.

## Assumptions

- The E2E tests will run in a Linux/container/CI environment with appropriate browser dependencies installed.
- Viewport size is fixed (e.g., 1280x720) to ensure consistent layout and screenshot dimensions.
- Local host port used for testing (e.g., 5173) is free or dynamically assigned.
