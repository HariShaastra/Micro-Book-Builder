/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, Chapter } from '../types.ts';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Download, 
  Maximize2, 
  Minimize2, 
  FileText, 
  ListTree 
} from 'lucide-react';

interface BookPreviewModalProps {
  book: Book;
  onClose: () => void;
  onExport: () => void;
}

export default function BookPreviewModal({
  book,
  onClose,
  onExport
}: BookPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [showTOCMenu, setShowTOCMenu] = useState(false);

  const borderStyle = book.pageSettings?.borderStyle || 'classic-single';
  const borderClass = 
    borderStyle === 'classic-double' ? 'page-border-classic-double' :
    borderStyle === 'oxford' ? 'page-border-oxford' :
    borderStyle === 'ornate-corners' ? 'page-border-ornate-corners' :
    borderStyle === 'vintage-filigree' ? 'page-border-vintage-filigree' :
    borderStyle === 'modern-accent' ? 'page-border-modern-accent' :
    borderStyle === 'manuscript-frame' ? 'page-border-manuscript-frame' :
    borderStyle === 'none' ? 'page-border-none' :
    'page-border-classic-single';

  const toRoman = (num: number): string => {
    const lookup: { [key: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    for (const i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman || 'I';
  };

  const tocSettings = book.tocSettings || {
    enabled: true,
    style: 'dots',
    showPageNumbers: true,
    showSubsections: false,
    title: 'Table of Contents',
    chapterPrefix: 'Chapter'
  };

  // Compile pages into an ordered list
  // 0: Cover
  // 1: Title Page
  // 2: Front Matter (Copyright & Dedication & Preface)
  // 3: Table of Contents
  // 4...: Chapters
  // End: References & About Author

  const pages: { id: string; type: string; title: string; render: () => React.ReactNode }[] = [
    // Page 0: Cover
    {
      id: 'cover',
      type: 'cover',
      title: 'Cover Page',
      render: () => {
        const c = book.cover || {};
        return (
          <div
            className="w-full h-full min-h-[550px] p-8 sm:p-12 flex flex-col justify-between text-center border relative shadow-xl rounded-md"
            style={{
              backgroundColor: c.bgColor || '#1B4332',
              color: c.textColor || '#FFFFFF',
              borderColor: c.accentColor || '#D8F3DC',
              backgroundImage: c.bgImage ? `url(${c.bgImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {c.bgImage && <div className="absolute inset-0 bg-black/40 z-0" />}
            <div className="relative z-10 text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
              {book.publisher || 'Shaastra Publishing'}
            </div>
            <div className="relative z-10 my-auto py-8 space-y-3">
              <h1 className="text-3xl sm:text-4xl font-serif italic font-bold leading-tight">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="text-sm sm:text-base font-serif italic opacity-90" style={{ color: c.accentColor || '#D8F3DC' }}>
                  {book.subtitle}
                </p>
              )}
            </div>
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-widest opacity-80 font-mono">By</span>
              <p className="text-sm font-serif font-bold">{book.authorName || 'Author'}</p>
            </div>
          </div>
        );
      }
    },
    // Page 1: Title Page
    {
      id: 'title-page',
      type: 'title',
      title: 'Title Page',
      render: () => (
        <div className={`w-full h-full min-h-[550px] p-8 sm:p-14 flex flex-col justify-between text-center bg-white text-editorial-text rounded-md shadow-lg transition-all ${borderClass}`}>
          <div className="pt-8">
            <h1 className="text-3xl sm:text-4xl font-serif italic font-bold mb-3">{book.title}</h1>
            {book.subtitle && (
              <p className="text-sm font-serif italic text-editorial-accent mb-6">{book.subtitle}</p>
            )}
            <div className="w-16 h-0.5 bg-editorial-accent mx-auto my-4" />
          </div>
          <div className="my-auto space-y-2">
            <p className="text-xs uppercase tracking-widest font-mono text-editorial-muted">Written by</p>
            <p className="text-base font-serif font-bold">{book.authorName || 'Author'}</p>
            {book.coAuthors && book.coAuthors.length > 0 && (
              <p className="text-xs text-editorial-muted font-serif italic">
                with {book.coAuthors.join(', ')}
              </p>
            )}
          </div>
          <div className="pt-8 border-t border-editorial-divider text-xs text-editorial-muted space-y-1">
            <p className="font-bold uppercase tracking-wider">{book.publisher || 'Shaastra Publishing Imprint'}</p>
            <p className="font-mono text-[10px]">Edition: {book.edition || 'First Edition'} • {book.copyrightYear || 2026}</p>
          </div>
        </div>
      )
    },
    // Page 2: Front Matter (Copyright, Dedication & Preface)
    {
      id: 'front-matter',
      type: 'frontmatter',
      title: 'Front Matter',
      render: () => (
        <div className={`w-full h-full min-h-[550px] p-8 sm:p-14 bg-white text-editorial-text rounded-md shadow-lg flex flex-col justify-between transition-all ${borderClass}`}>
          <div className="space-y-6">
            {book.frontMatter?.dedication?.text && (
              <div className="text-center italic font-serif text-sm p-4 bg-editorial-sidebar/30 rounded border border-editorial-divider">
                <p>"{book.frontMatter.dedication.text}"</p>
              </div>
            )}
            {book.frontMatter?.preface?.content && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-editorial-accent mb-2">
                  {book.frontMatter.preface.title || 'Preface'}
                </h3>
                <p className="text-xs font-serif leading-relaxed text-editorial-text italic">
                  {book.frontMatter.preface.content}
                </p>
              </div>
            )}
          </div>
          <div className="pt-8 border-t border-editorial-divider text-[10px] font-mono text-editorial-muted space-y-1 text-center">
            <p>{book.frontMatter?.copyright?.text || `© ${book.copyrightYear || 2026} ${book.authorName}. All rights reserved.`}</p>
            {book.isbn && <p>ISBN: {book.isbn}</p>}
          </div>
        </div>
      )
    },
    // Page 3: Table of Contents
    {
      id: 'toc',
      type: 'toc',
      title: tocSettings.title || 'Table of Contents',
      render: () => (
        <div className={`w-full h-full min-h-[550px] p-8 sm:p-14 bg-white text-editorial-text rounded-md shadow-lg transition-all ${borderClass}`}>
          <div className="text-center pb-6 border-b border-editorial-divider mb-6">
            <h2 className="text-2xl font-serif italic font-bold">{tocSettings.title || 'Table of Contents'}</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-editorial-muted mt-1">Structure of the Work</p>
          </div>
          <div className="space-y-3 font-serif">
            {book.chapters.map((ch, idx) => {
              const prefix = tocSettings.chapterPrefix === 'None' 
                ? '' 
                : tocSettings.style === 'roman'
                  ? `${toRoman(idx + 1)}. `
                  : tocSettings.style === 'modern'
                    ? `${String(idx + 1).padStart(2, '0')}  `
                    : `${tocSettings.chapterPrefix || 'Chapter'} ${idx + 1}. `;

              return (
                <div
                  key={ch.id}
                  onClick={() => setCurrentPage(idx + 4)}
                  className={`flex items-baseline justify-between text-sm py-1.5 transition-colors cursor-pointer hover:text-editorial-accent ${
                    tocSettings.style === 'minimal' 
                      ? 'border-none' 
                      : 'border-b border-dotted border-editorial-border/60'
                  }`}
                >
                  <span className="font-medium">
                    <span className="font-mono text-xs opacity-75 mr-1">{prefix}</span>
                    {ch.title}
                  </span>
                  {tocSettings.showPageNumbers !== false && (
                    <span className="font-mono text-xs text-editorial-muted ml-2 shrink-0">
                      p. {idx * 4 + 5}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )
    },
    // Pages 4+: Chapters
    ...book.chapters.map((ch, idx) => ({
      id: ch.id,
      type: 'chapter',
      title: `${idx + 1}. ${ch.title}`,
      render: () => (
        <div className={`w-full h-full min-h-[550px] p-8 sm:p-14 bg-white text-editorial-text rounded-md shadow-lg flex flex-col justify-between transition-all ${borderClass}`}>
          <div>
            {/* Header running title */}
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-editorial-muted border-b border-editorial-divider pb-2 mb-8">
              <span>{book.title}</span>
              <span>Fragment {idx + 1}</span>
            </div>

            {/* Chapter title */}
            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-editorial-accent block mb-1">
                Chapter {idx + 1}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-editorial-text">
                {ch.title}
              </h2>
            </div>

            {/* Chapter content (HTML or rendered blocks) */}
            {ch.blocks && ch.blocks.length > 0 ? (
              <div className="space-y-4 font-serif text-sm leading-relaxed">
                {ch.blocks.map(b => (
                  <div key={b.id}>
                    {b.type === 'heading' && <h3 className="font-bold text-lg font-serif mt-4">{b.content}</h3>}
                    {b.type === 'paragraph' && <p className="leading-relaxed">{b.content}</p>}
                    {b.type === 'quote' && (
                      <blockquote className="border-l-4 border-editorial-accent pl-4 italic text-editorial-accent my-3">
                        {b.content}
                      </blockquote>
                    )}
                    {b.type === 'callout' && (
                      <div className="bg-editorial-sidebar/40 p-3 rounded border border-editorial-divider text-xs my-2 italic">
                        {b.content}
                      </div>
                    )}
                    {b.type === 'image' && b.meta?.imageUrl && (
                      <div className="my-4 text-center">
                        <img src={b.meta.imageUrl} alt={b.meta.altText || ''} className="max-h-64 mx-auto rounded shadow-xs" />
                        {b.meta.caption && <p className="text-[11px] text-editorial-muted italic mt-1">{b.meta.caption}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="prose prose-slate max-w-none text-sm font-serif leading-relaxed"
                dangerouslySetInnerHTML={{ __html: ch.content || '<p class="italic text-gray-400">No content drafted in this fragment yet.</p>' }}
              />
            )}
          </div>

          {/* Running footer with page number */}
          <div className="flex items-center justify-between text-[10px] font-mono text-editorial-muted border-t border-editorial-divider pt-4 mt-8">
            <span>Book Builder Shaastra</span>
            <span>Page {idx * 4 + 5}</span>
          </div>
        </div>
      )
    })),
    // References page if exists
    ...(book.references && book.references.length > 0 ? [{
      id: 'references',
      type: 'references',
      title: 'References & Citations',
      render: () => (
        <div className={`w-full h-full min-h-[550px] p-8 sm:p-14 bg-white text-editorial-text rounded-md shadow-lg transition-all ${borderClass}`}>
          <div className="text-center pb-6 border-b border-editorial-divider mb-6">
            <h2 className="text-2xl font-serif italic font-bold">References & Bibliography</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-editorial-muted mt-1">Grounded Works Consulted</p>
          </div>
          <div className="space-y-4 font-serif text-xs">
            {book.references.map((ref, i) => (
              <div key={ref.id} className="border-b border-editorial-divider pb-2">
                <span className="font-bold text-editorial-text">{i + 1}. {ref.author}</span> ({ref.year || 'n.d.'}). <em>{ref.title}</em>. {ref.publisher || ref.url || ''}
              </div>
            ))}
          </div>
        </div>
      )
    }] : [])
  ];

  const currentPageObj = pages[currentPage] || pages[0];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-editorial-bg text-editorial-text select-none ${isReadingMode ? 'p-0' : 'p-3 sm:p-6'}`}>
      {/* Top Navigation & Action Bar */}
      <div className="bg-editorial-sidebar border border-editorial-border rounded-t-lg p-3 sm:p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white rounded text-editorial-muted hover:text-editorial-text transition-colors"
            title="Close Preview"
          >
            <X size={18} />
          </button>
          <div>
            <div className="text-[9px] font-mono uppercase font-bold tracking-widest text-editorial-accent">
              Full Document Preview
            </div>
            <h3 className="font-serif italic font-bold text-sm sm:text-base text-editorial-text truncate max-w-xs sm:max-w-md">
              {book.title}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* TOC Selector Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowTOCMenu(!showTOCMenu)}
              className="px-2.5 py-1.5 bg-white border border-editorial-border hover:border-editorial-text rounded text-xs font-bold uppercase tracking-wider text-editorial-text flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ListTree size={14} />
              <span className="hidden sm:inline">Jump to Section</span>
            </button>

            {showTOCMenu && (
              <div className="absolute right-0 mt-2 w-64 max-h-72 overflow-y-auto bg-white border border-editorial-border rounded-lg shadow-xl z-50 p-2 space-y-1">
                {pages.map((p, index) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentPage(index);
                      setShowTOCMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs font-serif truncate transition-colors ${
                      currentPage === index ? 'bg-editorial-sidebar text-editorial-accent font-bold' : 'hover:bg-neutral-50'
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reading Mode Toggle */}
          <button
            onClick={() => setIsReadingMode(!isReadingMode)}
            className="p-1.5 bg-white border border-editorial-border hover:border-editorial-text rounded text-editorial-text transition-colors cursor-pointer"
            title={isReadingMode ? 'Exit Full Screen' : 'Distraction-Free Mode'}
          >
            {isReadingMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Export Button */}
          <button
            onClick={onExport}
            className="px-3 py-1.5 bg-editorial-text text-white hover:bg-black rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Page Rendering Frame */}
      <div className="flex-1 overflow-y-auto bg-neutral-200/50 p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl transition-all duration-300">
          {currentPageObj.render()}
        </div>
      </div>

      {/* Bottom Paging Controller */}
      <div className="bg-editorial-sidebar border border-editorial-border rounded-b-lg p-3 flex items-center justify-between shadow-xs">
        <button
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-editorial-border disabled:opacity-40 rounded text-xs font-bold uppercase tracking-wider text-editorial-text hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <span className="text-xs font-mono font-bold text-editorial-muted">
          Page {currentPage + 1} of {pages.length} • {currentPageObj.title}
        </span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}
          disabled={currentPage === pages.length - 1}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-editorial-border disabled:opacity-40 rounded text-xs font-bold uppercase tracking-wider text-editorial-text hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
