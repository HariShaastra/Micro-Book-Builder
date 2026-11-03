/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  HelpCircle, 
  Compass, 
  Layers, 
  FileText, 
  Table, 
  Palette, 
  Quote, 
  Download, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import Logo from './Logo.tsx';

interface DetailedGuideProps {
  onBack: () => void;
}

export default function DetailedGuide({ onBack }: DetailedGuideProps) {
  const [activeTopic, setActiveTopic] = useState<string>('intro');
  const [search, setSearch] = useState('');

  const topics = [
    { id: 'intro', title: 'What is Book Builder Shaastra?', icon: Compass },
    { id: 'workflow', title: '4-Step Book Creation Workflow', icon: Layers },
    { id: 'word-tools', title: 'Word-like Tools: Tables & Boxes', icon: Table },
    { id: 'citing-linking', title: 'Citing & Linking Works (Zoho Style)', icon: Quote },
    { id: 'outline-structure', title: 'Outline & Hierarchical Structure', icon: BookOpen },
    { id: 'cover-builder', title: 'Designing Professional Covers', icon: Palette },
    { id: 'exports', title: 'Exporting PDF, Word, Markdown, TXT', icon: Download },
    { id: 'cloud-safety', title: 'Cloud Sync & Offline Persistence', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 sm:py-6 select-text w-full overflow-x-hidden animate-in fade-in duration-200">
      {/* Top Header with Prominent Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-editorial-border shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-editorial-sidebar/60 hover:bg-editorial-sidebar border border-editorial-border rounded-lg text-editorial-text transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
            title="Return to Previous Screen"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div>
            <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent">
              Comprehensive Reference
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-editorial-text">
              The Book Builder Shaastra Handbook
            </h1>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-editorial-muted" />
          <input
            type="text"
            placeholder="Search handbook topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded pl-8 pr-3 py-1.5 text-xs outline-none focus:border-editorial-accent"
          />
        </div>
      </div>

      {/* Main Handbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 bg-white border border-editorial-border rounded-xl p-3 shadow-xs space-y-1 sticky top-6">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-editorial-muted px-3 py-2 block">
            Table of Contents
          </span>
          {topics.map(t => {
            const Icon = t.icon;
            const isActive = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-serif transition-colors flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-editorial-sidebar text-editorial-accent font-bold border-l-2 border-editorial-accent'
                    : 'text-editorial-text hover:bg-neutral-50'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-editorial-accent' : 'text-editorial-muted'} />
                <span className="truncate">{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Topic Content Sheet */}
        <div className="md:col-span-8 bg-white border border-editorial-border rounded-xl p-6 sm:p-10 shadow-xs space-y-6 font-serif text-sm leading-relaxed text-editorial-text">
          {activeTopic === 'intro' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent block">
                Chapter 1 • Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold italic text-editorial-text">
                What is Book Builder Shaastra?
              </h2>
              <p>
                <strong>Book Builder Shaastra</strong> is a specialized writing, document architecture, and book creation studio designed to help authors, educators, researchers, and students turn raw ideas into structured, beautifully formatted books and documents.
              </p>
              <p>
                Unlike generic word processors that treat manuscripts as infinite scrolling ribbons of text, Book Builder Shaastra enforces a true book hierarchy:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-editorial-muted font-sans text-xs">
                <li>Formal Title Page, Copyright & ISBN Registration</li>
                <li>Dedication, Preface, and Front Matter</li>
                <li>Auto-updating Table of Contents with pagination</li>
                <li>Chapters broken into modular sections and content blocks</li>
                <li>Grounded bibliography & cross-linked citations</li>
                <li>About the Author epilogue and back matter</li>
              </ul>
              <div className="bg-editorial-sidebar/40 p-4 rounded-lg border border-editorial-divider text-xs italic font-serif mt-4">
                <strong>Our Non-AI Pledge:</strong> The entire application operates through software logic, structured templates, and direct authorial controls. There are no AI chatbots, text-generating hallucinations, or algorithms usurping your authorial voice.
              </div>
            </div>
          )}

          {activeTopic === 'workflow' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent block">
                Chapter 2 • Methodology
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold italic text-editorial-text">
                The 4-Step Book Creation Workflow
              </h2>
              <div className="space-y-4 pt-2">
                <div className="border-l-2 border-editorial-accent pl-4 space-y-1">
                  <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-editorial-accent">
                    Step 01: Initiation & Blueprint Selection
                  </h3>
                  <p className="text-xs text-editorial-muted">
                    Click <strong>+ New Book</strong> to launch the creation wizard. Choose between a clean blank slate, an existing document import (Word DOCX, Markdown, TXT), or one of our 10 curated architectural blueprints.
                  </p>
                </div>

                <div className="border-l-2 border-editorial-accent pl-4 space-y-1">
                  <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-editorial-accent">
                    Step 02: Structural Outlining
                  </h3>
                  <p className="text-xs text-editorial-muted">
                    Use the <strong>Outline</strong> tab to drag, re-sequence, and partition chapters into logical subsections before drafting.
                  </p>
                </div>

                <div className="border-l-2 border-editorial-accent pl-4 space-y-1">
                  <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-editorial-accent">
                    Step 03: Drafting with Word-like Facilities
                  </h3>
                  <p className="text-xs text-editorial-muted">
                    Type on distraction-free editorial stationery. Insert Word-like tables, callout boxes (Info, Warning, Tip, Quote), and cross-link external or internal references.
                  </p>
                </div>

                <div className="border-l-2 border-editorial-accent pl-4 space-y-1">
                  <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-editorial-accent">
                    Step 04: Visual Cover & Export
                  </h3>
                  <p className="text-xs text-editorial-muted">
                    Style your cover in the <strong>Cover Designer</strong>, preview the book page-by-page in <strong>Book Preview</strong>, and export cleanly as archival PDF, Word (.docx), Markdown, or Plain Text.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'word-tools' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent block">
                Chapter 3 • Writing Tools
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold italic text-editorial-text">
                Word-like Facilities: Tables, Boxes & Formatting
              </h2>
              <p>
                The writing studio is equipped with the familiar layout and document facilities found in desktop editorial tools:
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="bg-editorial-sidebar/30 p-3 rounded-lg border border-editorial-divider">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-editorial-text mb-1">
                    📊 Native Tables
                  </h4>
                  <p className="text-xs text-editorial-muted">
                    Insert formatted tabular grids with header rows, dynamic row/column expansion, and clean border styling for scientific experiments, financial surveys, and comparison matrices.
                  </p>
                </div>

                <div className="bg-editorial-sidebar/30 p-3 rounded-lg border border-editorial-divider">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-editorial-text mb-1">
                    📦 Word-like Callout Boxes
                  </h4>
                  <p className="text-xs text-editorial-muted">
                    Insert distinctive styled callout boxes: <strong>Info Box</strong> (blue left border), <strong>Warning Box</strong> (amber left border), <strong>Tip Box</strong> (emerald border), <strong>Blockquote Box</strong> (accent border), and <strong>Note Box</strong> (framed border).
                  </p>
                </div>

                <div className="bg-editorial-sidebar/30 p-3 rounded-lg border border-editorial-divider">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-editorial-text mb-1">
                    ⌨️ Keyboard Formatting Shortcuts
                  </h4>
                  <p className="text-xs text-editorial-muted font-mono">
                    Ctrl/Cmd + B (Bold) • Ctrl/Cmd + I (Italic) • Ctrl/Cmd + F (Find & Replace) • Ctrl/Cmd + S (Manual Save)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'citing-linking' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent block">
                Chapter 4 • Scholarship & Linking
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold italic text-editorial-text">
                Citing Works & Zoho-Style Cross-Linking
              </h2>
              <p>
                Scholarly and professional manuscripts require robust bibliographic citations and connected inter-document cross-references.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 border border-editorial-border rounded bg-white">
                  <h4 className="font-sans font-bold text-xs uppercase text-editorial-text">
                    1. In-Text Bibliography Citations
                  </h4>
                  <p className="text-xs text-editorial-muted mt-1">
                    Click the <strong>Cite & Link</strong> button on the editor toolbar to pick from your bibliography or create a new book, journal article, or report citation. It automatically inserts an author-year citation tag like <em>(Banerjee & Duflo, 2015)</em>.
                  </p>
                </div>

                <div className="p-3 border border-editorial-border rounded bg-white">
                  <h4 className="font-sans font-bold text-xs uppercase text-editorial-text">
                    2. Zoho-Style Work Linking
                  </h4>
                  <p className="text-xs text-editorial-muted mt-1">
                    Just as in Zoho Writer, link other authored books in your personal Shaastra library. A reader can see that a chapter references your companion field guide or research volume.
                  </p>
                </div>

                <div className="p-3 border border-editorial-border rounded bg-white">
                  <h4 className="font-sans font-bold text-xs uppercase text-editorial-text">
                    3. Chapter Cross-References
                  </h4>
                  <p className="text-xs text-editorial-muted mt-1">
                    Link internally to any other chapter (e.g. <em>"See Chapter 3: The Secret in the Reed Bank"</em>) to build cohesive, interconnected prose.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'outline-structure' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent block">
                Chapter 5 • Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold italic text-editorial-text">
                Outline & Hierarchical Structure
              </h2>
              <p>
                The <strong>Outline</strong> tab provides a bird's-eye view of your entire manuscript. You can drag and drop chapters to reorder them, add sub-sections (§ 1.1, § 1.2), duplicate chapters for parallel revisions, and collapse sections to concentrate on individual segments.
              </p>
            </div>
          )}

          {activeTopic === 'cover-builder' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent block">
                Chapter 6 • Visuals
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold italic text-editorial-text">
                Designing Professional Covers
              </h2>
              <p>
                Every published book needs an evocative cover. In the <strong>Cover Designer</strong>, choose from 7 publisher-tested presets (Children's, Fiction, Academic, Minimal, Business, Report, Modern), adjust background hues, upload custom artwork, and pick ornate or modern border frames with a live 6"×9" trade ratio view.
              </p>
            </div>
          )}

          {activeTopic === 'exports' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent block">
                Chapter 7 • Archival & Export
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold italic text-editorial-text">
                Exporting PDF, Word, Markdown & TXT
              </h2>
              <p>
                When your manuscript is ready, click <strong>Export</strong> in the top navigation:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-editorial-muted font-sans">
                <li><strong>PDF</strong>: Print-ready layout with formal cover, title page, auto-generated Table of Contents, and running page numbers.</li>
                <li><strong>DOCX</strong>: Native Microsoft Word format structured with proper Heading 1 and Heading 2 styles.</li>
                <li><strong>Markdown (.md)</strong>: Clean syntax ideal for blogs, digital documentation, and GitHub.</li>
                <li><strong>TXT</strong>: Plain text backup for archival preservation.</li>
              </ul>
            </div>
          )}

          {activeTopic === 'cloud-safety' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent block">
                Chapter 8 • Data Persistence
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold italic text-editorial-text">
                Cloud Sync & Offline Persistence
              </h2>
              <p>
                Book Builder Shaastra operates with an <strong>offline-first architecture</strong>. All keystrokes and chapters save to your browser's local cache instantly.
              </p>
              <p>
                When signed in with Google, all books synchronize automatically with Google Cloud Firestore in real time. You can also download a complete JSON archive of all your books under <strong>Settings &rarr; Data Archive</strong> anytime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
