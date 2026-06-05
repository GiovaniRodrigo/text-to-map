# Interface Contracts: Clean and Segment Text

This directory contains the interface contracts for the text cleaning, segmentation, and mapping features.

## 1. Gemini API Schema (`gemini-schema.json`)
The Gemini API response MUST adhere strictly to the JSON schema defined in [gemini-schema.json](file:///home/giovani/Documents/projects/text-map/specs/003-clean-segment-text/contracts/gemini-schema.json).

- **Segments Extraction**: Extracted blocks are parsed into standard UI cards.
- **Relationships Extraction**: Semantic connections are parsed into editable relationship lists.

## 2. In-Memory React Components Interfaces

### Wizard Navigation Props
Any wizard panel components (e.g. `SegmentEditor`, `RelationshipEditor`) must share the following interface patterns:

- `segments`: Current array of `Segment` objects.
- `onSegmentsChange`: Callback triggered when adding, deleting, updating, or merging segments.
- `relationships`: Current array of `Relationship` objects.
- `onRelationshipsChange`: Callback triggered when adding, deleting, or updating relationships.
- `onNext`: Callback to advance the wizard stage.
- `onBack`: Callback to return to the previous wizard stage.
