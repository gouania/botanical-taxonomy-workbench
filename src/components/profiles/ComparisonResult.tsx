import React from 'react';
import { ComparisonProfile, NavigationTarget } from '../../types';
import { CrossLink } from '../shared/CrossLink';
import { InfoCard } from '../shared/InfoCard';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';
import { SourcesBar } from '../shared/SourcesBar';

interface ComparisonResultProps {
  profile: ComparisonProfile;
  sources: any[];
  onNavigate: (target: NavigationTarget) => void;
}

export function ComparisonResult({ profile, sources, onNavigate }: ComparisonResultProps) {
  const taxa = [profile.taxon1, profile.taxon2];
  if (profile.taxon3) taxa.push(profile.taxon3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taxa.map((taxon, idx) => (
          <div key={idx}>
            <InfoCard className="text-center bg-slate-900/60 border-cyan-900/30">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                <i className="font-serif">{taxon.scientificName}</i>
              </h3>
              <div className="flex flex-col items-center gap-2 text-sm text-slate-400 mb-4">
                <CrossLink target={{ module: 'authorities', query: taxon.author }} onNavigate={onNavigate}>
                  {taxon.author}
                </CrossLink>
                <span className="text-cyan-400 font-medium">{taxon.commonName}</span>
                <CrossLink target={{ module: 'profiles', query: taxon.family }} onNavigate={onNavigate}>
                  {taxon.family}
                </CrossLink>
              </div>
              <p className="text-sm text-slate-300 text-left leading-relaxed">
                {taxon.quickRecap}
              </p>
            </InfoCard>
          </div>
        ))}
      </div>

      <InfoCard title="Key Differences" highlight>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="py-3 px-4 font-semibold text-slate-400">Feature</th>
                <th className="py-3 px-4 font-semibold text-white">
                  <i>{profile.taxon1.scientificName}</i>
                </th>
                <th className="py-3 px-4 font-semibold text-white">
                  <i>{profile.taxon2.scientificName}</i>
                </th>
                {profile.taxon3 && (
                  <th className="py-3 px-4 font-semibold text-white">
                    <i>{profile.taxon3.scientificName}</i>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {profile.keyDifferences.map((diff, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-slate-300">{diff.feature}</td>
                  <td className="py-3 px-4 text-slate-400">{diff.taxon1State}</td>
                  <td className="py-3 px-4 text-slate-400">{diff.taxon2State}</td>
                  {profile.taxon3 && (
                    <td className="py-3 px-4 text-slate-400">{diff.taxon3State}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taxa.map((taxon, idx) => (
          <div key={idx} className="space-y-6">
            <InfoCard title={`Diagnostic Features (${taxon.scientificName})`}>
              <MarkdownRenderer content={taxon.diagnosticDescription} className="text-sm" />
            </InfoCard>
            <InfoCard title="Ecology & Range">
              <MarkdownRenderer content={taxon.ecology} className="text-sm mb-4" />
              <MarkdownRenderer content={taxon.distribution} className="text-sm" />
            </InfoCard>
          </div>
        ))}
      </div>

      <SourcesBar sources={sources} mode="sticky" />
    </div>
  );
}
