import { AlertTriangle, BookOpen, Globe, History, Info, Map, Tag } from 'lucide-react';
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
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
          <i className="font-serif">{profile.scientificName}</i>
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 mb-6">
          <CrossLink target={{ module: 'authorities', query: profile.author }} onNavigate={onNavigate}>
            {profile.author}
          </CrossLink>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          <span className="text-cyan-400 font-medium">{profile.commonName}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          <CrossLink target={{ module: 'profiles', query: profile.family }} onNavigate={onNavigate}>
            {profile.family}
          </CrossLink>
        </div>
      </div>

      <InfoCard highlight className="bg-slate-900/60 border-cyan-900/30">
        <p className="text-lg text-slate-200 leading-relaxed font-medium">
          {profile.quickRecap}
        </p>
      </InfoCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <InfoCard title="Diagnostic Features" icon={<Tag size={20} />}>
            <MarkdownRenderer content={profile.diagnosticDescription} />
          </InfoCard>

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
            </div>
          </InfoCard>

          <InfoCard title="Etymology" icon={<Info size={20} />}>
            <MarkdownRenderer content={profile.etymology} className="text-sm" />
          </InfoCard>

          <InfoCard title="History" icon={<History size={20} />}>
            <MarkdownRenderer content={profile.history} className="text-sm" />
          </InfoCard>
        </div>
      </div>

      <SourcesBar sources={sources} mode="sticky" />
    </div>
  );
}
