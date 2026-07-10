# Interface Contract: AdSlot Component

This contract defines the React props, visual dimensions, class names, and behavior for the reusable `<AdSlot />` component.

---

## 1. React Props

```typescript
interface AdSlotProps {
  /**
   * Unique identifier for the ad slot to track dismissal in sessionStorage.
   */
  id: string;

  /**
   * The visual placement zone. Determines responsive styling and maximum dimensions.
   */
  placement: 'controlPanel' | 'detailsPanel';

  /**
   * Optional custom classes to inject into the outer container.
   */
  className?: string;

  /**
   * Optional custom third-party script URL to load (e.g. for Google AdSense).
   * Defaults to 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'.
   */
  adClientScriptUrl?: string;
}
```

---

## 2. Dynamic DOM / Script Injection Layout

When initialized, the component will load the third-party script and render a standardized ad container matching standard responsive banner blocks (e.g. 250x250 or 320x100).

### Render HTML Structure (Normal State)
```html
<div class="ad-slot-container rounded-xl border border-white/5 bg-[#15151e] p-4 relative overflow-hidden transition-all duration-200 ease-in-out">
  <!-- Close Button -->
  <button aria-label="Dismiss Ad" class="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors duration-150">
    <svg ...></svg>
  </button>
  
  <!-- Third-party Ad container -->
  <div class="ad-content-wrapper flex items-center justify-center min-h-[100px]">
    <!-- Dynamic Google AdSense Element -->
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-mock-client-id"
         data-ad-slot="1234567890"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  </div>
</div>
```

---

## 3. Fallback Sponsor Layout (Fallback State)

When script loading fails, is timed out, or is blocked by client-side ad blockers:

### Render HTML Structure (Fallback State)
```html
<div class="ad-slot-container rounded-xl border border-white/5 bg-[#15151e] p-4 relative overflow-hidden transition-all duration-200 ease-in-out">
  <!-- Close Button -->
  <button aria-label="Dismiss Ad" class="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors">
    <svg ...></svg>
  </button>
  
  <!-- Fallback Sponsor Content -->
  <div class="flex flex-col items-center text-center justify-center p-2">
    <span class="text-sm font-semibold text-violet-400 mb-1">Support Text-Map</span>
    <p class="text-xs text-slate-400 mb-3">Sponsor this open-source tool or disable ad blockers to support development.</p>
    <a href="https://github.com/sponsors/text-map" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors">
      Sponsor on GitHub
    </a>
  </div>
</div>
```
