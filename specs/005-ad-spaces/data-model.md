# Data Model: Ad Spaces

This document defines the client-side state and browser persistence structure for the ad slots and ad blocking detection state.

---

## 1. Local Component State (`AdSlotState`)

The state tracked within the `AdSlot` components to control rendering and user interactions.

```typescript
interface AdSlotState {
  id: string;          // Unique identifier, e.g. "control-panel-ad"
  placement: string;   // Visual position, either "controlPanel" or "detailsPanel"
  isDismissed: boolean; // Tracks if the user closed the ad in the current session
  isBlocked: boolean;   // Tracks if an ad blocker is preventing script loading
  isLoading: boolean;   // Tracks script loading phase
}
```

---

## 2. Session Persistence (`sessionStorage`)

To ensure that dismissed ads remain hidden across route navigation, wizard steps, and component unmounting/mounting during a single browser session, we persist the state in the browser's `sessionStorage`.

| Storage Key | Value Type | Description |
|---|---|---|
| `text-map:dismissed-ad:control-panel-ad` | `"true" | undefined` | Saved when the user clicks the close (X) button on the left control panel ad slot. |
| `text-map:dismissed-ad:details-panel-ad` | `"true" | undefined` | Saved when the user clicks the close (X) button on the right details panel ad slot. |

---

## 3. Ad Blocker / Fallback Campaign Schema

If third-party scripts fail to load, a fallback sponsor banner is displayed. The banner configuration is static but modeled cleanly:

```typescript
interface FallbackCampaign {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  targetUrl: string;
  accentColor: string; // Tailwind/CSS HSL colors
}
```
Example fallback configuration used inside the React component:
```javascript
const FALLBACK_CAMPAIGN = {
  id: 'sponsor-fallback',
  title: 'Support Text-Map',
  subtitle: 'Sponsor this open-source tool or disable ad blockers to support development.',
  buttonText: 'Sponsor on GitHub',
  targetUrl: 'https://github.com/sponsors/text-map',
  accentColor: 'violet-500'
};
```
