# Research: Ad Spaces (Espaços para Propaganda)

This document details the research, technical decisions, and rationale for integrating third-party advertisement spaces into the single-page React application.

---

## 1. Dynamic Third-Party Ad Script & iframe Loading in React

### Decision
Use a custom React hook `useAdScript` that dynamically loads the external Google AdSense script (or any specified script URL) and returns the loading status (`loading`, `loaded`, `error`/`blocked`).

### Rationale
- Standard script tags in HTML can block initial page rendering. Loading the script asynchronously in React's lifecycle ensures page load performance goals (SC-001) are met.
- React components can listen to the loading state and show a loader, the actual ad, or trigger the fallback interface immediately upon detection of script failure/blocking.

### Implementation Details
```javascript
// Example Hook Concept
import { useState, useEffect } from 'react';

export function useAdScript(src) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Check if script is already present
    let script = document.querySelector(`script[src="${src}"]`);
    if (script) {
      setStatus('loaded');
      return;
    }

    script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';

    const handleLoad = () => setStatus('loaded');
    const handleError = () => setStatus('error');

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
  }, [src]);

  return status;
}
```

---

## 2. Ad Blocker Detection

### Decision
Implement a multi-layered check:
1. Try to load the official script URL (`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`). If the script triggers an `error` event or a fetch request fails, mark the ad as blocked.
2. Render a tiny invisible bait `div` with CSS classes commonly blocked by easy-list rule-sets (e.g., `adsbox`, `ad-placement`, `doubleclick`). Check if the height is `0` or if the element is hidden (`window.getComputedStyle`).

### Rationale
- Relying on script errors alone can sometimes cause delay. A combination of bait-element checking and script-load monitoring yields immediate and reliable ad-block detection.
- When an ad blocker is detected, the UI instantly collapses the slot or renders the beautiful sponsor banner fallback, ensuring no broken UI layout exists.

---

## 3. Session-Based Ad Dismissal

### Decision
Use browser `sessionStorage` to persist the state of dismissed ad slots. 

### Rationale
- Using `sessionStorage` keeps the dismissal status valid for the current tab/session as requested by the user, but resets it when the tab is closed, meeting the acceptance criteria.
- Component state alone would reset on page reload, which fails User Story 3, Scenario 2.
- LocalStorage would persist across sessions, violating the "current browser session" requirement.

---

## 4. UI/UX Design & Styling

### Decision
- **Left Control Panel Slot**: Placed at the very bottom of the control panel, beneath the input form and buttons. A fixed height container of `120px` to match standard banner sizes.
- **Right Details Panel Slot**: Renders at the bottom of the node details cards.
- **Aesthetics**: Styled using deep dark cards (`bg-[#15151e]`), thin border (`border-white/5`), rounded corners (`rounded-xl`), and micro-animations (fade/collapse) when the close button is clicked.
- **Dismiss Control**: A small floating close `button` with a hover transition in the top-right corner of the ad slot.

---

## 5. Alternatives Considered

| Alternative | Rationale for Rejection |
|---|---|
| **Static Mock Images** | Rejected in favor of the user's choice to support dynamic third-party script integrations like Google AdSense. |
| **LocalStorage Persistence** | Rejected because the user specifically requested "session-dismissible" behavior, where ads reappear when a new session starts. |
| **Persistent Ads (No Close Button)** | Rejected because the user opted for a close (X) button to allow workspace focus. |
