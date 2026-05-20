import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

interface InfoCardProps {
  title?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  className?: string;
  onCopy?: () => void;
  collapsible?: boolean;
  children: React.ReactNode;
}

export function InfoCard({
  title,
  icon,
  highlight,
  className = '',
  onCopy,
  collapsible,
  children,
}: InfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 transition-all print:bg-transparent print:text-black print:border-none print:shadow-none print:p-0 print:m-0 ${
        highlight ? 'border-l-4 border-l-cyan-500' : ''
      } ${className}`}
    >
      {(title || icon || onCopy || collapsible) && (
        <div className="flex items-center justify-between mb-4 print:mb-2 border-b border-transparent print:border-slate-200 print:pb-1">
          <div className="flex items-center gap-2">
            {icon && <span className="text-cyan-500 print:text-black">{icon}</span>}
            {title && <h3 className="font-display text-lg font-semibold text-white print:text-black print:font-bold">{title}</h3>}
          </div>
          <div className="flex items-center gap-2 print:hidden">
            {onCopy && (
              <button
                onClick={onCopy}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            )}
            {collapsible && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        </div>
      )}
      {(!collapsible || isExpanded) && <div>{children}</div>}
    </div>
  );
}
