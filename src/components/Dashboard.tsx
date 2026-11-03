/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Book, 
  TEMPLATES, 
  Template, 
  Project, 
  Asset, 
  ReferenceItem, 
  DocumentStatus,
  DocumentCategory,
  DocumentSubCategory
} from '../types.ts';
import { 
  Plus, 
  BookOpen, 
  Trash2, 
  Clock, 
  FileText, 
  LayoutGrid, 
  List, 
  Library, 
  HelpCircle, 
  ArrowRight, 
  Copy, 
  Archive, 
  Download, 
  Search, 
  Upload, 
  FolderKanban, 
  Image as ImageIcon, 
  Quote, 
  Settings as SettingsIcon, 
  Check, 
  RotateCcw, 
  FolderPlus, 
  Edit3, 
  ExternalLink,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Layers,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Info,
  Compass,
  CheckSquare2,
  XCircle,
  Lightbulb,
  Share2,
  Eye,
  Keyboard,
  FolderOpen,
  Tag,
  Filter
} from 'lucide-react';
import Logo from './Logo.tsx';
import { getDemoBookForBlueprint } from '../lib/demoData.ts';
import { User, auth, signInWithPopup, googleProvider } from '../lib/firebase.ts';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { cn, formatDate } from '../lib/utils.ts';
import ReferencesManager from './ReferencesManager.tsx';
import MediaLibraryModal from './MediaLibraryModal.tsx';
import DetailedGuide from './DetailedGuide.tsx';
import FacilityIntro from './FacilityIntro.tsx';
import ShareModal from './ShareModal.tsx';
import CategoryManagerModal from './CategoryManagerModal.tsx';
import KeyboardShortcutsModal, { SHORTCUTS_LIST } from './KeyboardShortcutsModal.tsx';
import EditorKeyLegend from './EditorKeyLegend.tsx';
import { NavTab } from './Sidebar.tsx';

interface DashboardProps {
  books: Book[];
  projects?: Project[];
  activeTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  onCreateBook: (templateId?: string) => void;
  onOpenNewBookWizard: () => void;
  onImportBook: (book: Book) => void;
  onSelectBook: (id: string) => void;
  onDuplicateBook: (book: Book) => void;
  onArchiveBook: (id: string) => void;
  onRestoreBook: (id: string) => void;
  onDeleteBook: (id: string) => void;
  onUpdateBook: (book: Book) => void;
  currentUser?: User | null;
  cloudSyncState?: 'synced' | 'syncing' | 'offline' | 'saved_locally' | 'error';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onBack?: () => void;
}

const DEFAULT_DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    id: 'cat-fiction',
    name: 'Fiction & Literature',
    color: '#C05800',
    subCategories: [
      { id: 'sub-novel', name: 'Novels & Multi-Chapter' },
      { id: 'sub-children', name: 'Children & Illustrated' },
      { id: 'sub-poetry', name: 'Poetry & Anthologies' }
    ]
  },
  {
    id: 'cat-educational',
    name: 'Educational & Guides',
    color: '#059669',
    subCategories: [
      { id: 'sub-teacher', name: 'Teacher Handbooks' },
      { id: 'sub-student', name: 'Student Guides' },
      { id: 'sub-parent', name: 'Parent Companions' }
    ]
  },
  {
    id: 'cat-academic',
    name: 'Academic & Research',
    color: '#2563EB',
    subCategories: [
      { id: 'sub-research', name: 'Field Reports' },
      { id: 'sub-policy', name: 'Policy Whitepapers' },
      { id: 'sub-dissertation', name: 'Theses & Monographs' }
    ]
  },
  {
    id: 'cat-workbooks',
    name: 'Workbooks & Journals',
    color: '#7C3AED',
    subCategories: [
      { id: 'sub-science', name: 'Science Workbooks' },
      { id: 'sub-reflection', name: 'Reflection Logs' }
    ]
  }
];

