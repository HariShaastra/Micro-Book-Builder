/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  FilePlus, 
  LayoutTemplate, 
  Upload, 
  FileText, 
  Check, 
  Sparkles, 
  BookOpen, 
  Layers, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { Book, BookType, TEMPLATES, Template, DocumentStatus, Chapter } from '../types.ts';
import { v4 as uuidv4 } from 'uuid';
import * as mammoth from 'mammoth';

interface NewBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBook: (book: Book) => void;
  defaultAuthor?: string;
}

const BOOK_TYPES: { id: BookType; label: string; icon: string; desc: string }[] = [
  { id: 'children', label: 'Children\'s Book', icon: '🎨', desc: 'Illustrated storytelling with rich chapter beats' },
  { id: 'novel', label: 'Fiction Novel', icon: '📖', desc: '3-Act structure, multi-chapter literary arc' },
  { id: 'guide', label: 'Practical Guide / Handbook', icon: '🧭', desc: 'Step-by-step instructional manual' },
  { id: 'academic', label: 'Academic Book / Monograph', icon: '🎓', desc: 'Thematic discourse with citations' },
  { id: 'research', label: 'Research & Policy Paper', icon: '📊', desc: 'Field methodology, data tables & analysis' },
  { id: 'textbook', label: 'Educational Textbook', icon: '📚', desc: 'Curricular units with summaries and review' },
  { id: 'workbook', label: 'Student Inquiry Workbook', icon: '📝', desc: 'Hands-on worksheets and observation logs' },
  { id: 'biography', label: 'Biography / Memoir', icon: '👤', desc: 'Chronological life narrative & reflections' },
  { id: 'poetry', label: 'Poetry & Verse Anthology', icon: '🪶', desc: 'Stanza cycles, sonnets, and commentary' },
  { id: 'essay', label: 'Essay Collection', icon: '✒️', desc: 'Thematic literary or philosophical essays' },
  { id: 'report', label: 'Institutional Report', icon: '🏛️', desc: 'Strategic whitepaper or governance framework' },
  { id: 'portfolio', label: 'Creative Portfolio', icon: '💼', desc: 'Project showcase with commentary' },
  { id: 'custom', label: 'Blank / Custom Format', icon: '📄', desc: 'Boundless layout for unique visions' }
];

