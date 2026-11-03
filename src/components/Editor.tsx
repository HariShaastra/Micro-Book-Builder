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
  PanelLeft,
  MoreVertical,
  Keyboard
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
import { countMatchesInHtml, replaceInHtml } from '../lib/findReplace.ts';
import ReferencesManager from './ReferencesManager.tsx';
import CiteAndLinkModal from './CiteAndLinkModal.tsx';
import FacilityIntro from './FacilityIntro.tsx';
import ShareModal from './ShareModal.tsx';
import FormatLayoutStudio from './FormatLayoutStudio.tsx';
import KeyboardShortcutsModal from './KeyboardShortcutsModal.tsx';
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
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showMobileMoreMenu, setShowMobileMoreMenu] = useState(false);
  const [isChapterSidebarOpen, setIsChapterSidebarOpen] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('shaastra_autosave_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [isManualSaving, setIsManualSaving] = useState(false);

  // Toggle AutoSave functionality
  const toggleAutoSave = () => {
    setAutoSaveEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('shaastra_autosave_enabled', JSON.stringify(next));
      } catch {}
      notify(`AutoSave ${next ? 'enabled' : 'paused'}.`, next ? 'success' : 'info');
      return next;
    });
  };

  // Real-time network and offline persistence listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      notify('Network reconnected. Cloud synchronization active.', 'info');
    };
    const handleOffline = () => {
      setIsOnline(false);
      notify('Offline mode active. All progress is saved locally to device storage.', 'warning');
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

  // Dedicated manual force save (Alt+S)
  const handleManualSave = useCallback(() => {
    setIsManualSaving(true);
    const updatedBook: Book = { ...book, updatedAt: Date.now() };
    try {
      localStorage.setItem(`shaastra_autosave_${book.id}`, JSON.stringify(updatedBook));
      localStorage.setItem('shaastra_last_autosave_time', Date.now().toString());
    } catch (e) {
      console.warn('Manual save localStorage error:', e);
    }
    onUpdate(updatedBook);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(timeStr);
    setTimeout(() => setIsManualSaving(false), 500);
    notify('Document saved to local storage.', 'success');
  }, [book, onUpdate, notify]);

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

    // Offline resilience: if AutoSave is enabled, persist immediately
    if (autoSaveEnabled) {
      try {
        localStorage.setItem(`shaastra_autosave_${book.id}`, JSON.stringify(updatedBook));
        localStorage.setItem('shaastra_last_autosave_time', Date.now().toString());
      } catch (e) {
        console.warn('Local autosave error:', e);
      }
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }

    onUpdate(updatedBook);
  }, [book, onUpdate, autoSaveEnabled]);

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

  // Find & Replace Logic using safe text-node traversal
  const handleFind = (query: string, options: { wholeWord: boolean; matchCase: boolean }): number => {
    if (!activeChapter || !query.trim()) return 0;
    return countMatchesInHtml(activeChapter.content, query, options);
  };

  const handleReplace = (
    find: string,
    replaceWith: string,
    replaceAll: boolean,
    options: { wholeWord: boolean; matchCase: boolean; targetIndex: number }
  ) => {
    if (!activeChapter || !find.trim()) return;
    const { newHtml, replacedCount } = replaceInHtml(activeChapter.content, find, replaceWith, {
      ...options,
      replaceAll
    });
    if (replacedCount > 0) {
      updateChapter(activeChapter.id, { content: newHtml });
      notify(`Replaced ${replacedCount} ${replacedCount === 1 ? 'word match' : 'word matches'}.`, 'success');
    } else {
      notify('No matches found to replace.', 'info');
    }
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

  // Non-conflicting keyboard shortcuts listener (Alt+...)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Non-conflicting Alt+... shortcuts
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          handleManualSave();
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          toggleAutoSave();
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          setShowShortcutsModal(prev => !prev);
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setShowFullPreview(true);
        } else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          setShowExportModal(true);
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          onBack();
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          onToggleTheme?.();
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          setShowFindReplace(prev => !prev);
        }
      }

      // Standard browser Ctrl/Cmd fallbacks for common user muscle memory
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleManualSave();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        setShowFindReplace(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleManualSave, onBack, onToggleTheme]);

  const totalWords = book.chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);

    const editorTabsList = [
    { id: 'writing', label: 'Editor', shortLabel: 'Editor', icon: FileText },
    { id: 'outline', label: 'Outline', shortLabel: 'Outline', icon: ListTree },
    { id: 'cover', label: 'Cover Designer', shortLabel: 'Cover', icon: Palette },
    { id: 'format', label: 'Format & Borders', shortLabel: 'Format', icon: Frame },
    { id: 'characters', label: 'Characters', shortLabel: 'Chars', icon: UserPlus },
    { id: 'notes', label: 'Notes', shortLabel: 'Notes', icon: Quote },
    { id: 'references', label: 'References', shortLabel: 'Refs', icon: Bookmark },
    { id: 'versions', label: `Versions (${book.versions?.length || 0})`, shortLabel: `v(${book.versions?.length || 0})`, icon: History },
  ] as const;

  return (
    <div className="flex flex-col h-screen bg-editorial-bg text-editorial-text overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP BAR (Main Editorial App Bar) - Strictly 1 Row, Zero Clutter */}
      {/* ========================================================================= */}
      <header className="h-14 bg-editorial-sidebar dark:bg-stone-900 border-b border-editorial-border dark:border-stone-800 px-3 sm:px-4 lg:px-6 flex items-center justify-between shrink-0 shadow-2xs z-20 relative">
        {/* Left Section: Back Button + Breadcrumbs + Autosave Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0">
          <button
            onClick={onBack}
            className="h-8 px-2.5 sm:px-3 bg-white dark:bg-stone-800 text-editorial-text dark:text-stone-100 hover:bg-neutral-50 dark:hover:bg-stone-700 border border-editorial-border dark:border-stone-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-2xs cursor-pointer shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft size={14} className="text-editorial-accent dark:text-amber-400" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="hidden sm:block h-4 w-px bg-editorial-divider dark:bg-stone-700 shrink-0" />

          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-1.5 overflow-hidden text-xs min-w-0">
            <span 
              className="font-serif italic font-bold text-editorial-text dark:text-stone-100 truncate max-w-[100px] sm:max-w-[140px] md:max-w-[200px]" 
              title={book.title}
            >
              {book.title}
            </span>
            <span className="text-editorial-muted dark:text-stone-400 font-mono hidden md:inline">&rarr;</span>
            <span className="text-editorial-muted dark:text-stone-400 font-serif truncate max-w-[90px] lg:max-w-[160px] hidden md:inline">
              {viewTab === 'writing' ? (activeChapter?.title || 'Chapter') : viewTab.charAt(0).toUpperCase() + viewTab.slice(1)}
            </span>
          </div>

          {/* AutoSave Toggle Button */}
          <button
            type="button"
            onClick={toggleAutoSave}
            className={cn(
              "h-8 px-2 sm:px-2.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0",
              autoSaveEnabled
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700"
            )}
            title={autoSaveEnabled ? "AutoSave is ON (Alt+A to toggle)" : "AutoSave is OFF (Alt+A to toggle)"}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", autoSaveEnabled ? "bg-emerald-500 animate-pulse" : "bg-stone-400")} />
            <span className="hidden md:inline">{autoSaveEnabled ? 'AutoSave: ON' : 'AutoSave: OFF'}</span>
            <span className="md:hidden text-[10px]">{autoSaveEnabled ? 'Auto' : 'Off'}</span>
          </button>

          {/* Dedicated Manual Save Button (Alt+S) */}
          <button
            type="button"
            onClick={handleManualSave}
            className={cn(
              "h-8 px-2.5 sm:px-3 rounded-lg border border-editorial-border dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-editorial-accent text-editorial-text dark:text-stone-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0",
              isManualSaving && "scale-95 bg-editorial-sidebar dark:bg-stone-700"
            )}
            title="Save document immediately to offline device storage (Alt+S)"
          >
            <Save size={13} className={cn("text-editorial-accent dark:text-amber-400", isManualSaving && "animate-spin")} />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Compact Network Status Badge */}
          <div className="shrink-0 ml-1">
            {!isOnline ? (
              <div 
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono border bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-medium" 
                title={`Offline mode active. Progress saved to local storage • ${lastSavedTime}`}
              >
                <CloudOff size={11} className="text-amber-600 shrink-0" />
                <span className="hidden md:inline">Offline</span>
                <span className="hidden xl:inline text-[10px] opacity-75">• {lastSavedTime}</span>
              </div>
            ) : (
              <span className="text-[10px] font-mono text-editorial-muted dark:text-stone-400 hidden xl:inline">
                Synced {lastSavedTime}
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Harmonized Utility Tools & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Utilities (>=1024px) */}
          <div className="hidden lg:flex items-center gap-1.5">
            {/* Keyboard Shortcuts Button */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="h-8 px-2.5 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 hover:border-editorial-accent rounded-lg text-xs font-semibold text-editorial-text dark:text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Keyboard Shortcuts Cheatsheet (Alt+K)"
            >
              <Keyboard size={13} className="text-editorial-accent dark:text-amber-400" />
              <span className="hidden xl:inline">Shortcuts</span>
            </button>

            {/* Find & Replace Button */}
            <button
              onClick={() => setShowFindReplace(!showFindReplace)}
              className={cn(
                "h-8 w-8 rounded-lg border transition-colors flex items-center justify-center cursor-pointer shadow-2xs",
                showFindReplace
                  ? "bg-editorial-sidebar dark:bg-stone-700 border-editorial-accent text-editorial-accent dark:text-amber-400"
                  : "bg-white dark:bg-stone-800 border-editorial-border dark:border-stone-700 text-editorial-text dark:text-stone-200 hover:border-editorial-accent"
              )}
              title="Find & Replace Words (Alt+F)"
            >
              <Search size={14} />
            </button>

            {/* Cite & Link Works Button */}
            <button
              onClick={() => setShowCiteLinkModal(true)}
              className="h-8 px-2.5 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 hover:border-editorial-accent rounded-lg text-xs font-semibold text-editorial-accent dark:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Cite external works or cross-link companion manuscripts"
            >
              <Link2 size={13} />
              <span>Cite & Link</span>
            </button>

            {/* Preview Book Button */}
            <button
              onClick={() => setShowFullPreview(true)}
              className="h-8 px-2.5 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 hover:border-editorial-text rounded-lg text-xs font-semibold text-editorial-text dark:text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Preview Complete Book Page-by-Page"
            >
              <Eye size={13} />
              <span>Preview Book</span>
            </button>

            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="h-8 w-8 rounded-lg border border-editorial-border dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-editorial-text text-editorial-text dark:text-stone-200 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-500" />}
              </button>
            )}
          </div>

          {/* Tablet Secondary Tools (640px - 1024px) */}
          <div className="hidden sm:flex lg:hidden items-center gap-1">
            <button
              onClick={() => setShowFindReplace(!showFindReplace)}
              className="h-8 w-8 rounded-lg border border-editorial-border dark:border-stone-700 bg-white dark:bg-stone-800 text-editorial-text dark:text-stone-200 hover:border-editorial-accent flex items-center justify-center cursor-pointer shadow-2xs"
              title="Find & Replace (Ctrl+F)"
            >
              <Search size={14} />
            </button>

            <button
              onClick={() => setShowCiteLinkModal(true)}
              className="h-8 w-8 rounded-lg border border-editorial-border dark:border-stone-700 bg-white dark:bg-stone-800 text-editorial-accent dark:text-amber-400 hover:border-editorial-accent flex items-center justify-center cursor-pointer shadow-2xs"
              title="Cite & Link Works"
            >
              <Link2 size={13} />
            </button>

            <button
              onClick={() => setShowFullPreview(true)}
              className="h-8 w-8 rounded-lg border border-editorial-border dark:border-stone-700 bg-white dark:bg-stone-800 text-editorial-text dark:text-stone-200 hover:border-editorial-accent flex items-center justify-center cursor-pointer shadow-2xs"
              title="Preview Book"
            >
              <Eye size={14} />
            </button>

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="h-8 w-8 rounded-lg border border-editorial-border dark:border-stone-700 bg-white dark:bg-stone-800 text-editorial-text dark:text-stone-200 flex items-center justify-center cursor-pointer shadow-2xs"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-500" />}
              </button>
            )}
          </div>

          {/* Primary Action 1: Google Docs-style Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="h-8 px-2.5 sm:px-3 bg-editorial-accent hover:bg-editorial-accent/90 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
            title="Share manuscript & collaborate (Google Docs style)"
          >
            <Share2 size={13} />
            <span className="hidden xs:inline">Share</span>
            {book.collaborators && book.collaborators.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-editorial-accent text-[9px] font-mono font-bold flex items-center justify-center">
                {book.collaborators.length}
              </span>
            )}
          </button>

          {/* Primary Action 2: Export Button (High contrast in both light and dark mode) */}
          <button
            onClick={() => setShowExportModal(true)}
            className="h-8 px-2.5 sm:px-3 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
            title="Export to PDF, EPUB, DOCX, Markdown or HTML"
          >
            <Download size={13} />
            <span className="hidden xs:inline">Export</span>
          </button>

          {/* Mobile Overflow Menu Button (<640px) */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowMobileMoreMenu(!showMobileMoreMenu)}
              className={cn(
                "h-8 w-8 rounded-lg border flex items-center justify-center cursor-pointer shadow-2xs transition-colors",
                showMobileMoreMenu
                  ? "bg-editorial-sidebar dark:bg-stone-700 border-editorial-accent text-editorial-accent"
                  : "bg-white dark:bg-stone-800 border-editorial-border dark:border-stone-700 text-editorial-text dark:text-stone-200"
              )}
              title="More Tools"
              aria-label="More Tools"
            >
              <MoreVertical size={15} />
            </button>

            {/* Mobile Dropdown Popover */}
            {showMobileMoreMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-black/20"
                  onClick={() => setShowMobileMoreMenu(false)}
                />
                <div className="absolute right-0 top-10 w-48 bg-white dark:bg-stone-800 border border-editorial-border dark:border-stone-700 rounded-xl shadow-xl p-1.5 z-50 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setShowFullPreview(true);
                      setShowMobileMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-editorial-sidebar dark:hover:bg-stone-700 text-editorial-text dark:text-stone-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Eye size={14} className="text-editorial-accent" />
                    <span>Preview Book</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowCiteLinkModal(true);
                      setShowMobileMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-editorial-sidebar dark:hover:bg-stone-700 text-editorial-text dark:text-stone-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Link2 size={14} className="text-editorial-accent" />
                    <span>Cite & Link Works</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowFindReplace(true);
                      setShowMobileMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-editorial-sidebar dark:hover:bg-stone-700 text-editorial-text dark:text-stone-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Search size={14} className="text-editorial-accent" />
                    <span>Find & Replace (Alt+F)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowShortcutsModal(true);
                      setShowMobileMoreMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-editorial-sidebar dark:hover:bg-stone-700 text-editorial-text dark:text-stone-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Keyboard size={14} className="text-editorial-accent" />
                    <span>Keyboard Shortcuts (Alt+K)</span>
                  </button>

                  {onToggleTheme && (
                    <button
                      onClick={() => {
                        onToggleTheme();
                        setShowMobileMoreMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-editorial-sidebar dark:hover:bg-stone-700 text-editorial-text dark:text-stone-100 flex items-center gap-2 cursor-pointer border-t border-editorial-divider dark:border-stone-700 pt-2"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun size={14} className="text-amber-400" />
                          <span>Switch to Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon size={14} className="text-indigo-500" />
                          <span>Switch to Dark Mode</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUB-NAV RIBBON - Strictly 1 Row, Zero Wrapping, Smooth Horizontal Scroll */}
      {/* ========================================================================= */}
      <div className="h-11 bg-white dark:bg-stone-900 border-b border-editorial-border dark:border-stone-800 px-2 sm:px-4 flex items-center justify-between gap-1.5 shrink-0 z-10 select-none overflow-hidden">
        {/* Navigation Tabs Strip */}
        <div className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {viewTab !== 'writing' && (
            <button
              onClick={() => setViewTab('writing')}
              className="shrink-0 mr-1 px-2 py-1 text-xs font-bold text-editorial-accent dark:text-amber-400 bg-editorial-accent/10 dark:bg-amber-400/10 hover:bg-editorial-accent/20 rounded flex items-center gap-1 cursor-pointer transition-colors"
              title="Return to the manuscript writing sheet"
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">Back to Editor</span>
            </button>
          )}

          {editorTabsList.map((tab) => {
            const Icon = tab.icon;
            const isActive = viewTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewTab(tab.id as any)}
                className={cn(
                  "shrink-0 px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                  isActive
                    ? "bg-editorial-sidebar dark:bg-stone-800 text-editorial-accent dark:text-amber-400 font-bold shadow-2xs border border-editorial-border/80 dark:border-stone-700"
                    : "text-editorial-muted dark:text-stone-400 hover:text-editorial-text dark:hover:text-stone-100 hover:bg-neutral-100 dark:hover:bg-stone-800/60"
                )}
                title={tab.label}
              >
                <Icon size={13} className={cn("shrink-0", isActive ? "text-editorial-accent dark:text-amber-400" : "opacity-70")} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Contextual Editor Controls: Toggle Chapter Sidebar & WYSIWYG vs Blocks */}
        {viewTab === 'writing' && (
          <div className="shrink-0 flex items-center gap-1.5 pl-1.5 sm:pl-2 border-l border-editorial-border/60 dark:border-stone-800">
            <button
              onClick={() => setIsChapterSidebarOpen(!isChapterSidebarOpen)}
              className="h-7 px-2 text-xs font-medium rounded-md border border-editorial-border dark:border-stone-700 bg-editorial-sidebar/60 dark:bg-stone-800 text-editorial-text dark:text-stone-200 hover:bg-editorial-sidebar dark:hover:bg-stone-700 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              title={isChapterSidebarOpen ? "Hide Chapter Navigator" : "Show Chapter Navigator"}
            >
              {isChapterSidebarOpen ? <PanelLeftClose size={13} /> : <PanelLeft size={13} />}
              <span className="hidden md:inline">{isChapterSidebarOpen ? "Hide Chapters" : "Chapters"}</span>
            </button>

            <div className="flex items-center bg-editorial-sidebar/60 dark:bg-stone-800 border border-editorial-border dark:border-stone-700 p-0.5 rounded-md text-[11px] font-semibold shrink-0">
              <button
                onClick={() => setEditorMode('wysiwyg')}
                className={cn(
                  "px-2 py-0.5 rounded transition-all cursor-pointer",
                  editorMode === 'wysiwyg'
                    ? "bg-white dark:bg-stone-700 text-editorial-accent dark:text-amber-400 shadow-2xs font-bold"
                    : "text-editorial-muted dark:text-stone-400 hover:text-editorial-text"
                )}
              >
                <span className="hidden sm:inline">Rich Text</span>
                <span className="sm:hidden">Rich</span>
              </button>
              <button
                onClick={() => setEditorMode('blocks')}
                className={cn(
                  "px-2 py-0.5 rounded transition-all cursor-pointer",
                  editorMode === 'blocks'
                    ? "bg-white dark:bg-stone-700 text-editorial-accent dark:text-amber-400 shadow-2xs font-bold"
                    : "text-editorial-muted dark:text-stone-400 hover:text-editorial-text"
                )}
              >
                <span className="hidden sm:inline">Content Blocks</span>
                <span className="sm:hidden">Blocks</span>
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
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 flex justify-center bg-editorial-bg select-text w-full max-w-full overflow-x-hidden">
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
                tip="Press Alt+S for manual checkpoint save, Alt+A to toggle AutoSave, or Alt+F for Find & Replace."
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
                  onOpenFindReplace={() => setShowFindReplace(true)}
                  placeholder="Begin drafting your prose freely..."
                  borderStyle={book.pageSettings?.borderStyle || 'classic-single'}
                  pageSize={book.pageSettings?.size || 'A4'}
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

      {/* 7. Non-Conflicting Keyboard Shortcuts Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
}
