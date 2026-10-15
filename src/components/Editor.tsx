/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Book, 
  Chapter, 
  CoverConfig, 
  ReferenceItem, 
  BookNote, 
  FictionCharacter, 
  BookVersion 
} from '../types.ts';
import { 
  ChevronLeft, 
  Plus, 
  GripVertical, 
  Bookmark, 
  Save, 
  Download, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  Layout, 
  Settings, 
  Menu, 
  X as CloseIcon, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Eye, 
  Search, 
  History, 
  UserPlus, 
  Quote, 
  Palette, 
  ListTree, 
  Copy, 
  RotateCcw, 
  Cloud, 
  CheckCircle2, 
  Sparkles,
  ArrowLeft,
  Link2,
  Sun,
  Moon,
  Share2,
  Frame,
  CloudOff,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn, calculateWordCount } from '../lib/utils.ts';
import RichTextEditor from './RichTextEditor.tsx';
import ContentBlockEditor from './ContentBlockEditor.tsx';
import CoverBuilder from './CoverBuilder.tsx';
import OutlineView from './OutlineView.tsx';
import BookPreviewModal from './BookPreviewModal.tsx';
import ExportModal from './ExportModal.tsx';
import FindReplaceBar from './FindReplaceBar.tsx';
import ReferencesManager from './ReferencesManager.tsx';
import CiteAndLinkModal from './CiteAndLinkModal.tsx';
import FacilityIntro from './FacilityIntro.tsx';
import ShareModal from './ShareModal.tsx';
import FormatLayoutStudio from './FormatLayoutStudio.tsx';
import Logo from './Logo.tsx';
import { useNotification } from '../contexts/NotificationContext.tsx';
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
  allBooks?: Book[];
  cloudSyncState?: 'synced' | 'syncing' | 'offline' | 'saved_locally' | 'error';
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

