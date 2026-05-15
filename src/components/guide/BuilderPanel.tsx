import React from 'react';
import { Loader2, Sparkles, MapPin, Search, Trash2, Globe2 } from 'lucide-react';

interface BuilderPanelProps {
  taxon: string;
  setTaxon: (value: string) => void;
  locality: string;
  setLocality: (value: string) => void;
  useSearch: boolean;
  setUseSearch: (value: boolean) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export function BuilderPanel({ taxon, setTaxon, locality, setLocality, useSearch, setUseSearch, onGenerate, onClear, isLoading }: BuilderPanelProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm h-full flex flex-col">
      <div className="flex flex-col mb-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
            Target Taxon
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={taxon}
              onChange={(e) => setTaxon(e.target.value)}
              placeholder="e.g. Acer, Bursera, Rosaceae"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 block">
            Locality / Region
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <MapPin size={18} />
            </div>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. California, UK, Jalisco"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <label className="flex items-center gap-3 bg-slate-950/30 p-3 rounded-xl border border-slate-800 cursor-pointer hover:bg-slate-800/30 transition-colors">
          <input
            type="checkbox"
            checked={useSearch}
            onChange={(e) => setUseSearch(e.target.checked)}
            disabled={isLoading}
            className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/50 focus:ring-offset-0 disabled:opacity-50"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <Globe2 size={16} className="text-cyan-400" />
              Use Web Search Grounding
            </div>
            <div className="text-xs text-slate-500">Slower but usually more accurate.</div>
          </div>
        </label>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onClear}
          disabled={isLoading || (!taxon && !locality)}
          className="p-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear input"
        >
          <Trash2 size={20} />
        </button>
        <button
          onClick={onGenerate}
          disabled={isLoading || !taxon.trim() || !locality.trim()}
          className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Build Local Guide
            </>
          )}
        </button>
      </div>
    </div>
  );
}
