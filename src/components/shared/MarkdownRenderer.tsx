import { marked } from 'marked';
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  // Replace literal '\n' sequences (backslash followed by 'n') with real newlines
  const processedContent = String(content).replace(/\\n/g, '\n');

  const html = marked.parse(processedContent, { async: false, breaks: true }) as string;

  return (
    <div
      className={`prose prose-invert prose-slate max-w-none prose-a:text-cyan-500 hover:prose-a:text-cyan-400 prose-strong:text-white prose-headings:font-display ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
