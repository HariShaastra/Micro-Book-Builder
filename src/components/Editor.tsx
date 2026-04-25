/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Book, Chapter } from '../types.ts';
import { ChevronLeft, Plus, GripVertical, Bookmark, Save, Square, CheckSquare, Download, Maximize2, Minimize2, MoreVertical, Trash2, Layout, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { v4 as uuidv4 } from 'uuid';
import { cn, calculateWordCount } from '../lib/utils.ts';
import RichTextEditor from './RichTextEditor.tsx';
import ExportModal from './ExportModal.tsx';
import Logo from './Logo.tsx';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EditorProps {
  book: Book;
  onUpdate: (book: Book) => void;
  onBack: () => void;
}

interface SortableChapterItemProps {
  chapter: Chapter;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function SortableChapterItem({ chapter, isActive, onSelect, onDelete }: SortableChapterItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 0
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center justify-between p-3 transition-all mb-2 cursor-pointer border rounded-sm",
        isActive 
          ? "bg-white border-editorial-text shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] border-l-4" 
          : "bg-transparent border-transparent hover:bg-editorial-hover text-editorial-text",
        isDragging && "opacity-50 scale-[1.02] shadow-xl border-editorial-accent"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button 
          {...attributes} 
          {...listeners}
          className={cn(
            "cursor-grab active:cursor-grabbing text-editorial-muted opacity-0 group-hover:opacity-100 transition-opacity",
            isActive && "opacity-100 text-editorial-accent"
          )}
        >
          <GripVertical size={14} />
        </button>
        <span className={cn(
          "text-[10px] font-bold tracking-[0.1em] uppercase truncate transition-colors",
          isActive ? "text-editorial-text" : "text-editorial-accent group-hover:text-editorial-text"
        )}>
          {chapter.title}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-mono text-editorial-muted font-bold group-hover:hidden uppercase">
           {chapter.wordCount > 1000 ? `${(chapter.wordCount / 1000).toFixed(1)}k` : chapter.wordCount}w
        </span>
        <div className="hidden group-hover:flex items-center gap-2 transition-all">
          {chapter.isBookmarked && (
            <Bookmark size={12} className="fill-editorial-accent text-editorial-accent" />
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Editor({ book, onUpdate, onBack }: EditorProps) {
  const [activeChapterId, setActiveChapterId] = useState(book.chapters[0]?.id || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [viewTab, setViewTab] = useState<'writing' | 'outline' | 'structure'>('writing');

  const activeChapter = book.chapters.find(c => c.id === activeChapterId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = book.chapters.findIndex(c => c.id === active.id);
      const newIndex = book.chapters.findIndex(c => c.id === over.id);
      onUpdate({
        ...book,
        chapters: arrayMove(book.chapters, oldIndex, newIndex)
      });
    }
  };

  const updateChapter = useCallback((chapterId: string, updates: Partial<Chapter>) => {
    const updatedChapters = book.chapters.map(c => {
      if (c.id === chapterId) {
        const updated = { ...c, ...updates };
        if (updates.content !== undefined) {
          updated.wordCount = calculateWordCount(updates.content);
        }
        return updated;
      }
      return c;
    });
    onUpdate({ ...book, chapters: updatedChapters });
    setLastSaved(Date.now());
  }, [book, onUpdate]);

  const addChapter = () => {
    const newChapter: Chapter = {
      id: uuidv4(),
      title: `Chapter ${book.chapters.length + 1}`,
      content: '',
      isBookmarked: false,
      status: 'draft',
      wordCount: 0,
    };
    onUpdate({ ...book, chapters: [...book.chapters, newChapter] });
    setActiveChapterId(newChapter.id);
  };

  const deleteChapter = (id: string) => {
    if (book.chapters.length === 1) return alert("You must have at least one chapter.");
    if (window.confirm("Delete this chapter?")) {
      const newChapters = book.chapters.filter(c => c.id !== id);
      onUpdate({ ...book, chapters: newChapters });
      if (activeChapterId === id) {
        setActiveChapterId(newChapters[0].id);
      }
    }
  };

  const totalWordCount = book.chapters.reduce((acc, c) => acc + c.wordCount, 0);

  // Auto-save feedback
  useEffect(() => {
    const timer = setTimeout(() => setLastSaved(null), 3000);
    return () => clearTimeout(timer);
  }, [lastSaved]);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-editorial-border flex flex-col bg-editorial-sidebar">
        <div className="p-6 border-b border-editorial-border bg-editorial-sidebar/50">
          <div className="mb-6">
            <Logo className="scale-90 origin-left" />
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-editorial-accent mb-4 cursor-pointer hover:text-editorial-text transition-colors flex items-center gap-2" onClick={onBack}>
            <ChevronLeft size={12} />
            The Archive
          </div>
          <h1 
            className="text-xl font-serif italic font-semibold leading-tight text-editorial-text outline-none focus:ring-1 focus:ring-editorial-border rounded p-1 -ml-1 transition-all"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ ...book, title: e.currentTarget.textContent || 'Untitled' })}
          >
            {book.title}
          </h1>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
              <span className="text-[10px] text-editorial-accent uppercase tracking-widest font-bold">Project Live</span>
            </div>
             <AnimatePresence>
              {lastSaved && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[9px] uppercase tracking-[0.2em] text-editorial-muted font-bold"
                >
                  Saved
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-editorial-accent">Manuscript</h2>
            <button 
              onClick={addChapter} 
              className="p-1.5 hover:bg-editorial-hover rounded border border-transparent hover:border-editorial-border text-editorial-accent transition-all"
              title="Append Section"
            >
              <Plus size={14} />
            </button>
          </div>

          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={book.chapters.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="overflow-y-auto pr-2 max-h-[calc(100vh-320px)]">
                {book.chapters.map((chapter) => (
                  <SortableChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    isActive={activeChapterId === chapter.id}
                    onSelect={() => setActiveChapterId(chapter.id)}
                    onDelete={() => deleteChapter(chapter.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="mt-auto p-8 border-t border-editorial-divider bg-editorial-sidebar/50">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-editorial-accent uppercase mb-3">
            <span>Progress Density</span>
            <span className="text-editorial-text">{totalWordCount.toLocaleString()} words</span>
          </div>
          <div className="w-full h-1 bg-editorial-border rounded-full overflow-hidden mb-6 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (totalWordCount / 50000) * 100)}%` }}
              className="h-full bg-editorial-text"
            />
          </div>
          <p className="font-serif italic text-xs text-editorial-muted leading-relaxed opacity-60">
            "The first draft is just you telling yourself the story."
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {activeChapter ? (
          <>
            <header className="px-8 h-16 border-b border-editorial-divider flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-6">
                  {(['writing', 'outline', 'structure'] as const).map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setViewTab(tab)}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest transition-all pb-1 border-b-2",
                        viewTab === tab ? "border-editorial-text text-editorial-text" : "border-transparent text-editorial-muted hover:text-editorial-accent"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="w-px h-6 bg-editorial-border mx-2" />
                <div className="flex items-center gap-4">
                   <button 
                    onClick={() => updateChapter(activeChapter.id, { isBookmarked: !activeChapter.isBookmarked })}
                    className={cn(
                      "transition-colors",
                      activeChapter.isBookmarked ? "text-amber-500" : "text-editorial-muted hover:text-amber-500"
                    )}
                  >
                    <Bookmark size={16} className={activeChapter.isBookmarked ? "fill-current" : ""} />
                  </button>
                  <button 
                    onClick={() => updateChapter(activeChapter.id, { status: activeChapter.status === 'draft' ? 'final' : 'draft' })}
                    className={cn(
                      "text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full text-white transition-all shadow-sm",
                      activeChapter.status === 'final' ? "bg-emerald-600" : "bg-editorial-accent hover:bg-editorial-text"
                    )}
                  >
                    {activeChapter.status === 'final' ? 'Validated' : 'Draft'}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-editorial-accent tracking-widest uppercase">Chapter Word Count</span>
                   <span className="text-[11px] font-mono text-editorial-text">
                     {activeChapter.wordCount.toLocaleString()} words
                   </span>
                </div>
                <div className="w-px h-8 bg-editorial-divider" />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-editorial-hover rounded border border-transparent hover:border-editorial-border text-editorial-muted hover:text-editorial-text transition-all"
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="bg-editorial-text text-white px-5 py-2 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all shadow-sm"
                  >
                    Export Manuscript
                  </button>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-editorial-bg flex flex-col items-center">
              {viewTab === 'writing' && (
                <div className="w-full max-w-2xl py-20 px-8 flex flex-col">
                  <header className="mb-16 text-center border-b border-editorial-divider pb-12">
                    <div className="text-[11px] uppercase tracking-ultra-editorial text-editorial-muted mb-4">
                      Manuscript Fragment: {book.chapters.findIndex(c => c.id === activeChapterId) + 1}
                    </div>
                    <input
                      type="text"
                      value={activeChapter.title}
                      onChange={(e) => updateChapter(activeChapter.id, { title: e.target.value })}
                      className="text-5xl font-serif font-light text-editorial-text leading-tight bg-transparent border-none focus:ring-0 w-full text-center p-0 placeholder:opacity-20"
                      placeholder="Fragment Title"
                    />
                    <div className="w-16 h-px bg-editorial-border mx-auto mt-8"></div>
                  </header>

                  <div className="flex-1">
                    <RichTextEditor 
                      content={activeChapter.content} 
                      onChange={(content) => updateChapter(activeChapter.id, { content })}
                      isFullscreen={isFullscreen}
                    />
                  </div>
                  
                  <footer className="w-full h-12 border-t border-editorial-divider bg-editorial-bg/80 backdrop-blur-sm flex justify-between items-center px-10 text-[10px] font-bold text-editorial-muted tracking-[0.2em] uppercase sticky bottom-0 mt-auto">
                    <div>Section Architecture: {activeChapter.status}</div>
                    <div className="flex gap-10">
                      <span>Draft Progress: {Math.min(100, Math.round((activeChapter.wordCount / 2000) * 100))}%</span>
                      <span>Estimated Read: {Math.ceil(activeChapter.wordCount / 200)} mins</span>
                    </div>
                  </footer>
                </div>
              )}

              {viewTab === 'outline' && (
                <div className="w-full max-w-4xl py-20 px-8">
                  <header className="mb-16">
                    <div className="text-[10px] uppercase tracking-ultra-editorial font-bold text-editorial-accent mb-2">Narrative Arc</div>
                    <h2 className="text-4xl font-serif italic text-editorial-text">Manuscript Outline</h2>
                  </header>
                  
                  <div className="space-y-6">
                    {book.chapters.map((chapter, index) => (
                      <motion.div 
                        key={chapter.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "bg-white border rounded p-6 transition-all",
                          activeChapterId === chapter.id ? "border-editorial-text ring-1 ring-editorial-text shadow-sm" : "border-editorial-border"
                        )}
                        onClick={() => setActiveChapterId(chapter.id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-muted">Fragment {index + 1} / {chapter.title}</span>
                          <span className="text-[10px] font-mono text-editorial-accent">{chapter.wordCount} words</span>
                        </div>
                        <textarea 
                          className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded p-4 text-sm font-serif italic focus:ring-1 focus:ring-editorial-text focus:border-editorial-text outline-none min-h-[100px] resize-none"
                          placeholder="Draft the narrative summary for this fragment..."
                          value={chapter.summary || ''}
                          onChange={(e) => updateChapter(chapter.id, { summary: e.target.value })}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {viewTab === 'structure' && (
                <div className="w-full max-w-3xl py-20 px-8">
                  <header className="mb-16">
                    <div className="text-[10px] uppercase tracking-ultra-editorial font-bold text-editorial-accent mb-2">Technical Registry</div>
                    <h2 className="text-4xl font-serif italic text-editorial-text">Book Structure</h2>
                  </header>

                  <div className="space-y-12">
                    <section>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-4">Formal Title</label>
                      <input 
                        type="text"
                        className="w-full bg-transparent border-b border-editorial-border py-4 text-3xl font-serif italic text-editorial-text outline-none focus:border-editorial-text transition-colors"
                        value={book.title}
                        onChange={(e) => onUpdate({ ...book, title: e.target.value })}
                        placeholder="Untitled Manuscript"
                      />
                    </section>

                    <section>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-4">Project Description</label>
                      <textarea 
                        className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded p-6 text-sm font-serif italic focus:ring-1 focus:ring-editorial-text outline-none min-h-[150px]"
                        value={book.description}
                        onChange={(e) => onUpdate({ ...book, description: e.target.value })}
                        placeholder="Define the core thesis or narrative scope of this work..."
                      />
                    </section>

                    <div className="grid grid-cols-2 gap-12">
                      <section>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-4">Archive Status</label>
                        <select 
                          className="w-full bg-white border border-editorial-border rounded p-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-editorial-text"
                          value={book.status}
                          onChange={(e) => onUpdate({ ...book, status: e.target.value as any })}
                        >
                          <option value="draft">Live Draft</option>
                          <option value="completed">Completed Manuscript</option>
                          <option value="archived">Stored in Archive</option>
                        </select>
                      </section>
                      <section>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-4">Meta Registry</label>
                        <div className="text-xs font-serif italic text-editorial-accent">
                          Established: {new Date(book.createdAt).toLocaleDateString()}<br />
                          Last Modification: {new Date(book.updatedAt).toLocaleTimeString()}
                        </div>
                      </section>
                    </div>

                    <section>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-4">Archivist's Notes</label>
                      <textarea 
                        className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded p-6 text-sm font-serif italic focus:ring-1 focus:ring-editorial-text outline-none min-h-[200px]"
                        value={book.notes || ''}
                        onChange={(e) => onUpdate({ ...book, notes: e.target.value })}
                        placeholder="Jot down structural considerations, research links, or future revisions..."
                      />
                    </section>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chapter to start writing.
          </div>
        )}
      </main>

      {/* Fullscreen Overlay Close Button */}
      {isFullscreen && (
        <button 
          onClick={() => setIsFullscreen(false)}
          className="fixed top-8 right-8 z-[60] bg-black text-white p-3 rounded-full hover:scale-105 transition-transform shadow-xl"
        >
          <Minimize2 size={24} />
        </button>
      )}

      {showExportModal && (
        <ExportModal book={book} onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
}
