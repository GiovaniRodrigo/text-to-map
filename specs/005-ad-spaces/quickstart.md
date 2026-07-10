# Quickstart: Ad Spaces Validation Guide

This guide provides verification procedures to validate the implementation of the ad slots feature.

---

## 1. Prerequisites

- Node.js installed.
- Dependencies installed: `npm install`.
- Local development server running: `npm run dev`.

---

## 2. Manual Verification Scenarios

### Scenario A: Initial Load & Rendering
1. Open the application in a modern browser: `http://localhost:5173`.
2. Observe the bottom of the left-hand `ControlPanel`. You should see an ad slot container styled to match the dark premium theme.
3. Type a sample text and click "Generate Map" (or use a direct Mermaid list input) to populate nodes on the canvas.
4. Click on any node to select it. The right-hand `DetailsPanel` should slide open.
5. Verify that an ad slot card is rendered at the bottom of the `DetailsPanel`.

### Scenario B: Session-Based Dismissal
1. Locate the ad slot at the bottom of the left `ControlPanel`.
2. Click the close (`X`) button in the top-right corner of the slot.
3. Verify that the ad slot transitions/collapses out of view.
4. Navigate through the application (e.g. edit text, select/deselect nodes). Verify that the dismissed ad slot remains hidden.
5. Refresh the browser page (`F5` or `Cmd+R`). Since the session is active, the ad slot should remain hidden.
6. Open the app in a new tab or incognito window. Verify that the ad slot reappears.

### Scenario C: Ad Blocker Detection & Fallback Campaign
1. Open Browser Developer Tools (`F12`).
2. Go to the **Network** tab, search for `adsbygoogle.js`, right-click on it, and select **Block request URL**.
3. Reload the application.
4. Verify that the ad slots on both panels immediately render the "Support Text-Map" fallback campaign containing the GitHub Sponsor button.
5. Click "Sponsor on GitHub" and verify that it opens the target GitHub URL in a new browser tab with `rel="noopener noreferrer"` attribute.

---

## 3. Automated E2E Verification

Run the Playwright end-to-end tests for the ad spaces feature:

```bash
npm run test:e2e tests/e2e/ad-spaces.spec.js
```
Expected output should verify:
- Ad slot visibility in default and details states.
- Successful dismissal state persistence in sessionStorage.
- Graceful rendering of fallback UI when third-party ad script fails to load.
