export default function HeuristicsBadge({ violationsCount = 0, onClick, isOpen }) {
  const isHealthy = violationsCount === 0;

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full border glass-panel shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer ${
        isOpen
          ? 'border-violet-500/40 text-violet-300 bg-violet-950/20'
          : isHealthy
          ? 'border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-950/10'
          : 'border-amber-500/20 text-amber-400 hover:border-amber-500/40 hover:bg-amber-950/10'
      }`}
      aria-label="Map health heuristics report"
    >
      <span className="text-sm">
        {isHealthy ? '✅' : '⚠️'}
      </span>
      <span className="text-xs font-bold tracking-wide">
        {isHealthy ? 'Map Healthy' : `${violationsCount} Map ${violationsCount === 1 ? 'Issue' : 'Issues'}`}
      </span>
    </button>
  );
}
