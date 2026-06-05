# Interface Contracts

This directory contains the interface specification contracts for the Generate Map feature.

## 1. Gemini API Schema Contract
* **File**: [gemini-schema.json](file:///home/giovani/Documents/projects/text-map/specs/001-generate-map/contracts/gemini-schema.json)
* **Usage**: Passed directly as `responseSchema` during Gemini API initialization:
  ```javascript
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: mapSchemaJson,
    },
  });
  ```
* **Payload Enforcements**:
  * Guarantees `nodes` is an array containing `id`, `label`, `category`, and `description`.
  * Guarantees `edges` is an array containing `source` and `target` IDs.
  * Restricts node categories to the strict enum: `["concept", "action", "warning", "question"]`.
