/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  Highlighter, 
  Strikethrough, 
  Code, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Indent, 
  Outdent, 
  List, 
  ListOrdered, 
  Quote, 
  Divide, 
  Table as TableIcon, 
  PlusSquare, 
  MinusSquare, 
  Trash2, 
  Lightbulb, 
  AlertTriangle, 
  Sparkles, 
  Bookmark, 
  CheckCircle, 
  Save, 
  Cloud, 
  Search, 
  Link2, 
  Eye, 
  Download,
  Check
} from 'lucide-react';

interface KeyItem {
  id: string;
  category: 'headings' | 'formatting' | 'alignment' | 'tables' | 'boxes' | 'actions';
  title: string;
  shortcut?: string;
  icon: React.ReactNode;
  description: string;
  preview: React.ReactNode;
}

export default function EditorKeyLegend() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'headings' | 'formatting' | 'alignment' | 'tables' | 'boxes' | 'actions'>('all');

  const keyItems: KeyItem[] = [
    // 1. Headings & Styles
    {
      id: 'h1',
      category: 'headings',
      title: 'Heading 1 [H1]',
      shortcut: 'Alt + 1',
      icon: <Heading1 size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Primary chapter or major section header. Sets an authoritative 2.15rem serif headline.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg">
          <h1 className="font-serif font-bold text-xl text-editorial-text dark:text-stone-100">
            Chapter I. The Geometry of Ideas
          </h1>
        </div>
      )
    },
    {
      id: 'h2',
      category: 'headings',
      title: 'Heading 2 [H2]',
      shortcut: 'Alt + 2',
      icon: <Heading2 size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Secondary section title for dividing major themes, subtopics, and module divisions.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg">
          <h2 className="font-serif font-bold text-base text-editorial-text dark:text-stone-100">
            1.2 Grounded Theoretical Scaffolding
          </h2>
        </div>
      )
    },
    {
      id: 'h3',
      category: 'headings',
      title: 'Heading 3 [H3]',
      shortcut: 'Alt + 3',
      icon: <Heading3 size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Granular subsection header for micro-concepts, case examples, and focus beats.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg">
          <h3 className="font-serif font-semibold text-sm text-editorial-text dark:text-stone-100">
            Detailed Variable Clarifications
          </h3>
        </div>
      )
    },
    {
      id: 'p',
      category: 'headings',
      title: 'Normal Paragraph [P]',
      shortcut: 'Alt + 0',
      icon: <Type size={16} className="text-editorial-muted dark:text-stone-300" />,
      description: 'Standard editorial body font styled in Georgia / Playfair Display with generous 1.8 leading.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg">
          <p className="font-serif text-xs leading-relaxed text-editorial-text dark:text-stone-200">
            When constructing a durable manuscript, every sentence must carry architectural weight and precision.
          </p>
        </div>
      )
    },

    // 2. Formatting
    {
      id: 'bold',
      category: 'formatting',
      title: 'Bold Text [B]',
      shortcut: 'Alt + B',
      icon: <Bold size={16} className="font-bold text-editorial-text dark:text-stone-100" />,
      description: 'Strong typographic emphasis for key terms, foundational principles, and notable figures.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-editorial-text dark:text-stone-200">
          The central <strong className="font-bold text-editorial-text dark:text-white">axiom of clarity</strong> remains paramount.
        </div>
      )
    },
    {
      id: 'italic',
      category: 'formatting',
      title: 'Italic Text [I]',
      shortcut: 'Alt + I',
      icon: <Italic size={16} className="italic text-editorial-text dark:text-stone-100" />,
      description: 'Gentle literary emphasis for foreign phrases, volume titles, and interior monologues.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-editorial-text dark:text-stone-200">
          Referred to in classical treatises as the <em className="italic text-editorial-accent dark:text-amber-400">prima materia</em>.
        </div>
      )
    },
    {
      id: 'underline',
      category: 'formatting',
      title: 'Underline [U]',
      shortcut: 'Alt + U',
      icon: <Underline size={16} className="text-editorial-text dark:text-stone-100" />,
      description: 'Clean typographic baseline underline for statutory acts, references, and citations.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-editorial-text dark:text-stone-200">
          Consult <span className="underline underline-offset-3">Article 4, Subsection B</span> for regulatory compliance.
        </div>
      )
    },
    {
      id: 'highlight',
      category: 'formatting',
      title: 'Marker Highlight [A]',
      shortcut: 'Alt + M',
      icon: <Highlighter size={16} className="text-amber-500" />,
      description: 'Simulates a yellow editorial highlighter pen for key study lines and review points.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-editorial-text dark:text-stone-200">
          Remember that <mark className="bg-yellow-200 dark:bg-amber-900/60 dark:text-amber-200 px-1 py-0.5 rounded text-stone-950 font-medium">all chapter outlines are completely non-destructive</mark>.
        </div>
      )
    },
    {
      id: 'strike',
      category: 'formatting',
      title: 'Strikethrough [S]',
      icon: <Strikethrough size={16} className="text-editorial-muted dark:text-stone-400" />,
      description: 'Line through text denoting deprecated hypotheses, revisions, or edits.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-editorial-text dark:text-stone-200">
          <span className="line-through text-editorial-muted">Initial hypothesis from 2024</span> Revised model 2026.
        </div>
      )
    },
    {
      id: 'code',
      category: 'formatting',
      title: 'Monospace Code [code]',
      icon: <Code size={16} className="text-emerald-700 dark:text-emerald-400" />,
      description: 'Typesets code identifiers, mathematical symbols, or syntax variables in JetBrains Mono.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs">
          Execute <code className="bg-editorial-sidebar dark:bg-stone-800 text-editorial-accent dark:text-amber-400 px-1.5 py-0.5 rounded font-mono text-[11px]">compile_volume()</code> before final archival binding.
        </div>
      )
    },

    // 3. Alignment
    {
      id: 'align-left',
      category: 'alignment',
      title: 'Align Left',
      shortcut: 'Alt + L',
      icon: <AlignLeft size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Standard flush-left alignment with ragged right edge. Default for modern book chapters.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-left text-editorial-text dark:text-stone-200">
          The paragraphs flow from left to right along a uniform left margin guide.
        </div>
      )
    },
    {
      id: 'align-center',
      category: 'alignment',
      title: 'Align Center',
      shortcut: 'Alt + C',
      icon: <AlignCenter size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Centered text layout. Designed for epigraphs, dedication stanzas, and chapter numerals.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-center text-editorial-text dark:text-stone-200 italic">
          — Book Builder Shaastra Dedication —
        </div>
      )
    },
    {
      id: 'align-right',
      category: 'alignment',
      title: 'Align Right',
      shortcut: 'Alt + R',
      icon: <AlignRight size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Flush right alignment. Perfect for marginal dates, sign-offs, and author monikers.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-right text-editorial-muted dark:text-stone-400">
          New Delhi, Autumn 2026
        </div>
      )
    },
    {
      id: 'align-justify',
      category: 'alignment',
      title: 'Balanced Justify',
      shortcut: 'Alt + J',
      icon: <AlignJustify size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Microsoft Word-grade balanced alignment with uniform left and right borders.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-justify text-editorial-text dark:text-stone-200 leading-relaxed">
          Both left and right margins form clean straight architectural columns just like printed hardcover books.
        </div>
      )
    },
    {
      id: 'indent',
      category: 'alignment',
      title: 'Indent / Outdent',
      shortcut: 'Tab / Shift+Tab',
      icon: <Indent size={16} className="text-editorial-muted dark:text-stone-300" />,
      description: 'Shifts text or nested list elements inward by half-inch typographic intervals.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg text-xs font-serif text-editorial-text dark:text-stone-200">
          <div className="pl-6 border-l-2 border-editorial-border dark:border-stone-700 italic">
            Indented sub-paragraph beat reflecting deeper conceptual nesting.
          </div>
        </div>
      )
    },

    // 4. Tables
    {
      id: 'table-presets',
      category: 'tables',
      title: 'Word-Style Tables (2×2, 3×3, 4×3 & Custom)',
      icon: <TableIcon size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Fully structured tables with styled header rows, clean borders, and editable cells.',
      preview: (
        <div className="p-3 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg overflow-x-auto">
          <table className="w-full text-xs font-serif border-collapse">
            <thead>
              <tr className="bg-editorial-sidebar/60 dark:bg-stone-800 border-b border-editorial-border dark:border-stone-700">
                <th className="p-1.5 text-left font-bold text-editorial-text dark:text-stone-100">Chapter Beat</th>
                <th className="p-1.5 text-left font-bold text-editorial-text dark:text-stone-100">Word Target</th>
                <th className="p-1.5 text-left font-bold text-editorial-text dark:text-stone-100">Milestone</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-editorial-border/60 dark:border-stone-800">
                <td className="p-1.5 text-editorial-text dark:text-stone-200">I. Grounding</td>
                <td className="p-1.5 text-editorial-muted dark:text-stone-400 font-mono text-[11px]">3,500w</td>
                <td className="p-1.5 text-emerald-700 dark:text-emerald-400 font-bold">Drafted</td>
              </tr>
              <tr>
                <td className="p-1.5 text-editorial-text dark:text-stone-200">II. Exploration</td>
                <td className="p-1.5 text-editorial-muted dark:text-stone-400 font-mono text-[11px]">4,200w</td>
                <td className="p-1.5 text-amber-700 dark:text-amber-400 font-bold">In Review</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 'table-controls',
      category: 'tables',
      title: 'Table Row & Column Dynamic Controls',
      icon: <PlusSquare size={16} className="text-emerald-600 dark:text-emerald-400" />,
      description: 'When your cursor is inside any table, dynamic buttons appear in the toolbar: +Row, -Row, +Col, -Col, and Delete Table.',
      preview: (
        <div className="p-2.5 bg-editorial-sidebar/40 dark:bg-stone-800/60 border border-editorial-border dark:border-stone-700 rounded-lg flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-700 text-emerald-800 dark:text-emerald-300 font-bold">+ Row</span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-700 text-red-700 dark:text-red-400 font-bold">- Row</span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-700 text-emerald-800 dark:text-emerald-300 font-bold">+ Col</span>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-700 text-red-700 dark:text-red-400 font-bold">- Col</span>
          <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold">Del Table</span>
        </div>
      )
    },

    // 5. Callout Boxes
    {
      id: 'box-info',
      category: 'boxes',
      title: '💡 Info & Concept Note Box',
      icon: <Lightbulb size={16} className="text-blue-600 dark:text-blue-400" />,
      description: 'Azure blue container for foundational theoretical frameworks, scientific definitions, and background context.',
      preview: (
        <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-400 text-xs font-serif leading-relaxed text-blue-950 dark:text-blue-100">
          <strong className="font-bold flex items-center gap-1.5 mb-1">
            <span>💡 Note:</span>
          </strong>
          <span>Theoretical models indicate that learning retention multiplies by 3.2x when students construct hands-on artifacts.</span>
        </div>
      )
    },
    {
      id: 'box-caution',
      category: 'boxes',
      title: '⚠️ Caution & Pitfall Box',
      icon: <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />,
      description: 'Amber warning container for critical reader disclaimers, edge-case warnings, and common pitfalls.',
      preview: (
        <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border-l-4 border-amber-600 dark:border-amber-400 text-xs font-serif leading-relaxed text-amber-950 dark:text-amber-100">
          <strong className="font-bold flex items-center gap-1.5 mb-1">
            <span>⚠️ Caution:</span>
          </strong>
          <span>Do not overwrite primary dataset references without documenting the initial observation methodology.</span>
        </div>
      )
    },
    {
      id: 'box-tip',
      category: 'boxes',
      title: '✨ Pro-Tip & Rule of Thumb',
      icon: <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />,
      description: 'Emerald green container for practical actionable advice, authorial heuristics, and productivity techniques.',
      preview: (
        <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-600 dark:border-emerald-400 text-xs font-serif leading-relaxed text-emerald-950 dark:text-emerald-100">
          <strong className="font-bold flex items-center gap-1.5 mb-1">
            <span>✨ Pro-Tip:</span>
          </strong>
          <span>Draft the entire chapter first in one continuous sprint before revising headings or punctuation.</span>
        </div>
      )
    },
    {
      id: 'box-quote',
      category: 'boxes',
      title: '“ Literary Reflection & Epigraph',
      icon: <Quote size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Terracotta warm container for poignant philosophical reflections, quotes, and thematic epigraphs.',
      preview: (
        <div className="p-3 rounded-lg bg-orange-50/50 dark:bg-orange-950/30 border-l-4 border-editorial-accent dark:border-amber-500 text-xs font-serif italic leading-relaxed text-editorial-text dark:text-stone-200">
          <strong className="font-bold not-italic flex items-center gap-1.5 mb-1 text-editorial-accent dark:text-amber-400">
            <span>“ Key Reflection:</span>
          </strong>
          <span>"The mind is not a vessel to be filled, but a fire to be kindled." — Plutarch</span>
        </div>
      )
    },
    {
      id: 'box-note',
      category: 'boxes',
      title: '📌 Important Note & Action Item',
      icon: <Bookmark size={16} className="text-stone-700 dark:text-stone-300" />,
      description: 'Framed neutral container with subtle borders for assignment steps, checklists, and editorial instructions.',
      preview: (
        <div className="p-3 rounded-lg bg-editorial-sidebar/40 dark:bg-stone-800/60 border border-editorial-border dark:border-stone-700 text-xs font-serif leading-relaxed text-editorial-text dark:text-stone-200">
          <strong className="font-bold flex items-center gap-1.5 mb-1">
            <span>📌 Important Note:</span>
          </strong>
          <span>Complete Exercise 2.4 in the companion workbook before proceeding to Section 3.</span>
        </div>
      )
    },
    {
      id: 'box-takeaway',
      category: 'boxes',
      title: '✓ Key Takeaways & Summary Box',
      icon: <CheckCircle size={16} className="text-teal-600 dark:text-teal-400" />,
      description: 'Teal sage summary box designed for end-of-chapter syntheses, bulleted recaps, and study milestones.',
      preview: (
        <div className="p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/40 border-l-4 border-teal-600 dark:border-teal-400 text-xs font-serif leading-relaxed text-teal-950 dark:text-teal-100">
          <strong className="font-bold flex items-center gap-1.5 mb-1">
            <span>✓ Key Takeaways:</span>
          </strong>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
            <li>Chapters provide structural boundaries preventing disorientation.</li>
            <li>Export preserves true archival A4 geometry with zero data degradation.</li>
          </ul>
        </div>
      )
    },

    // 6. Author Utilities
    {
      id: 'find-replace',
      category: 'actions',
      title: 'Find & Replace (Whole Words Only)',
      shortcut: 'Alt + F',
      icon: <Search size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Microsoft Word-grade search utility. Includes Whole Word matching so searching for "art" never accidentally replaces letters inside "smart" or "start".',
      preview: (
        <div className="p-2.5 bg-editorial-sidebar/30 dark:bg-stone-800/50 border border-editorial-border dark:border-stone-700 rounded-lg flex items-center justify-between text-xs font-mono">
          <span className="text-editorial-text dark:text-stone-200">Find: <span className="bg-yellow-200 dark:bg-amber-900/60 text-stone-900 dark:text-white px-1 rounded">concept</span></span>
          <span className="text-[10px] bg-editorial-accent text-white px-1.5 py-0.5 rounded font-bold">1 of 4 matches</span>
        </div>
      )
    },
    {
      id: 'autosave',
      category: 'actions',
      title: 'AutoSave Toggle (Offline-First)',
      shortcut: 'Alt + A',
      icon: <Cloud size={16} className="text-emerald-600 dark:text-emerald-400" />,
      description: 'Continuous offline persistence. Automatically preserves every keystroke every 3 seconds into local database storage.',
      preview: (
        <div className="p-2.5 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg flex items-center gap-2 text-xs">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-emerald-800 dark:text-emerald-400">Autosaved to Local Storage • Just now</span>
        </div>
      )
    },
    {
      id: 'manual-save',
      category: 'actions',
      title: 'Manual Save Checkpoint',
      shortcut: 'Alt + S',
      icon: <Save size={16} className="text-editorial-text dark:text-stone-100" />,
      description: 'Explicit manual checkpoint button. Flushes all pending edits to disk immediately with visual confirmation.',
      preview: (
        <div className="p-2.5 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg flex items-center justify-between text-xs">
          <span className="font-serif italic text-editorial-text dark:text-stone-200">Checkpoint recorded</span>
          <span className="bg-editorial-sidebar dark:bg-stone-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-editorial-accent dark:text-amber-400">SAVED</span>
        </div>
      )
    },
    {
      id: 'page-size-a4',
      category: 'actions',
      title: 'A4 & Multi-Format Page Geometry',
      icon: <Download size={16} className="text-editorial-accent dark:text-amber-400" />,
      description: 'Standard A4 (210 × 297 mm) by default. Also supports Letter (8.5 × 11 in), A3, A5, and Legal across Editor, Preview, and Export.',
      preview: (
        <div className="p-2.5 bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 rounded-lg flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-editorial-sidebar dark:bg-stone-800 font-mono text-[11px] font-bold text-editorial-accent dark:text-amber-400 border border-editorial-border dark:border-stone-700">
            A4 Standard
          </span>
          <span className="text-[11px] font-mono text-editorial-muted dark:text-stone-400">210 × 297 mm</span>
        </div>
      )
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? keyItems 
    : keyItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-800 p-5 sm:p-6 rounded-2xl shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-editorial-divider dark:border-stone-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-editorial-accent dark:text-amber-400 mb-0.5">
            Editor Key & Legend Reference Directory
          </div>
          <h2 className="text-lg sm:text-xl font-serif italic font-bold text-editorial-text dark:text-stone-100">
            Pictorial Visual Key for All Editor Buttons, Tables & Boxes
          </h2>
          <p className="text-xs text-editorial-muted dark:text-stone-400 mt-1 max-w-xl">
            A complete illustrated directory showing every toolbar icon, keyboard combination, and the exact visual formatting it renders on the page.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 bg-editorial-sidebar dark:bg-stone-800 text-editorial-accent dark:text-amber-400 rounded-full border border-editorial-border dark:border-stone-700 shrink-0">
          {keyItems.length} Tools Cataloged
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { id: 'all', label: 'All Tools' },
          { id: 'headings', label: 'Headings & Styles' },
          { id: 'formatting', label: 'Inline Typography' },
          { id: 'alignment', label: 'Alignment & Indent' },
          { id: 'tables', label: 'Word Tables' },
          { id: 'boxes', label: 'Callout Boxes' },
          { id: 'actions', label: 'Actions & Utilities' }
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-editorial-accent text-white dark:bg-amber-600 dark:text-white font-bold shadow-2xs'
                : 'bg-editorial-sidebar/40 dark:bg-stone-800 text-editorial-muted dark:text-stone-300 hover:text-editorial-text dark:hover:text-white border border-editorial-border dark:border-stone-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Pictorial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-editorial-border/80 dark:border-stone-800 bg-editorial-bg/40 dark:bg-stone-950/40 hover:border-editorial-accent dark:hover:border-amber-500 transition-all flex flex-col justify-between space-y-3 shadow-2xs group"
          >
            {/* Top Bar with Icon, Title, and Shortcut Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-700 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-sm text-editorial-text dark:text-stone-100 leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-editorial-muted dark:text-stone-400 capitalize">
                    {item.category}
                  </span>
                </div>
              </div>

              {item.shortcut && (
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-stone-900 border border-editorial-border dark:border-stone-700 font-mono text-[10px] font-bold text-editorial-accent dark:text-amber-400 shrink-0 shadow-2xs">
                  {item.shortcut}
                </kbd>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-editorial-muted dark:text-stone-400 font-serif leading-relaxed">
              {item.description}
            </p>

            {/* Rendered Visual Picture Preview */}
            <div className="pt-2 border-t border-editorial-divider/70 dark:border-stone-800/80">
              <div className="text-[9px] font-mono uppercase tracking-wider text-editorial-muted dark:text-stone-500 font-bold mb-1.5 flex items-center gap-1">
                <span>Visual Rendered Output:</span>
              </div>
              {item.preview}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
