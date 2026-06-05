# Quickstart Validation Guide: Site-Wide Heuristics

This guide describes how to verify the site-wide heuristics feature end-to-end.

## 1. Automated Tests

Run the Vitest suite to verify the heuristics evaluation logic:
```bash
npm run test tests/unit/heuristics.test.js
```

### Expected Output
- All tests for `validateMap` pass:
  - Orphan nodes are successfully flagged.
  - Redundant self-loops are identified.
  - Cycle detection flags all nodes involved in a loop.
  - Nodes categorized as "warning" or "action" without correct keyword associations are flagged.

---

## 2. Manual End-to-End Verification Scenarios

### Scenario A: Orphan Detection & Highlighting
1. Open the application.
2. In the input area, paste the following Markdown outline (which lacks links/hierarchy context) or raw text:
   ```text
   Main Topic
   ```
3. Generate the map.
4. Verify that a floating badge showing `⚠️ 1 Issue` is visible in the bottom-right corner of the canvas.
5. Click the badge to open the right-side panel with the **Heuristics** tab active.
6. Verify that an issue "Node 'Main Topic' is disconnected from the rest of the map." is shown.
7. Click the issue item in the list and verify the "Main Topic" node on the canvas flashes with a pulse animation.

### Scenario B: Self-Loop Detection
1. In the input area, paste the following Mermaid graph:
   ```mermaid
   flowchart TD
     A[Concept A] --> A
   ```
2. Click **Generate Map**.
3. Open the **Heuristics** tab.
4. Verify that a self-loop error is listed.
5. Click the error, and verify the self-loop edge is highlighted on the canvas.

### Scenario C: Real-Time Updates
1. Generate a map with an orphan node "Node A" and a connected component "Node B --> Node C".
2. Open the **Heuristics** panel (confirming 1 orphan violation for Node A).
3. Open the wizard flow by clicking **Edit Structure**.
4. Navigate to the **Review Relationships** step.
5. Add a relationship from "Node B" to "Node A".
6. Complete the wizard to update the map.
7. Verify that the heuristics list updates dynamically and the orphan node issue for "Node A" has disappeared.
