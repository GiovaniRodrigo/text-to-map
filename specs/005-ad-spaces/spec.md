# Feature Specification: Ad Spaces (Espaços para Propaganda)

**Feature Branch**: `005-ad-spaces`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "espaços para propaganda"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Viewing Ad Slots in Main Interfaces (Priority: P1)

As a visitor, I want to see advertisements in clearly defined areas of the application so that the platform can be monetized without disrupting my main text-to-map generation workflow.

**Why this priority**: High priority as it constitutes the core placement and layout requirement for ads.

**Independent Test**: Can be fully tested by opening the application and verifying that ad slots render at their designated screen positions.

**Acceptance Scenarios**:

1. **Given** the application has loaded, **When** no node is selected, **Then** I should see the designated ad slot at the bottom of the left ControlPanel.
2. **Given** a node is selected and the DetailsPanel is open on the right, **Then** I should see an ad slot rendered inside the DetailsPanel.
3. **Given** the page layout changes or resized, **When** ad slots are rendered, **Then** they should adapt responsively without overlapping other user interface controls.

---

### User Story 2 - Ad Content Display and Integration (Priority: P2)

As a product owner, I want the ad slots to load dynamic third-party ads (like Google AdSense via script/iframe) so that we can easily monetize the site through ad impressions and clicks.

**Why this priority**: Medium priority to ensure monetization through standard third-party advertising networks.

**Independent Test**: Verify that ad spaces render dynamic third-party script/iframe contents when active.

**Acceptance Scenarios**:

1. **Given** an ad slot is rendered, **When** the page is loaded, **Then** the slot should initialize the script or load the iframe for the third-party ad network.
2. **Given** an ad is displayed, **When** a user clicks on the ad banner, **Then** it should open the ad's target link in a new tab.

---

### User Story 3 - Dismissing Ads for the Session (Priority: P3)

As a user, I want the ability to dismiss an ad slot if it blocks my workspace, so that I can focus on my map generation task when needed during my current session.

**Why this priority**: Lower priority but important for user experience and usability.

**Independent Test**: Can be tested by clicking the close (X) button on an ad slot and verifying that the slot is hidden until the page is reloaded.

**Acceptance Scenarios**:

1. **Given** an ad slot is visible, **When** I click the close (X) button, **Then** that ad slot should be hidden.
2. **Given** an ad slot was dismissed, **When** I navigate the app or select nodes, **Then** the dismissed ad slot remains hidden.
3. **Given** an ad slot was dismissed, **When** I reload the browser page, **Then** the ad slot should reappear.

---

### Edge Cases

- **Ad Blocker Active**: If the user's browser has an ad blocker that prevents loading third-party scripts/iframes, the ad slot should collapse gracefully or show a beautiful fallback banner (e.g., "Sponsor this project") rather than showing a broken layout or empty space.
- **Script Loading Timeout**: If the third-party ad script takes too long to load or fails, the container should show a local fallback sponsor message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allocate dedicated screen real estate for advertisements. Ad slots must be placed at the bottom of the left ControlPanel (sidebar) and inside the right DetailsPanel (as a card).
- **FR-002**: The ad slots MUST be styled to match the dark, premium theme of the application (e.g., using rounded corners, subtle borders, and harmonious margins).
- **FR-003**: The system MUST load and display advertisements dynamically using script or iframe integration for third-party ads (such as Google AdSense).
- **FR-004**: Clicking an ad MUST open the target link in a new browser tab with `rel="noopener noreferrer"`.
- **FR-005**: If the ad content fails to load or is blocked, the system MUST show a beautiful fallback banner encouraging local sponsorship or community support.
- **FR-006**: Users MUST be able to dismiss individual ads by clicking a close (X) button, which hides that specific ad slot for the duration of the current browser session.

### Key Entities *(include if feature involves data)*

- **AdSlot**: Represents a visual component slot on the page where an ad is displayed. Attributes: `id`, `placement` (controlPanel, detailsPanel), `isDismissed`, `isActive`.
- **ThirdPartyAd**: The dynamic script or iframe content injected by the third-party provider.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ad slots load within 300ms after the main app is interactive (if scripts load correctly).
- **SC-002**: Fallback layouts are displayed 100% of the time when external ad assets fail or are blocked.
- **SC-003**: 100% of user clicks on ads successfully redirect to the target URL in a new tab.
- **SC-004**: Ad placements occupy no more than 15% of the total screen space to preserve focus on the interactive canvas.

## Assumptions

- Ad slots are client-side React components integrated into the `ControlPanel` and `DetailsPanel`.
- A simple browser `sessionStorage` or local component state is sufficient to remember dismissed ads for the duration of the session.
- Ad blocker detection is handled via standard check (e.g. checking if a specific ad-related class or script fails to load).
