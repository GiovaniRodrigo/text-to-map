# Data Model: Site-Wide Heuristics

This document describes the schemas and validation criteria for the heuristics rules and violations.

## 1. Entity Definitions

### HeuristicRule
Defines a rule evaluated by the validation engine.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique identifier (e.g. `rule-orphan-node`) |
| `name` | `string` | User-friendly short title of the rule |
| `description` | `string` | Explanation of why this rule exists |
| `severity` | `'error' \| 'warning' \| 'info'` | Severity level of the violation |

### HeuristicViolation
Represents a failure of a specific `HeuristicRule` on one or more map elements.

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique identifier (`violation-<ruleId>-<targetId>`) |
| `ruleId` | `string` | Reference to the `HeuristicRule.id` |
| `targetType` | `'node' \| 'edge'` | Type of graph element violating the rule |
| `targetIds` | `string[]` | List of affected node/edge IDs |
| `message` | `string` | Human-readable message detailing the specific violation |

---

## 2. Predefined Rules List

We define 4 core rules within the system:

1. **`rule-orphan-node`**
   - **Severity**: `warning`
   - **Target**: `node`
   - **Condition**: Node has no incoming and no outgoing edges.
   - **Message**: "Node '[Label]' is disconnected from the rest of the map."

2. **`rule-self-loop`**
   - **Severity**: `error`
   - **Target**: `edge`
   - **Condition**: Edge has `source === target`.
   - **Message**: "Edge relates node '[Label]' to itself, which is redundant."

3. **`rule-category-alignment`**
   - **Severity**: `warning`
   - **Target**: `node`
   - **Condition**:
     - Category is `'warning'` but label/description does not contain any of: `not, prevent, danger, error, fail, warn, avoid, no, never, restrict`.
     - Category is `'action'` but label/description does not contain any of: `run, execute, do, create, call, build, process, start, stop, handle, use, make, perform`.
   - **Message**: "Node '[Label]' is categorized as [Category], but its content lacks typical indicators."

4. **`rule-circular-cycle`**
   - **Severity**: `warning`
   - **Target**: `node` (involved in the cycle)
   - **Condition**: Node is part of a directed cycle (e.g. A -> B -> C -> A).
   - **Message**: "Node '[Label]' is part of a circular dependency cycle."
