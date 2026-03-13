import React from 'react';

interface SkeletonLoaderProps {
  type: 'card' | 'text' | 'title' | 'list';
  count?: number;
  className?: string;
}

export function SkeletonLoader({ type, count = 1, className = '' }: SkeletonLoaderProps) {
  const renderSkeleton = (idx: number) => {
    switch (type) {
      case 'card':
        return (
          <div
            key={idx}
            className={`bg-slate-800/50 rounded-2xl p-6 animate-pulse ${className}`}
          >
            <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-700/50 rounded w-full"></div>
              <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
              <div className="h-4 bg-slate-700/50 rounded w-4/6"></div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div key={idx} className={`space-y-3 animate-pulse ${className}`}>
            <div className="h-4 bg-slate-800/50 rounded w-full"></div>
            <div className="h-4 bg-slate-800/50 rounded w-5/6"></div>
            <div className="h-4 bg-slate-800/50 rounded w-4/6"></div>
          </div>
        );
      case 'title':
        return (
          <div
            key={idx}
            className={`h-8 bg-slate-800/50 rounded animate-pulse w-1/2 ${className}`}
          ></div>
        );
      case 'list':
        return (
          <div key={idx} className={`space-y-4 animate-pulse ${className}`}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800/50 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-800/50 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-800/50 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return <>{[...Array(count)].map((_, idx) => renderSkeleton(idx))}</>;
}
