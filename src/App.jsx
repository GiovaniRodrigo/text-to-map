import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import ControlPanel from './components/ControlPanel';
import Canvas from './components/Canvas';
import DetailsPanel from './components/DetailsPanel';
import SegmentEditor from './components/SegmentEditor';
import { parseMermaid } from './utils/mermaid';
import { parseMarkdown } from './utils/markdown';
import { getLayoutedElements } from './utils/layout';
import { segmentTextWithAI } from './services/gemini';

export default function App() {
  const [rawInput, setRawInput] = useState('');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [layoutType, setLayoutType] = useState('hierarchical-td');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Wizard States
  const [wizardStep, setWizardStep] = useState(null); // null, 'segments', 'relationships', 'map'
  const [segments, setSegments] = useState([]);
  const [relationships, setRelationships] = useState([]);

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

    // Detect input format structure
    const isMermaid = /^\s*(flowchart|graph)\b/i.test(trimmedInput) || trimmedInput.includes('-->') || trimmedInput.includes('-.->');
    const isMarkdown = /^\s*[-*+]\s+/m.test(trimmedInput) || /^\s*\d+\.\s+/m.test(trimmedInput);

    // Route raw/unstructured text to Wizard Flow
    if (!isMermaid && !isMarkdown) {
      setIsLoading(true);
      try {
        const result = await segmentTextWithAI(trimmedInput);
        if (result.segments.length === 0) {
          throw new Error('AI was unable to extract any conceptual segments. Please add more detail to the input.');
        }
        setSegments(result.segments);
        setRelationships(result.relationships);
        setWizardStep('segments');
      } catch (err) {
        console.error(err);
        setError({ message: err.message || 'An unexpected error occurred during text segmentation.' });
        setSegments([]);
        setRelationships([]);
        setWizardStep(null);
      } finally {
        setIsLoading(false);
      }
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

      // Lay out the parsed structure
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(parsedNodes, parsedEdges, layoutType);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setWizardStep(null); // Direct generation is not in wizard mode
    } catch (err) {
      console.error(err);
      setError({ message: err.message || 'An unexpected error occurred during map generation.' });
      setNodes([]);
      setEdges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMapFromWizard = () => {
    setError(null);
    setSelectedNodeId(null);

    // Map segments to React Flow nodes
    const mappedNodes = segments.map((seg) => ({
      id: seg.id,
      data: {
        label: seg.title,
        category: seg.category,
        description: seg.content,
      },
      position: { x: 0, y: 0 },
    }));

    // Map relationships to React Flow edges
    const mappedEdges = relationships.map((rel) => ({
      id: rel.id || `e-${rel.sourceSegmentId}-${rel.targetSegmentId}`,
      source: rel.sourceSegmentId,
      target: rel.targetSegmentId,
      label: rel.label,
    }));

    // Lay out and render
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(mappedNodes, mappedEdges, layoutType);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setWizardStep('map');
  };

  const handleClear = () => {
    setRawInput('');
    setNodes([]);
    setEdges([]);
    setError(null);
    setSelectedNodeId(null);
    setWizardStep(null);
    setSegments([]);
    setRelationships([]);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const renderProgress = () => {
    if (wizardStep !== 'segments' && wizardStep !== 'relationships') return null;
    return (
      <div className="flex items-center justify-center gap-8 mb-6 pb-4 border-b border-white/5">
        <div className={`flex items-center gap-2 transition-all duration-200 ${wizardStep === 'segments' ? 'text-violet-400 font-bold' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${wizardStep === 'segments' ? 'bg-violet-600 text-white' : 'bg-white/10 text-slate-400'}`}>1</span>
          <span>Clean & Segment</span>
        </div>
        <div className="w-12 h-[1px] bg-white/10"></div>
        <div className={`flex items-center gap-2 transition-all duration-200 ${wizardStep === 'relationships' ? 'text-violet-400 font-bold' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${wizardStep === 'relationships' ? 'bg-violet-600 text-white' : 'bg-white/10 text-slate-400'}`}>2</span>
          <span>Review Relationships</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-screen h-screen bg-[#0b0b0e] text-slate-100 overflow-hidden">
      {wizardStep !== 'segments' && wizardStep !== 'relationships' && (
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
          wizardStep={wizardStep}
          onEditStructure={() => setWizardStep('relationships')}
        />
      )}
      <div className="flex-1 h-full p-6 relative flex flex-col">
        {renderProgress()}
        <div className="flex-1 min-h-0">
          {wizardStep === 'segments' ? (
            <SegmentEditor
              segments={segments}
              onSegmentsChange={setSegments}
              onNext={() => setWizardStep('relationships')}
              onBack={() => setWizardStep(null)}
            />
          ) : wizardStep === 'relationships' ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <h2 className="text-lg font-bold text-violet-300">Step 2: Review Relationships (Placeholder)</h2>
              <p className="text-xs text-slate-400">Manage and edit connections between segments in the next phase.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setWizardStep('segments')}
                  className="px-4 py-2 border border-white/10 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateMapFromWizard}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold"
                >
                  Generate Map
                </button>
              </div>
            </div>
          ) : (
            <ReactFlowProvider>
              <Canvas
                nodes={nodes}
                edges={edges}
                onNodeSelect={setSelectedNodeId}
                onPaneSelect={() => setSelectedNodeId(null)}
                selectedNodeId={selectedNodeId}
              />
            </ReactFlowProvider>
          )}
        </div>
      </div>
      {wizardStep !== 'segments' && wizardStep !== 'relationships' && (
        <DetailsPanel
          selectedNode={selectedNode}
          edges={edges}
          nodes={nodes}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}
