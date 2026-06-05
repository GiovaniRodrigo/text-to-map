# Quickstart: Generate Map Validation Guide

This guide describes how to run and verify the Generate Map feature end-to-end.

## Prerequisites
* Node.js (v18 or higher)
* NPM (v9 or higher)
* Gemini API Key (optional, required for Scenario 3: AI Extraction)

## Installation & Setup
1. Scaffold the project (once tasks are initialized):
   ```bash
   npm install
   ```
2. Run the local development server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173`.

---

## Validation Scenario 1: Local Mermaid Parser
Verify that valid Mermaid code is parsed and laid out locally without API hits.

1. **Setup**: Go to the local dev server. Ensure you have no network connection or the API key is not configured.
2. **Action**: Copy and paste the following code block into the input text area:
   ```text
   flowchart TD
       Start[Start Project] --> Plan[Write Plan]
       Plan --> Code[Write Code]
       Code --> Test[Test Code]
   ```
3. **Execution**: Click **"Generate Map"**.
4. **Expected Outcome**:
   * A 4-node directed graph immediately appears on the canvas.
   * Node positions are structured vertically from top to bottom (Dagre default layout).
   * Console network logs verify *no* calls were made to `generativelanguage.googleapis.com`.

---

## Validation Scenario 2: Local Markdown Outline Parser
Verify that indented Markdown outlines are parsed locally into hierarchical nodes.

1. **Setup**: Navigate to the text area input on the canvas interface.
2. **Action**: Clear the input area and paste the following tab-indented structure:
   ```text
   - Web App
     - Frontend
       - React Flow
       - Tailwind CSS
     - Backend
       - Gemini Service
   ```
3. **Execution**: Click **"Generate Map"**.
4. **Expected Outcome**:
   * Five nodes are drawn on the screen: "Web App", "Frontend", "React Flow", "Tailwind CSS", "Backend", "Gemini Service".
   * A root node ("Web App") is connected to its child nodes with directed arrows.
   * Rendering takes place in under 200 milliseconds.

---

## Validation Scenario 3: AI-Powered Extraction
Verify that unstructured text is analyzed by the Gemini API and successfully parsed into a structured graph.

1. **Setup**: Run the application with the API key set:
   ```bash
   export VITE_GEMINI_API_KEY="your-gemini-api-key"
   npm run dev
   ```
2. **Action**: Copy and paste the following paragraph of narrative text into the input area:
   ```text
   A software project uses Git for version control. Git tracks commits. Each commit stores code modifications. Developers review commits.
   ```
3. **Execution**: Click **"Generate Map"**.
4. **Expected Outcome**:
   * The UI shows a loading state/spinner.
   * Within 5 seconds, a graph renders with nodes such as "Software Project", "Git", "Commits", "Code Modifications", and "Developers".
   * Connecting lines have label descriptors (e.g., "uses", "tracks", "stores", "review").
   * Clicking the "Git" node opens the right-hand details panel containing a description (e.g., "A tool used for version control in a software project").

---

## Validation Scenario 4: Layout Recalculation
Verify layout positions are updated instantly when switching layouts.

1. **Setup**: Generate any map using Scenario 1, 2, or 3.
2. **Action**: Toggle the layout dropdown from **"Hierarchical (Top-Down)"** to **"Mind Map"**.
3. **Execution**: Observe the canvas behavior.
4. **Expected Outcome**:
   * The nodes recalculate their canvas coordinates in under 100ms.
   * Nodes rearrange into a radial, organic flow around the root node using D3 force calculations.

---

## Automated Test Suites
Run the test command to verify parser correctness and layout logic:
```bash
npm run test
```
* **Expected Result**: All parsing tests (`parsing.test.js`), layout tests (`layout.test.js`), and schema mapping tests (`service.test.js`) pass.
