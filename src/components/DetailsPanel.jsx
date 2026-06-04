export default function DetailsPanel({
  selectedNode,
  edges,
  nodes,
  onClose,
}) {
  const isOpen = !!selectedNode;

  // Determine connected nodes
  const connectedEdges = selectedNode
    ? edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  const parents = [];
  const children = [];

  if (selectedNode) {
    connectedEdges.forEach((edge) => {
      if (edge.target === selectedNode.id) {
        const parentNode = nodes.find((n) => n.id === edge.source);
        if (parentNode) {
          parents.push({ node: parentNode, relation: edge.label });
        }
      } else if (edge.source === selectedNode.id) {
        const childNode = nodes.find((n) => n.id === edge.target);
        if (childNode) {
          children.push({ node: childNode, relation: edge.label });
        }
      }
    });
  }

  // Set category branding
  let categoryBadge = 'Concept';
  let categoryColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  let categoryIcon = '💡';

  if (selectedNode) {
    switch (selectedNode.data?.category) {
      case 'action':
        categoryBadge = 'Action';
        categoryColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        categoryIcon = '⚡';
        break;
      case 'warning':
        categoryBadge = 'Warning';
        categoryColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        categoryIcon = '⚠️';
        break;
      case 'question':
        categoryBadge = 'Question';
        categoryColor = 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20';
        categoryIcon = '❓';
        break;
      default:
        categoryBadge = 'Concept';
        categoryColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        categoryIcon = '💡';
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[380px] z-50 glass-panel shadow-[0_0_50px_rgba(0,0,0,0.8)] border-l border-white/5 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <h3 className="font-bold text-lg text-slate-100">Node Details</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close details"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {selectedNode ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Category Badge & Node Title */}
          <div>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium mb-3 ${categoryColor}`}
            >
              <span>{categoryIcon}</span>
              <span>{categoryBadge}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight leading-tight">
              {selectedNode.data?.label}
            </h2>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 opacity-80">
              Description
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {selectedNode.data?.description || 'No description available for this node.'}
            </p>
          </div>

          {/* Parents Relationships */}
          {parents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 opacity-80">
                Connected From (Parents)
              </h4>
              <div className="space-y-2">
                {parents.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] text-xs"
                  >
                    <span className="font-semibold text-slate-300">{p.node.data?.label}</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 italic">
                      {p.relation || 'connects to'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Children Relationships */}
          {children.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 opacity-80">
                Connected To (Children)
              </h4>
              <div className="space-y-2">
                {children.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] text-xs"
                  >
                    <span className="font-semibold text-slate-300">{c.node.data?.label}</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 italic">
                      {c.relation || 'connects to'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
          <span className="text-3xl">👈</span>
          <p className="text-sm max-w-[240px]">
            Select a node on the canvas to view its detailed description and relationships.
          </p>
        </div>
      )}
    </div>
  );
}
