import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data, selected }) {
  const { label, category } = data;

  // Dynamic visual styling and categorizations
  let colorClass = '';
  let categoryLabel = 'Concept';
  let icon = '💡';

  switch (category) {
    case 'action':
      colorClass = 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.08)]';
      categoryLabel = 'Action';
      icon = '⚡';
      break;
    case 'warning':
      colorClass = 'border-amber-500/40 bg-amber-950/20 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.08)]';
      categoryLabel = 'Warning';
      icon = '⚠️';
      break;
    case 'question':
      colorClass = 'border-fuchsia-500/40 bg-fuchsia-950/20 text-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,0.08)]';
      categoryLabel = 'Question';
      icon = '❓';
      break;
    default:
      colorClass = 'border-indigo-500/40 bg-indigo-950/20 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.08)]';
      categoryLabel = 'Concept';
      icon = '💡';
  }

  return (
    <div
      className={`px-4 py-3 rounded-xl border glass-panel transition-all-custom w-[220px] text-left select-none ${colorClass} ${
        selected
          ? 'ring-2 ring-violet-500 border-violet-400 scale-[1.04]'
          : 'hover:scale-[1.02] hover:border-violet-500/40'
      }`}
    >
      {/* Target/Source handles on all sides to allow flexible routing in all layouts */}
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
