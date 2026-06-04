/**
 * Parses Mermaid flowchart code into nodes and edges arrays.
 * Supports flowchart TD/LR, node definitions, connections with labels, and custom node styling.
 * @param {String} text - Raw Mermaid text input
 * @returns {Object} { nodes, edges }
 */
export const parseMermaid = (text) => {
  const nodesMap = new Map();
  const edges = [];

  if (!text || (!text.includes('flowchart') && !text.includes('graph'))) {
    return { nodes: [], edges: [] };
  }

  const lines = text.split('\n');

  // Regex to match node declarations like: ID[Label], ID["Label"], ID(Label), ID{Label}
  const nodeDeclRegex = /([a-zA-Z0-9_-]+)\s*(?:\["([^"]+)"\]|\[([^\]]+)\]|\("([^"]+)"\)|\(([^)]+)\)|\{"([^"]+)"\}|\{([^}]+)\})/g;

  // Regex to match edge connections
  // 1. A -- label --> B
  const edgeLabelArrowRegex = /([a-zA-Z0-9_-]+)\s*--+\s*([^-]+)\s*--+>\s*([a-zA-Z0-9_-]+)/g;
  // 2. A -->|label| B
  const edgePipeLabelRegex = /([a-zA-Z0-9_-]+)\s*(?:--+>|-.->|==+>)\s*\|([^|]+)\|\s*([a-zA-Z0-9_-]+)/g;
  // 3. A --> B (or -.-> or ===>)
  const edgeArrowRegex = /([a-zA-Z0-9_-]+)\s*(?:--+>|-.->|==+>)\s*([a-zA-Z0-9_-]+)/g;

  const createDefaultNode = (id) => ({
    id,
    data: {
      label: id.replace(/_/g, ' '),
      category: 'concept',
      description: '',
    },
    position: { x: 0, y: 0 },
  });

  lines.forEach((line) => {
    let currentLine = line.trim();
    if (!currentLine || currentLine.startsWith('%%')) return;

    // 1. Match Node Declarations and extract labels
    let nodeMatch;
    nodeDeclRegex.lastIndex = 0;
    while ((nodeMatch = nodeDeclRegex.exec(currentLine)) !== null) {
      const id = nodeMatch[1];
      const label = nodeMatch[2] || nodeMatch[3] || nodeMatch[4] || nodeMatch[5] || nodeMatch[6] || nodeMatch[7] || id;
      
      nodesMap.set(id, {
        id,
        data: {
          label: label.trim(),
          category: 'concept',
          description: '',
        },
        position: { x: 0, y: 0 },
      });
    }

    // Strip bracketed label declarations to simplify edge parsing
    currentLine = currentLine.replace(/(?:\["([^"]+)"\]|\[([^\]]+)\]|\("([^"]+)"\)|\(([^)]+)\)|\{"([^"]+)"\}|\{([^}]+)\})/g, '');

    // 2. Match labeled arrows: A -- label --> B
    let matched;
    do {
      matched = false;
      edgeLabelArrowRegex.lastIndex = 0;
      const match = edgeLabelArrowRegex.exec(currentLine);
      if (match) {
        const fullMatch = match[0];
        const source = match[1];
        const label = match[2].trim();
        const target = match[3];

        edges.push({
          id: `e-${source}-${target}`,
          source,
          target,
          label,
        });

        if (!nodesMap.has(source)) nodesMap.set(source, createDefaultNode(source));
        if (!nodesMap.has(target)) nodesMap.set(target, createDefaultNode(target));

        currentLine = currentLine.replace(fullMatch, target);
        matched = true;
      }
    } while (matched);

    // 3. Match pipe labeled arrows: A -->|label| B
    do {
      matched = false;
      edgePipeLabelRegex.lastIndex = 0;
      const match = edgePipeLabelRegex.exec(currentLine);
      if (match) {
        const fullMatch = match[0];
        const source = match[1];
        const label = match[2].trim();
        const target = match[3];

        edges.push({
          id: `e-${source}-${target}`,
          source,
          target,
          label,
        });

        if (!nodesMap.has(source)) nodesMap.set(source, createDefaultNode(source));
        if (!nodesMap.has(target)) nodesMap.set(target, createDefaultNode(target));

        currentLine = currentLine.replace(fullMatch, target);
        matched = true;
      }
    } while (matched);

    // 4. Match plain arrows: A --> B
    do {
      matched = false;
      edgeArrowRegex.lastIndex = 0;
      const match = edgeArrowRegex.exec(currentLine);
      if (match) {
        const fullMatch = match[0];
        const source = match[1];
        const target = match[2];

        if (!edges.some((e) => e.source === source && e.target === target)) {
          edges.push({
            id: `e-${source}-${target}`,
            source,
            target,
            label: '',
          });
        }

        if (!nodesMap.has(source)) nodesMap.set(source, createDefaultNode(source));
        if (!nodesMap.has(target)) nodesMap.set(target, createDefaultNode(target));

        currentLine = currentLine.replace(fullMatch, target);
        matched = true;
      }
    } while (matched);
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
};
