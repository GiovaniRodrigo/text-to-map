import { useState } from 'react';
import { validateFile, readFileContent } from '../utils/fileUpload';

export default function ControlPanel({
  rawInput,
  onInputChange,
  layoutType,
  onLayoutChange,
  onGenerate,
  isLoading,
  error,
  onClear,
  onError,
  wizardStep,
  onEditStructure,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const trimmedInput = rawInput.trim();
  const isMermaid = /^\s*(flowchart|graph)\b/i.test(trimmedInput) || trimmedInput.includes('-->') || trimmedInput.includes('-.->');
  const isMarkdown = /^\s*[-*+]\s+/m.test(trimmedInput) || /^\s*\d+\.\s+/m.test(trimmedInput);
  const isRawText = trimmedInput.length > 0 && !isMermaid && !isMarkdown;

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if leaving the main container (to handle child element hover bugs)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processUploadedFile(file);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processUploadedFile(file);
      e.target.value = ''; // Reset to allow re-uploading the same file
    }
  };

  const processUploadedFile = async (file) => {
    if (onError) onError(null);

    const validation = validateFile(file);
    if (!validation.valid) {
      if (onError) onError({ message: validation.error });
      return;
    }

    try {
      const content = await readFileContent(file);
      onInputChange(content);
    } catch (err) {
      if (onError) {
        onError({ message: err.message || 'Failed to read file content.' });
      }
    }
  };

  return (
    <div className="w-full lg:w-[400px] h-full glass-panel border-r border-white/5 flex flex-col p-6 space-y-6">
      {/* Brand Header */}
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
          TextMap Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Turn Mermaid, Markdown outlines, or raw text into visual interactive maps.
        </p>
      </div>

      {/* Input Area */}
      <div className="flex-1 flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold tracking-wider uppercase text-slate-400 opacity-80">
            Source Text / Outline
          </label>
          <label className="flex items-center gap-1 py-0.5 px-2 rounded-lg bg-white/5 border border-white/5 text-[9px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/10 cursor-pointer transition-all active:scale-[0.97]">
            <span>📥</span>
            <span>Upload File</span>
            <input
              type="file"
              accept=".txt,.md,.mermaid,.json,.js,.jsx,.csv,.xml,.yml,.yaml"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <div
          className="flex-1 relative flex flex-col"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <textarea
            value={rawInput}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={`Paste Mermaid code:
flowchart TD
  A --> B

Or Markdown:
- Main Topic
  - Sub-topic

Or raw paragraphs of text for AI generation...`}
            className="flex-1 w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none transition-all"
          />

          {isDragging && (
            <div className="absolute inset-0 bg-[#0b0b0e]/90 backdrop-blur-md border border-dashed border-violet-500/50 rounded-xl flex flex-col items-center justify-center space-y-2 pointer-events-none transition-all duration-200 z-50">
              <span className="text-3xl animate-bounce">📥</span>
              <p className="text-xs font-bold text-violet-400">Drop your file here...</p>
              <p className="text-[9px] text-slate-500">Plain text files up to 500KB</p>
            </div>
          )}
        </div>
      </div>


      {/* Settings / Controls */}
      <div className="space-y-4">
        {/* Layout Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold tracking-wider uppercase text-slate-400 opacity-80">
            Layout Style
          </label>
          <select
            value={layoutType}
            onChange={(e) => onLayoutChange(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
          >
            <option value="hierarchical-td" className="bg-[#121218] text-slate-300">
              Hierarchical (Top-Down)
            </option>
            <option value="hierarchical-lr" className="bg-[#121218] text-slate-300">
              Hierarchical (Left-to-Right)
            </option>
            <option value="mind-map" className="bg-[#121218] text-slate-300">
              Mind Map (Horizontal)
            </option>
          </select>
        </div>

        {/* Error Log Panel */}
        {error && (
          <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
              <span>⚠️</span>
              <span>Generation Error</span>
            </div>
            <p className="text-[10px] text-red-300 leading-normal">
              {error.message || 'Parsing failed. Check your syntax.'}
            </p>
          </div>
        )}

        {/* Edit Structure Wizard button */}
        {wizardStep === 'map' && (
          <button
            onClick={onEditStructure}
            className="w-full bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/30 text-violet-300 font-bold text-xs py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-2"
          >
            <span>✏️</span>
            <span>Edit Structure</span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="px-4 py-3 rounded-xl border border-white/5 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all active:scale-[0.98]"
          >
            Clear
          </button>
          <button
            onClick={onGenerate}
            disabled={isLoading || !rawInput.trim()}
            className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-950/40 disabled:text-slate-500 text-white font-semibold text-xs py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(139,92,246,0.3)] disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{isRawText ? 'Segmenting...' : 'Extracting...'}</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>{isRawText ? 'Analyze & Segment' : 'Generate Map'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
