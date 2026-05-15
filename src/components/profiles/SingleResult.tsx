import { AlertTriangle, BookOpen, Globe, History, Info, Map, Tag, Users, Eye } from 'lucide-react';
import React from 'react';
import { NavigationTarget, TaxonProfile } from '../../types';
import { CrossLink } from '../shared/CrossLink';
import { InfoCard } from '../shared/InfoCard';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';
import { SourcesBar } from '../shared/SourcesBar';
import { SimilarSpeciesCard } from './SimilarSpeciesCard';

interface SingleResultProps {
  profile: TaxonProfile;
  sources: any[];
  onNavigate: (target: NavigationTarget) => void;
}

export function SingleResult({ profile, sources, onNavigate }: SingleResultProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center py-8">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 flex items-baseline justify-center gap-3 flex-wrap">
          <i className="font-serif">{profile.scientificName}</i>
          <span className="text-2xl text-slate-400 font-normal">
            <CrossLink target={{ module: 'authorities', query: profile.author }} onNavigate={onNavigate} className="!text-xl !bg-transparent !border-transparent hover:!bg-slate-800/50">
              {profile.author}
            </CrossLink>
          </span>
        </h2>
        <div className="text-xl text-cyan-400 font-medium mb-3">
          {profile.commonName}
          {profile.localityContext && <span className="ml-2 text-slate-400 text-lg font-normal">({profile.localityContext})</span>}
        </div>

        {profile.synonyms && profile.synonyms.length > 0 && (
          <p className="text-slate-500 text-sm italic mb-3">
            Synonyms: {profile.synonyms.join(', ')}
          </p>
        )}

        <div className="flex justify-center flex-wrap items-center gap-3 mb-6">
          {profile.includedTaxaCount && (
             <p className="text-slate-400 text-sm italic">
               Includes: <span className="text-slate-300 font-medium not-italic">{profile.includedTaxaCount.replace(/\*/g, '')}</span>
               {profile.localIncludedTaxaCount && profile.localIncludedTaxaCount !== 'N/A' && profile.localityContext && (
                 <>
                   <span className="mx-2 text-slate-600">•</span>
                   <span className="text-cyan-400 font-medium not-italic">Local to {profile.localityContext}: {profile.localIncludedTaxaCount.replace(/\*/g, '')}</span>
                 </>
               )}
             </p>
          )}
          {profile.conservationStatus && profile.conservationStatus !== 'Not Evaluated' && profile.conservationStatus !== 'N/A' && (
             <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-xs font-semibold text-slate-300 border border-slate-700/50">
               {profile.conservationStatus}
             </span>
          )}
        </div>
        
        {profile.classification && profile.classification.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400">
            {profile.classification.map((taxon, idx) => (
              <React.Fragment key={idx}>
                <button 
                  onClick={() => onNavigate({ module: 'profiles', query: taxon.name })}
                  className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors uppercase tracking-wider"
                >
                  {taxon.name}
                </button>
                {idx < profile.classification.length - 1 && (
                  <span className="text-slate-600">›</span>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <CrossLink target={{ module: 'profiles', query: profile.family }} onNavigate={onNavigate}>
              {profile.family}
            </CrossLink>
          </div>
        )}
      </div>

      <InfoCard highlight className="bg-slate-900/60 border-cyan-900/30">
        <MarkdownRenderer 
          content={profile.quickRecap} 
          className="prose-p:text-lg prose-p:text-slate-200 prose-p:leading-relaxed prose-p:font-medium prose-p:m-0" 
        />
      </InfoCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <InfoCard title="Diagnostic Features" icon={<Tag size={20} />}>
            <MarkdownRenderer content={profile.diagnosticDescription} />
          </InfoCard>

          {profile.hazards && !profile.hazards.toLowerCase().includes('none') && profile.hazards !== 'N/A' && (
            <div className="bg-orange-950/20 border border-orange-900/50 p-5 rounded-2xl text-orange-200 flex gap-4 items-start shadow-lg shadow-orange-900/10">
              <AlertTriangle className="w-7 h-7 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold uppercase tracking-widest text-sm mb-1 text-orange-400">Hazards & Toxicity</h4>
                <div className="text-sm text-orange-200/90"><MarkdownRenderer content={profile.hazards} /></div>
              </div>
            </div>
          )}

          {profile.confusedTaxa && profile.confusedTaxa.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" />
                Similar Species
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.confusedTaxa.map((taxon, idx) => (
                  <div key={idx}>
                    <SimilarSpeciesCard
                      taxon={taxon}
                      onNavigate={onNavigate}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          {profile.fieldNotes && profile.fieldNotes !== 'N/A' && (
            <InfoCard title="Field Notes" icon={<Eye size={20} />}>
              <MarkdownRenderer content={profile.fieldNotes} className="text-sm" />
            </InfoCard>
          )}

          <InfoCard title="Ecology & Range" icon={<Globe size={20} />}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <Map size={14} /> Habitat
                </h4>
                <MarkdownRenderer content={profile.ecology} className="text-sm" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <Globe size={14} /> Distribution
                </h4>
                <MarkdownRenderer content={profile.distribution} className="text-sm" />
              </div>
              {profile.seasonality && profile.seasonality !== 'N/A' && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                    <History size={14} /> Seasonality
                  </h4>
                  <MarkdownRenderer content={profile.seasonality} className="text-sm" />
                </div>
              )}
            </div>
          </InfoCard>

          <InfoCard title="Etymology" icon={<Info size={20} />}>
            <MarkdownRenderer content={profile.etymology} className="text-sm" />
          </InfoCard>

          <InfoCard title="History" icon={<History size={20} />}>
            <MarkdownRenderer content={profile.history} className="text-sm" />
          </InfoCard>

          {profile.humanRelevance && profile.humanRelevance !== 'N/A' && (
            <InfoCard title="Human Relevance" icon={<Users size={20} />}>
              <MarkdownRenderer content={profile.humanRelevance} className="text-sm" />
            </InfoCard>
          )}
        </div>
      </div>

      <SourcesBar sources={sources} mode="sticky" />
    </div>
  );
}
