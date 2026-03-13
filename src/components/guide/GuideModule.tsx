import React, { useState, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { InputPanel } from './InputPanel';
import { ResultPanel } from './ResultPanel';
import { generateTaxonGuide } from '../../services/geminiService';
import { AppStatus, GeneratedGuide } from '../../types';
import { SAMPLE_DATA } from '../../constants';

export function GuideModule() {
  const [input, setInput] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GeneratedGuide | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) return;

    setStatus(AppStatus.LOADING);
    setResult(null);

    try {
      const markdown = await generateTaxonGuide(input);
      setResult({ markdown });
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput('');
    setStatus(AppStatus.IDLE);
    setResult(null);
  }, []);

  const handleSample = useCallback(() => {
    setInput(SAMPLE_DATA);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
          <BookOpen size={24} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">AI-Powered Identification Keys</h2>
          <p className="text-slate-400">Generate detailed taxonomic guides and dichotomous keys.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className={`lg:col-span-4 transition-all duration-300 ease-in-out z-0
          ${status === AppStatus.SUCCESS ? 'hidden lg:block' : 'block'}
        `}>
          <InputPanel 
            input={input}
            setInput={setInput}
            onGenerate={handleGenerate}
            onClear={handleClear}
            onSample={handleSample}
            isLoading={status === AppStatus.LOADING}
          />
        </div>

        {/* Right: Output */}
        <div className={`lg:col-span-8 transition-all duration-300 ease-in-out
           ${status === AppStatus.IDLE ? 'hidden lg:block' : 'block'}
        `}>
          <ResultPanel 
            status={status}
            markdown={result?.markdown || ''}
          />
        </div>
      </div>

      {/* Mobile view toggle helper (only visible if success and on mobile) */}
      {status === AppStatus.SUCCESS && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 no-print">
           <button 
             onClick={() => setStatus(AppStatus.IDLE)}
             className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full shadow-lg border border-slate-700 font-medium transition-colors flex items-center gap-2"
           >
             <span>&larr;</span> Edit Request
           </button>
        </div>
      )}
    </div>
  );
}
