/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Book, 
  PageSettings, 
  TOCSettings, 
  PageBorderStyle 
} from '../types.ts';
import FacilityIntro from './FacilityIntro.tsx';
import { 
  Layout, 
  Frame, 
  ListTree, 
  FileText, 
  Eye, 
  Check, 
  Sliders, 
  Type, 
  Maximize, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext.tsx';

interface FormatLayoutStudioProps {
  book: Book;
  onUpdate: (updated: Book) => void;
}

export default function FormatLayoutStudio({ book, onUpdate }: FormatLayoutStudioProps) {
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<'borders' | 'toc' | 'geometry' | 'typography'>('borders');

  const pageSettings: PageSettings = book.pageSettings || {
    size: 'Trade 6x9',
    margins: 'normal',
    orientation: 'portrait',
    headerText: book.title,
    footerText: 'Book Builder Shaastra',
    showPageNumbers: true,
    chapterNumbering: true,
    borderStyle: 'classic-single',
    borderColor: '#EBE5C4',
    fontFamily: 'serif',
    lineSpacing: '1.75',
    fontSize: 'base'
  };

  const tocSettings: TOCSettings = book.tocSettings || {
    enabled: true,
    style: 'dots',
    showPageNumbers: true,
    showSubsections: false,
    title: 'Table of Contents',
    leaderChar: '.',
    chapterPrefix: 'Chapter'
  };

  const handleUpdatePageSettings = (partial: Partial<PageSettings>) => {
    const updated: PageSettings = { ...pageSettings, ...partial };
    onUpdate({ ...book, pageSettings: updated });
    notify('Page layout settings updated.', 'success');
  };

  const handleUpdateTOCSettings = (partial: Partial<TOCSettings>) => {
    const updated: TOCSettings = { ...tocSettings, ...partial };
    onUpdate({ ...book, tocSettings: updated });
    notify('Table of Contents format updated.', 'success');
  };

  const borderOptions: { id: PageBorderStyle; name: string; desc: string; sampleClass: string }[] = [
    {
      id: 'none',
      name: 'Clean Borderless',
      desc: 'Modern minimalist white space without borders.',
      sampleClass: 'border-0'
    },
    {
      id: 'classic-single',
      name: 'Single Hairline Rule',
      desc: 'Refined 1px rule framing the manuscript perimeter.',
      sampleClass: 'border border-editorial-border'
    },
    {
      id: 'classic-double',
      name: 'Aristocratic Double Line',
      desc: 'Timeless publisher double rule with outer and inner lines.',
      sampleClass: 'border-4 border-double border-editorial-text'
    },
    {
      id: 'oxford',
      name: 'Oxford Publishing Rule',
      desc: 'Thick outer rule with an inset fine keyline.',
      sampleClass: 'border-2 border-editorial-text outline-1 outline-editorial-text -outline-offset-4'
    },
    {
      id: 'ornate-corners',
      name: 'Ornate Corner Brackets',
      desc: 'Antique bookbinding corners with star ornaments.',
      sampleClass: 'border border-editorial-border relative'
    },
    {
      id: 'vintage-filigree',
      name: 'Vintage Filigree Rule',
      desc: 'Subtle dashed editorial framing for memoirs and poetry.',
      sampleClass: 'border-2 border-dashed border-editorial-accent'
    },
    {
      id: 'modern-accent',
      name: 'Modern Header/Footer Rules',
      desc: 'Bold horizontal accent beams top and bottom.',
      sampleClass: 'border-t-4 border-b-4 border-editorial-accent border-x border-x-editorial-border'
    },
    {
      id: 'manuscript-frame',
      name: 'Architectural Inset Frame',
      desc: 'Multi-layer parchment frame for academic works and textbooks.',
      sampleClass: 'shadow-[inset_0_0_0_1px_#EBE5C4,inset_0_0_0_4px_#FFFDF2,inset_0_0_0_5px_#EBE5C4]'
    }
  ];

  return (
    <div className="w-full max-w-5xl space-y-6 select-none animate-in fade-in duration-200">
      {/* 3-4 Line Instruction Guide */}
      <FacilityIntro
        title="Page Borders & Table of Contents Format Facility"
        facilityKey="format"
        description="Configure the macro architectural formatting of your book. Choose from 8 curated page border models, design your auto-updating Table of Contents, and establish trim sizes and running headers."
        steps={[
          "Select a Page Border model (Oxford, Classic Double, Ornate, or Minimal).",
          "Customize the Table of Contents format (Dotted Leaders, Minimal, or Roman).",
          "Fine-tune page margins, typography, and running headers."
        ]}
        tip="Formats configured here automatically govern the live manuscript, page-by-page preview, and PDF/Word exports."
      />

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-editorial-divider bg-white p-2 rounded-xl shadow-xs">
        <button
          onClick={() => setActiveTab('borders')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'borders'
              ? 'bg-editorial-sidebar text-editorial-accent border border-editorial-border'
              : 'text-editorial-muted hover:text-editorial-text'
          }`}
        >
          <Frame size={14} />
          <span>Page Borders ({borderOptions.find(b => b.id === (pageSettings.borderStyle || 'classic-single'))?.name})</span>
        </button>

        <button
          onClick={() => setActiveTab('toc')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'toc'
              ? 'bg-editorial-sidebar text-editorial-accent border border-editorial-border'
              : 'text-editorial-muted hover:text-editorial-text'
          }`}
        >
          <ListTree size={14} />
          <span>Table of Contents Format</span>
        </button>

        <button
          onClick={() => setActiveTab('geometry')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'geometry'
              ? 'bg-editorial-sidebar text-editorial-accent border border-editorial-border'
              : 'text-editorial-muted hover:text-editorial-text'
          }`}
        >
          <Maximize size={14} />
          <span>Trim Sizes & Margins</span>
        </button>

        <button
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'typography'
              ? 'bg-editorial-sidebar text-editorial-accent border border-editorial-border'
              : 'text-editorial-muted hover:text-editorial-text'
          }`}
        >
          <Type size={14} />
          <span>Typography & Spacing</span>
        </button>
      </div>

      {/* Main Studio Grid: Controls on Left, Live Page Inspector Model on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: PAGE BORDERS */}
          {activeTab === 'borders' && (
            <div className="bg-white border border-editorial-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-editorial-divider pb-3">
                <div>
                  <h3 className="font-serif italic font-bold text-lg text-editorial-text">
                    Architectural Page Border Models
                  </h3>
                  <p className="text-xs text-editorial-muted font-serif">
                    Select a perimeter frame for your manuscript and published editions.
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase bg-editorial-sidebar px-2 py-0.5 rounded font-bold text-editorial-accent">
                  8 Presets
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {borderOptions.map((opt) => {
                  const isSelected = (pageSettings.borderStyle || 'classic-single') === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleUpdatePageSettings({ borderStyle: opt.id })}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-36 ${
                        isSelected
                          ? 'border-editorial-accent bg-editorial-sidebar/30 ring-2 ring-editorial-accent/30 shadow-xs'
                          : 'border-editorial-border/70 hover:border-editorial-accent/60 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-xs text-editorial-text">
                            {opt.name}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-editorial-accent text-white flex items-center justify-center">
                              <Check size={11} />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-editorial-muted line-clamp-2 font-serif italic">
                          {opt.desc}
                        </p>
                      </div>

                      {/* Micro Visual Model */}
                      <div className={`w-full h-8 rounded bg-editorial-bg flex items-center justify-center p-1 text-[9px] font-mono text-editorial-muted ${opt.sampleClass}`}>
                        <span>Page Sample</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TABLE OF CONTENTS (TOC) FORMAT */}
          {activeTab === 'toc' && (
            <div className="bg-white border border-editorial-border rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-editorial-divider pb-3">
                <div>
                  <h3 className="font-serif italic font-bold text-lg text-editorial-text">
                    Table of Contents (TOC) Architecture
                  </h3>
                  <p className="text-xs text-editorial-muted font-serif">
                    The format includes a dedicated Table of Contents by default. Customize its layout below.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-editorial-accent cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tocSettings.enabled !== false}
                    onChange={(e) => handleUpdateTOCSettings({ enabled: e.target.checked })}
                    className="accent-editorial-accent"
                  />
                  <span>Include TOC in Book</span>
                </label>
              </div>

              {/* Style Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block">
                  TOC Presentation Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'dots', label: 'Dotted Leader', sample: 'Ch. 1 ...... 12' },
                    { id: 'minimal', label: 'Clean Space', sample: 'Ch. 1        12' },
                    { id: 'modern', label: 'Modern Numerals', sample: '01  Ch. 1    12' },
                    { id: 'roman', label: 'Roman Academic', sample: 'I.  Ch. 1     xii' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleUpdateTOCSettings({ style: s.id as any })}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        tocSettings.style === s.id
                          ? 'border-editorial-accent bg-editorial-sidebar/40 font-bold'
                          : 'border-editorial-border hover:bg-neutral-50'
                      }`}
                    >
                      <div className="text-xs font-serif text-editorial-text">{s.label}</div>
                      <div className="text-[10px] font-mono text-editorial-muted mt-1 truncate">{s.sample}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    TOC Heading Title
                  </label>
                  <input
                    type="text"
                    value={tocSettings.title || 'Table of Contents'}
                    onChange={(e) => handleUpdateTOCSettings({ title: e.target.value })}
                    className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded px-3 py-2 text-xs font-serif italic outline-none focus:border-editorial-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Chapter Prefix Label
                  </label>
                  <select
                    value={tocSettings.chapterPrefix || 'Chapter'}
                    onChange={(e) => handleUpdateTOCSettings({ chapterPrefix: e.target.value })}
                    className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded px-3 py-2 text-xs font-medium outline-none"
                  >
                    <option value="Chapter">Chapter (Chapter 1)</option>
                    <option value="Act">Act (Act 1)</option>
                    <option value="Fragment">Fragment (Fragment 1)</option>
                    <option value="Section">Section (Section 1)</option>
                    <option value="None">None (Only Title)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-editorial-divider">
                <label className="flex items-center gap-2 text-xs text-editorial-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tocSettings.showPageNumbers !== false}
                    onChange={(e) => handleUpdateTOCSettings({ showPageNumbers: e.target.checked })}
                    className="accent-editorial-accent"
                  />
                  <span>Show page numbers in Table of Contents</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-editorial-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(tocSettings.showSubsections)}
                    onChange={(e) => handleUpdateTOCSettings({ showSubsections: e.target.checked })}
                    className="accent-editorial-accent"
                  />
                  <span>Include secondary sub-sections (§ 1.1, § 1.2) under chapters</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: TRIM SIZES & MARGINS */}
          {activeTab === 'geometry' && (
            <div className="bg-white border border-editorial-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-serif italic font-bold text-lg text-editorial-text border-b border-editorial-divider pb-2">
                Trim Sizes & Margin Geometry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Book Trim Size
                  </label>
                  <select
                    value={pageSettings.size}
                    onChange={(e) => handleUpdatePageSettings({ size: e.target.value as any })}
                    className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded p-2 text-xs outline-none"
                  >
                    <option value="Trade 6x9">US Trade 6" × 9" (Standard Fiction & Non-Fiction)</option>
                    <option value="Digest 5.5x8.5">Digest 5.5" × 8.5" (Novellas & Poetry)</option>
                    <option value="A5">A5 5.8" × 8.3" (International Standard)</option>
                    <option value="Letter">US Letter 8.5" × 11" (Textbooks & Reports)</option>
                    <option value="A4">A4 8.3" × 11.7" (Academic Dissertations)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Margin Profile
                  </label>
                  <select
                    value={pageSettings.margins}
                    onChange={(e) => handleUpdatePageSettings({ margins: e.target.value as any })}
                    className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded p-2 text-xs outline-none"
                  >
                    <option value="normal">Normal (0.8" Gutter & Perimeters)</option>
                    <option value="narrow">Narrow (0.5" Compact Layout)</option>
                    <option value="wide">Wide (1.25" Scholarly Commentary Margin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Running Header Text
                  </label>
                  <input
                    type="text"
                    value={pageSettings.headerText || ''}
                    onChange={(e) => handleUpdatePageSettings({ headerText: e.target.value })}
                    placeholder="Book or Author Title..."
                    className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Running Footer Text
                  </label>
                  <input
                    type="text"
                    value={pageSettings.footerText || ''}
                    onChange={(e) => handleUpdatePageSettings({ footerText: e.target.value })}
                    placeholder="Publisher or Edition..."
                    className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded p-2 text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TYPOGRAPHY & SPACING */}
          {activeTab === 'typography' && (
            <div className="bg-white border border-editorial-border rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-serif italic font-bold text-lg text-editorial-text border-b border-editorial-divider pb-2">
                Typography & Line Geometry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Primary Typeface
                  </label>
                  <select
                    value={pageSettings.fontFamily || 'serif'}
                    onChange={(e) => handleUpdatePageSettings({ fontFamily: e.target.value as any })}
                    className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded p-2 text-xs outline-none"
                  >
                    <option value="serif">Playfair Display (Editorial Serif)</option>
                    <option value="garamond">Garamond Classic (Literary)</option>
                    <option value="sans">Inter (Modern Clean Sans)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Line Height / Leading
                  </label>
                  <select
                    value={pageSettings.lineSpacing || '1.75'}
                    onChange={(e) => handleUpdatePageSettings({ lineSpacing: e.target.value as any })}
                    className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded p-2 text-xs outline-none"
                  >
                    <option value="1.5">1.5 - Compact Reading</option>
                    <option value="1.75">1.75 - Standard Publisher Leading</option>
                    <option value="2.0">2.0 - Double Spaced Manuscript</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Base Font Scale
                  </label>
                  <select
                    value={pageSettings.fontSize || 'base'}
                    onChange={(e) => handleUpdatePageSettings({ fontSize: e.target.value as any })}
                    className="w-full bg-editorial-sidebar/20 border border-editorial-border rounded p-2 text-xs outline-none"
                  >
                    <option value="sm">Small (10pt Trade)</option>
                    <option value="base">Standard (11.5pt Book)</option>
                    <option value="lg">Large Print (14pt Accessible)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Interactive Page Inspector Model */}
        <div className="lg:col-span-5 bg-white border border-editorial-border rounded-xl p-6 shadow-md space-y-4 sticky top-6">
          <div className="flex items-center justify-between border-b border-editorial-divider pb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent flex items-center gap-1.5">
              <Eye size={12} />
              <span>Live Page Model Inspector</span>
            </span>
            <span className="text-[10px] font-mono text-editorial-muted">
              {pageSettings.size} • {pageSettings.borderStyle || 'classic-single'}
            </span>
          </div>

          {/* Interactive Simulated Page */}
          <div className="bg-editorial-bg p-4 sm:p-6 rounded-lg shadow-inner flex justify-center">
            <div 
              className={`w-full max-w-sm bg-white aspect-[1/1.4] rounded p-6 shadow-md flex flex-col justify-between text-editorial-text ${
                pageSettings.borderStyle === 'classic-double' ? 'page-border-classic-double' :
                pageSettings.borderStyle === 'oxford' ? 'page-border-oxford' :
                pageSettings.borderStyle === 'ornate-corners' ? 'page-border-ornate-corners' :
                pageSettings.borderStyle === 'vintage-filigree' ? 'page-border-vintage-filigree' :
                pageSettings.borderStyle === 'modern-accent' ? 'page-border-modern-accent' :
                pageSettings.borderStyle === 'manuscript-frame' ? 'page-border-manuscript-frame' :
                pageSettings.borderStyle === 'none' ? 'page-border-none' :
                'page-border-classic-single'
              }`}
            >
              {/* Running Header */}
              <div className="flex items-center justify-between text-[9px] font-mono text-editorial-muted border-b border-editorial-divider pb-1">
                <span className="truncate max-w-[120px]">{pageSettings.headerText || book.title}</span>
                <span>Page 1</span>
              </div>

              {/* Sample Content: Table of Contents or Chapter Opening */}
              <div className="my-auto py-3 space-y-2">
                {activeTab === 'toc' ? (
                  <div className="space-y-1.5">
                    <div className="text-center font-serif italic font-bold text-xs border-b border-editorial-divider pb-1">
                      {tocSettings.title || 'Table of Contents'}
                    </div>
                    {book.chapters.slice(0, 4).map((ch, idx) => (
                      <div key={ch.id} className="flex items-center justify-between text-[10px] font-serif">
                        <span className="truncate max-w-[150px]">
                          {tocSettings.chapterPrefix === 'None' ? '' : `${tocSettings.chapterPrefix || 'Chapter'} ${idx + 1}: `}{ch.title}
                        </span>
                        {tocSettings.style === 'dots' && <span className="text-editorial-muted/50 px-1 truncate flex-1 text-center font-mono">................</span>}
                        {tocSettings.style === 'modern' && <span className="font-mono text-[9px] text-editorial-accent">0{idx + 1}</span>}
                        {tocSettings.showPageNumbers !== false && (
                          <span className="font-mono text-[9px] text-editorial-muted shrink-0 pl-1">
                            {idx * 14 + 5}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <h4 className="font-serif italic font-bold text-xs text-editorial-text text-center">
                      Chapter 1. Opening Hypothesis
                    </h4>
                    <p className="text-[10px] font-serif leading-relaxed text-editorial-text text-justify line-clamp-6">
                      The deliberate construction of a manuscript demands patience, structured chapters, and respectful authorial craft. Within this architectural frame, every thought finds its natural elevation.
                    </p>
                  </div>
                )}
              </div>

              {/* Running Footer */}
              <div className="flex items-center justify-between text-[9px] font-mono text-editorial-muted border-t border-editorial-divider pt-1">
                <span className="truncate max-w-[120px]">{pageSettings.footerText || 'Book Builder Shaastra'}</span>
                <span>§ Section 1</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="text-[11px] font-mono text-editorial-muted">
              ✓ All border & TOC formatting models synchronized with manuscript export
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
