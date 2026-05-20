import { MapPin } from 'lucide-react';
import React from 'react';
import { ComparisonProfile, NavigationTarget } from '../../types';
import { CrossLink } from '../shared/CrossLink';
import { InfoCard } from '../shared/InfoCard';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';
import { SourcesBar } from '../shared/SourcesBar';
import { ShareButton, CopyTextButton, PrintPDFButton } from '../shared/ExportTools';

interface ComparisonResultProps {
  profile: ComparisonProfile;
  sources: any[];
  onNavigate: (target: NavigationTarget) => void;
}

function formatCompareAsMarkdown(profile: ComparisonProfile): string {
  return `
# Taxon Comparison Report
${profile.localityContext ? `**Geographic Context:** ${profile.localityContext}\n` : ''}
***
## Key Differences:
${profile.keyDifferences.map(diff => `- **${diff.feature}**:
  - *${profile.taxon1.scientificName}*: ${diff.taxon1State}
  - *${profile.taxon2.scientificName}*: ${diff.taxon2State}
  ${profile.taxon3 ? `- *${profile.taxon3.scientificName}*: ${diff.taxon3State}` : ''}`).join('\n')}

***
## Taxon 1: ${profile.taxon1.scientificName} (${profile.taxon1.commonName})
**Author:** ${profile.taxon1.author}
**Family:** ${profile.taxon1.family}
**Diagnostic Description:**
${profile.taxon1.diagnosticDescription}
**Ecology & Distribution:**
${profile.taxon1.ecology}
${profile.taxon1.distribution}

## Taxon 2: ${profile.taxon2.scientificName} (${profile.taxon2.commonName})
**Author:** ${profile.taxon2.author}
**Family:** ${profile.taxon2.family}
**Diagnostic Description:**
${profile.taxon2.diagnosticDescription}
**Ecology & Distribution:**
${profile.taxon2.ecology}
${profile.taxon2.distribution}
  `.trim();
}

export function ComparisonResult({ profile, sources, onNavigate }: ComparisonResultProps) {
  const taxa = [profile.taxon1, profile.taxon2];
  if (profile.taxon3) taxa.push(profile.taxon3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center gap-4">
        {profile.localityContext && (
          <div className="text-center -mb-2">
            <p className="inline-block px-4 py-2 bg-slate-900/50 rounded-full text-slate-300 border border-slate-800/50 font-medium">
              <MapPin className="w-4 h-4 inline-block mr-2 -mt-0.5 text-cyan-500" />
              Geographic Context: <span className="text-white mr-2">{profile.localityContext}</span>
              <button
                 onClick={() => onNavigate({ module: 'localities', query: profile.localityContext })}
                 className="text-xs px-2 py-1 rounded-full bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 border border-cyan-900/50 hover:border-cyan-700 transition-colors inline-flex items-center gap-1 print:hidden"
                 title={`Explore ${profile.localityContext} locality profile`}
              >
                 <MapPin size={12} />
                 Explore
              </button>
            </p>
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
          <ShareButton />
          <CopyTextButton 
            text={formatCompareAsMarkdown(profile)} 
            label="Copy Comparison" 
            title="Copy comparison data as structured Markdown list" 
          />
          <PrintPDFButton label="Export / Print PDF" />
        </div>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 ${taxa.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
        {taxa.map((taxon, idx) => (
          <div key={idx}>
            <InfoCard className="text-center bg-slate-900/60 border-cyan-900/30">
              <h3 className="font-display text-2xl font-bold text-white mb-2 break-words">
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
                {taxon.synonyms && taxon.synonyms.length > 0 && (
                  <span className="text-xs italic text-slate-500 text-center">
                    Synonyms: {taxon.synonyms.join(', ')}
                  </span>
                )}
                {taxon.includedTaxaCount && (
                  <span className="text-xs italic text-slate-400">
                    Includes: <span className="not-italic font-medium text-slate-300">{taxon.includedTaxaCount.replace(/\*/g, '')}</span>
                    {taxon.localIncludedTaxaCount && taxon.localIncludedTaxaCount !== 'N/A' && profile.localityContext && (
                      <>
                        <span className="mx-2 text-slate-600">•</span>
                        <span className="text-cyan-400 font-medium not-italic">Local: {taxon.localIncludedTaxaCount.replace(/\*/g, '')}</span>
                      </>
                    )}
                  </span>
                )}
                {taxon.conservationStatus && taxon.conservationStatus !== 'Not Evaluated' && taxon.conservationStatus !== 'N/A' && (
                  <span className="px-2 py-0.5 rounded bg-slate-800/80 text-xs font-semibold text-slate-300 border border-slate-700/50 mt-1">
                    {taxon.conservationStatus}
                  </span>
                )}
              </div>
              <MarkdownRenderer 
                content={taxon.quickRecap} 
                className="prose-p:text-sm prose-p:text-slate-300 prose-p:text-left prose-p:leading-relaxed prose-p:m-0" 
              />
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
                  <td className="py-3 px-4 text-slate-400">
                    <MarkdownRenderer content={diff.taxon1State} className="prose-p:m-0 prose-p:leading-normal" />
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <MarkdownRenderer content={diff.taxon2State} className="prose-p:m-0 prose-p:leading-normal" />
                  </td>
                  {profile.taxon3 && (
                    <td className="py-3 px-4 text-slate-400">
                      <MarkdownRenderer content={diff.taxon3State!} className="prose-p:m-0 prose-p:leading-normal" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoCard>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${taxa.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
        {taxa.map((taxon, idx) => (
          <div key={idx} className="space-y-6">
            <InfoCard title={`Diagnostic Features (${taxon.scientificName})`}>
              <MarkdownRenderer content={taxon.diagnosticDescription} className="text-sm" />
            </InfoCard>
            {taxon.fieldNotes && taxon.fieldNotes !== 'N/A' && (
              <InfoCard title="Field Notes">
                <MarkdownRenderer content={taxon.fieldNotes} className="text-sm" />
              </InfoCard>
            )}
            <InfoCard title="Ecology & Range">
              <MarkdownRenderer content={taxon.ecology} className="text-sm mb-4" />
              <MarkdownRenderer content={taxon.distribution} className="text-sm" />
              {taxon.seasonality && taxon.seasonality !== 'N/A' && (
                <div className="mt-4 border-t border-slate-800/50 pt-4">
                  <h4 className="text-xs font-semibold text-slate-400 mb-1">Seasonality</h4>
                  <MarkdownRenderer content={taxon.seasonality} className="text-sm" />
                </div>
              )}
            </InfoCard>
          </div>
        ))}
      </div>

      <SourcesBar sources={sources} mode="sticky" />
    </div>
  );
}
