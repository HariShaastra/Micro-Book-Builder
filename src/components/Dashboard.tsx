/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, TEMPLATES, Template } from '../types.ts';
import * as LucideIcons from 'lucide-react';
import { Plus, Book as BookIcon, Trash2, Clock, FileText, LayoutGrid, List, Library, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from '../lib/utils.ts';
import Logo from './Logo.tsx';

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

  const filteredBooks = books.filter(book => filter === 'all' || book.status === filter);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 bg-editorial-bg min-h-screen">
      <header className="mb-16 flex justify-between items-end border-b border-editorial-border pb-8">
        <div className="flex items-center gap-12">
          <Logo className="scale-125 origin-left" />
          <div className="w-px h-16 bg-editorial-divider" />
          <div>
            <div className="text-[10px] uppercase tracking-ultra-editorial font-bold text-editorial-accent mb-2">The Archive</div>
            <h1 className="text-4xl font-serif italic font-semibold text-editorial-text leading-tight">My Studio</h1>
          </div>
        </div>
        <div className="flex gap-4 items-center">
           <button 
              onClick={() => setShowGuide(true)}
              className="p-2 text-editorial-muted hover:text-editorial-text transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
           >
             <HelpCircle size={16} />
             Guide
           </button>
           <div className="bg-editorial-sidebar rounded border border-editorial-border p-1 flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded transition-colors", viewMode === 'grid' ? "bg-white text-editorial-text shadow-sm" : "text-editorial-muted hover:text-editorial-accent")}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded transition-colors", viewMode === 'list' ? "bg-white text-editorial-text shadow-sm" : "text-editorial-muted hover:text-editorial-accent")}
            >
              <List size={16} />
            </button>
          </div>
          <button 
            onClick={() => setShowTemplates(true)}
            className="bg-editorial-text text-white px-6 py-3 rounded text-xs font-bold tracking-widest uppercase hover:bg-black transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      </header>

      {/* Non-AI Disclaimer Banner */}
      <div className="mb-12 p-6 bg-editorial-sidebar/30 border border-editorial-border rounded flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white border border-editorial-border rounded-full text-emerald-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-editorial-text">Integrity Guarantee</h4>
            <p className="text-[11px] text-editorial-accent font-serif italic mt-0.5">Micro Book Builder is 100% human-driven. No AI writing, suggestions, or auto-generation is present in this studio.</p>
          </div>
        </div>
        <div className="text-[9px] font-mono font-bold text-editorial-muted uppercase tracking-widest border border-editorial-divider px-2 py-1 rounded">
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
              className="bg-white border border-editorial-border rounded max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-editorial-divider flex justify-between items-center bg-editorial-sidebar/30">
                <h2 className="text-2xl font-serif italic text-editorial-text">The Writer's Handbook</h2>
                <button onClick={() => setShowGuide(false)} className="text-editorial-accent hover:text-editorial-text">
                  <LucideIcons.X size={20} />
                </button>
              </div>
              <div className="p-10 overflow-y-auto space-y-8 max-h-[60vh] scrollbar-hide">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-editorial-accent mb-4">Core Philosophy</h3>
                  <p className="text-sm font-serif italic leading-relaxed text-editorial-text">
                    Micro Book Builder is designed to remove the noise. It is a tool for the deliberate architect, the careful memoirist, and the serious researcher. We provide the structure; you provide the soul.
                  </p>
                </section>
                <div className="grid grid-cols-2 gap-8 font-sans">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-3">1. Structure First</h4>
                    <p className="text-xs text-editorial-text leading-relaxed">Use templates to establish a formal outline. You can drag and drop chapters to reorder them at any time.</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-3">2. Focused Writing</h4>
                    <p className="text-xs text-editorial-text leading-relaxed">Enter 'Writing' mode for the editor, or use 'Outline' mode to manage summaries for each fragment.</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-3">3. Archival Export</h4>
                    <p className="text-xs text-editorial-text leading-relaxed">Once a chapter is marked as 'Validated', it is ready for the final binding. Export as a high-fidelity PDF manuscript.</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-3">4. Offline Ready</h4>
                    <p className="text-xs text-editorial-text leading-relaxed">The studio operates locally. Your work is saved to your browser session instantly, requiring no internet to write.</p>
                  </div>
                </div>
                <div className="p-6 bg-editorial-sidebar rounded border border-editorial-border">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-editorial-accent mb-2">Legal Disclaimer</h4>
                  <p className="text-[10px] text-editorial-accent leading-relaxed">
                    Micro Book Builder does not store your manuscripts on a central server. All data resides in your browser's local storage. We are not responsible for data loss due to cleared caches or lost devices. Always export your work frequently as a backup.
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-editorial-divider text-center">
                <button 
                  onClick={() => setShowGuide(false)}
                  className="bg-editorial-text text-white px-8 py-3 rounded text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all"
                >
                  Return to Studio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-10 mb-12">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-16 bg-editorial-sidebar border border-editorial-border p-10 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-editorial-accent mb-1">Architecture</div>
                <h2 className="text-2xl font-serif italic text-editorial-text">Select your structure</h2>
              </div>
              <button onClick={() => setShowTemplates(false)} className="text-editorial-muted hover:text-editorial-text transition-colors uppercase text-[10px] font-bold tracking-widest">Close</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onCreateBook(template.id);
                    setShowTemplates(false);
                  }}
                  className="group text-left p-8 bg-white border border-editorial-border rounded hover:border-editorial-text hover:shadow-md transition-all duration-300"
                >
                  <div className="mb-6 inline-flex items-center justify-center p-4 rounded bg-editorial-sidebar border border-editorial-border group-hover:border-editorial-text group-hover:bg-white transition-colors">
                    <TemplateIcon name={template.icon} className="text-editorial-accent group-hover:text-editorial-text" />
                  </div>
                  <h3 className="text-lg font-serif italic font-semibold mb-2 group-hover:text-editorial-text">{template.name}</h3>
                  <p className="text-xs text-editorial-accent leading-relaxed line-clamp-2 group-hover:text-editorial-text transition-colors">{template.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-32 bg-editorial-sidebar border border-dashed border-editorial-border rounded">
          <BookIcon className="mx-auto text-editorial-muted mb-6" size={48} />
          <h3 className="text-2xl font-serif italic text-editorial-text mb-2">No manuscripts found</h3>
          <p className="text-editorial-accent max-w-sm mx-auto font-serif italic leading-relaxed">Begin your journey by establishing the architecture of your next book.</p>
          <button 
            onClick={() => setShowTemplates(true)}
            className="mt-10 px-8 py-3 bg-editorial-text text-white text-[10px] font-bold tracking-widest uppercase rounded hover:bg-black transition-all"
          >
            Draft a New Concept
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <motion.div
              layout
              key={book.id}
              className="group bg-white rounded border border-editorial-border overflow-hidden hover:shadow-xl hover:border-editorial-text transition-all duration-500"
            >
              <div 
                className="p-8 cursor-pointer h-full flex flex-col"
                onClick={() => onSelectBook(book.id)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="text-[10px] tracking-widest uppercase font-bold text-editorial-muted flex items-center gap-2">
                    <Clock size={12} />
                    {formatDate(book.updatedAt)}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBook(book.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-editorial-muted hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="text-2xl font-serif italic font-semibold mb-4 text-editorial-text group-hover:text-black line-clamp-2 leading-tight">{book.title}</h3>
                <p className="text-editorial-accent font-serif text-[15px] italic leading-relaxed mb-8 line-clamp-3 flex-1">
                  {book.description || 'Manuscript details pending. Begin the formal structuring process.'}
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.15em] uppercase text-editorial-muted border-t border-editorial-divider pt-6">
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
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Book Title</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Chapters</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.map((book) => (
                <tr 
                  key={book.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectBook(book.id)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">{book.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{book.description || 'No description'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.chapters.length}</td>
                  <td className="px-6 py-4">
                   <div className="flex items-center gap-1.5 capitalize text-sm">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      book.status === 'draft' ? "bg-amber-400" : "bg-emerald-400"
                    )} />
                    {book.status}
                  </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(book.updatedAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBook(book.id);
                      }}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
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
