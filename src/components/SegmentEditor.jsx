import React from 'react';

export default function SegmentEditor({
  segments,
  onSegmentsChange,
  onNext,
  onBack,
}) {
  const handleUpdateSegment = (id, field, value) => {
    const updated = segments.map((seg) => {
      if (seg.id === id) {
        return { ...seg, [field]: value };
      }
      return seg;
    });
    onSegmentsChange(updated);
  };

  const handleDeleteSegment = (id) => {
    const updated = segments.filter((seg) => seg.id !== id);
    onSegmentsChange(updated);
  };

  const handleAddSegment = () => {
    const newId = `seg-manual-${Date.now()}`;
    const newSegment = {
      id: newId,
      title: 'New Segment',
      content: 'Enter description here...',
      category: 'concept',
    };
    onSegmentsChange([...segments, newSegment]);
  };

  const handleMergeDown = (index) => {
    if (index >= segments.length - 1) return;
    
    const current = segments[index];
    const next = segments[index + 1];
    
    const merged = {
      ...current,
      title: `${current.title} & ${next.title}`,
      content: `${current.content}\n\n${next.content}`,
    };

    const updated = [...segments];
    updated.splice(index, 2, merged); // replace the two with the merged one
    onSegmentsChange(updated);
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      {/* Step Header */}
      <div className="flex justify-between items-center bg-white/2 border border-white/5 rounded-2xl p-6 glass-panel">
        <div>
          <h2 className="text-lg font-bold text-violet-300 flex items-center gap-2">
            <span>📝</span> Step 1: Clean & Segment Text
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review, edit, delete, or merge the segments extracted from your text. The category changes the visual decoration on the final map.
          </p>
        </div>
        <button
          onClick={handleAddSegment}
          className="px-4 py-2 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 text-violet-200 text-xs font-semibold rounded-xl transition-all active:scale-[0.97]"
        >
          ➕ Add Segment
        </button>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar max-h-[calc(100vh-260px)]">
        {segments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-white/10 rounded-2xl text-slate-500">
            <span className="text-3xl mb-2">📭</span>
            <p className="text-xs">No segments found. Add one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {segments.map((seg, idx) => {
              // Map categories to decorative border/glow styles matching CustomNode
              let catBorder = 'border-indigo-500/20 focus-within:border-indigo-500/60';
              if (seg.category === 'action') catBorder = 'border-emerald-500/20 focus-within:border-emerald-500/60';
              else if (seg.category === 'warning') catBorder = 'border-amber-500/20 focus-within:border-amber-500/60';
              else if (seg.category === 'question') catBorder = 'border-fuchsia-500/20 focus-within:border-fuchsia-500/60';

              return (
                <div
                  key={seg.id}
                  className={`glass-card p-4 rounded-xl border flex flex-col space-y-3 transition-all duration-200 hover:bg-white/[0.02] ${catBorder}`}
                >
                  {/* Top Bar controls */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {seg.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {idx < segments.length - 1 && (
                        <button
                          onClick={() => handleMergeDown(idx)}
                          title="Merge with segment below"
                          className="p-1.5 rounded-lg hover:bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200 text-[10px] font-semibold flex items-center gap-1 transition-all"
                        >
                          <span>⬇️</span> Merge
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSegment(seg.id)}
                        title="Delete segment"
                        className="p-1.5 rounded-lg hover:bg-red-500/10 border border-red-500/10 text-red-400 hover:text-red-300 text-xs transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Title and Category Row */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={seg.title}
                      onChange={(e) => handleUpdateSegment(seg.id, 'title', e.target.value)}
                      placeholder="Segment Title"
                      className="flex-1 bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-all"
                    />
                    <select
                      value={seg.category}
                      onChange={(e) => handleUpdateSegment(seg.id, 'category', e.target.value)}
                      className="bg-black/30 border border-white/5 rounded-lg px-2 py-2 text-xs text-slate-300 cursor-pointer focus:outline-none focus:border-violet-500/60"
                    >
                      <option value="concept">Concept 💡</option>
                      <option value="action">Action ⚡</option>
                      <option value="warning">Warning ⚠️</option>
                      <option value="question">Question ❓</option>
                    </select>
                  </div>

                  {/* Content / Summary Area */}
                  <textarea
                    value={seg.content}
                    onChange={(e) => handleUpdateSegment(seg.id, 'content', e.target.value)}
                    placeholder="Segment details/summary..."
                    className="w-full h-24 bg-black/30 border border-white/5 rounded-lg p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 resize-none transition-all custom-scrollbar"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl border border-white/5 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all active:scale-[0.98]"
        >
          👈 Back to Input
        </button>
        <button
          onClick={onNext}
          disabled={segments.length === 0}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-950/40 disabled:text-slate-500 text-white font-semibold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-[0_4px_20px_rgba(139,92,246,0.25)]"
        >
          <span>Next: Review Relationships</span> 👉
        </button>
      </div>
    </div>
  );
}
