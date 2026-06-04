# Quickstart & Validation Guide: Clean and Segment Text

This guide details how to verify the text cleaning, segmentation, and mapping feature both manually and via automated test cases.

## Prerequisites

- Node.js installed.
- Vite dev server running (`npm run dev`).
- A modern web browser.
- (Optional) Gemini API Key set in a `.env.local` file as `VITE_GEMINI_API_KEY=your-api-key`.

## Scenario 1: Local Fallback (Offline Mode)

### Purpose
Ensure that cleaning, segmentation, and map generation work reliably when the API key is missing or offline.

### Steps
1. Open the application. Ensure no `VITE_GEMINI_API_KEY` is active (or click "Clear" to reset state).
2. Paste the following paragraph in the text area:
   ```text
   A server processes incoming requests.
   It must return a response to the client.
   If an error occurs, it should log a warning.
   ```
3. Click the **"Analyze & Segment"** button.
4. Verify the system moves to **Step 2 (Clean & Segment)**:
   - Three segment cards should be generated.
   - Segment 1: Title "A server processes", Category "concept".
   - Segment 2: Title "It must return", Category "action".
   - Segment 3: Title "If an error", Category "warning".
5. Edit the title of Segment 1 to "Web Server".
6. Click **"Next: Review Relationships"** to proceed to **Step 3**.
7. Verify two sequential relationships exist:
   - `Web Server` -> relates to -> `It must return`
   - `It must return` -> relates to -> `If an error`
8. Click **"Generate Map"**.
9. Verify the React Flow canvas renders 3 nodes styled by category and connected sequentially.

---

## Scenario 2: Semantic Segmentation & Relationship Extraction (AI Mode)

### Purpose
Verify the Gemini API extracts complex semantic structures and relationships correctly.

### Steps
1. Make sure `VITE_GEMINI_API_KEY` is configured in your `.env.local`.
2. Start the dev server.
3. Paste the following text in the input area:
   ```text
   The solar system consists of the Sun and objects orbiting it. Planets like Earth and Mars orbit the Sun directly. Moons orbit planets.
   ```
4. Click **"Analyze & Segment"**.
5. Verify the system shows loading state and then displays cards for the extracted segments (e.g. `Solar System`, `Planets`, `Moons`).
6. Click **"Next: Review Relationships"** and verify semantic relationships (e.g., `Planets` -> `orbit` -> `Sun`, `Moons` -> `orbit` -> `Planets`) are presented.
7. Click **"Generate Map"** and verify the graph reflects this non-linear structure.

---

## Automated Verification

Run the test suite using Vitest:
```bash
npm run test
```
Or run specifically the wizard and segment parser tests:
```bash
npx vitest run tests/unit/segmentation.test.js
```
All tests MUST pass with 100% success rate.
