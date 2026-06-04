import React from 'react';

export default function RelationshipEditor({
  segments,
  relationships,
  onRelationshipsChange,
  onNext,
  onBack,
}) {
  const handleUpdateRelationship = (id, field, value) => {
    const updated = relationships.map((rel) => {
      if (rel.id === id) {
        return { ...rel, [field]: value };
      }
      return rel;
    });
    onRelationshipsChange(updated);
  };

  const handleDeleteRelationship = (id) => {
    const updated = relationships.filter((rel) => rel.id !== id);
    onRelationshipsChange(updated);
  };

  const handleAddRelationship = () => {
    if (segments.length < 2) return;
    const newId = `r-manual-${Date.now()}`;
    const newRelationship = {
      id: newId,
      sourceSegmentId: segments[0].id,
      targetSegmentId: segments[1].id,
      label: 'relates to',
    };
    onRelationshipsChange([...relationships, newRelationship]);
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      {/* Step Header */}
      <div className="flex justify-between items-center bg-white/2 border border-white/5 rounded-2xl p-6 glass-panel">
        <div>
          <h2 className="text-lg font-bold text-violet-300 flex items-center gap-2">
            <span>🔗</span> Step 2: Review Relationships
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure how the segments connect. These connections will draw directed arrows (edges) on the generated map.
          </p>
        </div>
        <button
          onClick={handleAddRelationship}
          disabled={segments.length < 2}
          className="px-4 py-2 bg-violet-600/30 hover:bg-violet-600/50 disabled:opacity-40 disabled:hover:bg-violet-600/30 border border-violet-500/30 text-violet-200 text-xs font-semibold rounded-xl transition-all active:scale-[0.97]"
        >
          ➕ Add Relationship
        </button>
      </div>

      {/* Relationships Table List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar max-h-[calc(100vh-260px)]">
        {relationships.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-white/10 rounded-2xl text-slate-500">
            <span className="text-3xl mb-2">📭</span>
            <p className="text-xs">No relationships defined yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {relationships.map((rel) => (
              <div
                key={rel.id}
                className="glass-card p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center gap-4 hover:bg-white/[0.01] transition-all"
              >
                {/* Source Node Selector */}
                <div className="w-full sm:w-[35%] flex flex-col space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Source Segment</span>
                  <select
                    value={rel.sourceSegmentId}
                    onChange={(e) => handleUpdateRelationship(rel.id, 'sourceSegmentId', e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500/60"
                  >
                    {segments.map((seg) => (
                      <option key={seg.id} value={seg.id}>
                        {seg.title} ({seg.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Connection Label */}
                <div className="w-full sm:w-[25%] flex flex-col space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Connection Label</span>
                  <input
                    type="text"
                    value={rel.label}
                    onChange={(e) => handleUpdateRelationship(rel.id, 'label', e.target.value)}
                    placeholder="e.g. leads to"
                    className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/60"
                  />
                </div>

                {/* Target Node Selector */}
                <div className="w-full sm:w-[35%] flex flex-col space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Target Segment</span>
                  <select
                    value={rel.targetSegmentId}
                    onChange={(e) => handleUpdateRelationship(rel.id, 'targetSegmentId', e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500/60"
                  >
                    {segments.map((seg) => (
                      <option key={seg.id} value={seg.id}>
                        {seg.title} ({seg.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete row button */}
                <div className="pt-4 sm:pt-0">
                  <button
                    onClick={() => handleDeleteRelationship(rel.id)}
                    title="Delete connection"
                    className="p-2 rounded-lg hover:bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 text-xs transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-white/5 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all active:scale-[0.98]"
        >
          👈 Back to Segments
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
        >
          <span>✨ Generate Map</span>
        </button>
      </div>
    </div>
  );
}
