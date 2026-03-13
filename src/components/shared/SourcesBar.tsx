import { ExternalLink } from 'lucide-react';
import React from 'react';
import { GroundingSource } from '../../types';

interface SourcesBarProps {
  sources: GroundingSource[];
  mode?: 'inline' | 'sticky';
}

export function SourcesBar({ sources, mode = 'inline' }: SourcesBarProps) {
  if (!sources || sources.length === 0) return null;

  // Deduplicate sources by URI
  const uniqueSources = Array.from(
    new Map(sources.map((s) => [s.uri, s])).values()
  ).filter((s) => s.uri && s.title);

  if (uniqueSources.length === 0) return null;

  const containerClasses =
    mode === 'sticky'
      ? 'fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 p-4 z-40 flex justify-center gap-4 overflow-x-auto print:hidden'
      : 'flex flex-wrap gap-3 mt-6';

  return (
    <div className={containerClasses}>
      {mode === 'inline' && <h4 className="text-sm font-semibold text-slate-400 w-full">Sources</h4>}
      {uniqueSources.map((source, idx) => (
        <a
          key={`${source.uri}-${idx}`}
          href={source.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-cyan-400 rounded-full text-xs transition-colors border border-slate-700/50"
          title={source.title}
        >
          <ExternalLink size={12} />
          <span className="truncate max-w-[200px]">{source.title}</span>
        </a>
      ))}
    </div>
  );
}
