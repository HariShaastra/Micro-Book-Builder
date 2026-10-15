/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Chapter, ChapterSection } from '../types.ts';
import { 
  Plus, 
  Trash2, 
  Copy, 
  GripVertical, 
  ChevronRight, 
  ChevronDown, 
  Edit2, 
  Check, 
  FileText, 
  Folder 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface OutlineViewProps {
  chapters: Chapter[];
  onUpdateChapters: (chapters: Chapter[]) => void;
  onSelectChapter: (chapterId: string) => void;
}

export default function OutlineView({
  chapters,
  onUpdateChapters,
  onSelectChapter
}: OutlineViewProps) {
  const [collapsedChapterIds, setCollapsedChapterIds] = useState<Set<string>>(new Set());
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const toggleCollapse = (id: string) => {
    setCollapsedChapterIds(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: uuidv4(),
      title: `Chapter ${chapters.length + 1}: New Section`,
      content: '',
      isBookmarked: false,
      status: 'draft',
      wordCount: 0,
      order: chapters.length,
      sections: [
        { id: uuidv4(), title: 'Section 1.1: Foundations', content: '', order: 0 }
      ]
    };
    onUpdateChapters([...chapters, newChapter]);
  };

  const addSection = (chapterId: string) => {
    onUpdateChapters(
      chapters.map(ch => {
        if (ch.id === chapterId) {
          const currentSections = ch.sections || [];
          const newSec: ChapterSection = {
            id: uuidv4(),
            title: `Section ${currentSections.length + 1}`,
            content: '',
            order: currentSections.length
          };
          return { ...ch, sections: [...currentSections, newSec] };
        }
        return ch;
      })
    );
  };

  const deleteChapter = (id: string) => {
    if (chapters.length <= 1) return;
    onUpdateChapters(chapters.filter(ch => ch.id !== id));
  };

  const duplicateChapter = (chapter: Chapter, index: number) => {
    const dup: Chapter = {
      ...chapter,
      id: uuidv4(),
      title: `${chapter.title} (Copy)`,
      order: index + 1
    };
    const copy = [...chapters];
    copy.splice(index + 1, 0, dup);
    onUpdateChapters(copy);
  };

  const moveChapter = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === chapters.length - 1) return;
    const copy = [...chapters];
    const target = direction === 'up' ? index - 1 : index + 1;
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    onUpdateChapters(copy.map((c, i) => ({ ...c, order: i })));
  };

  const saveTitle = (id: string) => {
    if (!editingTitle.trim()) return;
    onUpdateChapters(
      chapters.map(ch => ch.id === id ? { ...ch, title: editingTitle.trim() } : ch)
    );
    setEditingChapterId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 select-none">
      {/* Outline Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-lg border border-editorial-border shadow-xs">
        <div>
          <h2 className="text-xl font-serif italic font-bold text-editorial-text">Manuscript Outline</h2>
          <p className="text-xs text-editorial-muted">
            Organise chapters, sub-sections, and sequence your book’s structural flow.
          </p>
        </div>
        <button
          onClick={addChapter}
          className="bg-editorial-text text-white hover:bg-black px-4 py-2 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Chapter</span>
        </button>
      </div>

      {/* Chapters Hierarchy List */}
      <div className="space-y-3">
        {chapters.map((chapter, index) => {
          const isCollapsed = collapsedChapterIds.has(chapter.id);
          const sections = chapter.sections || [];

          return (
            <div
              key={chapter.id}
              className="bg-white border border-editorial-border rounded-lg overflow-hidden shadow-2xs transition-all hover:border-editorial-text/40"
            >
              {/* Chapter Row Header */}
              <div className="p-3.5 flex items-center justify-between bg-editorial-sidebar/20 border-b border-editorial-divider">
                <div className="flex items-center gap-2.5 flex-1 overflow-hidden mr-2">
                  <button
                    onClick={() => toggleCollapse(chapter.id)}
                    className="p-1 text-editorial-muted hover:text-editorial-text transition-colors"
                  >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-accent bg-editorial-sidebar px-2 py-0.5 rounded">
                      Ch. {index + 1}
                    </span>

                    {editingChapterId === chapter.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="border border-editorial-border rounded px-2 py-1 text-sm font-serif font-bold text-editorial-text outline-none focus:border-editorial-accent"
                          autoFocus
                        />
                        <button
                          onClick={() => saveTitle(chapter.id)}
                          className="p-1 text-emerald-600 hover:text-emerald-800"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => onSelectChapter(chapter.id)}
                        className="font-serif font-bold text-sm text-editorial-text hover:text-editorial-accent cursor-pointer truncate"
                      >
                        {chapter.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Chapter Controls */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-editorial-muted mr-2">
                    {chapter.wordCount} words
                  </span>

                  <button
                    onClick={() => {
                      setEditingChapterId(chapter.id);
                      setEditingTitle(chapter.title);
                    }}
                    className="p-1.5 text-editorial-muted hover:text-editorial-text rounded"
                    title="Rename"
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    onClick={() => duplicateChapter(chapter, index)}
                    className="p-1.5 text-editorial-muted hover:text-editorial-text rounded"
                    title="Duplicate Chapter"
                  >
                    <Copy size={13} />
                  </button>

                  <button
                    onClick={() => addSection(chapter.id)}
                    className="p-1.5 text-editorial-muted hover:text-editorial-accent rounded text-[10px] font-mono font-bold uppercase"
                    title="Add Sub-section"
                  >
                    + Section
                  </button>

                  <button
                    onClick={() => deleteChapter(chapter.id)}
                    disabled={chapters.length <= 1}
                    className="p-1.5 text-editorial-muted hover:text-red-600 disabled:opacity-30 rounded"
                    title="Delete Chapter"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Nested Sections List */}
              {!isCollapsed && (
                <div className="p-3 pl-10 space-y-2 bg-neutral-50/50">
                  {sections.length === 0 ? (
                    <div className="text-xs text-editorial-muted italic py-1">
                      No subsections. Click "+ Section" above to break into logical subsections.
                    </div>
                  ) : (
                    sections.map((sec, sIdx) => (
                      <div
                        key={sec.id}
                        className="flex items-center justify-between p-2 rounded bg-white border border-editorial-border/60 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-editorial-muted">
                            § {index + 1}.{sIdx + 1}
                          </span>
                          <span className="font-serif font-medium text-editorial-text">
                            {sec.title}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const newSections = sections.filter(s => s.id !== sec.id);
                            onUpdateChapters(
                              chapters.map(c => c.id === chapter.id ? { ...c, sections: newSections } : c)
                            );
                          }}
                          className="text-editorial-muted hover:text-red-500 p-1"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
