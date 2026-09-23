import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, X, AlertTriangle, XCircle, Info } from 'lucide-react';

const entryStyles = {
  log: { row: 'text-slate-200', icon: null },
  info: { row: 'text-sky-300', icon: <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> },
  warn: {
    row: 'text-amber-200 bg-amber-500/10 border-amber-500/30',
    icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />,
  },
  error: {
    row: 'text-red-300 bg-red-500/10 border-red-500/30',
    icon: <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />,
  },
};

// Console toolbar toggle with error/output badge, shared by the editors.
export const ConsoleToggleButton = ({ open, entryCount, errorCount, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
      open ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
    }`}
    title="Console"
  >
    <Terminal className="w-4 h-4" />
    Console
    {entryCount > 0 && (
      <span
        className={`ml-1 min-w-[1.25rem] px-1 rounded-full text-[10px] leading-4 text-center ${
          errorCount > 0 ? 'bg-red-500 text-white' : 'bg-slate-500 text-white'
        }`}
      >
        {errorCount > 0 ? errorCount : entryCount}
      </span>
    )}
  </button>
);

const ConsolePanel = ({ entries, errorCount, warnCount, onClear, onClose }) => {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [entries]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-950 text-slate-200">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-700 bg-slate-900 shrink-0">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span>Console</span>
          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-red-400">
              <XCircle className="w-3 h-3" /> {errorCount}
            </span>
          )}
          {warnCount > 0 && (
            <span className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-3 h-3" /> {warnCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close console"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 min-h-0 overflow-auto font-mono text-xs py-1">
        {entries.length === 0 ? (
          <div className="px-3 py-2 text-slate-500">
            console.log() output and JavaScript errors from the preview appear here.
          </div>
        ) : (
          entries.map((entry) => {
            const style = entryStyles[entry.kind] || entryStyles.log;
            return (
              <div
                key={entry.id}
                className={`flex items-start gap-2 px-3 py-1 border-b border-slate-800 ${style.row}`}
              >
                {style.icon || <span className="w-3.5 shrink-0" />}
                <span className="whitespace-pre-wrap break-words min-w-0">{entry.text}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConsolePanel;
