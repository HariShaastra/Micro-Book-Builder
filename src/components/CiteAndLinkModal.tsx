/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Book, ReferenceItem, Chapter } from '../types.ts';
import { 
  X, 
  Quote, 
  BookOpen, 
  Link2, 
  ExternalLink, 
  Bookmark, 
  Plus, 
  Check, 
  Search, 
  Layers 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CiteAndLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBook: Book;
  allBooks: Book[];
  onInsertHtml: (html: string) => void;
  onAddReference: (ref: ReferenceItem) => void;
}

export default function CiteAndLinkModal({
  isOpen,
  onClose,
  currentBook,
  allBooks,
  onInsertHtml,
  onAddReference
}: CiteAndLinkModalProps) {
  const [tab, setTab] = useState<'cite' | 'link-book' | 'link-chapter' | 'web-link'>('cite');
  const [search, setSearch] = useState('');

  // New Reference inline form
  const [isAddingNewRef, setIsAddingNewRef] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
  const [newPublisher, setNewPublisher] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Web link form
  const [webUrl, setWebUrl] = useState('');
  const [webText, setWebText] = useState('');

  if (!isOpen) return null;

  // Insert existing reference
  const handleInsertCitation = (ref: ReferenceItem) => {
    const lastName = ref.author.split(',')[0].split(' ').pop() || ref.author;
    const citationHtml = `<span class="inline-citation font-serif font-bold text-editorial-accent cursor-pointer hover:underline" title="${ref.title} (${ref.publisher || ''})">(${lastName}, ${ref.year || 'n.d.'})</span>&nbsp;`;
    onInsertHtml(citationHtml);
    onClose();
  };

  // Create new ref and insert
  const handleCreateAndInsert = () => {
    if (!newAuthor.trim() || !newTitle.trim()) return;
    const newRef: ReferenceItem = {
      id: uuidv4(),
      type: 'book',
      author: newAuthor.trim(),
      title: newTitle.trim(),
      year: newYear.trim(),
      publisher: newPublisher.trim(),
      url: newUrl.trim()
    };
    onAddReference(newRef);
    handleInsertCitation(newRef);
  };

  // Link author's other book (Zoho-style work linking)
  const handleLinkBook = (targetBook: Book) => {
    const workLinkHtml = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-editorial-sidebar/60 border border-editorial-border font-serif italic text-editorial-text hover:text-editorial-accent" title="Companion Shaastra Work: ${targetBook.title}">📖 <strong>${targetBook.title}</strong> (${targetBook.authorName || 'Author'}, ${targetBook.copyrightYear || 2026})</span>&nbsp;`;
    onInsertHtml(workLinkHtml);
    onClose();
  };

  // Link internal chapter
  const handleLinkChapter = (ch: Chapter, index: number) => {
    const chapterLinkHtml = `<span class="inline-flex items-center gap-1 font-serif italic font-semibold text-editorial-accent underline decoration-dotted" title="Internal cross-reference">§ Chapter ${index + 1}: ${ch.title}</span>&nbsp;`;
    onInsertHtml(chapterLinkHtml);
    onClose();
  };

  // Insert standard web hyperlink
  const handleInsertWebLink = () => {
    if (!webUrl.trim()) return;
    const anchorText = webText.trim() || webUrl.trim();
    const linkHtml = `<a href="${webUrl.trim()}" target="_blank" rel="noopener noreferrer" class="text-editorial-accent underline font-medium hover:text-editorial-text">${anchorText}</a>&nbsp;`;
    onInsertHtml(linkHtml);
    onClose();
  };

  const filteredRefs = (currentBook.references || []).filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.author.toLowerCase().includes(search.toLowerCase())
  );

  const otherBooks = allBooks.filter(b => b.id !== currentBook.id);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-editorial-bg border border-editorial-border rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-editorial-divider flex items-center justify-between bg-editorial-sidebar/40">
          <div>
            <div className="text-[9px] font-mono uppercase font-bold tracking-widest text-editorial-accent">
              Scholarship & Cross-Linking Tool
            </div>
            <h2 className="text-xl font-serif italic font-bold text-editorial-text">
              Cite & Link Works
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-editorial-muted hover:text-editorial-text rounded-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-editorial-divider bg-white px-4 pt-2 gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setTab('cite')}
            className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              tab === 'cite'
                ? 'border-editorial-accent text-editorial-accent'
                : 'border-transparent text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <Quote size={13} />
            <span>Cite Bibliography</span>
          </button>

          <button
            onClick={() => setTab('link-book')}
            className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              tab === 'link-book'
                ? 'border-editorial-accent text-editorial-accent'
                : 'border-transparent text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <BookOpen size={13} />
            <span>Link Other Works</span>
          </button>

          <button
            onClick={() => setTab('link-chapter')}
            className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              tab === 'link-chapter'
                ? 'border-editorial-accent text-editorial-accent'
                : 'border-transparent text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <Bookmark size={13} />
            <span>Cross-Link Chapter</span>
          </button>

          <button
            onClick={() => setTab('web-link')}
            className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              tab === 'web-link'
                ? 'border-editorial-accent text-editorial-accent'
                : 'border-transparent text-editorial-muted hover:text-editorial-text'
            }`}
          >
            <ExternalLink size={13} />
            <span>Web Link</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CITE BIBLIOGRAPHY */}
          {tab === 'cite' && (
            <div className="space-y-4">
              {!isAddingNewRef ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-2.5 text-editorial-muted" />
                      <input
                        type="text"
                        placeholder="Search cited authors or titles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded pl-8 pr-3 py-1.5 text-xs outline-none focus:border-editorial-accent"
                      />
                    </div>
                    <button
                      onClick={() => setIsAddingNewRef(true)}
                      className="px-3 py-1.5 bg-editorial-accent text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-editorial-text flex items-center gap-1 shrink-0"
                    >
                      <Plus size={13} />
                      <span>New Source</span>
                    </button>
                  </div>

                  <div className="space-y-2 pr-1">
                    {filteredRefs.length === 0 ? (
                      <div className="text-center p-8 bg-white border border-editorial-border rounded-lg text-xs text-editorial-muted">
                        No bibliographic entries found for this book. Click <strong>+ New Source</strong> above to cite a book, research paper, or digital archive.
                      </div>
                    ) : (
                      filteredRefs.map((ref) => (
                        <div
                          key={ref.id}
                          className="bg-white border border-editorial-border rounded-lg p-3 flex items-center justify-between gap-3 hover:border-editorial-accent transition-colors"
                        >
                          <div className="space-y-0.5">
                            <span className="font-serif font-bold text-xs text-editorial-text">
                              {ref.author} ({ref.year || 'n.d.'})
                            </span>
                            <p className="text-xs italic text-editorial-muted truncate max-w-md">
                              "{ref.title}"
                            </p>
                          </div>
                          <button
                            onClick={() => handleInsertCitation(ref)}
                            className="px-3 py-1 bg-editorial-sidebar text-editorial-accent hover:bg-editorial-accent hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                          >
                            Insert Citation
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white border border-editorial-border p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-editorial-divider pb-2">
                    <span className="font-serif font-bold text-sm text-editorial-text">Add & Cite New Reference</span>
                    <button onClick={() => setIsAddingNewRef(false)} className="text-xs text-editorial-muted hover:text-editorial-text">Cancel</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Author(s)..."
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="border border-editorial-border rounded p-2 text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Year (e.g. 2026)..."
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="border border-editorial-border rounded p-2 text-xs outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Title of Work..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border border-editorial-border rounded p-2 text-xs outline-none font-serif italic"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Publisher / Journal..."
                      value={newPublisher}
                      onChange={(e) => setNewPublisher(e.target.value)}
                      className="border border-editorial-border rounded p-2 text-xs outline-none"
                    />
                    <input
                      type="url"
                      placeholder="URL / DOI link (optional)..."
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="border border-editorial-border rounded p-2 text-xs outline-none font-mono text-[11px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsAddingNewRef(false)}
                      className="px-3 py-1.5 text-xs text-editorial-muted hover:text-editorial-text"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateAndInsert}
                      disabled={!newAuthor.trim() || !newTitle.trim()}
                      className="px-4 py-1.5 bg-editorial-accent text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-editorial-text disabled:opacity-50"
                    >
                      Save & Insert
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LINK OTHER WORKS IN SHAASTRA LIBRARY */}
          {tab === 'link-book' && (
            <div className="space-y-3">
              <p className="text-xs text-editorial-muted font-serif italic leading-relaxed">
                Like in Zoho Writer, link your other authored works in the library as related publications, companion volumes, or reading recommendations.
              </p>
              <div className="space-y-2">
                {otherBooks.length === 0 ? (
                  <div className="text-center p-8 bg-white border border-editorial-border rounded-lg text-xs text-editorial-muted">
                    No other books in your library yet. Once you create additional manuscripts, you can cross-link them here with one click.
                  </div>
                ) : (
                  otherBooks.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white border border-editorial-border rounded-lg p-3 flex items-center justify-between gap-3 hover:border-editorial-accent transition-colors"
                    >
                      <div>
                        <span className="font-serif font-bold text-xs text-editorial-text block">{b.title}</span>
                        <span className="text-[10px] font-mono text-editorial-muted uppercase">{b.type} • By {b.authorName || 'Author'}</span>
                      </div>
                      <button
                        onClick={() => handleLinkBook(b)}
                        className="px-3 py-1 bg-editorial-sidebar text-editorial-text hover:bg-editorial-text hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                      >
                        Insert Link
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CROSS-LINK CHAPTERS */}
          {tab === 'link-chapter' && (
            <div className="space-y-3">
              <p className="text-xs text-editorial-muted font-serif italic leading-relaxed">
                Insert an internal cross-reference to another chapter or fragment within this manuscript.
              </p>
              <div className="space-y-2">
                {currentBook.chapters.map((ch, idx) => (
                  <div
                    key={ch.id}
                    className="bg-white border border-editorial-border rounded-lg p-3 flex items-center justify-between gap-3 hover:border-editorial-accent transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-editorial-accent mr-2">Chapter {idx + 1}</span>
                      <span className="font-serif font-medium text-xs text-editorial-text">{ch.title}</span>
                    </div>
                    <button
                      onClick={() => handleLinkChapter(ch, idx)}
                      className="px-3 py-1 bg-editorial-sidebar text-editorial-text hover:bg-editorial-text hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                    >
                      Cross-Link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WEB LINK */}
          {tab === 'web-link' && (
            <div className="bg-white border border-editorial-border p-4 rounded-lg space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                  Destination URL <span className="text-red-600">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  className="w-full border border-editorial-border rounded p-2 text-xs outline-none font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-editorial-text block mb-1">
                  Anchor Display Text (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. National Education Portal archive"
                  value={webText}
                  onChange={(e) => setWebText(e.target.value)}
                  className="w-full border border-editorial-border rounded p-2 text-xs outline-none"
                />
              </div>
              <button
                onClick={handleInsertWebLink}
                disabled={!webUrl.trim()}
                className="w-full py-2 bg-editorial-text text-white hover:bg-black rounded font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                Insert Hyperlink
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-editorial-divider bg-editorial-sidebar/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-editorial-muted hover:text-editorial-text"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
