# CLI Contract: E2E Testing Interface

This document specifies the command-line interface contract for running E2E tests and generating screenshots.

## Commands

### E2E Test Execution Command
Triggers execution of the Playwright E2E tests.

```bash
npm run test:e2e
```

**Behavior**:
1. Starts the Vite development server on port 5173.
2. Runs Playwright tests using Chromium in headless mode.
3. Overwrites existing screenshot files in `tests/e2e/screenshots/`.
4. Outputs test results (pass/fail) to the terminal.
5. Terminates the Vite development server when tests complete.

---

## Output Contract

Upon successful execution, the test suite contract guarantees the generation of exactly the following file assets:

```text
tests/e2e/screenshots/
├── 01-initial.png
├── 02-mermaid.png
├── 03-markdown.png
├── 04-mock-ai.png
├── 05-node-selection.png
├── 06-layout-switch.png
└── 07-heuristics.png
```
