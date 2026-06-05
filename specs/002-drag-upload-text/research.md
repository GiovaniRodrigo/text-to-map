# Research: Drag/Upload Text

This research outlines the architectural choices and technical approaches for implementing drag-and-drop and file uploading capabilities in TextMap Studio.

## 1. Drag and Drop Interaction

* **Decision**: Use the native HTML5 Drag and Drop API (`onDragEnter`, `onDragOver`, `onDragLeave`, and `onDrop`) combined with React state hooks to toggle a conditional overlay on the input textarea.
* **Rationale**:
  * Native browser support is mature and lightweight, requiring no external packages (keeps dependencies minimal).
  * Full control over styling transitions and glassmorphism styling to match TextMap Studio's design system.
* **Alternatives Considered**: 
  * `react-dropzone`: Evaluated for ease of use, but rejected because importing an external library is unnecessary for a single textarea overlay. A native React implementation requires less than 40 lines of code.

## 2. File Reading

* **Decision**: Use the browser's asynchronous `FileReader` API (`readAsText`) to extract the text content of the dropped or selected file.
* **Rationale**:
  * `FileReader` is the standard browser API for reading file contents on the client side.
  * `readAsText` handles text decoding natively (defaulting to UTF-8), ensuring compatibility with standard plain text, Markdown outlines, and Mermaid diagram code.
* **Alternatives Considered**:
  * `file.text()` Promise-based API: Modern browser method on the `Blob` interface. While simpler than setting up `FileReader` event listeners, `FileReader` has wider backward compatibility and fits standard React asynchronous handler structures perfectly. We will use `FileReader` for robustness.

## 3. File Validation & Error UI

* **Decision**: Validate the file size (`file.size <= 102400` bytes) and verify file extensions/mime-types synchronously before reading content. Display any failure message inline in the existing Control Panel error alert container.
* **Rationale**:
  * Prevents reading massive text files that could crash the browser tab or hit rate-limits/timeouts in the Gemini API.
  * Direct integration into the existing Control Panel error display keeps the interface clean and unified.
* **Alternatives Considered**:
  * Warning Modals: Rejected as too intrusive for simple file-validation errors; inline errors maintain user flow.
