export default function HeuristicsPanel({ violations = [], onHighlightElement }) {
  if (violations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
        <span className="text-4xl">✨</span>
        <h3 className="font-semibold text-slate-300 text-sm">Map is Perfectly Healthy</h3>
        <p className="text-xs max-w-[240px]">
          No orphan nodes, circular cycles, self-loops, or category alignment issues detected.
        </p>
      </div>
    );
  }

  // Sort: errors first, then warnings
  const sortedViolations = [...violations].sort((a, b) => {
    const severityScore = { error: 2, warning: 1, info: 0 };
    return (severityScore[b.ruleId] || 0) - (severityScore[a.ruleId] || 0);
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
      <div>
        <h3 className="text-sm font-bold text-slate-300">
          Validation Report ({violations.length} {violations.length === 1 ? 'issue' : 'issues'})
        </h3>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Click on any issue to locate and highlight it on the canvas.
        </p>
      </div>

      <div className="space-y-2">
        {sortedViolations.map((violation) => {
          const isError = violation.ruleId === 'rule-self-loop';
          const icon = isError ? '❌' : '⚠️';
          const badgeClass = isError
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

          return (
            <div
              key={violation.id}
              onClick={() => onHighlightElement(violation.targetIds)}
              className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 cursor-pointer transition-all duration-200 group flex flex-col space-y-2 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-semibold tracking-wider uppercase ${badgeClass}`}>
                  <span>{icon}</span>
                  <span>{isError ? 'Error' : 'Warning'}</span>
                </span>
                <span className="text-[9px] text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  Locate 🔍
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed group-hover:text-slate-200">
                {violation.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
