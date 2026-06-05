import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotDir = path.join(__dirname, 'screenshots');

// Helper to save screenshots with a delay to ensure animations finish
async function saveScreenshot(page, filename) {
  await page.waitForTimeout(600); // Allow animations/layout transitions to stabilize
  const filePath = path.join(screenshotDir, filename);
  await page.screenshot({ path: filePath });
  console.log(`Saved screenshot to: ${filePath}`);
}

test.describe('E2E Tests with Screenshots', () => {

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`BROWSER CONSOLE [${msg.type()}]:`, msg.text()));
    page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message));

    // Intercept and mock Gemini API calls to Google's generative language API
    await page.route('https://generativelanguage.googleapis.com/**', async (route) => {
      console.log('INTERCEPTED:', route.request().url());
      const postData = route.request().postData() || '';
      const isSegmentation = postData.includes('segment') || postData.includes('relationships');

      let mockTextResponse;
      if (isSegmentation) {
        mockTextResponse = JSON.stringify({
          segments: [
            {
              id: 'concept-a',
              title: 'Concept A',
              content: 'This is the first concept extracted by the AI.',
              category: 'concept'
            },
            {
              id: 'action-b',
              title: 'Action B',
              content: 'This is an action step that must be taken. Run this command.',
              category: 'action'
            }
          ],
          relationships: [
            {
              source: 'concept-a',
              target: 'action-b',
              label: 'leads to'
            }
          ]
        });
      } else {
        mockTextResponse = JSON.stringify({
          nodes: [
            {
              id: 'concept-a',
              label: 'Concept A',
              category: 'concept',
              description: 'This is the first concept extracted by the AI.'
            },
            {
              id: 'action-b',
              label: 'Action B',
              category: 'action',
              description: 'This is an action step that must be taken. Run this command.'
            }
          ],
          edges: [
            {
              source: 'concept-a',
              target: 'action-b',
              label: 'leads to'
            }
          ]
        });
      }

      const responsePayload = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: mockTextResponse
                }
              ]
            }
          }
        ]
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responsePayload)
      });
    });
  });

  test('01 - should capture initial page load', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('TextMap Studio');
    await saveScreenshot(page, '01-initial.png');
  });

  test('02 - should parse local Mermaid flowchart and render', async ({ page }) => {
    await page.goto('/');
    const inputTextArea = page.locator('textarea');
    await inputTextArea.fill('flowchart TD\n  A --> B');
    
    await page.click('button:has-text("Generate Map")');
    await page.waitForSelector('.react-flow__node');
    
    await saveScreenshot(page, '02-mermaid.png');
  });

  test('03 - should parse local Markdown outline and render', async ({ page }) => {
    await page.goto('/');
    const inputTextArea = page.locator('textarea');
    await inputTextArea.fill('- Root Node\n  - Child Level 1\n    - Child Level 2');
    
    await page.click('button:has-text("Generate Map")');
    await page.waitForSelector('.react-flow__node');
    
    await saveScreenshot(page, '03-markdown.png');
  });

  test('04 - should run mock AI text segmentation wizard and render map', async ({ page }) => {
    await page.goto('/');
    
    // Hide the heuristics badge to prevent overlap/intercept issues during the wizard
    await page.addStyleTag({ content: '.fixed.bottom-6 { display: none !important; }' });

    const inputTextArea = page.locator('textarea');
    // Using simple plain text (not matching markdown outline or mermaid) to trigger wizard flow
    await inputTextArea.fill('This is a simple raw paragraph. Concept A will lead to Action B.');
    
    // Step 1: Segmentation
    await page.click('button:has-text("Analyze & Segment")');
    await page.waitForSelector('text=Step 1: Clean & Segment Text');
    
    // Step 2: Relationships
    const nextBtn = page.locator('button:has-text("Next: Review Relationships")');
    await nextBtn.waitFor({ state: 'visible' });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await page.waitForSelector('text=Step 2: Review Relationships');
    
    // Step 3: Map generation
    const generateBtn = page.locator('button:has-text("Generate Map")');
    await generateBtn.waitFor({ state: 'visible' });
    await expect(generateBtn).toBeEnabled();
    await generateBtn.click();
    await page.waitForSelector('.react-flow__node');
    
    await saveScreenshot(page, '04-mock-ai.png');
  });

  test('05 - should select node to open details panel', async ({ page }) => {
    await page.goto('/');
    const inputTextArea = page.locator('textarea');
    await inputTextArea.fill('flowchart TD\n  ConceptA --> ActionB');
    await page.click('button:has-text("Generate Map")');
    await page.waitForSelector('.react-flow__node');

    // Click on a node to select it (using the node text matching "ConceptA")
    await page.click('.react-flow__node:has-text("ConceptA")');
    await page.waitForSelector('text=Node Details');
    
    await saveScreenshot(page, '05-node-selection.png');
  });

  test('06 - should switch layout styles dynamically', async ({ page }) => {
    await page.goto('/');
    const inputTextArea = page.locator('textarea');
    await inputTextArea.fill('flowchart TD\n  Node1 --> Node2\n  Node2 --> Node3');
    await page.click('button:has-text("Generate Map")');
    await page.waitForSelector('.react-flow__node');

    // Select "Mind Map (Horizontal)" layout option
    await page.selectOption('select', 'mind-map');
    
    await saveScreenshot(page, '06-layout-switch.png');
  });

  test('07 - should trigger heuristics warnings and show violations', async ({ page }) => {
    await page.goto('/');
    const inputTextArea = page.locator('textarea');
    // Self-loop (NodeA connects to itself) and Warning category node without indicator words (should trigger warning category check)
    // To trigger orphan warning as well, we will add a disconnected node "OrphanNode[Orphan Node]"
    await inputTextArea.fill('flowchart TD\n  NodeA --> NodeA\n  OrphanNode[Orphan Node]');
    await page.click('button:has-text("Generate Map")');
    await page.waitForSelector('.react-flow__node');

    // Wait for debounce (300ms) and expect the heuristics status/issues badge to appear
    await page.waitForSelector('.fixed:has-text("Issues")');
    
    // Click the heuristics issues badge to open the panel
    await page.click('.fixed:has-text("Issues")', { force: true });
    await page.waitForSelector('text=Map Heuristics');

    await saveScreenshot(page, '07-heuristics.png');
  });

});
