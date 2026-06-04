# Research: Clean and Segment Text

This document outlines the design decisions and technical research for implementing the interactive cleaning, segmentation, and relationship extraction wizard before map generation.

## 1. Interaction and User Flow Design

### Chosen Approach: Step-by-Step Wizard
We chose a multi-step wizard workflow divided into three main steps:
1. **Input**: User pastes raw text and clicks "Analyze & Segment".
2. **Clean & Segment**: Shows AI-extracted segments as editable cards. Users can change titles, content, categories, merge adjacent segments, delete segments, or add new ones.
3. **Review Relationships**: Displays a tabular list of relations between segments. Users can add new connections, edit relation labels, or delete connections.
4. **Interactive Canvas**: Shows the final React Flow canvas populated with the reviewed segments (nodes) and relationships (edges).

### Rationale
- Gives users precise control over what elements are placed on the canvas.
- Prevents messy layout rendering from cluttered raw inputs by validating contents prior to drawing.
- Facilitates correction of AI hallucinations or inaccurate relation maps.

---

## 2. Text Cleaning & Segmentation Engine

### AI-Driven Approach (Gemini API)
We will define a dedicated service function `segmentTextWithAI(text)` using the `gemini-1.5-flash` model.
- **System Prompt**: Instructs Gemini to clean the text (removing HTML tags, markdown formatting, noisy headers) and divide it semantically into logical topics/chapters (segments). It also extracts relationships between these segments.
- **Response Schema**: We will enforce a JSON schema to ensure data reliability:
  ```json
  {
    "type": "OBJECT",
    "properties": {
      "segments": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "id": { "type": "STRING", "description": "kebab-case identifier" },
            "title": { "type": "STRING", "description": "Concise title of the segment" },
            "content": { "type": "STRING", "description": "Cleaned summary/explanation" },
            "category": { "type": "STRING", "enum": ["concept", "action", "warning", "question"] }
          },
          "required": ["id", "title", "content", "category"]
        }
      },
      "relationships": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "source": { "type": "STRING", "description": "Source segment ID" },
            "target": { "type": "STRING", "description": "Target segment ID" },
            "label": { "type": "STRING", "description": "Short relation description (e.g. leads to)" }
          },
          "required": ["source", "target", "label"]
        }
      }
    },
    "required": ["segments", "relationships"]
  }
  ```

### Local Fallback Engine
If the Gemini API key is missing or calls fail, a local engine will run:
1. **Cleaning**: Remove HTML tags (`/<[^>]*>/g`) and compress multiple whitespaces/newlines.
2. **Segmentation**: Split text by double newlines (`\n\n`) or single newlines if double newlines aren't found.
   - Title: First 4 words of the segment.
   - Content: Full paragraph text.
   - Category: Evaluated using simple regex:
     - `must|should|run|execute` -> `action`
     - `not|error|fail|warn` -> `warning`
     - `why|how|\?` -> `question`
     - default -> `concept`
3. **Relationships**: Created sequentially between adjacent segments (e.g. `seg-1` -> `seg-2` -> `seg-3`) with the label `"leads to"`.

---

## 3. UI/UX Design & Styling

We will style the wizard to blend perfectly with the dark glassmorphic styling of the application:
- **Wizard Progress Bar**: A sleek horizontal track showing `1. Input -> 2. Segment -> 3. Relate -> 4. Map` with active glow states.
- **Segment Editor**: A responsive grid showing glassmorphic cards. Cards contain input fields for titles and contents, a dropdown for categories (decorated with matching borders/colors), and quick actions (Delete, Merge Up/Down).
- **Relationship Editor**: A clean table/list layout where each row displays:
  - Source Segment selector (dropdown of current segment titles)
  - Relation Label input field
  - Target Segment selector (dropdown of current segment titles)
  - Delete button
- **Micro-animations**: Smooth transitions when shifting between wizard steps and fading animations for added/deleted segments.