export default function NewBookModal({
  isOpen,
  onClose,
  onCreateBook,
  defaultAuthor = 'Author'
}: NewBookModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [startMethod, setStartMethod] = useState<'blank' | 'template' | 'import'>('blank');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('children');
  
  // Book Metadata Form
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [authorName, setAuthorName] = useState(defaultAuthor);
  const [coAuthors, setCoAuthors] = useState('');
  const [publisher, setPublisher] = useState('Shaastra Publishing Workshop');
  const [language, setLanguage] = useState('English');
  const [genre, setGenre] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [description, setDescription] = useState('');
  const [bookType, setBookType] = useState<BookType>('children');
  const [edition, setEdition] = useState('First Edition');
  const [copyrightYear, setCopyrightYear] = useState(new Date().getFullYear());
  const [isbn, setIsbn] = useState('');
  const [status, setStatus] = useState<DocumentStatus>('idea');
  const [tagInput, setTagInput] = useState('');

  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importedChapters, setImportedChapters] = useState<Chapter[] | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let rawText = '';

      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer });
        rawText = res.value;
      } else {
        rawText = await file.text();
      }

      // Split into chapters by headings or blocks
      const paragraphs = rawText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
      const chapters: Chapter[] = [];
      const chunkSize = Math.max(2, Math.ceil(paragraphs.length / 5));

      for (let i = 0; i < paragraphs.length; i += chunkSize) {
        const slice = paragraphs.slice(i, i + chunkSize);
        const chapterNum = Math.floor(i / chunkSize) + 1;
        chapters.push({
          id: uuidv4(),
          title: `Fragment ${chapterNum}`,
          content: slice.map(p => `<p>${p}</p>`).join(''),
          isBookmarked: false,
          status: 'draft',
          wordCount: slice.join(' ').split(/\s+/).length,
          order: chapterNum - 1
        });
      }

      if (chapters.length === 0) {
        chapters.push({
          id: uuidv4(),
          title: 'Opening Chapter',
          content: `<p>${rawText}</p>`,
          isBookmarked: false,
          status: 'draft',
          wordCount: rawText.split(/\s+/).length,
          order: 0
        });
      }

      setImportedChapters(chapters);
      if (!title) {
        setTitle(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
      }
      setStep(2);
    } catch (err) {
      console.error('Import error:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFinish = () => {
    if (!title.trim()) return;

    let chapters: Chapter[] = [];

    if (importedChapters && importedChapters.length > 0) {
      chapters = importedChapters;
    } else if (startMethod === 'template') {
      const t = TEMPLATES.find(temp => temp.id === selectedTemplateId) || TEMPLATES[0];
      chapters = t.structure.map((chapterTitle, index) => ({
        id: uuidv4(),
        title: chapterTitle,
        content: `<h2>${chapterTitle}</h2><p>Begin writing the opening draft for this section...</p>`,
        isBookmarked: false,
        status: 'draft',
        wordCount: 10,
        order: index
      }));
    } else {
      chapters = [
        {
          id: uuidv4(),
          title: 'Chapter 1: The Beginning',
          content: '<h1>Chapter 1: The Beginning</h1><p>Start writing your thoughts freely without constraints...</p>',
          isBookmarked: false,
          status: 'draft',
          wordCount: 10,
          order: 0
        }
      ];
    }

    const tags = tagInput ? tagInput.split(',').map(t => t.trim()).filter(Boolean) : [bookType];

    const newBook: Book = {
      id: uuidv4(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      authorName: authorName.trim() || 'Author',
      coAuthors: coAuthors ? coAuthors.split(',').map(s => s.trim()).filter(Boolean) : [],
      publisher: publisher.trim(),
      language: language.trim(),
      genre: genre.trim(),
      targetAudience: targetAudience.trim(),
      description: description.trim(),
      type: bookType,
      blueprintId: startMethod === 'template' ? selectedTemplateId : 'scratch',
      edition: edition.trim(),
      copyrightYear: Number(copyrightYear) || new Date().getFullYear(),
      isbn: isbn.trim(),
      status: status,
      tags: tags,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      chapters: chapters,
      cover: {
        title: title.trim(),
        subtitle: subtitle.trim(),
        author: authorName.trim() || 'Author',
        bgColor: '#1B4332',
        textColor: '#FFFFFF',
        accentColor: '#D8F3DC',
        styleTemplate: bookType === 'children' ? 'children' : bookType === 'academic' ? 'academic' : 'minimal',
        alignment: 'center',
        borderStyle: 'ornate'
      },
      frontMatter: {
        titlePage: {
          enabled: true,
          title: title.trim(),
          subtitle: subtitle.trim(),
          author: authorName.trim() || 'Author',
          publisher: publisher.trim(),
          year: Number(copyrightYear) || new Date().getFullYear()
        },
        copyright: {
          enabled: true,
          text: `© ${copyrightYear} ${authorName.trim() || 'Author'}. All rights reserved under the Shaastra Publishing Framework.`,
          isbn: isbn.trim(),
          edition: edition.trim()
        }
      },
      pageSettings: {
        size: 'Trade 6x9',
        margins: 'normal',
        orientation: 'portrait',
        headerText: title.trim(),
        footerText: 'Book Builder Shaastra',
        showPageNumbers: true,
        chapterNumbering: true,
        borderStyle: 'classic-single',
        borderColor: '#EBE5C4',
        fontFamily: 'serif',
        lineSpacing: '1.75',
        fontSize: 'base'
      },
      tocSettings: {
        enabled: true,
        style: 'dots',
        showPageNumbers: true,
        showSubsections: false
      },
      references: [],
      bookNotes: [],
      characters: [],
      assets: []
    };

    onCreateBook(newBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-editorial-bg border border-editorial-border rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-editorial-divider flex items-center justify-between bg-editorial-sidebar/40">
          <div>
            <div className="text-[9px] font-mono uppercase font-bold tracking-widest text-editorial-accent">
              Creation Wizard • Step {step} of 2
            </div>
            <h2 className="text-xl sm:text-2xl font-serif italic text-editorial-text font-bold">
              {step === 1 ? 'Choose How You Want to Start' : 'Manuscript Metadata & Structure'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-editorial-muted hover:text-editorial-text rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-sm font-serif italic text-editorial-muted">
                Select a foundation for your new book. Every section, chapter, and block remains fully editable at all times.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Method 1: Blank Book */}
                <button
                  onClick={() => setStartMethod('blank')}
                  className={`p-5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-44 ${
                    startMethod === 'blank'
                      ? 'border-editorial-accent bg-white shadow-md ring-2 ring-editorial-accent/20'
                      : 'border-editorial-border bg-white/40 hover:bg-white/80'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-editorial-sidebar flex items-center justify-center text-editorial-accent mb-3">
                      <FilePlus size={20} />
                    </div>
                    <h3 className="font-serif font-bold text-base text-editorial-text">Blank Book</h3>
                    <p className="text-xs text-editorial-muted mt-1 leading-relaxed">
                      A clean slate. Start from Chapter 1 with complete freedom.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-editorial-accent">
                    Unconstrained
                  </div>
                </button>

                {/* Method 2: Use Template */}
                <button
                  onClick={() => setStartMethod('template')}
                  className={`p-5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-44 ${
                    startMethod === 'template'
                      ? 'border-editorial-accent bg-white shadow-md ring-2 ring-editorial-accent/20'
                      : 'border-editorial-border bg-white/40 hover:bg-white/80'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-editorial-sidebar flex items-center justify-center text-editorial-accent mb-3">
                      <LayoutTemplate size={20} />
                    </div>
                    <h3 className="font-serif font-bold text-base text-editorial-text">Use Template</h3>
                    <p className="text-xs text-editorial-muted mt-1 leading-relaxed">
                      Pre-structured chapters for fiction, children's books, or research.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-editorial-accent">
                    10 Curated Blueprints
                  </div>
                </button>

                {/* Method 3: Import Existing Content */}
                <label
                  className={`p-5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-44 ${
                    startMethod === 'import'
                      ? 'border-editorial-accent bg-white shadow-md ring-2 ring-editorial-accent/20'
                      : 'border-editorial-border bg-white/40 hover:bg-white/80'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-full bg-editorial-sidebar flex items-center justify-center text-editorial-accent mb-3">
                      <Upload size={20} />
                    </div>
                    <h3 className="font-serif font-bold text-base text-editorial-text">Import Document</h3>
                    <p className="text-xs text-editorial-muted mt-1 leading-relaxed">
                      Load Word (.docx), Markdown (.md), or text files into chapters.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-editorial-accent">
                    {isImporting ? 'Processing File...' : 'Upload File'}
                  </div>
                  <input
                    type="file"
                    accept=".docx,.md,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Template Picker if method is template */}
              {startMethod === 'template' && (
                <div className="pt-4 border-t border-editorial-divider space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block">
                    Select a Template
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TEMPLATES.map(temp => (
                      <div
                        key={temp.id}
                        onClick={() => setSelectedTemplateId(temp.id)}
                        className={`p-3 rounded border text-left cursor-pointer transition-all ${
                          selectedTemplateId === temp.id
                            ? 'border-editorial-accent bg-white shadow-xs font-medium'
                            : 'border-editorial-border/60 bg-white/20 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-sm text-editorial-text">{temp.name}</span>
                          <span className="text-[9px] font-mono uppercase bg-editorial-sidebar px-1.5 py-0.5 rounded text-editorial-muted">
                            {temp.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-editorial-muted line-clamp-2 mt-1">
                          {temp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Core Titles */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Manuscript Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The River Remembers"
                    className="w-full bg-white border border-editorial-border rounded px-4 py-2.5 text-base font-serif italic focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                    Subtitle <span className="text-[10px] font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. An Illustrated Tale of the Kaveri"
                    className="w-full bg-white border border-editorial-border rounded px-4 py-2 text-sm font-serif italic focus:border-editorial-accent outline-none"
                  />
                </div>
              </div>

              {/* Book Type Picker */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-2">
                  Book Category & Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BOOK_TYPES.map(bt => (
                    <button
                      key={bt.id}
                      type="button"
                      onClick={() => setBookType(bt.id)}
                      className={`p-2.5 rounded border text-left text-xs transition-all cursor-pointer flex items-center gap-2 ${
                        bookType === bt.id
                          ? 'border-editorial-accent bg-white shadow-xs font-bold text-editorial-text'
                          : 'border-editorial-border/60 bg-white/30 text-editorial-muted hover:bg-white'
                      }`}
                    >
                      <span className="text-base">{bt.icon}</span>
                      <div className="truncate">
                        <div className="truncate">{bt.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Author & Publisher Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                    Primary Author
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-white border border-editorial-border rounded px-3 py-2 text-sm focus:border-editorial-accent outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                    Co-Author(s) <span className="text-[10px] font-normal normal-case">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={coAuthors}
                    onChange={(e) => setCoAuthors(e.target.value)}
                    placeholder="e.g. M. Deepa, Dr. K. Rao"
                    className="w-full bg-white border border-editorial-border rounded px-3 py-2 text-sm focus:border-editorial-accent outline-none"
                  />
                </div>
              </div>

              {/* Description & Audience */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                  Synopsis / Core Thesis
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the core theme, audience, and scope of this manuscript..."
                  rows={3}
                  className="w-full bg-white border border-editorial-border rounded p-3 text-sm font-serif focus:border-editorial-accent outline-none resize-none"
                />
              </div>

              {/* Extended Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                    Language
                  </label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-white border border-editorial-border rounded p-1.5 text-xs focus:border-editorial-accent outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                    Genre / Field
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. Ecology, Fiction"
                    className="w-full bg-white border border-editorial-border rounded p-1.5 text-xs focus:border-editorial-accent outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as DocumentStatus)}
                    className="w-full bg-white border border-editorial-border rounded p-1.5 text-xs focus:border-editorial-accent outline-none"
                  >
                    <option value="idea">Idea</option>
                    <option value="planning">Planning</option>
                    <option value="draft">Draft</option>
                    <option value="editing">Editing</option>
                    <option value="final">Final</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                    ISBN (optional)
                  </label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="978-81-..."
                    className="w-full bg-white border border-editorial-border rounded p-1.5 text-xs focus:border-editorial-accent outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-editorial-divider flex items-center justify-between bg-editorial-sidebar/30">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-editorial-muted hover:text-editorial-text px-4 py-2 rounded transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-xs font-bold uppercase tracking-wider text-editorial-muted hover:text-editorial-text px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="bg-editorial-accent text-white hover:bg-editorial-accent/90 px-6 py-2.5 rounded font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Continue to Details</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!title.trim()}
                className="bg-editorial-accent text-white hover:bg-editorial-text disabled:opacity-50 px-6 py-2.5 rounded font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Check size={16} />
                <span>Create Manuscript</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
