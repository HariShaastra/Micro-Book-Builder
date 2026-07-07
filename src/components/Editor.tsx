/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Book, Chapter } from '../types.ts';
import { ChevronLeft, Plus, GripVertical, Bookmark, Save, Square, CheckSquare, Download, Maximize2, Minimize2, MoreVertical, Trash2, Layout, Settings, Menu, X as CloseIcon, Home, ArrowLeft, FileText, MessageSquare, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { v4 as uuidv4 } from 'uuid';
import { cn, calculateWordCount } from '../lib/utils.ts';
import RichTextEditor from './RichTextEditor.tsx';
import ExportModal from './ExportModal.tsx';
import Logo from './Logo.tsx';
import { useNotification } from '../contexts/NotificationContext';
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
        "group flex items-center justify-between p-3.5 transition-all mb-1.5 cursor-pointer border rounded-md",
        isActive 
          ? "bg-white border-editorial-text shadow-[0_4px_14px_-2px_rgba(0,0,0,0.06)] border-l-[3px]" 
          : "bg-white/40 border-editorial-border/40 hover:bg-white/80 hover:border-editorial-text/40 text-editorial-text",
        isDragging && "opacity-60 scale-[1.01] shadow-md border-editorial-accent"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2.5 overflow-hidden flex-1">
        <button 
          {...attributes} 
          {...listeners}
          className={cn(
            "cursor-grab active:cursor-grabbing text-editorial-muted opacity-20 group-hover:opacity-100 transition-opacity p-0.5 hover:text-editorial-text shrink-0",
            isActive && "opacity-100 text-editorial-accent"
          )}
          title="Drag to reorder"
        >
          <GripVertical size={13} />
        </button>
        <span className={cn(
          "text-[11px] font-semibold tracking-wide uppercase truncate transition-colors",
          isActive ? "text-editorial-text font-bold" : "text-editorial-accent group-hover:text-editorial-text"
        )}>
          {chapter.title}
        </span>
      </div>
      
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <span className="text-[9px] font-mono text-editorial-muted font-bold tracking-wider uppercase">
          {chapter.wordCount > 1000 ? `${(chapter.wordCount / 1000).toFixed(1)}k` : chapter.wordCount}w
        </span>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {chapter.isBookmarked && (
            <Bookmark size={11} className="fill-amber-500 text-amber-500 shrink-0" />
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 hover:text-red-500 hover:bg-red-50/50 rounded transition-colors shrink-0"
            title="Delete Segment"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Editor({ book, onUpdate, onBack }: EditorProps) {
  const { notify } = useNotification();
  const [activeChapterId, setActiveChapterId] = useState(book.chapters[0]?.id || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [viewTab, setViewTab] = useState<'writing' | 'outline' | 'structure' | 'assets'>('writing');

  const [userName, setUserName] = useState(localStorage.getItem('book-builder-shaastra-user-name') || localStorage.getItem('micro-book-user-name') || 'Writer');
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const TIPS = [
    "True writing is an act of architecture. Define your boundaries.",
    "Symmetry in structure leads to clarity in thought.",
    "The 'Resource Repository' is your intellectual evidence locker.",
    "A manuscript is never finished, only abandoned at the right moment.",
    "Privacy is the ultimate luxury for a modern writer.",
    "Every book is a conversation with a future reader.",
    "Focus on the rhythm of your prose. Let the studio handle the rest.",
  ];

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserName(val);
    localStorage.setItem('book-builder-shaastra-user-name', val);
    window.dispatchEvent(new Event('storage'));
  };

  const handleNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % TIPS.length);
  };

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
    <div className="flex h-screen overflow-hidden bg-white relative">
      {/* Sidebar Backdrop on Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar: Fixed, highly-polished layout panel */}
      <aside className={cn(
        "w-64 sm:w-72 md:w-80 border-r border-editorial-border flex flex-col bg-editorial-sidebar shrink-0 z-30 select-none transition-transform duration-300 ease-in-out",
        "fixed inset-y-0 left-0 md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header Section */}
        <div className="p-4 sm:p-5 border-b border-editorial-divider bg-white/30 backdrop-blur-sm shrink-0">
          <div className="mb-4 flex items-center justify-between">
            <Logo compact />
            {/* Mobile Sidebar Close Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 md:hidden text-editorial-muted hover:text-editorial-text transition-colors"
              title="Close Sidebar"
            >
              <CloseIcon size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div 
              className="text-[9px] uppercase tracking-[0.2em] font-bold text-editorial-accent cursor-pointer hover:text-editorial-text transition-colors flex items-center gap-1" 
              onClick={() => {
                onBack();
                setIsSidebarOpen(false);
              }}
              title="Return to the library archive"
            >
              <ChevronLeft size={11} className="text-editorial-accent/70" />
              <span>The Archive</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded text-[9px] text-emerald-800 uppercase tracking-wider font-bold shadow-sm whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>Online</span>
              <AnimatePresence>
                {lastSaved && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-1 text-[8px] font-mono text-emerald-600 font-bold shrink-0"
                  >
                    (Saved)
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <h1 
            className="text-base sm:text-lg font-serif italic font-semibold leading-normal text-editorial-text outline-none focus:ring-1 focus:ring-editorial-border rounded p-1 -ml-1 transition-all mt-2.5"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ ...book, title: e.currentTarget.textContent || 'Untitled' })}
            title="Click to rename document"
          >
            {book.title}
          </h1>
        </div>

        {/* Scrollable Chapters Section */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-hide">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-editorial-accent">Manuscript Sheets</h2>
            <button 
              onClick={addChapter} 
              className="p-1 px-2.5 bg-white border border-editorial-border rounded text-[9px] font-bold uppercase tracking-widest text-editorial-text hover:bg-neutral-50 transition-all flex items-center gap-1 shadow-sm shrink-0"
              title="Add Chapter Sheet"
            >
              <Plus size={10} />
              <span>Add</span>
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
              <div className="space-y-1.5 pr-1 pb-4">
                {book.chapters.map((chapter) => (
                  <SortableChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    isActive={activeChapterId === chapter.id}
                    onSelect={() => {
                      setActiveChapterId(chapter.id);
                      setIsSidebarOpen(false);
                    }}
                    onDelete={() => deleteChapter(chapter.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Sidebar Footer Section */}
        <div className="mt-auto p-4 sm:p-5 border-t border-editorial-divider bg-white/20 shrink-0">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold tracking-widest text-editorial-accent uppercase mb-3.5">
            <span>Manuscript Density</span>
            <span className="text-editorial-text font-mono">{totalWordCount.toLocaleString()} words</span>
          </div>
          <div className="w-full h-1 bg-editorial-border rounded-full overflow-hidden mb-3.5 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (totalWordCount / 50000) * 100)}%` }}
              className="h-full bg-editorial-text"
            />
          </div>
          <p className="font-serif italic text-[10px] text-editorial-muted leading-relaxed opacity-70">
            "The first draft is just you telling yourself the story."
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white w-full">
        {activeChapter ? (
          <>
            <header className="px-4 lg:px-8 min-h-[4rem] border-b border-editorial-divider flex items-center justify-between bg-white/80 backdrop-blur-md z-10 sticky top-0">
              {/* Left Actions */}
              <div className="flex items-center gap-1 sm:gap-2 flex-1">
                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 md:hidden text-editorial-muted hover:text-editorial-text transition-colors mr-1 shrink-0"
                  title="Toggle Chapters Sidebar"
                >
                  <Menu size={20} />
                </button>
                
                <button 
                  onClick={onBack}
                  className="p-2 text-editorial-muted hover:text-editorial-text transition-colors flex items-center gap-2"
                  title="Back to Archive"
                >
                  <ArrowLeft size={18} />
                  <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest text-left">Back to Studio</span>
                </button>
                <div className="hidden sm:block w-px h-6 bg-editorial-divider mx-1 lg:mx-2" />
                <div className="hidden sm:flex items-center gap-3">
                   <button 
                    onClick={() => updateChapter(activeChapter.id, { isBookmarked: !activeChapter.isBookmarked })}
                    className={cn(
                      "transition-colors",
                      activeChapter.isBookmarked ? "text-amber-500" : "text-editorial-muted hover:text-amber-500"
                    )}
                  >
                    <Bookmark size={14} className={activeChapter.isBookmarked ? "fill-current" : ""} />
                  </button>
                </div>
              </div>

              {/* Center Navigation (Tabs) */}
              <div className="flex items-center bg-editorial-sidebar rounded border border-editorial-border p-1 shrink-0 scale-90 sm:scale-100 overflow-x-auto scrollbar-hide">
                {(['writing', 'outline', 'structure', 'assets'] as const).map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setViewTab(tab)}
                    className={cn(
                      "text-[9px] lg:text-[10px] font-bold uppercase tracking-widest transition-all px-2.5 lg:px-4 py-1.5 rounded-sm shrink-0",
                      viewTab === tab ? "bg-white text-editorial-text shadow-sm" : "text-editorial-muted hover:text-editorial-accent"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* Right Actions */}
              <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1 font-sans">
                <div className="hidden lg:flex flex-col items-end mr-2">
                   <span className="text-[10px] font-bold text-editorial-accent tracking-widest uppercase">Words</span>
                   <span className="text-[11px] font-mono text-editorial-text leading-none font-bold">
                     {activeChapter.wordCount.toLocaleString()}
                   </span>
                </div>
                
                <button 
                  onClick={() => setIsCompanionOpen(!isCompanionOpen)}
                  className={cn(
                    "px-3 lg:px-4 py-2 rounded text-[9px] lg:text-[10px] font-bold tracking-widest uppercase transition-all shadow-sm flex items-center gap-2 border leading-none h-[34px]",
                    isCompanionOpen 
                      ? "bg-editorial-text text-white border-editorial-text hover:bg-black" 
                      : "bg-white text-editorial-text border-editorial-border hover:bg-neutral-50"
                  )}
                  title="Toggle Studio Companion"
                >
                  <MessageSquare size={13} />
                  <span className="hidden sm:inline">Companion</span>
                </button>
                
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="bg-editorial-text text-white px-3 lg:px-5 py-2 rounded text-[9px] lg:text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all shadow-sm flex items-center gap-2 h-[34px]"
                >
                  <Download size={14} className="sm:hidden" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-editorial-bg flex flex-col items-center">
              {viewTab === 'writing' && (
                <div className="w-full max-w-2xl py-10 lg:py-20 px-4 lg:px-8 flex flex-col min-h-full">
                  <header className="mb-10 lg:mb-16 text-center border-b border-editorial-divider pb-8 lg:pb-12">
                    <div className="text-[9px] lg:text-[11px] uppercase tracking-ultra-editorial text-editorial-muted mb-3 lg:mb-4">
                      Manuscript Fragment: {book.chapters.findIndex(c => c.id === activeChapterId) + 1}
                    </div>
                    <input
                      type="text"
                      value={activeChapter.title}
                      onChange={(e) => updateChapter(activeChapter.id, { title: e.target.value })}
                      className="text-3xl lg:text-5xl font-serif font-light text-editorial-text leading-tight bg-transparent border-none focus:ring-0 w-full text-center p-0 placeholder:opacity-20"
                      placeholder="Name this segment... (e.g., Preface, Chapter One, The Reveal)"
                    />
                    <div className="w-12 lg:w-16 h-px bg-editorial-border mx-auto mt-6 lg:mt-8"></div>
                  </header>

                  <div className="flex-1 pb-20">
                    <RichTextEditor 
                      content={activeChapter.content} 
                      onChange={(content) => updateChapter(activeChapter.id, { content })}
                      isFullscreen={isFullscreen}
                      onImagePasted={(img) => {
                        const newAsset = {
                          id: uuidv4(),
                          name: img.name || `Pasted_Image_${Date.now()}.png`,
                          type: 'image/png',
                          size: img.size,
                          url: img.url
                        };
                        onUpdate({
                          ...book,
                          assets: [...(book.assets || []), newAsset]
                        });
                        notify('Image pasted and added to Resource Repository', 'success');
                      }}
                      placeholder="The story begins here... Let your thoughts crystallize. (Click to start writing your masterpiece)"
                    />
                  </div>
                  
                  <footer className="w-full h-auto lg:h-12 border-t border-editorial-divider bg-editorial-bg/80 backdrop-blur-sm flex flex-row justify-between items-center py-4 lg:py-0 px-6 lg:px-10 text-[9px] lg:text-[10px] font-bold text-editorial-muted tracking-[0.2em] uppercase sticky bottom-0 mt-auto shadow-sm">
                    <div className="flex-1 text-left truncate pr-4">Mode: {activeChapter.status}</div>
                    <div className="flex items-center gap-4 lg:gap-10 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="hidden sm:inline">Progress:</span>
                        <span className="text-editorial-text">{Math.min(100, Math.round((activeChapter.wordCount / 2000) * 100))}%</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1">
                        <span>Read:</span>
                        <span className="text-editorial-text">{Math.ceil(activeChapter.wordCount / 200)}m</span>
                      </div>
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

                  <div className="p-4 bg-white border border-editorial-border rounded text-left mb-8 shadow-sm">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-editorial-accent mb-1 block">🗺️ Section Guide: Storyboard Planner</span>
                    <p className="text-[11px] text-editorial-accent leading-relaxed font-serif italic">
                      <strong>Steps:</strong> Write target scene beats, plot elements, or goals into each card's summary textarea. Scan this checklist to verify your book's narrative pacing. Click any card to quick-jump directly back to writing it.
                    </p>
                  </div>
                  
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
                <div className="w-full max-w-3xl py-10 lg:py-20 px-4 lg:px-8">
                  <header className="mb-10 lg:mb-16">
                    <div className="text-[9px] lg:text-[10px] uppercase tracking-ultra-editorial font-bold text-editorial-accent mb-2">Technical Registry</div>
                    <h2 className="text-3xl lg:text-4xl font-serif italic text-editorial-text">Book Structure</h2>
                  </header>

                  <div className="p-4 bg-white border border-editorial-border rounded text-left mb-8 shadow-sm">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-editorial-accent mb-1 block">📂 Section Guide: Registry & Settings</span>
                    <p className="text-[11px] text-editorial-accent leading-relaxed font-serif italic">
                      <strong>Steps:</strong> Click the cover module to select art from your device. Refine the formal synopsis details, assign progress stages (Draft / Complete), and append custom research directions in the Notes panel.
                    </p>
                  </div>

                  <div className="space-y-10 lg:space-y-12">
                    <section>
                      <label className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-3 lg:mb-4">Manuscript Cover</label>
                      <div 
                        className="w-full aspect-[2/3] max-w-[200px] bg-editorial-sidebar border border-dashed border-editorial-border rounded flex flex-col items-center justify-center cursor-pointer hover:border-editorial-text transition-all overflow-hidden group relative"
                        onClick={() => document.getElementById('cover-upload')?.click()}
                      >
                        {book.coverImage ? (
                          <>
                            <img src={book.coverImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change Image</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center px-4">
                            <Plus size={24} className="mx-auto text-editorial-muted mb-2" />
                            <span className="text-[10px] text-editorial-muted font-bold uppercase tracking-widest">Upload Cover</span>
                          </div>
                        )}
                        <input 
                          id="cover-upload" 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => onUpdate({ ...book, coverImage: ev.target?.result as string });
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </section>

                    <section>
                      <label className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-3 lg:mb-4">Formal Title</label>
                      <input 
                        type="text"
                        className="w-full bg-transparent border-b border-editorial-border py-3 lg:py-4 text-2xl lg:text-3xl font-serif italic text-editorial-text outline-none focus:border-editorial-text transition-colors"
                        value={book.title}
                        onChange={(e) => onUpdate({ ...book, title: e.target.value })}
                        placeholder="Establish manuscript identity..."
                      />
                    </section>

                    <section>
                      <label className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-3 lg:mb-4">Project Description</label>
                      <textarea 
                        className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded p-4 lg:p-6 text-sm font-serif italic focus:ring-1 focus:ring-editorial-text outline-none min-h-[120px] lg:min-h-[150px]"
                        value={book.description}
                        onChange={(e) => onUpdate({ ...book, description: e.target.value })}
                        placeholder="Define the core thesis or narrative scope of this work..."
                      />
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      <section>
                        <label className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-3 lg:mb-4">Archive Status</label>
                        <select 
                          className="w-full bg-white border border-editorial-border rounded p-3 text-[10px] lg:text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-editorial-text"
                          value={book.status}
                          onChange={(e) => onUpdate({ ...book, status: e.target.value as any })}
                        >
                          <option value="draft">Live Draft</option>
                          <option value="completed">Completed Manuscript</option>
                          <option value="archived">Stored in Archive</option>
                        </select>
                      </section>
                      <section>
                        <label className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-3 lg:mb-4">Meta Registry</label>
                        <div className="text-[11px] lg:text-xs font-serif italic text-editorial-accent">
                          Established: {new Date(book.createdAt).toLocaleDateString()}<br />
                          Last Modification: {new Date(book.updatedAt).toLocaleTimeString()}
                        </div>
                      </section>
                    </div>

                    <section>
                      <label className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest text-editorial-accent block mb-4 lg:mb-4">Archivist's Notes</label>
                      <textarea 
                        className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded p-4 lg:p-6 text-sm font-serif italic focus:ring-1 focus:ring-editorial-text outline-none min-h-[150px] lg:min-h-[200px]"
                        value={book.notes || ''}
                        onChange={(e) => onUpdate({ ...book, notes: e.target.value })}
                        placeholder="Append structural considerations, research findings, or revision notes..."
                      />
                    </section>
                  </div>
                </div>
              )}
              {viewTab === 'assets' && (
                <div className="w-full max-w-4xl py-10 lg:py-20 px-4 lg:px-8">
                  <header className="mb-10 lg:mb-16 flex justify-between items-end">
                    <div>
                      <div className="text-[9px] lg:text-[10px] uppercase tracking-ultra-editorial font-bold text-editorial-accent mb-2">Resource Repository</div>
                      <h2 className="text-3xl lg:text-4xl font-serif italic text-editorial-text">Attachments & Assets</h2>
                      <p className="text-sm font-serif italic text-editorial-accent mt-2">"Research, evidence, and inspiration."</p>
                    </div>
                    <button 
                      onClick={() => document.getElementById('asset-upload')?.click()}
                      className="bg-editorial-text text-white px-6 py-3 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all shadow-sm flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Attach Asset
                    </button>
                    <input 
                      id="asset-upload" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const newAsset = {
                              id: uuidv4(),
                              name: file.name,
                              type: file.type,
                              size: file.size,
                              url: ev.target?.result as string
                            };
                            onUpdate({ 
                              ...book, 
                              assets: [...(book.assets || []), newAsset] 
                            });
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                    />
                  </header>

                  <div className="p-4 bg-white border border-editorial-border rounded text-left mb-8 shadow-sm">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-editorial-accent mb-1 block">🖇️ Section Guide: Cabinet Assets</span>
                    <p className="text-[11px] text-editorial-accent leading-relaxed font-serif italic">
                      <strong>Steps:</strong> Tap <strong>Attach Asset</strong> on the right to upload reference files, pictures, character boards, or research logs. Keep them organized in the grid, downloaded to other devices, or removed instantly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(book.assets || []).length === 0 ? (
                      <div className="col-span-full py-20 text-center bg-editorial-sidebar/30 border border-dashed border-editorial-border rounded">
                        <Layout className="mx-auto text-editorial-muted mb-4 opacity-50" size={32} />
                        <p className="text-sm font-serif italic text-editorial-accent">No assets attached to this manuscript yet.</p>
                      </div>
                    ) : (
                      book.assets?.map((asset) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={asset.id}
                          className="bg-white border border-editorial-border p-4 rounded group hover:border-editorial-text transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="p-2 bg-editorial-sidebar rounded border border-editorial-border">
                              {asset.type.startsWith('image/') ? (
                                <Layout size={20} className="text-editorial-accent" />
                              ) : (
                                <FileText size={20} className="text-editorial-accent" />
                              )}
                            </div>
                            <button 
                              onClick={() => {
                                const newAssets = book.assets?.filter(a => a.id !== asset.id);
                                onUpdate({ ...book, assets: newAssets });
                              }}
                              className="text-editorial-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="space-y-1 overflow-hidden">
                            <h4 className="text-[11px] font-bold text-editorial-text truncate" title={asset.name}>{asset.name}</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-editorial-accent uppercase tracking-widest font-mono">{(asset.size / 1024).toFixed(1)} KB</span>
                              <a 
                                href={asset.url} 
                                download={asset.name}
                                className="text-[9px] font-bold text-editorial-text uppercase tracking-widest hover:underline"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                          {asset.type.startsWith('image/') && (
                            <div className="mt-4 aspect-video rounded overflow-hidden bg-editorial-sidebar border border-editorial-border">
                              <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-12 p-6 bg-editorial-sidebar/30 border border-editorial-border rounded">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-2">Storage Intelligence</h4>
                    <p className="text-[10px] text-editorial-accent leading-relaxed italic">
                      Assets are stored via Base64 within your browser's local storage. To maintain performance, avoid attaching files larger than 1MB. Total project capacity is approximately 5MB.
                    </p>
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

      {/* Companion Right Sidebar Panel */}
      <AnimatePresence>
        {isCompanionOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="hidden sm:flex border-l border-editorial-border flex-col bg-editorial-sidebar shrink-0 z-10 overflow-hidden font-sans select-none"
          >
            {/* Header */}
            <div className="p-4 border-b border-editorial-divider flex items-center justify-between bg-white/40">
              <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-text font-sans">Studio Companion</span>
              <button 
                onClick={() => setIsCompanionOpen(false)} 
                className="p-1 hover:bg-neutral-100/55 rounded text-editorial-muted hover:text-editorial-text transition-colors"
              >
                <CloseIcon size={14} />
              </button>
            </div>

            {/* Profile Avatar Block */}
            <div className="p-5 border-b border-editorial-divider bg-white/20 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-editorial-text text-white rounded-full flex items-center justify-center font-serif italic text-xl shadow-inner mb-2.5">
                A
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-editorial-text font-sans">The Archivist</h3>
              <span className="text-[9px] text-editorial-muted uppercase tracking-widest font-sans font-semibold mt-0.5 opacity-80">Writing Mentor</span>
            </div>

            {/* Pen Name Field */}
            <div className="p-5 border-b border-editorial-divider bg-white/20">
              <label className="text-[9px] font-bold uppercase tracking-widest text-editorial-accent block mb-2 font-sans">Pen Name</label>
              <input 
                type="text" 
                value={userName} 
                onChange={handleUserNameChange}
                className="w-full bg-white border border-editorial-border rounded px-3 py-2 text-xs font-serif italic focus:ring-1 focus:ring-editorial-text focus:border-editorial-text outline-none shadow-inner"
                placeholder="Establish your moniker..."
              />
            </div>

            {/* Reflection of the Day */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <label className="text-[9px] font-bold uppercase tracking-widest text-editorial-accent block font-sans">Daily Thought</label>
              <div className="bg-white/80 p-4 border border-editorial-border rounded shadow-sm relative italic font-serif text-[12.5px] text-editorial-text leading-relaxed">
                "{TIPS[currentTip]}"
              </div>
              <button 
                onClick={handleNextTip}
                className="text-[9px] font-bold uppercase tracking-widest text-editorial-text hover:underline transition-all font-sans"
              >
                Next Thought &rarr;
              </button>
            </div>

            {/* Companion Footer Block */}
            <div className="p-4 bg-white/10 text-center text-[10px] text-editorial-muted italic font-serif border-t border-editorial-divider">
              Private offline sandbox drafting
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Floating Companion Overlay (only shown for small devices) */}
      <AnimatePresence>
        {isCompanionOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-editorial-border shadow-2xl p-5 flex flex-col font-sans mb-0"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-editorial-divider">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-editorial-text text-white rounded-full flex items-center justify-center font-serif italic text-xs">
                  A
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-text">The Archivist</span>
              </div>
              <button onClick={() => setIsCompanionOpen(false)} className="text-editorial-muted hover:text-editorial-text">
                <CloseIcon size={16} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="text-[8px] font-bold uppercase tracking-widest text-editorial-accent block mb-1">Pen Name</label>
              <input 
                type="text" 
                value={userName} 
                onChange={handleUserNameChange}
                className="w-full bg-white border border-editorial-border rounded px-3 py-1.5 text-xs font-serif italic focus:ring-1 focus:ring-editorial-text focus:border-editorial-text outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-bold uppercase tracking-widest text-editorial-accent block font-sans">Daily Thought</label>
              <p className="font-serif italic text-xs text-editorial-text leading-relaxed">
                "{TIPS[currentTip]}"
              </p>
              <button 
                onClick={handleNextTip}
                className="text-[9px] font-bold uppercase tracking-widest text-editorial-accent hover:underline font-sans"
              >
                Next Thought &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
