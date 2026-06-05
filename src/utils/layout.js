import dagre from 'dagre';
import * as d3 from 'd3-hierarchy';

/**
 * Calculates node coordinates based on layout type.
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {String} layoutType - 'hierarchical-td' | 'hierarchical-lr' | 'mind-map'
 * @returns {Object} { nodes: LayoutedNodes, edges }
 */
export const getLayoutedElements = (nodes, edges, layoutType = 'hierarchical-td') => {
  if (nodes.length === 0) return { nodes, edges };

  // 1. Hierarchical Layout (Dagre)
  if (layoutType === 'hierarchical-td' || layoutType === 'hierarchical-lr') {
    const isHorizontal = layoutType === 'hierarchical-lr';
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    
    // Configure Dagre graph layout separation
    dagreGraph.setGraph({
      rankdir: isHorizontal ? 'LR' : 'TB',
      nodesep: 80,
      ranksep: 100,
    });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 220, height: 90 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const pos = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: pos.x - 110, // Center alignment offset (half width)
          y: pos.y - 45,  // Center alignment offset (half height)
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  // 2. Mind Map / Radial Tree Layout (D3 Hierarchy)
  try {
    // To construct a hierarchy tree, we must determine the roots and structure.
    const incomingEdgesMap = {};
    nodes.forEach((n) => { incomingEdgesMap[n.id] = []; });
    edges.forEach((e) => {
      if (incomingEdgesMap[e.target]) {
        incomingEdgesMap[e.target].push(e.source);
      }
    });

    // Roots are nodes with no incoming connections
    const roots = nodes.filter((n) => incomingEdgesMap[n.id].length === 0);
    const primaryRoot = roots.length > 0 ? roots[0] : nodes[0];

    const visited = new Set();
    const buildTreeData = (nodeId) => {
      visited.add(nodeId);
      const nodeObj = nodes.find((n) => n.id === nodeId);
      if (!nodeObj) return null;

      // Children are outgoing nodes that haven't been visited (prevents cycles)
      const childElements = edges
        .filter((e) => e.source === nodeId && !visited.has(e.target))
        .map((e) => buildTreeData(e.target))
        .filter(Boolean);

      return {
        id: nodeId,
        children: childElements,
      };
    };

    const hierarchyData = buildTreeData(primaryRoot.id);

    // Append any isolated/unreachable components as children of the main root
    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        const detachedBranch = buildTreeData(n.id);
        if (detachedBranch && hierarchyData) {
          hierarchyData.children.push(detachedBranch);
        }
      }
    });

    if (!hierarchyData) return { nodes, edges };

    const d3Root = d3.hierarchy(hierarchyData);
    // NodeSize sets width-breadth and depth spacing
    const treeGenerator = d3.tree().nodeSize([120, 260]);
    treeGenerator(d3Root);

    const positions = {};
    d3Root.descendants().forEach((d) => {
      // Center the layout horizontally, expanding out from the root
      positions[d.data.id] = {
        x: d.y, // Expand depth horizontally (x)
        y: d.x, // Expand children vertically (y)
      };
    });

    const layoutedNodes = nodes.map((node) => {
      const pos = positions[node.id] || { x: 0, y: 0 };
      return {
        ...node,
        position: {
          x: pos.x,
          y: pos.y,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  } catch (err) {
    console.error('D3 Layout failed, falling back to grid', err);
    // Graceful fallback positioning
    const layoutedNodes = nodes.map((node, index) => ({
      ...node,
      position: { x: (index % 5) * 240, y: Math.floor(index / 5) * 120 },
    }));
    return { nodes: layoutedNodes, edges };
  }
};
