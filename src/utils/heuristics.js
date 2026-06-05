/**
 * Evaluates a set of nodes and edges against predefined graph heuristic rules.
 *
 * @param {Array} nodes React Flow node objects
 * @param {Array} edges React Flow edge objects
 * @returns {Array} List of HeuristicViolation objects
 */
export function validateMap(nodes = [], edges = []) {
  const violations = [];
  const connectedNodeIds = new Set();

  // Populate connectedNodeIds for orphan check
  edges.forEach((edge) => {
    if (edge.source) connectedNodeIds.add(edge.source);
    if (edge.target) connectedNodeIds.add(edge.target);
  });

  // 1. Orphan Check
  nodes.forEach((node) => {
    if (!connectedNodeIds.has(node.id)) {
      violations.push({
        id: `violation-rule-orphan-node-${node.id}`,
        ruleId: 'rule-orphan-node',
        targetType: 'node',
        targetIds: [node.id],
        message: `Node '${node.data?.label || node.id}' is disconnected from the rest of the map.`,
      });
    }
  });

  // 2. Self-Loop Check
  edges.forEach((edge) => {
    if (edge.source && edge.target && edge.source === edge.target) {
      const nodeLabel = nodes.find(n => n.id === edge.source)?.data?.label || edge.source;
      violations.push({
        id: `violation-rule-self-loop-${edge.id}`,
        ruleId: 'rule-self-loop',
        targetType: 'edge',
        targetIds: [edge.id],
        message: `Redundant connection: edge relates '${nodeLabel}' to itself.`,
      });
    }
  });

  // 3. Category Alignment Check
  const warningKeywords = ['not', 'prevent', 'danger', 'error', 'fail', 'warn', 'avoid', 'no', 'never', 'restrict'];
  const actionKeywords = ['run', 'execute', 'do', 'create', 'call', 'build', 'process', 'start', 'stop', 'handle', 'use', 'make', 'perform'];

  nodes.forEach((node) => {
    const category = node.data?.category;
    if (!category) return;

    const label = (node.data?.label || '').toLowerCase();
    const description = (node.data?.description || '').toLowerCase();
    const combinedText = `${label} ${description}`;

    if (category === 'warning') {
      const hasKeyword = warningKeywords.some((word) => {
        if (word === 'no') {
          return new RegExp('\\bno\\b', 'i').test(combinedText);
        }
        return new RegExp('\\b' + word, 'i').test(combinedText);
      });
      if (!hasKeyword) {
        violations.push({
          id: `violation-rule-category-alignment-${node.id}`,
          ruleId: 'rule-category-alignment',
          targetType: 'node',
          targetIds: [node.id],
          message: `Node '${node.data?.label || node.id}' is categorized as Warning, but its text doesn't contain typical indicator words (e.g. prevent, danger, not).`,
        });
      }
    } else if (category === 'action') {
      const hasKeyword = actionKeywords.some((word) => {
        if (word === 'do') {
          return new RegExp('\\bdo\\b', 'i').test(combinedText);
        }
        return new RegExp('\\b' + word, 'i').test(combinedText);
      });
      if (!hasKeyword) {
        violations.push({
          id: `violation-rule-category-alignment-${node.id}`,
          ruleId: 'rule-category-alignment',
          targetType: 'node',
          targetIds: [node.id],
          message: `Node '${node.data?.label || node.id}' is categorized as Action, but its text doesn't contain typical action verbs (e.g. run, execute, create).`,
        });
      }
    }
  });

  // 4. Circular Cycle Check (DFS 3-coloring algorithm)
  const adj = {};
  nodes.forEach((n) => {
    adj[n.id] = [];
  });
  edges.forEach((e) => {
    if (e.source && e.target && e.source !== e.target && adj[e.source] && adj[e.target]) {
      adj[e.source].push(e.target);
    }
  });

  const state = {}; // 0 = unvisited, 1 = visiting, 2 = visited
  nodes.forEach((n) => {
    state[n.id] = 0;
  });

  const nodesInCycles = new Set();

  function dfs(u, path) {
    state[u] = 1; // visiting
    path.push(u);

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      if (state[v] === 1) {
        const cycleStartIndex = path.indexOf(v);
        if (cycleStartIndex !== -1) {
          for (let i = cycleStartIndex; i < path.length; i++) {
            nodesInCycles.add(path[i]);
          }
        }
      } else if (state[v] === 0) {
        dfs(v, path);
      }
    }

    path.pop();
    state[u] = 2; // visited
  }

  nodes.forEach((n) => {
    if (state[n.id] === 0) {
      dfs(n.id, []);
    }
  });

  nodesInCycles.forEach((nodeId) => {
    violations.push({
      id: `violation-rule-circular-cycle-${nodeId}`,
      ruleId: 'rule-circular-cycle',
      targetType: 'node',
      targetIds: [nodeId],
      message: `Node '${nodes.find((n) => n.id === nodeId)?.data?.label || nodeId}' is part of a circular dependency cycle.`,
    });
  });

  return violations;
}
