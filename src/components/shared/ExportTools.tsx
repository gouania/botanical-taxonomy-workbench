import React, { useState } from 'react';
import { Share2, Check, Copy, Printer } from 'lucide-react';

interface ShareButtonProps {
  className?: string;
  url?: string;
}

export function ShareButton({ className = '', url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const targetUrl = url || window.location.href;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-all cursor-pointer ${className}`}
      title="Copy shareable deep link to clipboard"
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-400" />
          <span className="text-emerald-400">Link Copied</span>
        </>
      ) : (
        <>
          <Share2 size={14} className="text-cyan-400" />
          <span>Share Link</span>
        </>
      )}
    </button>
  );
}

interface CopyTextButtonProps {
  text: string;
  label?: string;
  title?: string;
  className?: string;
}

export function CopyTextButton({ text, label = 'Copy', title, className = '' }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-all cursor-pointer ${className}`}
      title={title || "Copy raw text content to clipboard"}
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={14} className="text-cyan-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

interface PrintPDFButtonProps {
  className?: string;
  label?: string;
}

export function PrintPDFButton({ className = '', label = 'Print / PDF' }: PrintPDFButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-all cursor-pointer print:hidden ${className}`}
      title="Print this view or export as high-quality PDF code"
    >
      <Printer size={14} className="text-fuchsia-400" />
      <span>{label}</span>
    </button>
  );
}
