/**
 * Parses nested Markdown outline structures (lists) into nodes and edges.
 * Supports spaces and tabs as indentations and cleans up standard markdown formatting symbols.
 * @param {String} text - Raw Markdown outline text input
 * @returns {Object} { nodes, edges }
 */
export const parseMarkdown = (text) => {
  const nodes = [];
  const edges = [];

  if (!text) return { nodes: [], edges: [] };

  const lines = text.split('\n');
  const stack = []; // Holds objects of: { id, depth }
  let nodeIdCounter = 1;

  lines.forEach((line) => {
    // Regex for list items: e.g. "- Root", "  * Item", "\t1. Sub-item"
    const listItemRegex = /^([\s\t]*)(?:[-*+]|\d+\.)\s+(.+)$/;
    const match = line.match(listItemRegex);
    if (!match) return;

    const whitespace = match[1];
    const rawContent = match[2].trim();

    // Remove bold (*, **), italic (*, _), code (`) or strike (~~) markdown symbols
    const label = rawContent.replace(/[\*_`~]/g, '');

    // Calculate indentation depth (tabs count as 4 spaces)
    let depth = 0;
    for (let i = 0; i < whitespace.length; i++) {
      if (whitespace[i] === '\t') {
        depth += 4;
      } else {
        depth += 1;
      }
    }

    const id = `node-${nodeIdCounter++}`;
    const newNode = {
      id,
      data: {
        label,
        category: 'concept',
        description: '',
      },
      position: { x: 0, y: 0 },
    };
    nodes.push(newNode);

    // Pop from stack until the top item is a parent with less depth
    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    // If parent exists, connect them
    if (stack.length > 0) {
      const parent = stack[stack.length - 1];
      edges.push({
        id: `e-${parent.id}-${id}`,
        source: parent.id,
        target: id,
        label: 'has child',
      });
    }

    // Push current item onto stack
    stack.push({ id, depth });
  });

  return { nodes, edges };
};
