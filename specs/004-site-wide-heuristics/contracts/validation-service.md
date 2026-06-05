# Validation Service Contract

This contract defines the programmatic interface for the client-side heuristics validation functions.

## `validateMap` Function

Calculates all violations on the current set of nodes and edges.

### Signature
```typescript
function validateMap(nodes: Node[], edges: Edge[]): HeuristicViolation[]
```

### Input Parameters
- **`nodes`**: Array of React Flow node objects.
  ```json
  {
    "id": "string",
    "data": {
      "label": "string",
      "category": "concept" | "action" | "warning" | "question",
      "description": "string"
    }
  }
  ```
- **`edges`**: Array of React Flow edge objects.
  ```json
  {
    "id": "string",
    "source": "string",
    "target": "string",
    "label": "string"
  }
  ```

### Output Value
- Returns an array of **`HeuristicViolation`** objects:
  ```json
  [
    {
      "id": "violation-rule-orphan-node-node-1",
      "ruleId": "rule-orphan-node",
      "targetType": "node",
      "targetIds": ["node-1"],
      "message": "Node 'Database' is disconnected from the rest of the map."
    }
  ]
  ```
