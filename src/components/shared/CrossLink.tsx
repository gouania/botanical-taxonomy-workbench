import { ArrowRight } from 'lucide-react';
import React from 'react';
import { NavigationTarget } from '../../types';

interface CrossLinkProps {
  target: NavigationTarget;
  onNavigate: (target: NavigationTarget) => void;
  children: React.ReactNode;
  className?: string;
}

export function CrossLink({ target, onNavigate, children, className = '' }: CrossLinkProps) {
  return (
    <button
      onClick={() => onNavigate(target)}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-800/60 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-300 rounded-md text-sm font-medium transition-colors border border-slate-700/50 hover:border-cyan-700/50 group ${className}`}
      title={`Open in ${target.module}`}
    >
      {children}
      <ArrowRight
        size={14}
        className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
      />
    </button>
  );
}
