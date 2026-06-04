import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import ControlPanel from './components/ControlPanel';
import Canvas from './components/Canvas';
import DetailsPanel from './components/DetailsPanel';
import { parseMermaid } from './utils/mermaid';
import { parseMarkdown } from './utils/markdown';
import { getLayoutedElements } from './utils/layout';

export default function App() {
  const [rawInput, setRawInput] = useState('');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [layoutType, setLayoutType] = useState('hierarchical-td');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Recalculate node positions immediately when layout changes
  useEffect(() => {
    if (nodes.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, layoutType);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [layoutType]);

  const handleGenerate = async () => {
    setError(null);
    setSelectedNodeId(null);
    const trimmedInput = rawInput.trim();

    if (!trimmedInput) return;

    const isMermaid = /^\s*(flowchart|graph)\b/i.test(trimmedInput) || trimmedInput.includes('-->') || trimmedInput.includes('-.->');
    const isMarkdown = /^\s*[-*+]\s+/m.test(trimmedInput) || /^\s*\d+\.\s+/m.test(trimmedInput);

    if (!isMermaid && !isMarkdown) {
      setError({ message: 'Input format not recognized. Please use Mermaid flowchart/graph or Markdown list.' });
      return;
    }

    setIsLoading(true);
    try {
      let parsedNodes = [];
      let parsedEdges = [];

      if (isMermaid) {
        const result = parseMermaid(trimmedInput);
        parsedNodes = result.nodes;
        parsedEdges = result.edges;
        if (parsedNodes.length === 0) {
          throw new Error('Mermaid parser could not extract any nodes. Check flowchart/graph block declarations.');
        }
      } else if (isMarkdown) {
        const result = parseMarkdown(trimmedInput);
        parsedNodes = result.nodes;
        parsedEdges = result.edges;
        if (parsedNodes.length === 0) {
          throw new Error('Markdown parser could not extract nested outline lists.');
        }
      }

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(parsedNodes, parsedEdges, layoutType);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch (err) {
      console.error(err);
      setError({ message: err.message || 'An unexpected error occurred during map generation.' });
      setNodes([]);
      setEdges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setRawInput('');
    setNodes([]);
    setEdges([]);
    setError(null);
    setSelectedNodeId(null);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="flex w-screen h-screen bg-[#0b0b0e] text-slate-100 overflow-hidden">
      <ControlPanel
        rawInput={rawInput}
        onInputChange={setRawInput}
        layoutType={layoutType}
        onLayoutChange={setLayoutType}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        error={error}
        onClear={handleClear}
        onError={setError}
        wizardStep={null}
        onEditStructure={() => {}}
      />
      <div className="flex-1 h-full p-6 relative flex flex-col">
        <div className="flex-1 min-h-0">
          <ReactFlowProvider>
            <Canvas
              nodes={nodes}
              edges={edges}
              onNodeSelect={setSelectedNodeId}
              onPaneSelect={() => setSelectedNodeId(null)}
              selectedNodeId={selectedNodeId}
            />
          </ReactFlowProvider>
        </div>
      </div>
      <DetailsPanel
        selectedNode={selectedNode}
        edges={edges}
        nodes={nodes}
        onClose={() => setSelectedNodeId(null)}
      />
    </div>
  );
}
