/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Keyboard, Command, Sparkles, Check } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  action: string;
  category: 'Document & Saving' | 'Word Formatting' | 'Navigation & View';
  note?: string;
}

export const SHORTCUTS_LIST: ShortcutItem[] = [
  // Document & Saving
  { keys: ['Alt', 'S'], action: 'Save Document Now', category: 'Document & Saving', note: 'Immediate local & offline storage persist' },
  { keys: ['Alt', 'A'], action: 'Toggle AutoSave (ON / OFF)', category: 'Document & Saving', note: 'Switch automated background saving' },
  { keys: ['Alt', 'P'], action: 'Preview Book Page-by-Page', category: 'Document & Saving', note: 'Inspect typography and pagination' },
  { keys: ['Alt', 'E'], action: 'Export Document', category: 'Document & Saving', note: 'PDF, Word DOCX, EPUB, Markdown' },
  { keys: ['Alt', 'F'], action: 'Find & Replace', category: 'Document & Saving', note: 'Word-style search and replace' },
  { keys: ['Alt', 'K'], action: 'Open Keyboard Shortcuts', category: 'Document & Saving', note: 'View this reference guide' },

  // Word Formatting
  { keys: ['Alt', '0'], action: 'Normal Style (Paragraph)', category: 'Word Formatting', note: 'Reset selection to body prose' },
  { keys: ['Alt', '1'], action: 'Heading 1', category: 'Word Formatting', note: 'Main chapter / document title' },
  { keys: ['Alt', '2'], action: 'Heading 2', category: 'Word Formatting', note: 'Major section heading' },
  { keys: ['Alt', '3'], action: 'Heading 3', category: 'Word Formatting', note: 'Minor subsection heading' },
  { keys: ['Alt', 'B'], action: 'Bold', category: 'Word Formatting', note: 'Toggle heavy weight' },
  { keys: ['Alt', 'I'], action: 'Italic', category: 'Word Formatting', note: 'Toggle emphasis' },
  { keys: ['Alt', 'U'], action: 'Underline', category: 'Word Formatting', note: 'Word-style underline mark' },
  { keys: ['Alt', 'M'], action: 'Highlight', category: 'Word Formatting', note: 'Marker highlight background' },
  { keys: ['Alt', 'L'], action: 'Align Left', category: 'Word Formatting', note: 'Standard flush left' },
  { keys: ['Alt', 'C'], action: 'Align Center', category: 'Word Formatting', note: 'Centered title / poem lines' },
  { keys: ['Alt', 'R'], action: 'Align Right', category: 'Word Formatting', note: 'Flush right alignment' },
  { keys: ['Alt', 'J'], action: 'Balanced Justify', category: 'Word Formatting', note: 'Full book margin justification' },

  // Navigation & View
  { keys: ['Alt', 'H'], action: 'Return to Dashboard', category: 'Navigation & View', note: 'Navigate back to your bookshelf' },
  { keys: ['Alt', 'D'], action: 'Toggle Dark / Light Mode', category: 'Navigation & View', note: 'Instant high-contrast theme change' },
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const categories = ['Document & Saving', 'Word Formatting', 'Navigation & View'] as const;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-editorial-bg dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-editorial-border dark:border-stone-800 flex items-center justify-between bg-editorial-sidebar dark:bg-stone-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-editorial-accent/10 dark:bg-amber-950/40 text-editorial-accent dark:text-amber-400 flex items-center justify-center shrink-0">
              <Keyboard size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-editorial-text dark:text-stone-100">
                Non-Conflicting Keyboard Shortcuts
              </h3>
              <p className="text-xs text-editorial-muted dark:text-stone-400 font-sans">
                Engineered with <span className="font-mono font-semibold">Alt</span> keys so they never collide with system or browser shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-editorial-muted dark:text-stone-400 hover:text-editorial-text dark:hover:text-stone-100 hover:bg-white/80 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-editorial-text dark:text-stone-200">
          {categories.map((cat) => {
            const items = SHORTCUTS_LIST.filter(s => s.category === cat);
            return (
              <div key={cat} className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-editorial-accent dark:text-amber-400 border-b border-editorial-divider dark:border-stone-800 pb-1 flex items-center gap-2">
                  <span>{cat}</span>
                  <span className="text-[10px] text-editorial-muted dark:text-stone-400 font-normal">({items.length} shortcuts)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((shortcut, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-editorial-border/60 dark:border-stone-800 flex items-center justify-between gap-2 shadow-2xs hover:border-editorial-accent transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-editorial-text dark:text-stone-100 truncate">
                          {shortcut.action}
                        </div>
                        {shortcut.note && (
                          <div className="text-[10px] text-editorial-muted dark:text-stone-400 truncate">
                            {shortcut.note}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {shortcut.keys.map((k, ki) => (
                          <React.Fragment key={ki}>
                            <kbd className="px-2 py-0.5 rounded bg-editorial-sidebar dark:bg-stone-900 border border-editorial-border dark:border-stone-700 text-editorial-text dark:text-amber-300 font-mono text-[11px] font-bold shadow-2xs">
                              {k}
                            </kbd>
                            {ki < shortcut.keys.length - 1 && (
                              <span className="text-xs text-editorial-muted dark:text-stone-400 font-mono">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-editorial-border dark:border-stone-800 bg-editorial-sidebar dark:bg-stone-900 flex items-center justify-between text-xs text-editorial-muted dark:text-stone-400 shrink-0">
          <span className="font-sans">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 font-mono text-[10px]">Esc</kbd> to dismiss this dialog
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-editorial-accent hover:bg-editorial-accent/90 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
