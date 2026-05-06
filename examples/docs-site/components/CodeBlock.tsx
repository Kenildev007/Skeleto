'use client';

import { useState } from 'react';

export function CodeBlock({ code, language = 'tsx' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative my-4 min-w-0 max-w-full">
      <pre className="code-block">
        <code dangerouslySetInnerHTML={{ __html: highlight(code, language) }} />
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/20"
      >
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  );
}

function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(code: string, lang: string): string {
  const escaped = escape(code);
  if (lang === 'bash') {
    return escaped.replace(/^(\$\s.*)$/gm, '<span class="tk-comment">$1</span>');
  }

  const protectedTokens: string[] = [];
  const protect = (html: string) => {
    const key = `%%SA_TOKEN_${protectedTokens.length}%%`;
    protectedTokens.push(html);
    return key;
  };

  const withStringsAndComments = escaped.replace(
    /(\/\/[^\n]*|'[^'\n]*'|"[^"\n]*"|`[^`]*`)/g,
    (match) => {
      const className = match.startsWith('//') ? 'tk-comment' : 'tk-string';
      return protect(`<span class="${className}">${match}</span>`);
    },
  );

  const highlighted = withStringsAndComments
    .replace(/(&lt;\/?[A-Za-z][\w.]*)/g, (match) => protect(`<span class="tk-tag">${match}</span>`))
    .replace(/(\b[a-zA-Z_]\w*)=/g, (_match, attr) => protect(`<span class="tk-attr">${attr}</span>=`))
    .replace(
      /\b(import|from|export|const|let|var|function|return|if|else|for|while|true|false|null|undefined|interface|type|async|await|new|class|extends|of|in|boolean|number|string|void)\b/g,
      '<span class="tk-keyword">$1</span>',
    );

  return highlighted.replace(/%%SA_TOKEN_(\d+)%%/g, (_match, index) => protectedTokens[Number(index)] ?? '');
}
