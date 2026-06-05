# Quickstart & Verification Guide: Drag/Upload Text

This guide details how to verify and validate the "Drag/Upload Text" feature implementation.

## Prerequisites

Ensure all dependencies are installed:
```bash
npm install
```

---

## 1. Automated Verification

Run the unit tests to verify the file validation, size checking, and text extraction logic:
```bash
npm run test -- tests/file-upload.test.js
```

---

## 2. Manual Verification

### Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Test Scenarios

#### Scenario 1: Drag-and-Drop Plain Text
1. Create a local plain text file named `mermaid-diagram.txt` with the following content:
   ```text
   flowchart TD
     Start --> Process
     Process --> End
   ```
2. Drag `mermaid-diagram.txt` over the source input textarea in the Control Panel.
3. **Verify**: A dashed, styled overlay with a "Drop your file here..." message appears over the textarea.
4. Release the file.
5. **Verify**: The overlay disappears, the textarea content is replaced with the file content, and the "Generate Map" button becomes active.
6. Click "Generate Map" and verify that a 3-node diagram renders on the canvas.

#### Scenario 2: File Upload Dialog Fallback
1. Click the "Upload file" icon button located in the top-right corner of the source input area.
2. Select any local `.md` or `.txt` file using the native file browser.
3. **Verify**: The file explorer filters for text files, and once selected, the textarea content is replaced with the selected file's content.

#### Scenario 3: Validation - File Exceeds 100KB Size Limit
1. Create a large text file (over 100KB) or use an existing one.
2. Drag and drop or upload the file.
3. **Verify**: The file is rejected, the text area is NOT updated, and a clear red alert is displayed saying: `Error: File exceeds the maximum limit of 100KB.`

#### Scenario 4: Validation - Non-Text Binary Files
1. Drag and drop a binary file (such as a PNG image or zip file) into the drop zone.
2. **Verify**: The file is rejected, the text area is NOT updated, and an alert is displayed stating: `Error: Only plain text files are supported.`
