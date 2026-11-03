/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Replace, X, ChevronDown, ChevronUp, CaseSensitive } from 'lucide-react';

interface FindReplaceBarProps {
  isOpen: boolean;
  onClose: () => void;
  onFind: (query: string, options: { wholeWord: boolean; matchCase: boolean }) => number;
  onReplace: (
    find: string,
    replaceWith: string,
    replaceAll: boolean,
    options: { wholeWord: boolean; matchCase: boolean; targetIndex: number }
  ) => void;
}

export default function FindReplaceBar({
  isOpen,
  onClose,
  onFind,
  onReplace
}: FindReplaceBarProps) {
  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [matchCount, setMatchCount] = useState<number>(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const [wholeWord, setWholeWord] = useState<boolean>(true); // Default to whole word as requested
  const [matchCase, setMatchCase] = useState<boolean>(false);

  useEffect(() => {
    if (findQuery.trim()) {
      const count = onFind(findQuery, { wholeWord, matchCase });
      setMatchCount(count);
      setCurrentMatchIndex(count > 0 ? 0 : 0);
    } else {
      setMatchCount(0);
      setCurrentMatchIndex(0);
    }
  }, [findQuery, wholeWord, matchCase, onFind]);

  if (!isOpen) return null;

  const handleNextMatch = () => {
    if (matchCount > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % matchCount);
    }
  };

  const handlePrevMatch = () => {
    if (matchCount > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + matchCount) % matchCount);
    }
  };

  const handleReplaceSingle = () => {
    if (!findQuery.trim() || matchCount === 0) return;
    onReplace(findQuery, replaceQuery, false, {
      wholeWord,
      matchCase,
      targetIndex: currentMatchIndex
    });
    // Re-run count
    const count = onFind(findQuery, { wholeWord, matchCase });
    setMatchCount(count);
    if (currentMatchIndex >= count && count > 0) {
      setCurrentMatchIndex(count - 1);
    }
  };

  const handleReplaceAll = () => {
    if (!findQuery.trim() || matchCount === 0) return;
    onReplace(findQuery, replaceQuery, true, {
      wholeWord,
      matchCase,
      targetIndex: 0
    });
    setMatchCount(0);
    setCurrentMatchIndex(0);
  };

  return (
    <div className="bg-editorial-sidebar dark:bg-stone-900 border border-editorial-border dark:border-stone-800 p-3 rounded-xl shadow-lg flex flex-wrap items-center gap-2.5 text-xs select-none animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Search Input + Options */}
      <div className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 rounded-lg px-2.5 py-1.5 flex-1 min-w-[220px]">
        <Search size={14} className="text-editorial-muted dark:text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Find word in manuscript..."
          value={findQuery}
          onChange={(e) => setFindQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-xs text-editorial-text dark:text-stone-100 placeholder:text-editorial-muted/60"
          autoFocus
        />

        {/* Match Count Badge & Navigators */}
        {findQuery.trim() && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-mono text-editorial-muted dark:text-stone-400 font-bold whitespace-nowrap bg-editorial-sidebar/60 dark:bg-stone-700/60 px-1.5 py-0.5 rounded">
              {matchCount > 0 ? `${currentMatchIndex + 1} of ${matchCount}` : 'No matches'}
            </span>
            <button
              type="button"
              onClick={handlePrevMatch}
              disabled={matchCount <= 1}
              className="p-0.5 text-editorial-muted hover:text-editorial-text dark:hover:text-stone-100 disabled:opacity-30 cursor-pointer"
              title="Previous Match"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              onClick={handleNextMatch}
              disabled={matchCount <= 1}
              className="p-0.5 text-editorial-muted hover:text-editorial-text dark:hover:text-stone-100 disabled:opacity-30 cursor-pointer"
              title="Next Match"
            >
              <ChevronDown size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Whole Word & Match Case Toggles */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setWholeWord(!wholeWord)}
          className={`px-2 py-1.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer border ${
            wholeWord
              ? 'bg-editorial-accent text-white border-editorial-accent dark:bg-amber-600 dark:border-amber-600 shadow-2xs'
              : 'bg-white dark:bg-stone-800 text-editorial-muted dark:text-stone-400 border-editorial-border dark:border-stone-700 hover:text-editorial-text'
          }`}
          title={wholeWord ? "Whole word matching: ACTIVE (won't replace substrings)" : "Whole word matching: OFF"}
        >
          [W] Whole Word
        </button>

        <button
          type="button"
          onClick={() => setMatchCase(!matchCase)}
          className={`p-1.5 rounded transition-all cursor-pointer border flex items-center gap-1 ${
            matchCase
              ? 'bg-editorial-accent text-white border-editorial-accent dark:bg-amber-600 dark:border-amber-600 shadow-2xs'
              : 'bg-white dark:bg-stone-800 text-editorial-muted dark:text-stone-400 border-editorial-border dark:border-stone-700 hover:text-editorial-text'
          }`}
          title={matchCase ? "Match Case: ACTIVE" : "Match Case: OFF"}
        >
          <CaseSensitive size={14} />
          <span className="text-[10px] hidden sm:inline">Case</span>
        </button>
      </div>

      {/* Replace Input */}
      <div className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 rounded-lg px-2.5 py-1.5 flex-1 min-w-[200px]">
        <Replace size={14} className="text-editorial-muted dark:text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Replace with..."
          value={replaceQuery}
          onChange={(e) => setReplaceQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-xs text-editorial-text dark:text-stone-100 placeholder:text-editorial-muted/60"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleReplaceSingle}
          disabled={!findQuery.trim() || matchCount === 0}
          className="px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-neutral-50 dark:hover:bg-stone-700 border border-editorial-border dark:border-stone-700 disabled:opacity-40 rounded-lg font-bold text-[10px] uppercase tracking-wider text-editorial-text dark:text-stone-100 transition-colors cursor-pointer shadow-2xs"
          title="Replace current match"
        >
          Replace
        </button>
        <button
          type="button"
          onClick={handleReplaceAll}
          disabled={!findQuery.trim() || matchCount === 0}
          className="px-3 py-1.5 bg-editorial-accent hover:bg-editorial-accent/90 text-white dark:bg-amber-600 dark:hover:bg-amber-500 disabled:opacity-40 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
          title="Replace all matching whole words in chapter"
        >
          Replace All
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-editorial-muted hover:text-editorial-text dark:hover:text-stone-100 rounded-lg"
          title="Close Find & Replace (Esc)"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
