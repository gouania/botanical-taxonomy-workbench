import { marked } from 'marked';
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  const html = marked.parse(content, { async: false, breaks: true }) as string;

  return (
    <div
      className={`prose prose-invert prose-slate max-w-none prose-a:text-cyan-500 hover:prose-a:text-cyan-400 prose-strong:text-white prose-headings:font-display ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
