/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Replace, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FindReplaceBarProps {
  isOpen: boolean;
  onClose: () => void;
  onFind: (query: string) => number; // returns match count
  onReplace: (find: string, replaceWith: string, replaceAll: boolean) => void;
}

export default function FindReplaceBar({
  isOpen,
  onClose,
  onFind,
  onReplace
}: FindReplaceBarProps) {
  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matchCount, setMatchCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFindQuery(val);
    if (val.trim()) {
      const count = onFind(val);
      setMatchCount(count);
    } else {
      setMatchCount(null);
    }
  };

  return (
    <div className="bg-editorial-sidebar border border-editorial-border p-3 rounded-lg shadow-lg flex flex-wrap items-center gap-3 text-xs select-none">
      {/* Find Input */}
      <div className="flex items-center gap-2 bg-white border border-editorial-border rounded px-2.5 py-1.5 flex-1 min-w-[200px]">
        <Search size={14} className="text-editorial-muted" />
        <input
          type="text"
          placeholder="Find in manuscript..."
          value={findQuery}
          onChange={handleSearch}
          className="w-full bg-transparent outline-none text-xs text-editorial-text"
          autoFocus
        />
        {matchCount !== null && (
          <span className="text-[10px] font-mono text-editorial-muted font-bold whitespace-nowrap">
            {matchCount} {matchCount === 1 ? 'match' : 'matches'}
          </span>
        )}
      </div>

      {/* Replace Input */}
      <div className="flex items-center gap-2 bg-white border border-editorial-border rounded px-2.5 py-1.5 flex-1 min-w-[200px]">
        <Replace size={14} className="text-editorial-muted" />
        <input
          type="text"
          placeholder="Replace with..."
          value={replaceQuery}
          onChange={(e) => setReplaceQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-xs text-editorial-text"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onReplace(findQuery, replaceQuery, false)}
          disabled={!findQuery.trim()}
          className="px-3 py-1.5 bg-white hover:bg-neutral-50 border border-editorial-border disabled:opacity-40 rounded font-bold text-[10px] uppercase tracking-wider text-editorial-text transition-colors cursor-pointer"
        >
          Replace
        </button>
        <button
          onClick={() => onReplace(findQuery, replaceQuery, true)}
          disabled={!findQuery.trim()}
          className="px-3 py-1.5 bg-editorial-text hover:bg-black text-white disabled:opacity-40 rounded font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
        >
          Replace All
        </button>
        <button
          onClick={onClose}
          className="p-1.5 text-editorial-muted hover:text-editorial-text rounded"
          title="Close search"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