function SortableChapterItem({ 
  chapter, 
  index,
  isActive, 
  onSelect, 
  onDelete 
}: { 
  chapter: Chapter; 
  index: number;
  isActive: boolean; 
  onSelect: () => void; 
  onDelete: () => void; 
}) {
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
        "group flex items-center justify-between p-3 transition-all mb-1 cursor-pointer border rounded-md select-none",
        isActive 
          ? "bg-white border-editorial-text shadow-xs border-l-[3px] border-l-editorial-accent font-semibold" 
          : "bg-white/40 border-editorial-border/40 hover:bg-white/80 text-editorial-text",
        isDragging && "opacity-60 scale-[1.01] shadow-md border-editorial-accent"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 overflow-hidden flex-1">
        <button 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-editorial-muted opacity-30 group-hover:opacity-100 transition-opacity p-0.5 hover:text-editorial-text shrink-0"
          title="Drag to reorder"
        >
          <GripVertical size={13} />
        </button>
        <span className="text-[10px] font-mono font-bold text-editorial-muted">
          {index + 1}.
        </span>
        <span className="text-xs truncate font-serif">
          {chapter.title}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <span className="text-[9px] font-mono text-editorial-muted">
          {chapter.wordCount}w
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 text-editorial-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded"
          title="Delete Chapter"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

export default function Editor({ 
  book, 
  onUpdate, 
  onBack, 
  allBooks = [], 
  cloudSyncState = 'saved_locally',
  theme = 'light',
  onToggleTheme
}: EditorProps) {
  const { notify } = useNotification();
  
  // Navigation & Workspace View
  const [activeChapterId, setActiveChapterId] = useState(book.chapters[0]?.id || '');
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'blocks'>('wysiwyg');
  const [viewTab, setViewTab] = useState<
    'writing' | 'outline' | 'cover' | 'format' | 'characters' | 'notes' | 'references' | 'versions'
  >('writing');

  // Modals & Panels
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showCiteLinkModal, setShowCiteLinkModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isChapterSidebarOpen, setIsChapterSidebarOpen] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Real-time network and offline persistence listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      notify('Network reconnected. Cloud synchronization active.', 'info');
    };
    const handleOffline = () => {
      setIsOnline(false);
      notify('Offline mode active. All progress is autosaved locally to device storage.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [notify]);

  // Versioning state
  const [newVersionLabel, setNewVersionLabel] = useState('');

  // Character notes state
  const [newCharName, setNewCharName] = useState('');
  const [newCharRole, setNewCharRole] = useState<FictionCharacter['role']>('Protagonist');
  const [newCharDesc, setNewCharDesc] = useState('');

  // General notes state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const activeChapter = book.chapters.find(c => c.id === activeChapterId) || book.chapters[0];

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
      const reordered = arrayMove(book.chapters, oldIndex, newIndex).map((ch, i) => ({
        ...ch,
        order: i
      }));
      onUpdate({ ...book, chapters: reordered });
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
    const updatedBook: Book = { ...book, chapters: updatedChapters, updatedAt: Date.now() };

    // Offline resilience: immediately persist to localStorage dedicated autosave cache
    try {
      localStorage.setItem(`shaastra_autosave_${book.id}`, JSON.stringify(updatedBook));
      localStorage.setItem('shaastra_last_autosave_time', Date.now().toString());
    } catch (e) {
      console.warn('Local autosave error:', e);
    }

    onUpdate(updatedBook);
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [book, onUpdate]);

  const addChapter = () => {
    const newChapter: Chapter = {
      id: uuidv4(),
      bookId: book.id,
      title: `Chapter ${book.chapters.length + 1}`,
      content: `<h2>Chapter ${book.chapters.length + 1}</h2><p>Begin drafting this section...</p>`,
      isBookmarked: false,
      status: 'draft',
      wordCount: 10,
      order: book.chapters.length,
    };
    onUpdate({ ...book, chapters: [...book.chapters, newChapter] });
    setActiveChapterId(newChapter.id);
    notify('New chapter added.', 'info');
  };

  const deleteChapter = (id: string) => {
    if (book.chapters.length <= 1) {
      notify("A manuscript requires at least one chapter.", "warning");
      return;
    }
    const newChapters = book.chapters.filter(c => c.id !== id);
    onUpdate({ ...book, chapters: newChapters });
    if (activeChapterId === id) {
      setActiveChapterId(newChapters[0].id);
    }
    notify("Chapter removed.", "info");
  };

  // Find & Replace Logic
  const handleFind = (query: string): number => {
    if (!activeChapter || !query.trim()) return 0;
    const regex = new RegExp(query, 'gi');
    const matches = activeChapter.content.match(regex);
    return matches ? matches.length : 0;
  };

  const handleReplace = (find: string, replaceWith: string, replaceAll: boolean) => {
    if (!activeChapter || !find.trim()) return;
    const regex = new RegExp(find, replaceAll ? 'gi' : 'i');
    const newContent = activeChapter.content.replace(regex, replaceWith);
    updateChapter(activeChapter.id, { content: newContent });
    notify(`Replaced ${replaceAll ? 'all occurrences' : 'first match'}.`, 'success');
  };

  // Insert HTML into Chapter (from Cite & Link tool)
  const handleInsertHtmlIntoChapter = (html: string) => {
    if (!activeChapter) return;
    updateChapter(activeChapter.id, {
      content: activeChapter.content + html
    });
    notify('Inserted citation / work link into manuscript.', 'success');
  };

  // Create Snapshot Version
  const handleCreateSnapshot = () => {
    const currentVersions = book.versions || [];
    const snapshot: BookVersion = {
      id: uuidv4(),
      versionNumber: currentVersions.length + 1,
      label: newVersionLabel.trim() || `Draft Snapshot v${currentVersions.length + 1}`,
      timestamp: Date.now(),
      chapterCount: book.chapters.length,
      wordCount: book.chapters.reduce((s, c) => s + (c.wordCount || 0), 0),
      dataSnapshot: {
        chapters: JSON.parse(JSON.stringify(book.chapters)),
        description: book.description || ''
      }
    };
    onUpdate({ ...book, versions: [snapshot, ...currentVersions] });
    setNewVersionLabel('');
    notify(`Version ${snapshot.versionNumber} snapshot created.`, 'success');
  };

  const handleRestoreVersion = (version: BookVersion) => {
    if (window.confirm(`Restore manuscript to "${version.label}"? Current edits will be replaced.`)) {
      onUpdate({
        ...book,
        chapters: JSON.parse(JSON.stringify(version.dataSnapshot.chapters)),
        updatedAt: Date.now()
      });
      notify(`Restored to ${version.label}.`, 'success');
    }
  };

  // Add Character
  const handleAddCharacter = () => {
    if (!newCharName.trim()) return;
    const char: FictionCharacter = {
      id: uuidv4(),
      name: newCharName.trim(),
      role: newCharRole,
      description: newCharDesc.trim()
    };
    onUpdate({ ...book, characters: [...(book.characters || []), char] });
    setNewCharName('');
    setNewCharDesc('');
    notify('Character added to register.', 'success');
  };

  // Add Note
  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    const note: BookNote = {
      id: uuidv4(),
      title: newNoteTitle.trim(),
      category: 'general',
      content: newNoteContent.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    onUpdate({ ...book, bookNotes: [...(book.bookNotes || []), note] });
    setNewNoteTitle('');
    setNewNoteContent('');
    notify('Research note recorded.', 'success');
  };

  // Keyboard shortcut listener (Ctrl/Cmd + S, Ctrl/Cmd + F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        notify('Manual save confirmed.', 'success');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowFindReplace(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notify]);

  const totalWords = book.chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);

  return (
    <div className="flex flex-col h-screen bg-editorial-bg text-editorial-text select-none overflow-hidden">
      {/* 1. Global Top Navigation & Breadcrumb Bar */}
      <header className="h-14 bg-editorial-sidebar border-b border-editorial-border px-4 flex items-center justify-between shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 px-2.5 sm:px-3 bg-white/80 hover:bg-white text-editorial-text border border-editorial-border rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft size={14} className="text-editorial-accent" />
            <span className="hidden sm:inline">&larr; Back to Dashboard</span>
            <span className="sm:hidden">&larr; Back</span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-editorial-divider shrink-0" />

          {/* Breadcrumb Hierarchy */}
          <div className="hidden md:flex items-center gap-1.5 overflow-hidden text-xs min-w-0">
            <span className="font-serif italic font-bold text-editorial-text truncate max-w-[120px] lg:max-w-[180px]">
              {book.title}
            </span>
            <span className="text-editorial-muted font-mono">&rarr;</span>
            <span className="text-editorial-muted font-serif truncate max-w-[100px] lg:max-w-[150px]">
              {activeChapter?.title || 'Chapter'}
            </span>
          </div>
        </div>

        {/* Center Autosave & Offline / Cloud Status (Google Docs style) */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono shrink-0 mx-1">
          {isOnline ? (
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/60 font-semibold" title="All keystrokes autosaved and synced with cloud storage.">
              <CheckCircle2 size={12} className="text-emerald-600" />
              <span className="hidden sm:inline">Autosaved to Cloud</span>
              <span className="sm:hidden">Saved</span>
              <span className="text-[10px] opacity-75">• {lastSavedTime}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 font-semibold" title="Offline mode active. Progress is securely autosaved to local device memory.">
              <CloudOff size={12} className="text-amber-600" />
              <span className="hidden sm:inline">Autosaved Offline</span>
              <span className="sm:hidden">Offline</span>
              <span className="text-[10px] opacity-75">• {lastSavedTime}</span>
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Google Docs-style Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 bg-editorial-accent text-white hover:bg-editorial-accent/90 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Share manuscript & collaborate (Google Docs style)"
          >
            <Share2 size={13} />
            <span>Share</span>
            {book.collaborators && book.collaborators.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-editorial-accent text-[9px] font-mono font-bold flex items-center justify-center">
                {book.collaborators.length}
              </span>
            )}
          </button>

          {/* Zoho-style Cite & Link Works Button */}
          <button
            onClick={() => setShowCiteLinkModal(true)}
            className="px-2.5 py-1.5 bg-white border border-editorial-border hover:border-editorial-accent rounded text-xs font-bold uppercase tracking-wider text-editorial-accent flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Cite external works or cross-link companion manuscripts"
          >
            <Link2 size={13} />
            <span className="hidden md:inline">Cite & Link</span>
          </button>

          {/* Find & Replace Button */}
          <button
            onClick={() => setShowFindReplace(!showFindReplace)}
            className="p-1.5 text-editorial-muted hover:text-editorial-text hover:bg-white/60 rounded cursor-pointer"
            title="Find & Replace (Ctrl+F)"
          >
            <Search size={15} />
          </button>

          {/* Full Preview Modal Button */}
          <button
            onClick={() => setShowFullPreview(true)}
            className="px-2.5 py-1.5 bg-white border border-editorial-border hover:border-editorial-text rounded text-xs font-bold uppercase tracking-wider text-editorial-text flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Preview Complete Book Page-by-Page"
          >
            <Eye size={13} />
            <span className="hidden md:inline">Preview Book</span>
          </button>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-1.5 px-2.5 rounded-full border border-editorial-border hover:border-editorial-text text-editorial-text bg-white transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-2xs"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={13} className="text-amber-500" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon size={13} className="text-indigo-500" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          )}

          {/* Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="px-3 py-1.5 bg-editorial-text text-white hover:bg-black rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* 2. Workspace Tabs Navigation Ribbon (Wrap beautifully with zero side-scrolling) */}
      <div className="min-h-10 py-1.5 bg-white border-b border-editorial-border px-3 sm:px-4 flex flex-wrap items-center justify-between gap-1.5 shrink-0 z-10">
        <div className="flex flex-wrap items-center gap-1">
          {/* Sub-tab "Back to Writing Sheet" if on another tab */}
          {viewTab !== 'writing' && (
            <button
              onClick={() => setViewTab('writing')}
              className="mr-2 px-2.5 py-1 bg-editorial-sidebar text-editorial-text border border-editorial-border rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-editorial-sidebar/80 cursor-pointer"
              title="Return to the manuscript writing sheet"
            >
              <ArrowLeft size={13} />
              <span>&larr; Back to Writing</span>
            </button>
          )}

          <button
            onClick={() => setViewTab('writing')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5",
              viewTab === 'writing' ? "bg-editorial-sidebar text-editorial-accent font-bold" : "text-editorial-muted hover:text-editorial-text"
            )}
          >
            <FileText size={13} />
            <span>Editor</span>
          </button>

          <button
            onClick={() => setViewTab('outline')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5",
              viewTab === 'outline' ? "bg-editorial-sidebar text-editorial-accent font-bold" : "text-editorial-muted hover:text-editorial-text"
            )}
          >
            <ListTree size={13} />
            <span>Outline</span>
          </button>

          <button
            onClick={() => setViewTab('cover')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5",
              viewTab === 'cover' ? "bg-editorial-sidebar text-editorial-accent font-bold" : "text-editorial-muted hover:text-editorial-text"
            )}
          >
            <Palette size={13} />
            <span>Cover Designer</span>
          </button>

          <button
            onClick={() => setViewTab('format')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5",
              viewTab === 'format' ? "bg-editorial-sidebar text-editorial-accent font-bold" : "text-editorial-muted hover:text-editorial-text"
            )}
            title="Page Borders, Table of Contents, Margins & Typography"
          >
            <Frame size={13} />
            <span>Format & Borders</span>
          </button>

          <button
            onClick={() => setViewTab('characters')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5",
              viewTab === 'characters' ? "bg-editorial-sidebar text-editorial-accent font-bold" : "text-editorial-muted hover:text-editorial-text"
            )}
          >
            <UserPlus size={13} />
            <span>Characters</span>
          </button>

          <button
            onClick={() => setViewTab('notes')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5",
              viewTab === 'notes' ? "bg-editorial-sidebar text-editorial-accent font-bold" : "text-editorial-muted hover:text-editorial-text"
            )}
          >
            <Quote size={13} />
            <span>Notes</span>
          </button>

          <button
            onClick={() => setViewTab('references')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5",
              viewTab === 'references' ? "bg-editorial-sidebar text-editorial-accent font-bold" : "text-editorial-muted hover:text-editorial-text"
            )}
          >
            <Quote size={13} />
            <span>References</span>
          </button>

          <button
            onClick={() => setViewTab('versions')}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5",
              viewTab === 'versions' ? "bg-editorial-sidebar text-editorial-accent font-bold" : "text-editorial-muted hover:text-editorial-text"
            )}
          >
            <History size={13} />
            <span>Versions ({book.versions?.length || 0})</span>
          </button>
        </div>

        {/* Editor Mode Selector: WYSIWYG vs Content Blocks & Chapter Sidebar Toggle */}
        {viewTab === 'writing' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChapterSidebarOpen(!isChapterSidebarOpen)}
              className="px-2.5 py-1 text-xs font-medium rounded-md border border-editorial-border bg-editorial-sidebar/60 text-editorial-text hover:bg-editorial-sidebar flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isChapterSidebarOpen ? "Hide Chapter Navigator" : "Show Chapter Navigator"}
            >
              {isChapterSidebarOpen ? <PanelLeftClose size={13} /> : <PanelLeft size={13} />}
              <span className="hidden sm:inline">{isChapterSidebarOpen ? "Hide Chapters" : "Chapters"}</span>
            </button>

            <div className="flex items-center gap-1 bg-editorial-sidebar/60 border border-editorial-border p-0.5 rounded text-[11px] font-bold">
              <button
                onClick={() => setEditorMode('wysiwyg')}
                className={cn(
                  "px-2 py-0.5 rounded cursor-pointer",
                  editorMode === 'wysiwyg' ? "bg-white text-editorial-accent shadow-xs" : "text-editorial-muted"
                )}
              >
                Rich Text
              </button>
              <button
                onClick={() => setEditorMode('blocks')}
                className={cn(
                  "px-2 py-0.5 rounded cursor-pointer",
                  editorMode === 'blocks' ? "bg-white text-editorial-accent shadow-xs" : "text-editorial-muted"
                )}
              >
                Content Blocks
              </button>
            </div>
          </div>
        )}
      </div>

      {/* In-Editor Find & Replace Bar */}
      {showFindReplace && (
        <div className="px-4 py-2 bg-white border-b border-editorial-border">
          <FindReplaceBar
            isOpen={showFindReplace}
            onClose={() => setShowFindReplace(false)}
            onFind={handleFind}
            onReplace={handleReplace}
          />
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Chapter Navigator Sidebar (Only visible in writing mode when toggled) */}
        {viewTab === 'writing' && isChapterSidebarOpen && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black/40 z-30"
              onClick={() => setIsChapterSidebarOpen(false)}
            />
            <aside className="fixed md:static inset-y-0 left-0 z-40 md:z-auto w-64 max-w-[80vw] border-r border-editorial-border bg-editorial-sidebar flex flex-col shrink-0 select-none overflow-hidden shadow-lg md:shadow-none animate-in slide-in-from-left duration-200">
              <div className="p-3 border-b border-editorial-divider flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-editorial-muted">
                  Chapters ({book.chapters.length})
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={addChapter}
                    className="p-1 hover:text-editorial-accent text-editorial-muted transition-colors rounded cursor-pointer"
                    title="Add Chapter"
                  >
                    <Plus size={15} />
                  </button>
                  <button
                    onClick={() => setIsChapterSidebarOpen(false)}
                    className="md:hidden p-1 text-editorial-muted hover:text-editorial-text rounded cursor-pointer"
                    title="Close Navigator"
                  >
                    <CloseIcon size={15} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={book.chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {book.chapters.map((ch, idx) => (
                      <SortableChapterItem
                        key={ch.id}
                        chapter={ch}
                        index={idx}
                        isActive={activeChapterId === ch.id}
                        onSelect={() => {
                          setActiveChapterId(ch.id);
                          if (window.innerWidth < 768) setIsChapterSidebarOpen(false);
                        }}
                        onDelete={() => deleteChapter(ch.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>

              <div className="p-3 border-t border-editorial-divider bg-white/20 text-center text-[10px] font-mono text-editorial-muted">
                Total {totalWords.toLocaleString()} Words
              </div>
            </aside>
          </>
        )}

        {/* Center Main Editor / Viewport Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-editorial-bg">
          {/* TAB 1: WRITING (Rich Text or Blocks) */}
          {viewTab === 'writing' && activeChapter && (
            <div className="w-full max-w-3xl space-y-6">
              {/* Facility Introduction Banner (COMPLETELY OUTSIDE the white writing sheet) */}
              <FacilityIntro
                title="Typewriter & Manuscript Studio Facility"
                facilityKey="editor"
                description="Your clean, distraction-free manuscript drafting desk. Keystrokes auto-save in real time. Use Microsoft Word-like tables, custom callouts, and Zoho-style reference linking."
                steps={[
                  "Click the chapter headline below to rename this segment.",
                  "Use the toolbar to insert Word-like Tables, Info Boxes, or Tip Boxes.",
                  "Click 'Cite & Link' to cite bibliography sources or cross-link companion books."
                ]}
                tip="Press Ctrl+S for manual checkpoint save, or Ctrl+F to activate Find & Replace."
              />

              {/* Chapter Title Edit Header */}
              <div className="space-y-1 pb-4 border-b border-editorial-divider">
                <input
                  type="text"
                  value={activeChapter.title}
                  onChange={(e) => updateChapter(activeChapter.id, { title: e.target.value })}
                  placeholder="Chapter Title..."
                  className="w-full bg-transparent text-2xl sm:text-3xl font-serif italic font-bold text-editorial-text outline-none focus:border-b focus:border-editorial-accent transition-colors"
                />
                <div className="flex items-center justify-between text-xs text-editorial-muted font-mono">
                  <span>Fragment {activeChapter.order + 1}</span>
                  <span>{activeChapter.wordCount} words</span>
                </div>
              </div>

              {/* Mode 1: Rich Text Editor (Clean White Paper Sheet with ZERO Section Guide inside) */}
              {editorMode === 'wysiwyg' ? (
                <RichTextEditor
                  content={activeChapter.content}
                  onChange={(html) => updateChapter(activeChapter.id, { content: html })}
                  onOpenCiteLinkModal={() => setShowCiteLinkModal(true)}
                  placeholder="Begin drafting your prose freely..."
                  borderStyle={book.pageSettings?.borderStyle || 'classic-single'}
                />
              ) : (
                /* Mode 2: Content Block System */
                <ContentBlockEditor
                  blocks={activeChapter.blocks || []}
                  onChangeBlocks={(newBlocks) => updateChapter(activeChapter.id, { blocks: newBlocks })}
                />
              )}
            </div>
          )}

          {/* TAB 2: OUTLINE VIEW */}
          {viewTab === 'outline' && (
            <div className="w-full max-w-4xl space-y-6">
              <FacilityIntro
                title="Hierarchical Outline Builder Facility"
                facilityKey="outline"
                description="Organize the macro-architecture of your manuscript. Drag and drop chapters to re-sequence narrative flow, split fragments into sub-sections, and monitor chapter lengths."
                steps={[
                  "Drag chapters vertically using the grip handles to rearrange sequence.",
                  "Click '+ Section' to partition a chapter into detailed sub-headings (§ 1.1, § 1.2).",
                  "Click any chapter title to jump directly to it in the editor."
                ]}
                tip="Use the collapse arrows to keep your focus on the active segment."
              />

              <OutlineView
                chapters={book.chapters}
                onUpdateChapters={(newChapters) => onUpdate({ ...book, chapters: newChapters })}
                onSelectChapter={(id) => {
                  setActiveChapterId(id);
                  setViewTab('writing');
                }}
              />
            </div>
          )}

          {/* TAB 3: COVER DESIGNER */}
          {viewTab === 'cover' && (
            <div className="w-full max-w-4xl space-y-6">
              <FacilityIntro
                title="Visual Cover Studio Facility"
                facilityKey="cover"
                description={'Design print-ready book covers formatted to standard 6" × 9" trade publication proportions. Choose from 7 curated aesthetic presets or customize typography, borders, and background hues.'}
                steps={[
                  "Select a publisher preset (Fiction, Children's, Academic, Minimal, Report).",
                  "Fine-tune background palette, text contrast, and decorative border frames.",
                  "Upload custom background artwork or author logos if desired."
                ]}
                tip="The cover generated here is automatically embedded into PDF and full-book previews."
              />

              <CoverBuilder
                book={book}
                onUpdateCover={(cover) => onUpdate({ ...book, cover, coverImage: cover.bgImage })}
              />
            </div>
          )}

          {/* TAB: FORMAT & LAYOUT STUDIO (Page Borders, Table of Contents & Trim Sizes) */}
          {viewTab === 'format' && (
            <div className="w-full max-w-5xl space-y-6">
              <FormatLayoutStudio
                book={book}
                onUpdate={onUpdate}
              />
            </div>
          )}

          {/* TAB 4: FICTION CHARACTERS REGISTRY */}
          {viewTab === 'characters' && (
            <div className="w-full max-w-3xl space-y-6">
              <FacilityIntro
                title="Character & Entity Dossier Facility"
                facilityKey="characters"
                description="Keep structured character sheets for fiction projects and memoirs. Record character roles (Protagonist, Antagonist, Mentor), physical traits, and narrative motivations."
                steps={[
                  "Enter character name, story archetype, and physical appearance notes.",
                  "Document personality traits, relationships, and key narrative stakes.",
                  "Reference these character registers while drafting dialogue."
                ]}
                tip="Character sheets are private to your studio and do not appear in the exported book."
              />

              <div className="bg-white border border-editorial-border p-6 rounded-xl space-y-4 shadow-xs">
                <h3 className="font-serif italic font-bold text-lg text-editorial-text">
                  Character & Entity Dossiers
                </h3>
                <p className="text-xs text-editorial-muted">
                  Keep track of character motivations, appearance traits, relationships, and story arcs.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="Character Name..."
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    className="border border-editorial-border rounded p-2 text-xs outline-none bg-editorial-sidebar/20"
                  />
                  <select
                    value={newCharRole}
                    onChange={(e) => setNewCharRole(e.target.value as any)}
                    className="border border-editorial-border rounded p-2 text-xs outline-none bg-editorial-sidebar/20"
                  >
                    <option value="Protagonist">Protagonist</option>
                    <option value="Antagonist">Antagonist</option>
                    <option value="Supporting">Supporting</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  placeholder="Personality traits, physical appearance, and narrative stakes..."
                  value={newCharDesc}
                  onChange={(e) => setNewCharDesc(e.target.value)}
                  className="w-full border border-editorial-border rounded p-2 text-xs outline-none bg-editorial-sidebar/20 resize-none"
                />
                <button
                  onClick={handleAddCharacter}
                  disabled={!newCharName.trim()}
                  className="px-4 py-2 bg-editorial-accent text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-editorial-text disabled:opacity-50 cursor-pointer"
                >
                  + Add Character Dossier
                </button>
              </div>

              {/* Character Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(book.characters || []).map((char) => (
                  <div key={char.id} className="bg-white border border-editorial-border rounded-lg p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-editorial-text">{char.name}</h4>
                      <span className="text-[9px] font-mono uppercase bg-editorial-sidebar px-2 py-0.5 rounded font-bold text-editorial-accent">
                        {char.role}
                      </span>
                    </div>
                    <p className="text-xs text-editorial-muted leading-relaxed font-serif italic">
                      {char.description}
                    </p>
                    <button
                      onClick={() => {
                        const updated = (book.characters || []).filter(c => c.id !== char.id);
                        onUpdate({ ...book, characters: updated });
                      }}
                      className="text-[10px] text-red-600 hover:underline pt-2 block cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RESEARCH & BOOK NOTES */}
          {viewTab === 'notes' && (
            <div className="w-full max-w-3xl space-y-6">
              <FacilityIntro
                title="Research & Field Notes Facility"
                facilityKey="notes"
                description="A dedicated scratchpad for capturing fleeting ideas, historical research, interview transcripts, and dialogue snippets. Kept strictly private from publication output."
                steps={[
                  "Jot down field observations, interview notes, or chapter brainstorms.",
                  "Tag notes by topic or link them to specific chapter ideas.",
                  "Review research entries alongside your active chapter writing."
                ]}
                tip="Use this pad as an idea repository without cluttering your formal manuscript."
              />

              <div className="bg-white border border-editorial-border p-6 rounded-xl space-y-4 shadow-xs">
                <h3 className="font-serif italic font-bold text-lg text-editorial-text">
                  Research & Field Notes
                </h3>
                <p className="text-xs text-editorial-muted">
                  Jot down ideas, dialogue scraps, or historical research. Notes are kept private and do not appear in final output.
                </p>

                <input
                  type="text"
                  placeholder="Note Title / Topic..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full border border-editorial-border rounded p-2 text-xs outline-none bg-editorial-sidebar/20"
                />
                <textarea
                  rows={3}
                  placeholder="Draft your research notes here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full border border-editorial-border rounded p-2 text-xs outline-none bg-editorial-sidebar/20 resize-none font-serif"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                  className="px-4 py-2 bg-editorial-accent text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-editorial-text disabled:opacity-50 cursor-pointer"
                >
                  + Add Note
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {(book.bookNotes || []).map((note) => (
                  <div key={note.id} className="bg-white border border-editorial-border rounded-lg p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-editorial-text">{note.title}</h4>
                      <span className="text-[10px] font-mono text-editorial-muted">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-editorial-text leading-relaxed font-serif">
                      {note.content}
                    </p>
                    <button
                      onClick={() => {
                        const updated = (book.bookNotes || []).filter(n => n.id !== note.id);
                        onUpdate({ ...book, bookNotes: updated });
                      }}
                      className="text-[10px] text-red-600 hover:underline pt-2 block cursor-pointer"
                    >
                      Delete Note
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REFERENCES */}
          {viewTab === 'references' && (
            <div className="w-full max-w-4xl space-y-6">
              <FacilityIntro
                title="Scholarship & Bibliography Facility"
                facilityKey="references"
                description="Manage citations and works consulted. Insert in-text citation keys directly into your active chapter or link related volumes from your personal Shaastra library."
                steps={[
                  "Add sources across books, academic journals, reports, and websites.",
                  "Click 'Insert' to place a formatted (Author, Year) tag into the active chapter.",
                  "All references are automatically appended to the final PDF and Word exports."
                ]}
                tip="Use the 'Cite & Link' button in the writing toolbar to cite without leaving the page."
              />

              <ReferencesManager
                references={book.references || []}
                onUpdateReferences={(refs) => onUpdate({ ...book, references: refs })}
                onInsertReference={(citation) => {
                  if (activeChapter) {
                    updateChapter(activeChapter.id, {
                      content: activeChapter.content + ` <em>${citation}</em>`
                    });
                    notify(`Inserted ${citation} into chapter.`, 'success');
                    setViewTab('writing');
                  }
                }}
              />
            </div>
          )}

          {/* TAB 7: VERSION HISTORY */}
          {viewTab === 'versions' && (
            <div className="w-full max-w-3xl space-y-6">
              <FacilityIntro
                title="Milestone Checkpoints & Version History Facility"
                facilityKey="versions"
                description="Safeguard your editing process by recording point-in-time milestones. Restore any historical snapshot at any time with complete data safety."
                steps={[
                  "Enter a milestone label (e.g. 'Completed First Draft Revisions').",
                  "Click '+ Take Snapshot' to record a complete checkpoint.",
                  "Review prior versions and click 'Restore' if you wish to roll back."
                ]}
                tip="Taking a milestone snapshot before major chapter deletions ensures you can always recover text."
              />

              <div className="bg-white border border-editorial-border p-6 rounded-xl space-y-4 shadow-xs">
                <h3 className="font-serif italic font-bold text-lg text-editorial-text">
                  Save Version Snapshot
                </h3>
                <p className="text-xs text-editorial-muted">
                  Create a milestone checkpoint of your manuscript. You can restore previous versions at any time.
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Milestone label, e.g. 'Completed Act 1 Revisions'..."
                    value={newVersionLabel}
                    onChange={(e) => setNewVersionLabel(e.target.value)}
                    className="flex-1 border border-editorial-border rounded p-2 text-xs outline-none bg-editorial-sidebar/20"
                  />
                  <button
                    onClick={handleCreateSnapshot}
                    className="px-4 py-2 bg-editorial-accent text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-editorial-text shrink-0 cursor-pointer"
                  >
                    + Take Snapshot
                  </button>
                </div>
              </div>

              {/* Version History List */}
              <div className="space-y-3">
                {(!book.versions || book.versions.length === 0) ? (
                  <div className="bg-white border border-dashed border-editorial-border p-8 rounded-lg text-center text-xs text-editorial-muted">
                    No snapshots recorded yet. Create a milestone above to safeguard your editing stages.
                  </div>
                ) : (
                  book.versions.map((ver) => (
                    <div
                      key={ver.id}
                      className="bg-white border border-editorial-border rounded-lg p-4 flex items-center justify-between gap-4 shadow-2xs hover:border-editorial-text/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-editorial-sidebar text-editorial-accent">
                            v{ver.versionNumber}
                          </span>
                          <span className="text-xs font-mono text-editorial-muted">
                            {new Date(ver.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-editorial-text">
                          {ver.label || `Version ${ver.versionNumber}`}
                        </h4>
                        <div className="text-[10px] font-mono text-editorial-muted">
                          {ver.chapterCount} chapters • {ver.wordCount} words
                        </div>
                      </div>

                      <button
                        onClick={() => handleRestoreVersion(ver)}
                        className="px-3 py-1.5 bg-editorial-sidebar hover:bg-editorial-sidebar/80 border border-editorial-border rounded text-xs font-bold uppercase tracking-wider text-editorial-text flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw size={13} />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. Full Book Page-by-Page Preview Modal */}
      {showFullPreview && (
        <BookPreviewModal
          book={book}
          onClose={() => setShowFullPreview(false)}
          onExport={() => {
            setShowFullPreview(false);
            setShowExportModal(true);
          }}
        />
      )}

      {/* 5. Multi-Format Export Modal */}
      {showExportModal && (
        <ExportModal
          book={book}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* 6. Zoho-Style Cite & Link Works Modal */}
      {showCiteLinkModal && (
        <CiteAndLinkModal
          isOpen={showCiteLinkModal}
          onClose={() => setShowCiteLinkModal(false)}
          currentBook={book}
          allBooks={allBooks}
          onInsertHtml={handleInsertHtmlIntoChapter}
          onAddReference={(newRef) => {
            const currentRefs = book.references || [];
            onUpdate({ ...book, references: [...currentRefs, newRef] });
          }}
        />
      )}
    </div>
  );
}
