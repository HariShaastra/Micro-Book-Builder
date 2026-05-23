/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, TEMPLATES, Template } from '../types.ts';
import * as LucideIcons from 'lucide-react';
import { Plus, Book as BookIcon, Trash2, Clock, FileText, LayoutGrid, List, Library, HelpCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from '../lib/utils.ts';
import Logo from './Logo.tsx';

import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User } from '../lib/firebase.ts';
import { useNotification } from '../contexts/NotificationContext';

interface DashboardProps {
  books: Book[];
  onCreateBook: (templateId: string) => void;
  onSelectBook: (id: string) => void;
  onDeleteBook: (id: string) => void;
}

const TemplateIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name] || BookIcon;
  return <Icon className={className} size={24} />;
};

export default function Dashboard({ books, onCreateBook, onSelectBook, onDeleteBook }: DashboardProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'draft' | 'completed' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [templateViewMode, setTemplateViewMode] = useState<'grid' | 'list'>('grid');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [userName, setUserName] = useState(localStorage.getItem('micro-book-user-name') || 'Writer');
  const [user, setUser] = useState<User | null>(null);
  const [handbookTab, setHandbookTab] = useState<'intro' | 'writing' | 'outline' | 'structure' | 'assets' | 'export'>('intro');
  const templatesRef = React.useRef<HTMLDivElement>(null);
  const { notify } = useNotification();

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

  const handleNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % TIPS.length);
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.displayName && !localStorage.getItem('micro-book-user-name')) {
        setUserName(u.displayName);
        localStorage.setItem('micro-book-user-name', u.displayName);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      notify('Welcome back to the studio.', 'success');
    } catch (error) {
      notify('Failed to authenticate.', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      notify('Signed out successfully.', 'info');
    } catch (error) {
      notify('Logout failed.', 'error');
    }
  };

  React.useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem('micro-book-user-name') || 'Writer');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleStartWriting = () => {
    templatesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filteredBooks = books.filter(book => {
    const matchesFilter = filter === 'all' || book.status === filter;
    const matchesSearch = searchQuery.trim() === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filteredTemplates = TEMPLATES.filter(template => {
    return templateSearchQuery.trim() === '' ||
      template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(templateSearchQuery.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 lg:py-16 bg-editorial-bg min-h-screen">
      <header className="mb-12 lg:mb-20">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-10">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:gap-10">
            <Logo className="scale-110 lg:scale-150 lg:origin-left" />
            <div className="space-y-2">
              <div className="text-[9px] lg:text-[10px] uppercase tracking-ultra-editorial font-bold text-editorial-accent">The Archive</div>
              <h1 className="text-4xl lg:text-5xl font-serif italic font-semibold text-editorial-text leading-tight">Welcome, {userName}</h1>
              <p className="text-sm lg:text-base font-serif italic text-editorial-accent max-w-md">"A quiet space for your deliberate work."</p>
            </div>
            {user ? (
               <div className="flex items-center gap-4 bg-white border border-editorial-divider p-2 pr-4 rounded-full shadow-sm">
                 <img src={user.photoURL || ''} className="w-8 h-8 rounded-full border border-editorial-border" alt="Profile" />
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-editorial-text leading-tight">{user.displayName}</span>
                   <button onClick={handleLogout} className="text-[8px] font-bold uppercase tracking-widest text-editorial-muted hover:text-red-500 text-left">Sign Out</button>
                 </div>
               </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent border border-editorial-divider px-4 py-2 rounded hover:border-editorial-text hover:text-editorial-text transition-all"
              >
                Sync with Google Account (Optional)
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <button 
              onClick={handleStartWriting}
              className="w-full sm:w-auto bg-editorial-text text-white px-12 py-6 rounded text-sm font-bold tracking-[0.2em] uppercase hover:bg-black transition-all shadow-2xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 flex items-center justify-center gap-4 active:scale-95 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
              Start Writing
            </button>
            <button 
              onClick={() => setShowGuide(true)}
              className="p-3 text-editorial-muted hover:text-editorial-text transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-editorial-divider rounded hover:border-editorial-text"
            >
              <HelpCircle size={18} />
              The Handbook
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 lg:mb-16">
        <div className="bg-white border border-editorial-border p-6 rounded text-center lg:text-left transition-all hover:border-editorial-text duration-300">
          <div className="text-[9px] uppercase tracking-widest font-bold text-editorial-accent mb-1">Total Manuscripts</div>
          <div className="text-2xl font-serif italic text-editorial-text">{books.length}</div>
        </div>
        <div className="bg-white border border-editorial-border p-6 rounded text-center lg:text-left transition-all hover:border-editorial-text duration-300">
          <div className="text-[9px] uppercase tracking-widest font-bold text-editorial-accent mb-1">Fragments Drafted</div>
          <div className="text-2xl font-serif italic text-editorial-text">{books.reduce((acc, b) => acc + b.chapters.length, 0)}</div>
        </div>
        <div className="bg-white border border-editorial-border p-6 rounded text-left col-span-2 flex flex-col justify-between min-h-[140px] transition-all hover:border-editorial-text duration-300 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] uppercase tracking-widest font-bold text-editorial-accent">The Archivist's Reflections</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
                <span className="text-[8px] font-mono tracking-widest text-editorial-muted uppercase font-bold">Studio Active</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-serif italic text-editorial-text leading-relaxed">
              "{TIPS[currentTip]}"
            </p>
          </div>
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-editorial-divider/70">
            <span className="text-[8px] font-mono font-bold tracking-widest text-editorial-muted uppercase">Your reflective writing mentor</span>
            <button 
              onClick={handleNextTip}
              className="text-[9px] font-bold uppercase tracking-widest text-editorial-text hover:underline transition-all"
            >
              Next Thought &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Non-AI Disclaimer Banner */}
      <div className="mb-10 lg:mb-12 p-5 lg:p-6 bg-editorial-sidebar/30 border border-editorial-border rounded flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white border border-editorial-border rounded-full text-emerald-600 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-editorial-text text-left">Integrity Guarantee</h4>
            <p className="text-[10px] lg:text-[11px] text-editorial-accent font-serif italic mt-0.5 text-left leading-snug lg:leading-relaxed">Micro Book Builder is 100% human-driven. No AI writing, suggestions, or auto-generation is present in this studio.</p>
          </div>
        </div>
        <div className="w-full sm:w-auto text-[9px] font-mono font-bold text-editorial-muted uppercase tracking-widest border border-editorial-divider px-3 py-1 rounded text-center sm:text-left">
          Pure Studio Mode
        </div>
      </div>

      {/* Layman Quick start guide section */}
      <div className="mb-12 p-6 lg:p-8 bg-white border border-editorial-border rounded-lg text-left shadow-sm">
        <div className="border-b border-editorial-divider pb-4 mb-6">
          <span className="text-[9px] uppercase tracking-ultra-editorial font-bold text-editorial-accent">Layman's Quick-Start Portal</span>
          <h2 className="text-xl lg:text-2xl font-serif italic font-medium text-editorial-text mt-1">What is Micro Book Builder?</h2>
          <p className="text-xs text-editorial-accent font-serif italic mt-2 leading-relaxed">
            Micro Book Builder is a serene, private typewriter app that lets you write and publish books without distracting tools or automated AI clutter. Your thoughts are kept 100% secure in your browser.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-editorial-sidebar border border-editorial-border text-xs font-mono font-bold flex items-center justify-center text-editorial-text">1</span>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-text">Adopt a Structure</h4>
            </div>
            <p className="text-xs text-editorial-accent leading-relaxed font-serif italic">
              Scroll to the <strong>Architecture</strong> section, find a blueprint that matches (e.g., Short Story, Novel, or blank pad), and click it to establish the draft vault.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-editorial-sidebar border border-editorial-border text-xs font-mono font-bold flex items-center justify-center text-editorial-text">2</span>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-text">Add & Write Sections</h4>
            </div>
            <p className="text-xs text-editorial-accent leading-relaxed font-serif italic">
              Click your draft card to enter. Click <strong>Add Chapter</strong> to grow your index, drag chapters to reorder them, and type text as auto-save stores each character instantly.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-editorial-sidebar border border-editorial-border text-xs font-mono font-bold flex items-center justify-center text-editorial-text">3</span>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-text">Storyboard & Export</h4>
            </div>
            <p className="text-xs text-editorial-accent leading-relaxed font-serif italic">
              Map out character summaries in <strong>Outline</strong>, link research charts in <strong>Assets</strong>, and hit <strong>Export</strong> to instantly print your work as a publication-ready PDF.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border border-editorial-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Left Column Tabs Sidebar */}
              <div className="w-full md:w-64 bg-editorial-sidebar border-b md:border-b-0 md:border-r border-editorial-divider flex flex-col shrink-0">
                <div className="p-5 border-b border-editorial-divider flex justify-between items-center bg-white/40">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={18} className="text-editorial-text" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-editorial-text">Handbooks & Guides</span>
                  </div>
                  <button onClick={() => setShowGuide(false)} className="md:hidden p-1 text-editorial-muted hover:text-editorial-text transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                </div>
                <div className="flex md:flex-col p-2 gap-1 overflow-x-auto md:overflow-x-visible scrollbar-hide">
                  {[
                    { id: 'intro', label: 'Overview & Home', icon: 'Home' },
                    { id: 'writing', label: 'Writing room', icon: 'FileText' },
                    { id: 'outline', label: 'Storyboard Plan', icon: 'Layers' },
                    { id: 'structure', label: 'Book blueprint', icon: 'BookOpen' },
                    { id: 'assets', label: 'Cabinet Assets', icon: 'Paperclip' },
                    { id: 'export', label: 'PDF print', icon: 'Download' },
                  ].map((tab) => {
                    const Icon = (LucideIcons as any)[tab.icon] || HelpCircle;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setHandbookTab(tab.id as any)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded text-left text-[10px] font-bold uppercase tracking-widest whitespace-nowrap md:whitespace-normal transition-all shrink-0 w-auto md:w-full",
                          handbookTab === tab.id 
                            ? "bg-editorial-text text-white shadow-sm" 
                            : "text-editorial-muted hover:text-editorial-text hover:bg-white/50"
                        )}
                      >
                        <Icon size={14} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <div className="hidden md:block p-5 mt-auto border-t border-editorial-divider bg-white/10 text-center">
                  <div className="text-[8px] font-mono uppercase tracking-widest text-editorial-accent">Micro Book Studio v1.2</div>
                </div>
              </div>

              {/* Right Column Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                <div className="p-6 border-b border-editorial-divider flex justify-between items-center bg-editorial-sidebar/10">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-editorial-accent">
                    {handbookTab === 'intro' && "01 // Studio Welcome & Home"}
                    {handbookTab === 'writing' && "02 // Distraction-Free Typewriter"}
                    {handbookTab === 'outline' && "03 // Scene & Storyboard Planner"}
                    {handbookTab === 'structure' && "04 // Project Blueprint Register"}
                    {handbookTab === 'assets' && "05 // Research Locker & Assets"}
                    {handbookTab === 'export' && "06 // High-Fidelity Binder"}
                  </h3>
                  <button 
                    onClick={() => setShowGuide(false)} 
                    className="hidden md:flex items-center gap-2 text-editorial-muted hover:text-editorial-text transition-colors text-[10px] font-bold uppercase tracking-widest"
                  >
                    <ArrowLeft size={14} />
                    Return to Studio
                  </button>
                </div>

                <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto space-y-6 scrollbar-hide text-left">
                  {handbookTab === 'intro' && (
                    <div className="space-y-6 font-sans">
                      <div>
                        <h4 className="text-xl lg:text-2xl font-serif italic text-editorial-text mb-2 text-left">What is Micro Book Builder?</h4>
                        <p className="text-xs text-editorial-muted leading-relaxed font-serif italic">
                          A peaceful and beautiful digital studio designed specifically for novelists, researchers, memoirists, and essayists. This workspace strips away the noise of bloated text processors so your story can flow naturally.
                        </p>
                      </div>
                      <div className="p-4 bg-editorial-sidebar rounded border border-editorial-border">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent block mb-1">What does this page do?</span>
                        <p className="text-xs text-editorial-text leading-relaxed">
                          The <strong>Archive Home screen</strong> serves as your master catalog. Inside, you can see real-time statistics of your active writings, customize your profile, filter your drafts, and explore new architectural layouts to boot up a fresh project.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent text-left">How to build a book in 3 steps:</h5>
                        <div className="space-y-3 font-sans">
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">1</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Select an Architecture:</strong> Scroll down to the structural template grid. Choose the blueprint format that fits your vision (such as a <em>Short Story</em> structure, a <em>Multi-Chapter Novel</em> outline, or a blank <em>Scratchpad</em>). Click it to draft immediately.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">2</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Enter the Studio Workspace:</strong> A newly generated book card will appear in your archive grid. Click anywhere on the card to open the complete manuscript.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">3</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Save & Synced Access:</strong> All your changes are auto-saved to your personal browser instantly, allowing fully offline drafting. (Optional: Use Google Login at the top to securely sync across devices).
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {handbookTab === 'writing' && (
                    <div className="space-y-6 font-sans">
                      <div>
                        <h4 className="text-xl lg:text-2xl font-serif italic text-editorial-text mb-2 text-left">The Writing Room</h4>
                        <p className="text-xs text-editorial-muted leading-relaxed font-serif italic">
                          A high-contrast distraction-free digital typewriter where you draft your book section-by-section.
                        </p>
                      </div>
                      <div className="p-4 bg-editorial-sidebar rounded border border-editorial-border">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent block mb-1">What does this page do?</span>
                        <p className="text-xs text-editorial-text leading-relaxed">
                          This is the centerpiece edit view. It holds an interactive sidebar of chapters and a sleek central typewriter sheet. It shows live word-counts, scroll percentage, and estimated read times at the bottom.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent text-left">Step-by-Step Writing Guide:</h5>
                        <div className="space-y-3 font-sans">
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">1</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Arrange Your Storyboard:</strong> Click <strong>Add Chapter</strong> in the left drawer to expand the manuscript. Drag any chapter up or down by holding its side grabber to customize the sequence.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">2</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Establish Chapter Identities:</strong> Click on the large headline placeholder at the top of the white typing page (e.g., <em>"Chapter One"</em>) and type your specific chapter title.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">3</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Draft Core Sentences:</strong> Write your prose directly onto the page. Every keystroke is immediately persisted. You can toggle favorites or starry icons on the chapter list to highlight critical plot points.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {handbookTab === 'outline' && (
                    <div className="space-y-6 font-sans">
                      <div>
                        <h4 className="text-xl lg:text-2xl font-serif italic text-editorial-text mb-2 text-left">The Storyboard Planner</h4>
                        <p className="text-xs text-editorial-muted leading-relaxed font-serif italic">
                          A structural plotting board to lay out narratives, plot arcs, and side summaries.
                        </p>
                      </div>
                      <div className="p-4 bg-editorial-sidebar rounded border border-editorial-border">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent block mb-1">What does this page do?</span>
                        <p className="text-xs text-editorial-text leading-relaxed">
                          This screen lets you write behind-the-scenes summary outlines for each individual chapter to plan out the book's pacing and structural direction.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent text-left">Step-by-Step Outlining:</h5>
                        <div className="space-y-3 font-sans">
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">1</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Access Storyboards:</strong> Inside the Editor, tap <strong>Outline</strong> in the top-center tab navigation menu.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">2</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Draft Plot Beats:</strong> Type planned scenarios, research facts, or target events into each chapter card's outline text box.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">3</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Connect Drafts:</strong> Click key outline boxes. The studio will focus that chapter instantly, letting you jump from big-picture planning back to granular writing.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {handbookTab === 'structure' && (
                    <div className="space-y-6 font-sans">
                      <div>
                        <h4 className="text-xl lg:text-2xl font-serif italic text-editorial-text mb-2 text-left">The Project Registry Blueprint</h4>
                        <p className="text-xs text-editorial-muted leading-relaxed font-serif italic">
                          The control ledger detailing formal book definitions, titles, visual designs, and archive notes.
                        </p>
                      </div>
                      <div className="p-4 bg-editorial-sidebar rounded border border-editorial-border">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent block mb-1">What does this page do?</span>
                        <p className="text-xs text-editorial-text leading-relaxed">
                          This configuration section is the administrative card of your book. Use it to upload visual draft covers, edit details, and track timeline logs.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent text-left">Step-by-Step Structuring:</h5>
                        <div className="space-y-3 font-sans">
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">1</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Access Configuration:</strong> Inside the Editor, tap <strong>Structure</strong> in the top-center tab navigation menu.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">2</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Format Title Pages & Covers:</strong> Write your formal book title and high-level synopsis/thesis, and upload an exquisite front cover image to style your draft.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">3</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Toggle Archive Status & Notes:</strong> Set categories (Live Draft, Stored in Archive, or Completed) and write overall archivist's research parameters or editorial milestones.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {handbookTab === 'assets' && (
                    <div className="space-y-6 font-sans">
                      <div>
                        <h4 className="text-xl lg:text-2xl font-serif italic text-editorial-text mb-2 text-left">The Resource Repository</h4>
                        <p className="text-xs text-editorial-muted leading-relaxed font-serif italic">
                          A private file cabinet to secure photos, character boards, datasets, or reference docs for your manuscript.
                        </p>
                      </div>
                      <div className="p-4 bg-editorial-sidebar rounded border border-editorial-border">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent block mb-1">What does this page do?</span>
                        <p className="text-xs text-editorial-text leading-relaxed">
                          This keeps research assets and design boards tied directly to your book's master database file, making sure you never lose track of source papers or references.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent text-left">Step-by-Step Asset Management:</h5>
                        <div className="space-y-3 font-sans">
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">1</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Access Attachments:</strong> Inside the Editor, tap <strong>Assets</strong> in the top-center tab navigation menu.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">2</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Attach Critical Data:</strong> Press <strong>Attach Asset</strong> on the top right. Select reference images, sketches, or prompt lists from your computer to bind them securely to the workspace.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">3</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Download & Discard:</strong> Click <strong>Download</strong> on any asset card to save it back to any device, or tap the Trash can to delete expired logs.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {handbookTab === 'export' && (
                    <div className="space-y-6 font-sans">
                      <div>
                        <h4 className="text-xl lg:text-2xl font-serif italic text-editorial-text mb-2 text-left">Archival Publishing & PDF Export</h4>
                        <p className="text-xs text-editorial-muted leading-relaxed font-serif italic">
                          A high-fidelity manuscript compilation engine that binds separate fragment files into one cohesive file.
                        </p>
                      </div>
                      <div className="p-4 bg-editorial-sidebar rounded border border-editorial-border">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent block mb-1">What does this page do?</span>
                        <p className="text-xs text-editorial-text leading-relaxed">
                          This compiler ties together your separate chapters, formats proper spacing, and outputs raw, elegant archival-grade files ready to post, print, or email to publishers.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent text-left">Step-by-Step Publishing:</h5>
                        <div className="space-y-3 font-sans">
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">1</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Launch Book Binder:</strong> Click the black <strong>Export</strong> button on the top-right of the editor workspace header.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">2</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Customize Document Structure:</strong> Toggle inclusion for a gorgeous <strong>Title cover sheet</strong> or an auto-computed interactive <strong>Directory (Table of Contents)</strong>.
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-editorial-sidebar border border-editorial-border text-[10px] font-mono font-bold flex items-center justify-center text-editorial-text shrink-0">3</span>
                            <div className="text-xs text-editorial-text leading-relaxed">
                              <strong>Build Manuscript:</strong> Tap <strong>Generate Manuscript</strong>. The app automatically compiles and downloads a beautifully set PDF document in seconds.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-editorial-divider text-right bg-editorial-sidebar/10 flex justify-between items-center">
                  <p className="text-[10px] text-editorial-accent italic font-serif">100% Secure Local Sandbox Drafting</p>
                  <button 
                    onClick={() => setShowGuide(false)}
                    className="bg-editorial-text text-white px-6 py-2.5 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all"
                  >
                    Return to Studio
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 lg:mb-12 border-b border-editorial-divider pb-4">
        {/* Filter categories */}
        <div className="flex flex-wrap gap-6 lg:gap-8">
          {(['all', 'draft', 'completed', 'archived'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-all relative pb-2",
                filter === f ? "text-editorial-text" : "text-editorial-muted hover:text-editorial-accent"
              )}
            >
              {f}
              {filter === f && (
                <motion.div 
                  layoutId="activeFilter"
                  className="absolute bottom-0 left-0 right-0 h-px bg-editorial-text"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Search & View Toggles for User Writing Assignments */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search manuscripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 bg-white border border-editorial-border rounded px-3 py-1.5 pl-8 text-xs font-serif italic focus:ring-1 focus:ring-editorial-text focus:border-editorial-text outline-none text-editorial-text transition-all shadow-inner"
            />
            <LucideIcons.Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted pointer-events-none" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-editorial-muted hover:text-editorial-text"
                title="Clear search"
              >
                <LucideIcons.X size={12} />
              </button>
            )}
          </div>

          {/* Grid / Line View Selector */}
          <div className="flex items-center border border-editorial-border rounded bg-white p-0.5 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded transition-all",
                viewMode === 'grid' 
                  ? "bg-editorial-sidebar text-editorial-text" 
                  : "text-editorial-muted hover:text-editorial-accent"
              )}
              title="Grid view"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded transition-all",
                viewMode === 'list' 
                  ? "bg-editorial-sidebar text-editorial-text" 
                  : "text-editorial-muted hover:text-editorial-accent"
              )}
              title="Line view"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 lg:py-32 bg-editorial-sidebar border border-dashed border-editorial-border rounded p-6">
          <BookIcon className="mx-auto text-editorial-muted mb-6" size={40} />
          {searchQuery ? (
            <>
              <h3 className="text-xl lg:text-2xl font-serif italic text-editorial-text mb-2">No matching manuscripts</h3>
              <p className="text-[13px] text-editorial-accent max-w-sm mx-auto font-serif italic leading-relaxed">No drafts match your search query "{searchQuery}". Try a different keyword.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-8 lg:mt-10 px-8 py-3 bg-editorial-text text-white text-[10px] font-bold tracking-widest uppercase rounded hover:bg-black transition-all w-full sm:w-auto shadow-sm"
              >
                Clear Search Filter
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl lg:text-2xl font-serif italic text-editorial-text mb-2">No manuscripts found</h3>
              <p className="text-[13px] text-editorial-accent max-w-sm mx-auto font-serif italic leading-relaxed">Begin your journey by establishing the architecture of your next book.</p>
              <button 
                onClick={handleStartWriting}
                className="mt-8 lg:mt-10 px-8 py-3 bg-editorial-text text-white text-[10px] font-bold tracking-widest uppercase rounded hover:bg-black transition-all w-full sm:w-auto shadow-sm"
              >
                Draft a New Concept
              </button>
            </>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredBooks.map((book) => (
            <motion.div
              layout
              key={book.id}
              className="group bg-white rounded border border-editorial-border overflow-hidden hover:shadow-xl hover:border-editorial-text transition-all duration-500"
            >
              <div 
                className="p-6 lg:p-8 cursor-pointer h-full flex flex-col"
                onClick={() => onSelectBook(book.id)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="text-[9px] lg:text-[10px] tracking-widest uppercase font-bold text-editorial-muted flex items-center gap-2">
                    <Clock size={12} />
                    {formatDate(book.updatedAt)}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBook(book.id);
                    }}
                    className="md:opacity-0 group-hover:opacity-100 text-editorial-muted hover:text-red-500 transition-all p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="text-xl lg:text-2xl font-serif italic font-semibold mb-3 lg:mb-4 text-editorial-text group-hover:text-black line-clamp-2 leading-tight text-left">{book.title}</h3>
                <p className="text-editorial-accent font-serif text-sm lg:text-[15px] italic leading-relaxed mb-6 lg:mb-8 line-clamp-3 lg:line-clamp-4 flex-1 text-left">
                  {book.description || 'Manuscript details pending. Begin the formal structuring process.'}
                </p>
                <div className="flex items-center justify-between text-[10px] lg:text-[11px] font-bold tracking-[0.12em] lg:tracking-[0.15em] uppercase text-editorial-muted border-t border-editorial-divider pt-5 lg:pt-6">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-editorial-accent" />
                    {book.chapters.length} Sections
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-sm",
                      book.status === 'draft' ? "bg-amber-400" : "bg-emerald-500"
                    )} />
                    {book.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-editorial-border overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-editorial-divider bg-editorial-sidebar/30">
                <th className="px-6 py-4 text-[10px] lg:text-[11px] font-bold text-editorial-muted uppercase tracking-widest">Book Title</th>
                <th className="px-6 py-4 text-[10px] lg:text-[11px] font-bold text-editorial-muted uppercase tracking-widest">Sections</th>
                <th className="px-6 py-4 text-[10px] lg:text-[11px] font-bold text-editorial-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] lg:text-[11px] font-bold text-editorial-muted uppercase tracking-widest">Modified</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-editorial-divider">
              {filteredBooks.map((book) => (
                <tr 
                  key={book.id} 
                  className="hover:bg-editorial-sidebar/20 cursor-pointer transition-colors"
                  onClick={() => onSelectBook(book.id)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-serif italic text-editorial-text">{book.title}</div>
                    <div className="text-[10px] lg:text-[11px] text-editorial-accent truncate max-w-xs">{book.description || 'No description established.'}</div>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-mono font-bold text-editorial-muted">{book.chapters.length}</td>
                  <td className="px-6 py-4">
                   <div className="flex items-center gap-1.5 capitalize text-[10px] font-bold tracking-widest">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      book.status === 'draft' ? "bg-amber-400" : "bg-emerald-400"
                    )} />
                    {book.status}
                  </div>
                  </td>
                  <td className="px-6 py-4 text-[10px] lg:text-[11px] text-editorial-accent">{formatDate(book.updatedAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBook(book.id);
                      }}
                      className="text-editorial-muted hover:text-red-500 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Architecture selection panel now rendered beautifully at the bottom of the home page */}
      <div 
        ref={templatesRef}
        className="mt-16 lg:mt-24 mb-10 lg:mb-16 bg-editorial-sidebar border border-editorial-border p-6 lg:p-10 rounded-lg shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 lg:mb-8 border-b border-editorial-divider pb-4">
          <div>
            <div className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest text-editorial-accent mb-1 text-left">Architecture</div>
            <h2 className="text-xl lg:text-2xl font-serif italic text-editorial-text text-left font-medium">Select your structure</h2>
          </div>

          {/* Search & View Toggles for Architecture Options (Templates) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search blueprints..."
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                className="w-full sm:w-60 bg-white border border-editorial-border rounded px-3 py-1.5 pl-8 text-xs font-serif italic focus:ring-1 focus:ring-editorial-text focus:border-editorial-text outline-none text-editorial-text transition-all shadow-inner"
              />
              <LucideIcons.Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted pointer-events-none" />
              {templateSearchQuery && (
                <button 
                  onClick={() => setTemplateSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-editorial-muted hover:text-editorial-text"
                  title="Clear search"
                >
                  <LucideIcons.X size={12} />
                </button>
              )}
            </div>

            {/* Grid / Line View Selector */}
            <div className="flex items-center border border-editorial-border rounded bg-white p-0.5 self-end sm:self-auto">
              <button
                onClick={() => setTemplateViewMode('grid')}
                className={cn(
                  "p-1.5 rounded transition-all",
                  templateViewMode === 'grid' 
                    ? "bg-editorial-sidebar text-editorial-text" 
                    : "text-editorial-muted hover:text-editorial-accent"
                )}
                title="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setTemplateViewMode('list')}
                className={cn(
                  "p-1.5 rounded transition-all",
                  templateViewMode === 'list' 
                    ? "bg-editorial-sidebar text-editorial-text" 
                    : "text-editorial-muted hover:text-editorial-accent"
                )}
                title="Line view"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-editorial-border rounded p-6">
            <LucideIcons.Search className="mx-auto text-editorial-muted mb-4" size={32} />
            <p className="text-sm font-serif italic text-editorial-text mb-2">No architectures found matching "{templateSearchQuery}"</p>
            <button 
              onClick={() => setTemplateSearchQuery('')}
              className="mt-4 px-4 py-2 bg-editorial-text text-white text-[9px] font-bold tracking-widest uppercase rounded hover:bg-black transition-all"
            >
              Clear Architecture Search
            </button>
          </div>
        ) : templateViewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onCreateBook(template.id)}
                className="group text-left p-6 lg:p-8 bg-white border border-editorial-border rounded hover:border-editorial-text hover:shadow-md transition-all duration-300"
              >
                <div className="mb-6 inline-flex items-center justify-center p-3 lg:p-4 rounded bg-editorial-sidebar border border-editorial-border group-hover:border-editorial-text group-hover:bg-white transition-colors">
                  <TemplateIcon name={template.icon} className="text-editorial-accent group-hover:text-editorial-text" />
                </div>
                <h3 className="text-base lg:text-lg font-serif italic font-semibold mb-2 group-hover:text-editorial-text text-left">{template.name}</h3>
                <p className="text-[11px] lg:text-xs text-editorial-accent leading-relaxed line-clamp-2 group-hover:text-editorial-text transition-colors text-left font-serif italic">{template.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded border border-editorial-border overflow-hidden divide-y divide-editorial-divider">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onCreateBook(template.id)}
                className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-editorial-sidebar/30 group transition-all duration-300"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 sm:p-3 rounded bg-editorial-sidebar border border-editorial-border group-hover:bg-white group-hover:border-editorial-text transition-colors shrink-0">
                    <TemplateIcon name={template.icon} className="text-editorial-accent group-hover:text-editorial-text" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-serif italic font-semibold text-editorial-text group-hover:text-black transition-colors">{template.name}</h3>
                    <p className="text-[11px] sm:text-xs text-editorial-accent leading-relaxed font-serif italic group-hover:text-editorial-text transition-colors">{template.description}</p>
                  </div>
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-editorial-muted group-hover:text-editorial-text transition-colors flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  Select Blueprint
                  <LucideIcons.ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