export default function Dashboard({
  books,
  projects = [],
  activeTab = 'home',
  onSelectTab,
  onCreateBook,
  onOpenNewBookWizard,
  onImportBook,
  onSelectBook,
  onDuplicateBook,
  onArchiveBook,
  onRestoreBook,
  onDeleteBook,
  onUpdateBook,
  currentUser,
  cloudSyncState = 'saved_locally',
  theme,
  onToggleTheme,
  onBack
}: DashboardProps) {
  const { notify } = useNotification();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DocumentStatus>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'words'>('updated');
  const [templateCategory, setTemplateCategory] = useState<string>('All');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sharingBook, setSharingBook] = useState<Book | null>(null);

  // Document Folder & Category states
  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>(() => {
    try {
      const saved = localStorage.getItem('shaastra_document_categories');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DOCUMENT_CATEGORIES;
  });
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [selectedSubFolderId, setSelectedSubFolderId] = useState<string>('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showWhatIsBox, setShowWhatIsBox] = useState(false);
  const [showWhyBox, setShowWhyBox] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeViewMode, setHomeViewMode] = useState<'grid' | 'list'>('grid');

  const handleSaveCategories = (newCats: DocumentCategory[]) => {
    setDocumentCategories(newCats);
    try {
      localStorage.setItem('shaastra_document_categories', JSON.stringify(newCats));
    } catch {}
    notify('Categories & folders saved.', 'success');
  };

  const handleAssignCategory = (book: Book, catId: string, subId?: string) => {
    const cat = documentCategories.find(c => c.id === catId);
    const sub = cat?.subCategories.find(s => s.id === subId);
    const updated: Book = {
      ...book,
      categoryId: catId === 'none' ? undefined : catId,
      category: catId === 'none' ? undefined : (cat?.name || undefined),
      subCategoryId: subId === 'none' ? undefined : subId,
      subCategory: subId === 'none' ? undefined : (sub?.name || undefined),
      updatedAt: Date.now()
    };
    onUpdateBook(updated);
    notify(`Document categorized under "${cat?.name || 'Uncategorized'}".`, 'info');
  };

  // User Profile
  const [penName, setPenName] = useState(
    localStorage.getItem('book-builder-shaastra-user-name') || currentUser?.displayName || 'Author'
  );

  const handleUpdatePenName = (val: string) => {
    setPenName(val);
    localStorage.setItem('book-builder-shaastra-user-name', val);
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else if (onSelectTab) {
      onSelectTab('home');
    }
  };

  // Collect all media across books
  const allMediaAssets: Asset[] = React.useMemo(() => {
    const list: Asset[] = [];
    books.forEach(b => {
      if (b.assets) list.push(...b.assets);
    });
    return list;
  }, [books]);

  // Collect all references across books
  const allReferences: ReferenceItem[] = React.useMemo(() => {
    const list: ReferenceItem[] = [];
    books.forEach(b => {
      if (b.references) list.push(...b.references);
    });
    return list;
  }, [books]);

  // Filtered & Sorted Books
  const nonArchivedBooks = books.filter(b => b.status !== 'archived');
  const archivedBooks = books.filter(b => b.status === 'archived');

  const displayedBooks = (activeTab === 'archived' ? archivedBooks : 
                          activeTab === 'drafts' ? books.filter(b => b.status === 'draft') :
                          activeTab === 'published' ? books.filter(b => b.status === 'published' || b.status === 'exported') :
                          nonArchivedBooks)
    .filter(b => {
      const activeCat = documentCategories.find(c => c.id === selectedFolderId);
      const matchesFolder = selectedFolderId === 'all' || 
        b.categoryId === selectedFolderId || 
        (activeCat && b.category === activeCat.name);

      const activeSub = activeCat?.subCategories.find(s => s.id === selectedSubFolderId);
      const matchesSubFolder = selectedSubFolderId === 'all' ||
        b.subCategoryId === selectedSubFolderId ||
        (activeSub && b.subCategory === activeSub.name);

      const matchesSearch = 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.subtitle && b.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.authorName && b.authorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.subCategory && b.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus && matchesFolder && matchesSubFolder;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'words') {
        const wordsA = a.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
        const wordsB = b.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
        return wordsB - wordsA;
      }
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

  // Calculate high-level stats
  const totalWords = books.reduce((acc, b) => 
    acc + b.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0), 0
  );
  const totalChapters = books.reduce((acc, b) => acc + b.chapters.length, 0);

  // Template categories
  const templateCategoriesList = ['All', 'Fiction', 'Children\'s', 'Academic', 'Educational', 'Guide', 'Report', 'Workbook', 'Poetry', 'Custom'];
  const filteredTemplates = TEMPLATES.filter(t => 
    templateCategory === 'All' || t.category === templateCategory
  );

  // Continue writing target (most recently modified active book)
  const continueBook = nonArchivedBooks[0];

  return (
    <div className="flex-1 bg-editorial-bg min-h-screen p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Universal Top "Back" Button Bar for all sub-views */}
      {activeTab !== 'home' && (
        <div className="flex items-center justify-between bg-white p-3.5 px-5 rounded-xl border border-editorial-border shadow-xs animate-in fade-in duration-150">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-editorial-sidebar text-editorial-text hover:bg-editorial-sidebar/80 border border-editorial-border font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            title="Go back to previous screen"
          >
            <ArrowLeft size={15} className="text-editorial-accent" />
            <span>&larr; Back to Previous Screen</span>
          </button>

          <span className="text-[11px] font-mono font-bold text-editorial-muted uppercase tracking-wider">
            {activeTab.toUpperCase().replace('-', ' ')} WORKSPACE
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HOME DASHBOARD VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'home' && (
        <div className="space-y-10">
          {/* Prominent Symmetrical Big Title Banner */}
          <div className="text-center py-6 sm:py-10 space-y-3 max-w-4xl mx-auto border-b border-editorial-divider">
            <Logo className="mx-auto scale-110 mb-2" />
            
            {/* Big Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic font-bold text-editorial-text tracking-tight leading-none drop-shadow-xs">
              Book Builder Shaastra
            </h1>

            {/* Tagline */}
            <div className="inline-block bg-editorial-sidebar px-4 py-1.5 rounded-full border border-editorial-border shadow-2xs">
              <span className="text-sm sm:text-base font-serif italic font-bold text-editorial-accent">
                "You too can build a book now!"
              </span>
            </div>

            {/* Subtext explaining what the app is */}
            <p className="text-sm sm:text-base font-serif text-editorial-text max-w-2xl mx-auto leading-relaxed pt-1">
              A focused digital writing and book creation studio for manually structuring, drafting, and crafting books with full authorial control.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={onOpenNewBookWizard}
                className="bg-editorial-accent hover:bg-editorial-accent/90 text-white dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Plus size={16} />
                <span>+ New Book</span>
              </button>

              <button
                onClick={() => onSelectTab && onSelectTab('my-books')}
                className="bg-white hover:bg-neutral-50 border border-editorial-border px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-editorial-text transition-colors cursor-pointer shadow-2xs"
              >
                Open My Books
              </button>

              <button
                onClick={() => onSelectTab && onSelectTab('templates')}
                className="bg-white hover:bg-neutral-50 border border-editorial-border px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-editorial-text transition-colors cursor-pointer shadow-2xs"
              >
                Browse Blueprints
              </button>

              {continueBook && (
                <button
                  onClick={() => onSelectBook(continueBook.id)}
                  className="bg-editorial-accent/15 hover:bg-editorial-accent/25 text-editorial-accent border border-editorial-accent/30 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
                >
                  Continue Editing
                </button>
              )}

              <button
                onClick={() => onSelectTab && onSelectTab('guide')}
                className="bg-white hover:bg-neutral-50 border border-editorial-border px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-editorial-text transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <HelpCircle size={14} className="text-editorial-accent" />
                <span>The Handbook</span>
              </button>

              <button
                onClick={() => setShowShortcutsModal(true)}
                className="bg-white hover:bg-neutral-50 border border-editorial-border px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-editorial-text transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                title="View Non-Conflicting Keyboard Shortcuts (Alt+K)"
              >
                <Keyboard size={14} className="text-editorial-accent dark:text-amber-400" />
                <span>Shortcuts</span>
              </button>
            </div>
          </div>

          {/* BOX 1: What is Book Builder Shaastra — Dropdown Accordion */}
          <div className="bg-white border border-editorial-border rounded-2xl p-5 sm:p-6 shadow-xs transition-all">
            <button
              type="button"
              onClick={() => setShowWhatIsBox(!showWhatIsBox)}
              className="w-full flex items-center justify-between text-left cursor-pointer group select-none gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-editorial-sidebar flex items-center justify-center text-editorial-accent shrink-0 group-hover:scale-105 transition-transform">
                  <Compass size={19} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-editorial-accent font-bold">
                    Introduction & Overview
                  </span>
                  <h2 className="text-base sm:text-xl font-serif italic font-bold text-editorial-text group-hover:text-editorial-accent transition-colors leading-tight">
                    What is Book Builder Shaastra — and How to Use It (In Brief)
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-editorial-muted font-mono bg-editorial-sidebar/60 px-3 py-1.5 rounded-lg border border-editorial-border/60 shrink-0">
                <span className="hidden sm:inline font-sans">{showWhatIsBox ? 'Collapse' : 'Click to Read'}</span>
                {showWhatIsBox ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
            </button>

            {showWhatIsBox && (
              <div className="pt-4 mt-4 border-t border-editorial-divider space-y-4 animate-in fade-in duration-200">
                <p className="text-xs sm:text-sm font-serif leading-relaxed text-editorial-text">
                  <strong>Book Builder Shaastra</strong> is an architectural book creation environment engineered for dedicated authors, educators, and students. Instead of treating documents as endless unorganized streams, it equips you with hierarchical chapters, Word-like tables, callout boxes, citation management, visual cover crafting, and instant export into archival PDF and Word (.docx).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-sans text-xs">
                  <div className="bg-editorial-sidebar/40 p-4 rounded-xl border border-editorial-border/60 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                      1
                    </div>
                    <h4 className="font-bold text-editorial-text uppercase tracking-wider text-[11px]">
                      Initiate Your Book
                    </h4>
                    <p className="text-[11px] text-editorial-muted leading-relaxed font-serif">
                      Click <em>+ New Book</em> to start from scratch, select a blueprint (Fiction, Children's, Academic, Science), or upload a Word/Markdown draft.
                    </p>
                  </div>

                  <div className="bg-editorial-sidebar/40 p-4 rounded-xl border border-editorial-border/60 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                      2
                    </div>
                    <h4 className="font-bold text-editorial-text uppercase tracking-wider text-[11px]">
                      Sequence the Outline
                    </h4>
                    <p className="text-[11px] text-editorial-muted leading-relaxed font-serif">
                      Structure your volume in the <em>Outline</em> workspace. Reorder chapters with drag-and-drop, configure subsections, and set front matter.
                    </p>
                  </div>

                  <div className="bg-editorial-sidebar/40 p-4 rounded-xl border border-editorial-border/60 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                      3
                    </div>
                    <h4 className="font-bold text-editorial-text uppercase tracking-wider text-[11px]">
                      Draft with Word-like Tools
                    </h4>
                    <p className="text-[11px] text-editorial-muted leading-relaxed font-serif">
                      Write on pure manuscript paper. Insert Word-like tables, custom callout boxes, character registers, and Zoho-style linked works.
                    </p>
                  </div>

                  <div className="bg-editorial-sidebar/40 p-4 rounded-xl border border-editorial-border/60 space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                      4
                    </div>
                    <h4 className="font-bold text-editorial-text uppercase tracking-wider text-[11px]">
                      Design Cover & Export
                    </h4>
                    <p className="text-[11px] text-editorial-muted leading-relaxed font-serif">
                      Style a trade cover in the <em>Cover Studio</em>, preview page-by-page, and export print-ready PDF, Word, Markdown, or Plain Text.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BOX 2: "Why Book Builder Shaastra" — Dropdown Accordion */}
          <div className="bg-editorial-sidebar/30 border border-editorial-border rounded-2xl p-5 sm:p-6 shadow-xs transition-all">
            <button
              type="button"
              onClick={() => setShowWhyBox(!showWhyBox)}
              className="w-full flex items-center justify-between text-left cursor-pointer group select-none gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-editorial-sidebar flex items-center justify-center text-editorial-accent shrink-0 group-hover:scale-105 transition-transform">
                  <Lightbulb size={19} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-editorial-accent font-bold">
                    Architectural Rationale
                  </span>
                  <h2 className="text-base sm:text-xl font-serif italic font-bold text-editorial-text group-hover:text-editorial-accent transition-colors leading-tight">
                    Why Book Builder Shaastra? (Problems Before & Solutions Now)
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-editorial-muted font-mono bg-white px-3 py-1.5 rounded-lg border border-editorial-border shrink-0">
                <span className="hidden sm:inline font-sans">{showWhyBox ? 'Collapse' : 'Click to Read'}</span>
                {showWhyBox ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
            </button>

            {showWhyBox && (
              <div className="pt-4 mt-4 border-t border-editorial-divider space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Left Column: Problems that arose before this app */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-red-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-red-700 font-sans font-bold text-xs uppercase tracking-wider">
                      <XCircle size={16} />
                      <span>The Problems That Arose Before This App</span>
                    </div>

                    <ul className="space-y-2.5 text-xs font-serif leading-relaxed text-editorial-text">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold shrink-0">•</span>
                        <span><strong>Fragmented, Chaotic Workflows:</strong> Authors had to juggle separate word processors for typing, spreadsheet tools for data tables, and bloated layout software just to assemble a book.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold shrink-0">•</span>
                        <span><strong>Manual Table of Contents & Pagination:</strong> Changing one paragraph threw off page numbers across the entire document, requiring tedious manual retyping of indexes.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold shrink-0">•</span>
                        <span><strong>Losing Work & Weak Backups:</strong> Complex desktop software often crashed, corrupting chapter files without automatic offline caching or cloud synchronization.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold shrink-0">•</span>
                        <span><strong>AI-Slop & Erosion of Authentic Voice:</strong> Modern writing tools increasingly force intrusive chatbots and AI text-generators, muddying authentic authorial craft and scholarship.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right Column: Solutions this app provides */}
                  <div className="bg-white p-5 sm:p-6 rounded-xl border border-emerald-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-sans font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 size={16} />
                      <span>The Solution Book Builder Shaastra Provides</span>
                    </div>

                    <ul className="space-y-2.5 text-xs font-serif leading-relaxed text-editorial-text">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span><strong>Unified Book-First Workspace:</strong> Hierarchical chapters, sections, Word-like tables, callout boxes, and cover design unified in one seamless, distraction-free environment.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span><strong>Automatic Table of Contents & Paging:</strong> Structural changes dynamically update the directory, running headers, and export page numbers with zero manual effort.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span><strong>Offline-First Resilience with Cloud Sync:</strong> Keystrokes save instantly to your device cache, syncing seamlessly to Google Cloud Firestore whenever connected.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span><strong>Pure Authorial Craftsmanship:</strong> 100% non-AI software architecture that respects your authorial voice, scholarship, and creative vision.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-editorial-border p-4 rounded-xl shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-muted block">
                Total Manuscripts
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-editorial-text">
                {nonArchivedBooks.length}
              </span>
            </div>

            <div className="bg-white border border-editorial-border p-4 rounded-xl shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-muted block">
                Total Words Drafted
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-editorial-text font-mono">
                {totalWords.toLocaleString()}
              </span>
            </div>

            <div className="bg-white border border-editorial-border p-4 rounded-xl shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-muted block">
                Total Chapters
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-editorial-text">
                {totalChapters}
              </span>
            </div>

            <div className="bg-white border border-editorial-border p-4 rounded-xl shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-muted block">
                Storage Status
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {currentUser ? 'Cloud Synced' : 'Private Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Continue Writing Hero Card */}
          {continueBook && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif italic font-bold text-editorial-text">
                  Continue Writing
                </h2>
                <span className="text-xs text-editorial-muted font-mono">
                  Last edited {formatDate(continueBook.updatedAt)}
                </span>
              </div>

              <div className="bg-white border border-editorial-border rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-editorial-accent transition-all">
                <div className="flex items-center gap-5">
                  <div
                    className="w-16 h-24 rounded shadow-sm border border-editorial-border shrink-0 flex flex-col justify-between p-2 text-center"
                    style={{
                      backgroundColor: continueBook.cover?.bgColor || '#1B4332',
                      color: continueBook.cover?.textColor || '#FFFFFF'
                    }}
                  >
                    <span className="text-[7px] font-mono font-bold uppercase truncate">
                      {continueBook.publisher || 'Shaastra'}
                    </span>
                    <span className="text-[9px] font-serif italic font-bold line-clamp-2">
                      {continueBook.title}
                    </span>
                    <span className="text-[7px] opacity-75 truncate">{continueBook.authorName}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono uppercase bg-editorial-sidebar px-2 py-0.5 rounded font-bold text-editorial-muted">
                        {continueBook.type}
                      </span>
                      <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                        {continueBook.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif italic font-bold text-editorial-text">
                      {continueBook.title}
                    </h3>
                    <p className="text-xs text-editorial-muted line-clamp-1 max-w-lg">
                      {continueBook.description || 'No description provided.'}
                    </p>
                    <div className="text-xs font-mono text-editorial-muted pt-1">
                      {continueBook.chapters.length} chapters • {continueBook.chapters.reduce((s, c) => s + (c.wordCount || 0), 0)} words
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectBook(continueBook.id)}
                  className="w-full md:w-auto px-6 py-3 bg-stone-900 text-white hover:bg-black dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
                >
                  <span>Continue Editing</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Home Documents Section with Live Search & Grid / Line View Modes */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-serif italic font-bold text-editorial-text">
                  Library Documents & Manuscripts
                </h2>
                <p className="text-xs text-editorial-muted">
                  Search across your entire catalog, switch views, or open any document immediately.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab && onSelectTab('my-books')}
                  className="text-xs font-bold uppercase tracking-wider text-editorial-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>All Folders ({nonArchivedBooks.length})</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Home Search Bar & Grid/Line View Controls */}
            <div className="bg-white border border-editorial-border p-3 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-editorial-muted" />
                <input
                  type="text"
                  placeholder="Search manuscripts by title, topic, author, or keywords..."
                  value={homeSearchQuery}
                  onChange={(e) => setHomeSearchQuery(e.target.value)}
                  className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded-lg pl-9 pr-8 py-2 text-xs outline-none focus:border-editorial-accent text-editorial-text"
                />
                {homeSearchQuery && (
                  <button
                    onClick={() => setHomeSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-editorial-muted hover:text-editorial-text cursor-pointer"
                    title="Clear search"
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>

              {/* Grid / Line View Mode Toggle */}
              <div className="flex items-center border border-editorial-border rounded-lg overflow-hidden shrink-0 bg-editorial-sidebar/30">
                <button
                  type="button"
                  onClick={() => setHomeViewMode('grid')}
                  className={`p-2 transition-colors cursor-pointer ${
                    homeViewMode === 'grid'
                      ? 'bg-editorial-accent text-white font-bold shadow-2xs'
                      : 'text-editorial-muted hover:text-editorial-text'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setHomeViewMode('list')}
                  className={`p-2 transition-colors cursor-pointer ${
                    homeViewMode === 'list'
                      ? 'bg-editorial-accent text-white font-bold shadow-2xs'
                      : 'text-editorial-muted hover:text-editorial-text'
                  }`}
                  title="Line View (List View)"
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Documents Listing (Grid vs Line view) */}
            {(() => {
              const homeFilteredBooks = nonArchivedBooks.filter(b => {
                if (!homeSearchQuery.trim()) return true;
                const q = homeSearchQuery.toLowerCase();
                return (
                  b.title.toLowerCase().includes(q) ||
                  (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
                  (b.description && b.description.toLowerCase().includes(q)) ||
                  (b.authorName && b.authorName.toLowerCase().includes(q)) ||
                  (b.category && b.category.toLowerCase().includes(q)) ||
                  (b.subCategory && b.subCategory.toLowerCase().includes(q))
                );
              });

              if (homeFilteredBooks.length === 0) {
                return (
                  <div className="bg-white border border-dashed border-editorial-border rounded-xl p-8 text-center space-y-2">
                    <p className="font-serif italic text-editorial-text text-sm">
                      No documents match "{homeSearchQuery}"
                    </p>
                    <button
                      onClick={() => setHomeSearchQuery('')}
                      className="text-xs text-editorial-accent hover:underline font-bold cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  </div>
                );
              }

              if (homeViewMode === 'list') {
                return (
                  <div className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-xs divide-y divide-editorial-divider">
                    {homeFilteredBooks.map(book => {
                      const words = book.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
                      return (
                        <div
                          key={book.id}
                          className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="flex-1 overflow-hidden cursor-pointer" onClick={() => onSelectBook(book.id)}>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[9px] font-mono font-bold uppercase bg-editorial-sidebar px-2 py-0.5 rounded text-editorial-muted">
                                {book.type}
                              </span>
                              {book.category && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 font-sans border border-editorial-border/60 text-editorial-text font-medium">
                                  <FolderOpen size={10} className="text-editorial-accent" />
                                  <span>{book.category}</span>
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold">
                                {book.status}
                              </span>
                              <span className="text-[10px] font-mono text-editorial-muted">
                                Edited {formatDate(book.updatedAt)}
                              </span>
                            </div>
                            <h3 className="font-serif italic font-bold text-base text-editorial-text hover:text-editorial-accent truncate">
                              {book.title}
                            </h3>
                            {book.subtitle && (
                              <p className="text-xs text-editorial-muted italic truncate">
                                {book.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-mono text-editorial-muted">
                              {book.chapters.length} ch. • {words}w
                            </span>
                            <button
                              onClick={() => onSelectBook(book.id)}
                              className="px-3 py-1.5 bg-editorial-text text-white hover:bg-black rounded text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs"
                            >
                              Open
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {homeFilteredBooks.map((book) => {
                    const words = book.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
                    return (
                      <div
                        key={book.id}
                        onClick={() => onSelectBook(book.id)}
                        className="bg-white border border-editorial-border rounded-xl p-5 shadow-xs hover:border-editorial-accent hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-56 group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-editorial-muted mb-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="uppercase font-bold tracking-wider bg-editorial-sidebar px-2 py-0.5 rounded">
                                {book.type}
                              </span>
                              {book.category && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 font-sans border border-editorial-border/60 text-editorial-text font-medium truncate max-w-[100px]">
                                  <FolderOpen size={10} className="text-editorial-accent" />
                                  <span>{book.category}</span>
                                </span>
                              )}
                            </div>
                            <span>{formatDate(book.updatedAt)}</span>
                          </div>
                          <h3 className="font-serif italic font-bold text-lg text-editorial-text group-hover:text-editorial-accent transition-colors line-clamp-2">
                            {book.title}
                          </h3>
                          {book.subtitle && (
                            <p className="text-xs text-editorial-muted italic line-clamp-1 mt-0.5">
                              {book.subtitle}
                            </p>
                          )}
                          <p className="text-xs text-editorial-muted line-clamp-2 mt-2 font-serif">
                            {book.description || 'No synopsis provided.'}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-editorial-divider flex items-center justify-between text-xs">
                          <span className="font-mono text-[10px] text-editorial-muted">
                            {book.chapters.length} ch. • {words}w
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-editorial-accent group-hover:underline flex items-center gap-1">
                            Open &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MY BOOKS VIEW */}
      {/* ========================================================================= */}
      {(activeTab === 'my-books' || activeTab === 'drafts' || activeTab === 'published' || activeTab === 'archived') && (
        <div className="space-y-6">
          {/* Facility Introduction */}
          <FacilityIntro
            title="My Books & Document Library Facility"
            facilityKey="my-books"
            description="Your central catalog for managing, duplicating, categorizing, and archiving authored volumes. Filter across draft milestones or sort by word count."
            steps={[
              "Filter drafts, published volumes, or archives using the status menu.",
              "Duplicate any book to branch into parallel revisions or sequels.",
              "Click 'Open' or the title to load the book into the editing studio."
            ]}
            tip="Use the search bar to locate specific keywords, co-authors, or synopses across your entire library."
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif italic font-bold text-editorial-text">
                {activeTab === 'archived' ? 'Archived Manuscripts' :
                 activeTab === 'drafts' ? 'Manuscript Drafts' :
                 activeTab === 'published' ? 'Published / Exported Works' :
                 'My Books & Manuscripts'}
              </h1>
              <p className="text-xs text-editorial-muted mt-1">
                Manage, duplicate, export, or organize your library of works.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-white border border-editorial-border hover:bg-editorial-sidebar text-editorial-text px-3 py-2 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Create and manage document folder categories"
              >
                <FolderPlus size={14} className="text-editorial-accent" />
                <span className="hidden sm:inline">Manage</span> Folders
              </button>

              <button
                onClick={onOpenNewBookWizard}
                className="bg-editorial-accent hover:bg-editorial-accent/90 text-white dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-white px-4 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>+ New Book</span>
              </button>
            </div>
          </div>

          {/* Folder & Category Strip */}
          <div className="bg-white border border-editorial-border p-3 sm:p-4 rounded-xl space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-editorial-muted">
              <div className="flex items-center gap-2">
                <FolderOpen size={14} className="text-editorial-accent" />
                <span>Document Categories & Folders</span>
              </div>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="text-[11px] text-editorial-accent hover:underline flex items-center gap-1 normal-case font-medium cursor-pointer"
              >
                <Edit3 size={11} />
                Edit Categories
              </button>
            </div>

            {/* Main Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setSelectedFolderId('all');
                  setSelectedSubFolderId('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  selectedFolderId === 'all'
                    ? 'bg-editorial-accent text-white shadow-xs font-bold'
                    : 'bg-editorial-sidebar/60 text-editorial-text hover:bg-editorial-sidebar border border-editorial-border'
                }`}
              >
                <span>All Documents</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedFolderId === 'all' ? 'bg-white/25 text-white' : 'bg-black/10 text-editorial-muted'
                }`}>
                  {nonArchivedBooks.length}
                </span>
              </button>

              {documentCategories.map((cat) => {
                const count = nonArchivedBooks.filter(
                  b => b.categoryId === cat.id || b.category === cat.name
                ).length;
                const isSelected = selectedFolderId === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedFolderId('all');
                        setSelectedSubFolderId('all');
                      } else {
                        setSelectedFolderId(cat.id);
                        setSelectedSubFolderId('all');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-editorial-text text-white shadow-xs font-bold'
                        : 'bg-editorial-sidebar/40 text-editorial-text hover:bg-editorial-sidebar border border-editorial-border'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#C05800' }}
                    />
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/10 text-editorial-muted'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-category Pills (when a parent folder is selected) */}
            {selectedFolderId !== 'all' && (() => {
              const currentCat = documentCategories.find(c => c.id === selectedFolderId);
              if (!currentCat || currentCat.subCategories.length === 0) return null;
              return (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-editorial-divider">
                  <span className="text-[10px] uppercase font-mono text-editorial-muted mr-1 font-bold">
                    Sub-folder:
                  </span>
                  <button
                    onClick={() => setSelectedSubFolderId('all')}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                      selectedSubFolderId === 'all'
                        ? 'bg-editorial-accent text-white font-bold'
                        : 'bg-editorial-sidebar/30 text-editorial-muted hover:text-editorial-text border border-editorial-border'
                    }`}
                  >
                    All in {currentCat.name}
                  </button>
                  {currentCat.subCategories.map((sub) => {
                    const subCount = nonArchivedBooks.filter(
                      b => (b.categoryId === currentCat.id || b.category === currentCat.name) &&
                           (b.subCategoryId === sub.id || b.subCategory === sub.name)
                    ).length;
                    const isSubSelected = selectedSubFolderId === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubFolderId(isSubSelected ? 'all' : sub.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                          isSubSelected
                            ? 'bg-editorial-accent text-white font-bold'
                            : 'bg-editorial-sidebar/30 text-editorial-text hover:bg-editorial-sidebar border border-editorial-border'
                        }`}
                      >
                        <span>{sub.name}</span>
                        <span className="ml-1.5 text-[9px] opacity-75">({subCount})</span>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Search, Filter & Layout Controls */}
          <div className="bg-white border border-editorial-border p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-3 text-editorial-muted" />
              <input
                type="text"
                placeholder="Search across title, subtitle, synopsis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded pl-9 pr-3 py-2 text-xs outline-none focus:border-editorial-accent"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white border border-editorial-border rounded px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none text-editorial-text"
              >
                <option value="all">All Statuses</option>
                <option value="idea">Idea</option>
                <option value="planning">Planning</option>
                <option value="draft">Draft</option>
                <option value="editing">Editing</option>
                <option value="final">Final</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-editorial-border rounded px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none text-editorial-text"
              >
                <option value="updated">Recent Edit</option>
                <option value="title">Title (A-Z)</option>
                <option value="words">Word Count</option>
              </select>

              <div className="flex items-center border border-editorial-border rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-editorial-sidebar text-editorial-accent' : 'bg-white text-editorial-muted'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-editorial-sidebar text-editorial-accent' : 'bg-white text-editorial-muted'}`}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Book Cards Display */}
          {displayedBooks.length === 0 ? (
            <div className="bg-white border border-dashed border-editorial-border rounded-xl p-16 text-center">
              <BookOpen size={36} className="mx-auto text-editorial-muted/40 mb-3" />
              <h3 className="font-serif italic font-bold text-lg text-editorial-text">
                No manuscripts found
              </h3>
              <p className="text-xs text-editorial-muted mt-1 max-w-sm mx-auto mb-4">
                Your library is ready for your thoughts. Create your first book from scratch or select a curated template.
              </p>
              <button
                onClick={onOpenNewBookWizard}
                className="px-5 py-2.5 bg-editorial-accent hover:bg-editorial-accent/90 text-white dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-white rounded font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer"
              >
                + Create Your First Book
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBooks.map((book) => {
                const words = book.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
                return (
                  <div
                    key={book.id}
                    className="bg-white border border-editorial-border rounded-xl p-5 shadow-xs hover:border-editorial-accent hover:shadow-md transition-all flex flex-col justify-between h-64 group relative"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-editorial-muted mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="uppercase font-bold tracking-wider bg-editorial-sidebar px-2 py-0.5 rounded">
                            {book.type}
                          </span>
                          {book.category && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 font-sans border border-editorial-border/60 text-editorial-text font-medium">
                              <FolderOpen size={10} className="text-editorial-accent" />
                              <span className="truncate max-w-[100px]">{book.category}</span>
                              {book.subCategory && <span className="text-editorial-muted text-[9px]">/ {book.subCategory}</span>}
                            </span>
                          )}
                        </div>
                        <span className="capitalize font-bold text-editorial-accent shrink-0">
                          {book.status}
                        </span>
                      </div>

                      <h3
                        onClick={() => onSelectBook(book.id)}
                        className="font-serif italic font-bold text-lg text-editorial-text hover:text-editorial-accent transition-colors line-clamp-2 cursor-pointer"
                      >
                        {book.title}
                      </h3>
                      {book.subtitle && (
                        <p className="text-xs text-editorial-muted italic line-clamp-1 mt-0.5">
                          {book.subtitle}
                        </p>
                      )}

                      <p className="text-xs text-editorial-muted line-clamp-2 mt-2 font-serif">
                        {book.description || 'No synopsis provided.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-editorial-divider flex items-center justify-between">
                      <div className="text-[10px] font-mono text-editorial-muted">
                        {book.chapters.length} ch. • {words}w
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Quick Folder Assigner */}
                        <div className="relative" title="Assign to folder/category">
                          <select
                            value={book.categoryId || ''}
                            onChange={(e) => handleAssignCategory(book, e.target.value)}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                            title="Assign to folder category"
                          >
                            <option value="none">No Folder</option>
                            {documentCategories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="p-1.5 text-editorial-muted hover:text-editorial-accent rounded transition-colors"
                            title={`Folder: ${book.category || 'Uncategorized'}`}
                          >
                            <FolderPlus size={13} />
                          </button>
                        </div>

                        <button
                          onClick={() => setSharingBook(book)}
                          className="p-1.5 text-editorial-muted hover:text-editorial-accent rounded transition-colors"
                          title="Share & Collaborate (Google Docs style)"
                        >
                          <Share2 size={13} />
                        </button>

                        <button
                          onClick={() => onDuplicateBook(book)}
                          className="p-1.5 text-editorial-muted hover:text-editorial-text rounded"
                          title="Duplicate Book"
                        >
                          <Copy size={13} />
                        </button>

                        {book.status === 'archived' ? (
                          <button
                            onClick={() => onRestoreBook(book.id)}
                            className="p-1.5 text-editorial-muted hover:text-emerald-700 rounded"
                            title="Restore from Archive"
                          >
                            <RotateCcw size={13} />
                          </button>
                        ) : (
                          <button
                            onClick={() => onArchiveBook(book.id)}
                            className="p-1.5 text-editorial-muted hover:text-editorial-text rounded"
                            title="Archive Book"
                          >
                            <Archive size={13} />
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteConfirmId(book.id)}
                          className="p-1.5 text-editorial-muted hover:text-red-600 rounded"
                          title="Delete Manuscript"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-xs divide-y divide-editorial-divider">
              {displayedBooks.map((book) => {
                const words = book.chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
                return (
                  <div
                    key={book.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1 overflow-hidden" onClick={() => onSelectBook(book.id)}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[9px] font-mono font-bold uppercase bg-editorial-sidebar px-2 py-0.5 rounded text-editorial-muted">
                          {book.type}
                        </span>
                        {book.category && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 font-sans border border-editorial-border/60 text-editorial-text font-medium">
                            <FolderOpen size={10} className="text-editorial-accent" />
                            <span>{book.category}</span>
                            {book.subCategory && <span className="text-editorial-muted text-[9px]">/ {book.subCategory}</span>}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold">
                          {book.status}
                        </span>
                        <span className="text-[10px] font-mono text-editorial-muted">
                          Edited {formatDate(book.updatedAt)}
                        </span>
                      </div>
                      <h3 className="font-serif italic font-bold text-base text-editorial-text hover:text-editorial-accent cursor-pointer truncate">
                        {book.title}
                      </h3>
                      {book.subtitle && (
                        <p className="text-xs text-editorial-muted italic truncate">
                          {book.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs font-mono text-editorial-muted">
                        {book.chapters.length} ch. • {words}w
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Quick Folder Assigner */}
                        <div className="relative" title="Assign to folder/category">
                          <select
                            value={book.categoryId || ''}
                            onChange={(e) => handleAssignCategory(book, e.target.value)}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                            title="Assign to folder category"
                          >
                            <option value="none">No Folder</option>
                            {documentCategories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="p-1.5 text-editorial-muted hover:text-editorial-accent rounded transition-colors"
                            title={`Folder: ${book.category || 'Uncategorized'}`}
                          >
                            <FolderPlus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => setSharingBook(book)}
                          className="p-1.5 text-editorial-muted hover:text-editorial-accent rounded transition-colors"
                          title="Share & Collaborate (Google Docs style)"
                        >
                          <Share2 size={14} />
                        </button>

                        <button
                          onClick={() => onDuplicateBook(book)}
                          className="p-1.5 text-editorial-muted hover:text-editorial-text rounded"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>

                        {book.status === 'archived' ? (
                          <button
                            onClick={() => onRestoreBook(book.id)}
                            className="p-1.5 text-editorial-muted hover:text-emerald-700 rounded"
                            title="Restore"
                          >
                            <RotateCcw size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => onArchiveBook(book.id)}
                            className="p-1.5 text-editorial-muted hover:text-editorial-text rounded"
                            title="Archive"
                          >
                            <Archive size={14} />
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteConfirmId(book.id)}
                          className="p-1.5 text-editorial-muted hover:text-red-600 rounded"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          onClick={() => onSelectBook(book.id)}
                          className="px-3 py-1.5 bg-editorial-text text-white hover:bg-black rounded text-xs font-bold uppercase tracking-wider"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TEMPLATES GALLERY VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <FacilityIntro
            title="Curated Blueprints & Templates Facility"
            facilityKey="templates"
            description="Pre-structured document scaffolding built according to authentic genre and pedagogical standards. Every chapter and guidance beat remains 100% editable."
            steps={[
              "Browse blueprints by genre pill (Fiction, Children's, Academic, Science, Policy).",
              "Review the estimated word count and structured section roadmap.",
              "Click 'Use Blueprint' to instantiate an editable manuscript copy immediately."
            ]}
            tip="Templates never lock your content; you can freely add, delete, rename, or reorder any chapter later."
          />

          <div>
            <h1 className="text-3xl font-serif italic font-bold text-editorial-text">
              Curated Blueprint Library
            </h1>
            <p className="text-xs text-editorial-muted mt-1">
              Select an architectural starting blueprint. All chapters, headings, and sections remain 100% editable.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-editorial-divider">
            {templateCategoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setTemplateCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  templateCategory === cat
                    ? 'bg-editorial-text text-white shadow-xs'
                    : 'bg-white border border-editorial-border text-editorial-muted hover:text-editorial-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const demoDoc = books.find(b => b.blueprintId === template.id || b.id === `demo-${template.id}`) || getDemoBookForBlueprint(template.id);

              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-editorial-accent transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-editorial-muted mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="uppercase font-bold tracking-wider bg-editorial-sidebar dark:bg-stone-800 px-2 py-0.5 rounded text-editorial-accent">
                          {template.category}
                        </span>
                        <span className="font-bold text-editorial-muted dark:text-stone-400">{template.complexity}</span>
                      </div>
                      {demoDoc && (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          Demo Available
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif italic font-bold text-lg text-editorial-text dark:text-stone-100 group-hover:text-editorial-accent transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-editorial-muted dark:text-stone-400 mt-2 leading-relaxed">
                      {template.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-editorial-divider dark:border-stone-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-editorial-muted dark:text-stone-400 font-bold block">
                        Includes {template.structure.length} Sections:
                      </span>
                      <ul className="text-xs text-editorial-text dark:text-stone-300 space-y-0.5 list-disc list-inside font-serif italic line-clamp-3">
                        {template.structure.slice(0, 3).map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-editorial-divider dark:border-stone-800 space-y-3">
                    <div className="text-[10px] font-mono text-editorial-muted dark:text-stone-400">
                      Target: {template.estimatedWords}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {demoDoc && (
                        <button
                          onClick={() => {
                            const existing = books.find(b => b.id === demoDoc.id);
                            if (existing) {
                              onSelectBook(existing.id);
                            } else if (onImportBook) {
                              onImportBook(demoDoc);
                            } else {
                              onSelectBook(demoDoc.id);
                            }
                          }}
                          className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          title="Open full interactive demo document for this blueprint"
                        >
                          <Eye size={13} className="text-editorial-accent" />
                          <span>Explore Demo</span>
                        </button>
                      )}

                      <button
                        onClick={() => onCreateBook(template.id)}
                        className="flex-1 py-2 px-3 bg-editorial-accent hover:bg-editorial-accent/90 text-white rounded text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer text-center"
                      >
                        Use Blueprint
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PROJECTS WORKSPACE VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <FacilityIntro
            title="Multi-Document Projects Facility"
            facilityKey="projects"
            description="Bundle connected volumes, teacher guides, student workbooks, and research registers into collaborative programmatic suites."
            steps={[
              "Create a Project to group companion books under one umbrella.",
              "Track multi-volume milestones and cross-volume references.",
              "Open any linked manuscript directly from the project directory."
            ]}
            tip="Ideal for multi-disciplinary initiatives like NEP implementations and school curriculum series."
          />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif italic font-bold text-editorial-text">
                Multi-Document Projects
              </h1>
              <p className="text-xs text-editorial-muted mt-1">
                Combine primary manuscripts, character registers, research notes, and field reports into unified workspaces.
              </p>
            </div>
            <button
              onClick={() => notify('Project creation initialized.', 'info')}
              className="bg-editorial-text text-white hover:bg-black px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
            >
              <FolderPlus size={14} />
              <span>+ New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(proj => {
              const projectBooks = books.filter(b => proj.bookIds.includes(b.id));
              return (
                <div key={proj.id} className="bg-white border border-editorial-border rounded-xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase bg-editorial-sidebar text-editorial-accent px-2 py-0.5 rounded">
                      {proj.category}
                    </span>
                    <span className="text-[10px] font-mono text-editorial-muted">
                      {projectBooks.length} Manuscripts linked
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif italic font-bold text-xl text-editorial-text">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-editorial-muted mt-1 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  {proj.notes && (
                    <div className="bg-editorial-sidebar/30 p-3 rounded border border-editorial-divider text-xs italic font-serif text-editorial-text">
                      "{proj.notes}"
                    </div>
                  )}

                  <div className="pt-3 border-t border-editorial-divider space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-editorial-muted block">
                      Linked Works:
                    </span>
                    <div className="space-y-1.5">
                      {projectBooks.map(pb => (
                        <div
                          key={pb.id}
                          onClick={() => onSelectBook(pb.id)}
                          className="p-2 rounded bg-neutral-50 border border-editorial-border hover:border-editorial-accent cursor-pointer flex items-center justify-between text-xs"
                        >
                          <span className="font-serif font-bold text-editorial-text">{pb.title}</span>
                          <span className="text-[10px] font-mono text-editorial-muted">{pb.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. REFERENCES TAB VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'references' && (
        <div className="space-y-6">
          <FacilityIntro
            title="References & Bibliography Facility"
            facilityKey="references"
            description="A dedicated scholar's database to catalog books, journal articles, websites, and field reports. Generate in-text citation keys or insert them directly."
            steps={[
              "Add sources with author, title, publication year, and publisher.",
              "Copy formatted in-text citations like (Author, Year) with one click.",
              "Link citations seamlessly across chapters during export."
            ]}
            tip="Keep DOI links and URLs handy in the reference notes to maintain authentic traceability."
          />

          <ReferencesManager
            references={allReferences}
            onUpdateReferences={(newRefs) => {
              if (books[0]) {
                onUpdateBook({ ...books[0], references: newRefs });
                notify('References updated.', 'success');
              }
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. USER HANDBOOK & DETAILED GUIDE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'guide' && (
        <DetailedGuide onBack={handleGoBack} />
      )}

      {/* ========================================================================= */}
      {/* 7. SETTINGS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-8 max-w-3xl mx-auto">
          <FacilityIntro
            title="Studio Settings & Data Portability Facility"
            facilityKey="settings"
            description="Configure your default authorial pen name, visual contrast theme, and download full JSON snapshots for offline archiving."
            steps={[
              "Update your default Author Pen Name for new manuscripts.",
              "Switch between Warm Editorial Light Mode and High-Contrast Dark Mode.",
              "Download complete JSON backups of your entire book library."
            ]}
            tip="Downloading an external JSON backup weekly ensures your manuscripts are permanently safeguarded."
          />

          <div>
            <h1 className="text-3xl font-serif italic font-bold text-editorial-text">
              Studio Settings & Preferences
            </h1>
            <p className="text-xs text-editorial-muted mt-1">
              Configure your authorial profile, visual theme, and export backups.
            </p>
          </div>

          <div className="bg-white border border-editorial-border p-6 rounded-xl space-y-4 shadow-xs">
            <h3 className="text-base font-serif italic font-bold text-editorial-text">Author Profile</h3>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                Author Pen Name / Default Moniker
              </label>
              <input
                type="text"
                value={penName}
                onChange={(e) => handleUpdatePenName(e.target.value)}
                className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded px-4 py-2 text-sm font-serif outline-none focus:border-editorial-accent"
              />
              <p className="text-[11px] text-editorial-muted mt-1">
                Used automatically as the primary author for newly generated manuscripts.
              </p>
            </div>
          </div>

          <div className="bg-white border border-editorial-border p-6 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-serif italic font-bold text-editorial-text flex items-center gap-2">
                  <Keyboard size={18} className="text-editorial-accent" />
                  Non-Conflicting Keyboard Shortcuts
                </h3>
                <p className="text-xs text-editorial-muted mt-1 leading-relaxed">
                  Engineered with universal <kbd className="px-1.5 py-0.5 rounded bg-editorial-sidebar border border-editorial-border font-mono text-[11px] font-bold">Alt + [Key]</kbd> combinations that never collide with browser tabs, browser history, or system window shortcuts.
                </p>
              </div>
              <button
                onClick={() => setShowShortcutsModal(true)}
                className="px-4 py-2 bg-editorial-accent hover:bg-editorial-accent/90 text-white rounded font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer shrink-0"
              >
                View Full Cheatsheet
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
              {[
                { key: 'Alt + S', desc: 'Save document immediately' },
                { key: 'Alt + A', desc: 'Toggle AutoSave (Offline friendly)' },
                { key: 'Alt + F', desc: 'Find & Replace word matching' },
                { key: 'Alt + 1 / 2 / 3', desc: 'Apply Heading 1 / 2 / 3' },
                { key: 'Alt + 0', desc: 'Normal body paragraph style' },
                { key: 'Alt + B / I / U', desc: 'Bold, Italic, Underline' },
                { key: 'Alt + M', desc: 'Yellow text highlight' },
                { key: 'Alt + L / C / R / J', desc: 'Left, Center, Right, Balanced Justify' },
                { key: 'Alt + K', desc: 'Open Keyboard Shortcuts modal' }
              ].map((sc, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-editorial-sidebar/30 border border-editorial-border text-xs">
                  <span className="text-editorial-text font-serif">{sc.desc}</span>
                  <kbd className="px-2 py-0.5 rounded bg-white border border-editorial-border text-[11px] font-mono font-bold text-editorial-accent shrink-0">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Key & Legend: Pictorial Guide to Editor Buttons, Formatting Tools & Boxes */}
          <EditorKeyLegend />

          <div className="bg-white border border-editorial-border p-6 rounded-xl space-y-4 shadow-xs">
            <h3 className="text-base font-serif italic font-bold text-editorial-text">Visual Appearance</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-editorial-text">Light & Dark Mode</div>
                <div className="text-[11px] text-editorial-muted">
                  Warm editorial tones for day drafting, high contrast for night concentration.
                </div>
              </div>
              <button
                onClick={onToggleTheme}
                className="px-4 py-2 border border-editorial-border rounded font-bold text-xs uppercase tracking-wider text-editorial-text bg-white hover:bg-neutral-50 shadow-xs cursor-pointer"
              >
                Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-editorial-border p-6 rounded-xl space-y-4 shadow-xs">
            <h3 className="text-base font-serif italic font-bold text-editorial-text">Data Archive & Portability</h3>
            <p className="text-xs text-editorial-muted">
              Download a complete JSON snapshot of all manuscripts, chapters, and references to store on an external drive.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(books, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `book-builder-shaastra-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  notify('Complete library backup downloaded.', 'success');
                }}
                className="px-4 py-2 bg-editorial-text text-white hover:bg-black rounded font-bold text-xs uppercase tracking-wider shadow-xs"
              >
                Download Library Backup (.json)
              </button>
            </div>
          </div>

          <div className="bg-editorial-sidebar/30 border border-editorial-border p-6 rounded-xl space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-editorial-accent">
              Shaastra Ecosystem Readiness
            </h3>
            <p className="text-xs text-editorial-muted leading-relaxed font-serif">
              Book Builder Shaastra includes architectural hooks to bridge documents into <strong>Memory Shaastra</strong> (spaced study cards), <strong>Karya Shaastra</strong> (experiential activity reports), <strong>Edu Shaastra</strong> (institutional curricula), and <strong>Decision Shaastra</strong> (formal policy charters).
            </p>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      {showMediaModal && (
        <MediaLibraryModal
          isOpen={showMediaModal}
          onClose={() => setShowMediaModal(false)}
          assets={allMediaAssets}
          onUpdateAssets={(newAssets) => {
            if (books[0]) {
              onUpdateBook({ ...books[0], assets: newAssets });
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="bg-white border border-editorial-border rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="font-serif italic font-bold text-lg text-editorial-text">
                Delete this book permanently?
              </h3>
            </div>
            <p className="text-xs text-editorial-muted leading-relaxed">
              This action will remove the selected manuscript, all its chapters, and associated metadata. It cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-editorial-muted hover:text-editorial-text"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteBook(deleteConfirmId);
                  setDeleteConfirmId(null);
                  notify('Manuscript permanently deleted.', 'info');
                }}
                className="px-4 py-1.5 bg-red-600 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-red-700 shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Docs-Style Link Sharing & Collaboration Modal */}
      {sharingBook && (
        <ShareModal
          isOpen={!!sharingBook}
          onClose={() => setSharingBook(null)}
          book={sharingBook}
          onUpdateBook={(updated) => {
            onUpdateBook(updated);
            setSharingBook(updated);
          }}
          currentUserName={penName}
          currentUserEmail={currentUser?.email || ''}
        />
      )}

      {/* Category & Folder Manager Modal */}
      {showCategoryModal && (
        <CategoryManagerModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          categories={documentCategories}
          onSaveCategories={handleSaveCategories}
        />
      )}

      {/* Non-Conflicting Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <KeyboardShortcutsModal
          isOpen={showShortcutsModal}
          onClose={() => setShowShortcutsModal(false)}
        />
      )}
    </div>
  );
}
