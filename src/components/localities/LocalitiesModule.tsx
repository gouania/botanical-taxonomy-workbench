import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { LocalityProfile, NavigationTarget } from '../../types';
import { LocalityDashboard } from './LocalityDashboard';
import { Loader2 } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { ErrorDisplay } from '../shared/ErrorDisplay';

interface LocalitiesModuleProps {
  initialQuery?: string;
  onNavigate: (target: NavigationTarget) => void;
}

export function LocalitiesModule({ initialQuery, onNavigate }: LocalitiesModuleProps) {
  const [query, setQuery] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<LocalityProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);

  React.useEffect(() => {
    if (initialQuery && !profile && !isLoading && !error) {
       handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setProfile(null);
    setSources([]);

    try {
      const response = await geminiService.generateLocalityProfile(searchQuery);
      setProfile(response.result);
      setSources(response.sources);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate locality profile. Please try a different query or check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Localities</h1>
            <p className="text-slate-400">
              Explore the ecological, biological, and geographical context of specific regions.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Enter locality name or coordinates (e.g., Mount Kinabalu)..."
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-24 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-sans text-lg shadow-inner"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <button
                onClick={() => handleSearch(query)}
                disabled={!query.trim() || isLoading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Analyze'}
              </button>
            </div>
          </div>
          
          {!profile && !isLoading && !error && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-3xl mx-auto">
              <span className="text-sm text-slate-500 py-1">Examples:</span>
              {["Mount Kinabalu", "14°15'N, 121°2'E", "Cerrado biome", "Table Mountain, SA"].map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setQuery(ex);
                    handleSearch(ex);
                  }}
                  className="px-3 py-1 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-cyan-400 rounded-full text-sm transition-colors border border-slate-700/50"
                >
                  {ex}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error ? (
        <ErrorDisplay message={error} />
      ) : profile ? (
         <LocalityDashboard profile={profile} onNavigate={onNavigate} sources={sources} />
      ) : isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-cyan-500" size={48} />
        </div>
      ) : null}
    </div>
  );
}
