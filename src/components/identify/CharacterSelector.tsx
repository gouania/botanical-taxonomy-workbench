import { Info, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { CHARACTER_GROUPS } from '../../constants';
import { geminiService } from '../../services/geminiService';

interface CharacterSelectorProps {
  selected: Set<string>;
  suggested: Map<string, string>;
  onToggle: (id: string) => void;
}

export function CharacterSelector({ selected, suggested, onToggle }: CharacterSelectorProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(CHARACTER_GROUPS.map((g) => g.category))
  );
  const [explanation, setExplanation] = useState<{ id: string; text: string } | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const toggleGroup = (category: string) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setExpandedGroups(newSet);
  };

  const handleExplain = async (e: React.MouseEvent, id: string, label: string) => {
    e.stopPropagation();
    if (explanation?.id === id) {
      setExplanation(null);
      return;
    }

    setIsLoadingExplanation(true);
    setExplanation({ id, text: 'Loading...' });

    try {
      const text = await geminiService.explainCharacter(label);
      setExplanation({ id, text });
    } catch (err) {
      setExplanation({ id, text: 'Failed to load explanation.' });
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  return (
    <div className="space-y-6">
      {CHARACTER_GROUPS.map((group) => (
        <div key={group.category} className="bg-slate-900/40 border border-slate-800/50 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleGroup(group.category)}
            className="w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
          >
            <h3 className="font-display text-lg font-semibold text-white">{group.category}</h3>
            <span className="text-slate-500 text-sm">
              {group.characters.filter((c) => selected.has(c.id)).length} / {group.characters.length}
            </span>
          </button>

          {expandedGroups.has(group.category) && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {group.characters.map((char) => {
                const isSelected = selected.has(char.id);
                const suggestionReason = suggested.get(char.id);

                return (
                  <div key={char.id} className="relative group">
                    <button
                      onClick={() => onToggle(char.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-50'
                          : suggestionReason
                          ? 'bg-amber-900/20 border-amber-500/40 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-cyan-500 border-cyan-500'
                              : 'border-slate-500 bg-transparent'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />}
                        </div>
                        <span className="text-sm font-medium">{char.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {suggestionReason && (
                          <Sparkles size={14} className="text-amber-400 animate-pulse" />
                        )}
                        <button
                          onClick={(e) => handleExplain(e, char.id, char.label)}
                          className="p-1 text-slate-500 hover:text-cyan-400 transition-colors"
                          title="Explain character"
                        >
                          <Info size={14} />
                        </button>
                      </div>
                    </button>

                    {/* Explanation Tooltip */}
                    {explanation?.id === char.id && (
                      <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-xl text-sm text-slate-200 animate-in fade-in zoom-in-95 duration-200">
                        {isLoadingExplanation && explanation.text === 'Loading...' ? (
                          <div className="flex items-center justify-center gap-2 text-slate-400">
                            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                            Loading...
                          </div>
                        ) : (
                          <p>{explanation.text}</p>
                        )}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
                      </div>
                    )}

                    {/* Suggestion Tooltip */}
                    {suggestionReason && !isSelected && (
                      <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-amber-900/90 border border-amber-700/50 rounded-xl shadow-xl text-xs text-amber-100 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                        <span className="font-semibold block mb-1">Why try this?</span>
                        {suggestionReason}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-700/50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
