# Research: Generate Map

This document consolidates findings, design decisions, and rationales for the implementation of the Generate Map feature.

## 1. Automatic Parsing Detection & Routing
* **Decision**: Implement an automatic pattern-matching routing system in the frontend.
* **Rationale**: Fast, offline-first execution for structured documents. If input begins with standard Mermaid flowchart syntax (e.g., `graph`, `flowchart`, `subgraph`) or matches a tabbed/spaced Markdown indent pattern, the application runs local parsers. Otherwise, it defaults to calling the Gemini API.
* **Alternatives Considered**: 
  * *Manual Toggle*: Rejected because it adds friction to the user experience.
  * *AI-only parsing*: Rejected due to high latency, cost, and offline limitations for valid structured inputs.

## 2. Canvas & Graph Rendering Library
* **Decision**: React Flow (v11+).
* **Rationale**: Out-of-the-box support for canvas zoom, pan, mini-map, background patterns, node/edge drag events, and customizable node templates. Highly modular and integrates seamlessly with standard React state.
* **Alternatives Considered**: 
  * *D3.js directly on Canvas/SVG*: Too low-level. Writing custom logic for node dragging, zooming, selection, and edge routing would consume significant development time.
  * *Vis.js / Cytoscape*: Harder to theme cleanly with modern CSS frameworks (Tailwind) compared to React Flow's native component-based nodes.

## 3. Layout Engines (Dagre & D3-Hierarchy)
* **Decision**: Use `dagre` for top-down/left-to-right layouts, and `d3-hierarchy` / `d3-force` for radial mind-maps.
* **Rationale**: React Flow itself does not position nodes automatically. Combining `dagre` for structured hierarchy and `d3` layout calculators provides the exact Multi-Layout capability ratified in Core Principle II of the project constitution.
* **Alternatives Considered**:
  * *ELK (Eclipse Layout Kernel)*: Very powerful but highly complex configuration and significantly larger bundle size.

## 4. Gemini API Integration & Response Schema
* **Decision**: Enforce structured JSON output using Gemini's `responseSchema` configuration.
* **Rationale**: Guarantees the AI returns data matching our exact schema:
  ```json
  {
    "type": "OBJECT",
    "properties": {
      "nodes": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "id": { "type": "STRING" },
            "label": { "type": "STRING" },
            "category": { "type": "STRING", "enum": ["concept", "action", "warning", "question"] },
            "description": { "type": "STRING" }
          },
          "required": ["id", "label", "category", "description"]
        }
      },
      "edges": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "source": { "type": "STRING" },
            "target": { "type": "STRING" },
            "label": { "type": "STRING" }
          },
          "required": ["source", "target"]
        }
      }
    },
    "required": ["nodes", "edges"]
  }
  ```
  This prevents malformed output and ensures instant mapping to React Flow without post-LLM cleanup regex.
* **Alternatives Considered**: 
  * *Raw text output parsing*: Incredibly fragile; frequently fails to parse edge mappings.

## 5. Testing Framework
* **Decision**: Vitest.
* **Rationale**: Zero-configuration setup with Vite projects, supports hot module reloading, and allows testing pure JS utilities (parsers and layout calculators) with standard Jest-like syntax.
* **Alternatives Considered**:
  * *Jest*: Requires complex Babel/TS configurations when used inside a Vite environment.
