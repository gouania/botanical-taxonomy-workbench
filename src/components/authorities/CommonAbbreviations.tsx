import React from 'react';

interface CommonAbbreviationsProps {
  examples: string[];
  onSelect: (ex: string) => void;
}

export function CommonAbbreviations({ examples, onSelect }: CommonAbbreviationsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <span className="text-sm text-slate-500 py-1">Common Abbreviations:</span>
      {examples.map((ex) => (
        <button
          key={ex}
          onClick={() => onSelect(ex)}
          className="px-3 py-1 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-cyan-400 rounded-full text-sm font-mono transition-colors border border-slate-700/50"
        >
          {ex}
        </button>
      ))}
    </div>
  );
}
