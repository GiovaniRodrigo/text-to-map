import { useMemo, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = {
  customNode: CustomNode,
};

export default function Canvas({
  nodes,
  edges,
  onNodeSelect,
  onPaneSelect,
  selectedNodeId,
  highlightedElementIds,
}) {
  const reactFlowInstance = useReactFlow();

  // Recalculate viewport and fit graph in viewport smoothly when nodes load/change
  useEffect(() => {
    if (nodes.length > 0) {
      const timer = setTimeout(() => {
        reactFlowInstance.fitView({ duration: 400, padding: 0.25 });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [nodes.length, reactFlowInstance]);

  // Viewport focusing when element is highlighted
  useEffect(() => {
    if (highlightedElementIds && highlightedElementIds.size > 0 && reactFlowInstance) {
      const firstId = Array.from(highlightedElementIds)[0];
      const targetNode = nodes.find((n) => n.id === firstId);
      if (targetNode && typeof targetNode.position?.x === 'number') {
        const { x, y } = targetNode.position;
        reactFlowInstance.setCenter(x + 100, y + 50, { zoom: 1.1, duration: 800 });
      } else {
        const targetEdge = edges.find((e) => e.id === firstId);
        if (targetEdge) {
          const sourceNode = nodes.find((n) => n.id === targetEdge.source);
          if (sourceNode && typeof sourceNode.position?.x === 'number') {
            const { x, y } = sourceNode.position;
            reactFlowInstance.setCenter(x + 100, y + 50, { zoom: 1.1, duration: 800 });
          }
        }
      }
    }
  }, [highlightedElementIds, nodes, edges, reactFlowInstance]);

  const customNodes = useMemo(() => {
    return nodes.map((node) => {
      const isHighlighted = highlightedElementIds?.has(node.id);
      return {
        ...node,
        type: 'customNode',
        selected: node.id === selectedNodeId,
        className: `${node.className || ''} ${isHighlighted ? 'pulse-highlight-node' : ''}`.trim(),
      };
    });
  }, [nodes, selectedNodeId, highlightedElementIds]);

  const customEdges = useMemo(() => {
    return edges.map((edge) => {
      const isHighlighted = highlightedElementIds?.has(edge.id);
      return {
        ...edge,
        type: 'smoothstep',
        className: `${edge.className || ''} ${isHighlighted ? 'pulse-highlight-edge' : ''}`.trim(),
        animated: edge.id.includes('animated') || edge.selected,
        style: {
          stroke: edge.id === selectedNodeId ? '#8b5cf6' : 'rgba(255, 255, 255, 0.15)',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: '#64748b',
        },
      };
    });
  }, [edges, selectedNodeId, highlightedElementIds]);


  return (
    <div className="w-full h-full relative bg-[#0f0f13] overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
      <ReactFlow
        nodes={customNodes}
        edges={customEdges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeSelect(node.id)}
        onPaneClick={() => onPaneSelect()}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background color="#ffffff" opacity={0.03} gap={16} size={1.5} />
        <Controls showInteractive={false} className="glass-panel text-white border-white/10" />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.category === 'action') return '#10b981';
            if (n.data?.category === 'warning') return '#f59e0b';
            if (n.data?.category === 'question') return '#d946ef';
            return '#6366f1';
          }}
          maskColor="rgba(15, 15, 19, 0.6)"
          className="!bg-[#121218] !border !border-white/10 !rounded-xl !shadow-2xl overflow-hidden"
          style={{ width: 120, height: 90 }}
        />
      </ReactFlow>
    </div>
  );
}
