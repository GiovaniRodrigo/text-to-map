# Quickstart: E2E Tests with Screenshots

This guide explains how to install dependencies, run the E2E tests, and verify that the screenshots are captured correctly.

## Prerequisites

Before running the tests, ensure you have:
1. Node.js (v18+) and npm installed.
2. The project dependencies installed (`npm install`).

## Setup

1. **Install Playwright and Browsers**:
   Run the following commands to install Playwright test runner and the required Chromium browser binary:
   ```bash
   npm install --save-dev @playwright/test
   npx playwright install chromium
   ```

2. **Configure package.json Script**:
   Verify or add the E2E testing script in `package.json` under `scripts`:
   ```json
   "test:e2e": "playwright test"
   ```

## Running E2E Tests

To run the entire E2E test suite:
```bash
npm run test:e2e
```

To run the tests with the UI runner (for visual debugging):
```bash
npx playwright test --ui
```

## Validation & Verification

1. **Test Success**:
   The terminal should report that all tests in `tests/e2e/` passed successfully.
   
2. **Screenshot Verification**:
   Navigate to the `tests/e2e/screenshots/` directory. You should see 7 newly captured PNG files representing each tested state:
   - `01-initial.png`
   - `02-mermaid.png`
   - `03-markdown.png`
   - `04-mock-ai.png`
   - `05-node-selection.png`
   - `06-layout-switch.png`
   - `07-heuristics.png`

   Open the images to visually verify that elements, layouts, and panels render correctly.
