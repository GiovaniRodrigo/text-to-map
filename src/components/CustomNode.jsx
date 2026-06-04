import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data, selected }) {
  const { label } = data;
  const colorClass = 'border-indigo-500/40 bg-indigo-950/20 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.08)]';
  const categoryLabel = 'Concept';
  const icon = '💡';

  return (
    <div
      className={`px-4 py-3 rounded-xl border glass-panel transition-all-custom w-[220px] text-left select-none ${colorClass} ${
        selected
          ? 'ring-2 ring-violet-500 border-violet-400 scale-[1.04]'
          : 'hover:scale-[1.02] hover:border-violet-500/40'
      }`}
    >
      <Handle type="target" position={Position.Left} id="l-tar" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Right} id="r-src" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Top} id="t-tar" style={{ left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="b-src" style={{ left: '50%' }} />

      <div className="flex items-center gap-1.5 mb-1 opacity-70">
        <span className="text-xs">{icon}</span>
        <span className="text-[10px] tracking-wider uppercase font-semibold">{categoryLabel}</span>
      </div>

      <div className="font-semibold text-sm leading-snug text-slate-100 line-clamp-2">
        {label}
      </div>
    </div>
  );
}

export default memo(CustomNode);
