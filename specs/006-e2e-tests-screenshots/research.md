# Research: E2E Tests with Screenshots

This document details the research, tool evaluation, and architecture choices for implementing E2E tests with screenshot capture.

## E2E Testing Framework

- **Decision**: Use Playwright (`@playwright/test`).
- **Rationale**: Playwright is modern, extremely fast, runs headlessly in Chromium by default, and has native support for capturing screenshots of pages or specific elements. It also has a built-in `webServer` utility to spin up and tear down the Vite development server automatically, and network routing capabilities to mock external API requests easily.
- **Alternatives considered**: 
  - *Cypress*: Powerful interactive runner, but heavier and has a more complex headless run/report configuration for generating and storing screenshots via CLI.
  - *Vitest with JSDOM/Happy DOM*: Already used for unit tests, but does not render a real visual layout canvas, zoom/pan interactions, or capture visual screenshot screenshots.

## Screenshot Artifact Strategy

- **Decision**: Capture and save `.png` screenshots to `tests/e2e/screenshots/` without automated visual regression comparison.
- **Rationale**: The user wants visual artifacts (evidence) of test outcomes. Avoiding pixel-by-pixel comparisons prevents test failures from minor anti-aliasing variations or rendering differences across systems.
- **Alternatives considered**:
  - *Playwright Visual Comparisons (`toHaveScreenshot`)*: Pixel-by-pixel checks against baseline images. Rejected because it is highly sensitive to font rendering engine differences between developer machines and CI environments.

## API Mocking Strategy

- **Decision**: Use Playwright's network routing API (`page.route()`) to intercept HTTP requests to `https://generativelanguage.googleapis.com/**` and return a pre-configured JSON response matching the Gemini API schema.
- **Rationale**: Intercepting requests at the network layer allows us to test the production code without modifying production files to insert mock logic. This keeps the application code clean.
- **Alternatives considered**:
  - *Injecting environment variables (like `VITE_USE_MOCK=true`)*: Modifies source code paths. Playwright's network interception is cleaner and more realistic.

## Test Server Management

- **Decision**: Configure Playwright's `webServer` block in `playwright.config.js` to run `npm run dev` and wait for `http://localhost:5173` to be ready.
- **Rationale**: Built-in support that automatically manages the lifecycle of the dev server during E2E test runs.
- **Alternatives considered**:
  - *`start-server-and-test`*: NPM package to run dev server and then trigger test scripts. Playwright config replaces the need for this package.
