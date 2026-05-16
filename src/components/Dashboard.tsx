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
  const [showTemplates, setShowTemplates] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'draft' | 'completed' | 'archived'>('all');
  const [userName, setUserName] = useState(localStorage.getItem('micro-book-user-name') || 'Writer');
  const [user, setUser] = useState<User | null>(null);
  const templatesRef = React.useRef<HTMLDivElement>(null);
  const { notify } = useNotification();

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
    setShowTemplates(true);
    // Use a small timeout to let the AnimatePresence start rendering
    setTimeout(() => {
      templatesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const filteredBooks = books.filter(book => filter === 'all' || book.status === filter);

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
        <div className="bg-white border border-editorial-border p-6 rounded text-center lg:text-left">
          <div className="text-[9px] uppercase tracking-widest font-bold text-editorial-accent mb-1">Total Manuscripts</div>
          <div className="text-2xl font-serif italic text-editorial-text">{books.length}</div>
        </div>
        <div className="bg-white border border-editorial-border p-6 rounded text-center lg:text-left">
          <div className="text-[9px] uppercase tracking-widest font-bold text-editorial-accent mb-1">Fragments Drafted</div>
          <div className="text-2xl font-serif italic text-editorial-text">{books.reduce((acc, b) => acc + b.chapters.length, 0)}</div>
        </div>
        <div className="bg-white border border-editorial-border p-6 rounded text-center lg:text-left col-span-2">
          <div className="text-[9px] uppercase tracking-widest font-bold text-editorial-accent mb-1">Studio Status</div>
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
            <div className="text-sm font-serif italic text-editorial-text">Secure & Private Local Session</div>
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

      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-editorial-bg lg:bg-white border border-editorial-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 lg:p-8 border-b border-editorial-divider flex justify-between items-center bg-editorial-sidebar/30">
                <div className="flex items-center gap-4">
                  <button onClick={() => setShowGuide(false)} className="p-2 text-editorial-muted hover:text-editorial-text transition-colors">
                  <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl lg:text-2xl font-serif italic text-editorial-text">The Writer's Handbook</h2>
                </div>
              </div>
              <div className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-8 scrollbar-hide">
                <section>
                  <h3 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-editorial-accent mb-4">Core Philosophy</h3>
                  <p className="text-sm lg:text-sm font-serif italic leading-relaxed text-editorial-text text-left">
                    Micro Book Builder is designed to remove the noise. It is a tool for the deliberate architect, the careful memoirist, and the serious researcher. We provide the structure; you provide the soul.
                  </p>
                </section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 font-sans">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-3 text-left">1. Structure First</h4>
                    <p className="text-xs text-editorial-text leading-relaxed text-left">Establish a formal outline. You can drag and drop chapters to reorder them at any time.</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-3 text-left">2. Focused Writing</h4>
                    <p className="text-xs text-editorial-text leading-relaxed text-left">Enter 'Writing' mode for the editor, or use 'Outline' mode to manage summaries for each fragment.</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-3 text-left">3. Archival Export</h4>
                    <p className="text-xs text-editorial-text leading-relaxed text-left">Once a chapter is 'Validated', it is ready for binding. Export as a high-fidelity PDF manuscript.</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-3 text-left">4. Offline Ready</h4>
                    <p className="text-xs text-editorial-text leading-relaxed text-left">Work is saved locally to your browser session instantly, requiring no internet to write.</p>
                  </div>
                </div>
                <div className="p-4 lg:p-6 bg-editorial-sidebar rounded border border-editorial-border">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-2 text-left">Legal Disclaimer</h4>
                  <p className="text-[10px] text-editorial-accent leading-relaxed text-left">
                    MS Data resides in your browser's local storage. We are not responsible for data loss due to cleared caches. Always export your work frequently as a backup.
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-editorial-divider text-center">
                <button 
                  onClick={() => setShowGuide(false)}
                  className="bg-editorial-text text-white px-8 py-3 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all w-full sm:w-auto"
                >
                  Return to Studio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-6 lg:gap-10 mb-10 lg:mb-12 border-b border-editorial-divider lg:border-none pb-4 lg:pb-0">
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

      <AnimatePresence>
        {showTemplates && (
          <motion.div 
            ref={templatesRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-10 lg:mb-16 bg-editorial-sidebar border border-editorial-border p-6 lg:p-10 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setShowTemplates(false)} 
                  className="p-2 text-editorial-muted hover:text-editorial-text transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <div className="text-[9px] lg:text-[10px] uppercase font-bold tracking-widest text-editorial-accent mb-1 text-left">Architecture</div>
                  <h2 className="text-xl lg:text-2xl font-serif italic text-editorial-text text-left">Select your structure</h2>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onCreateBook(template.id);
                    setShowTemplates(false);
                  }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 lg:py-32 bg-editorial-sidebar border border-dashed border-editorial-border rounded p-6">
          <BookIcon className="mx-auto text-editorial-muted mb-6" size={40} />
          <h3 className="text-xl lg:text-2xl font-serif italic text-editorial-text mb-2">No manuscripts found</h3>
          <p className="text-[13px] lg:text-editorial-accent max-w-sm mx-auto font-serif italic leading-relaxed">Begin your journey by establishing the architecture of your next book.</p>
          <button 
            onClick={() => setShowTemplates(true)}
            className="mt-8 lg:mt-10 px-8 py-3 bg-editorial-text text-white text-[10px] font-bold tracking-widest uppercase rounded hover:bg-black transition-all w-full sm:w-auto shadow-sm"
          >
            Draft a New Concept
          </button>
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
    </div>
  );
}
