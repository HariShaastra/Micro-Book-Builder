/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ReferenceItem } from '../types.ts';
import { Plus, Search, Trash2, Edit3, Copy, Check, Quote, ExternalLink, Book, FileText, Globe } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ReferencesManagerProps {
  references: ReferenceItem[];
  onUpdateReferences: (refs: ReferenceItem[]) => void;
  onInsertReference?: (citationKey: string) => void;
}

export default function ReferencesManager({
  references,
  onUpdateReferences,
  onInsertReference
}: ReferencesManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form fields
  const [type, setType] = useState<ReferenceItem['type']>('book');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [url, setUrl] = useState('');
  const [accessDate, setAccessDate] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setType('book');
    setAuthor('');
    setTitle('');
    setPublisher('');
    setYear('');
    setUrl('');
    setAccessDate('');
    setNotes('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!author.trim() || !title.trim()) return;

    if (editingId) {
      onUpdateReferences(
        references.map(r => r.id === editingId ? {
          ...r,
          type,
          author: author.trim(),
          title: title.trim(),
          publisher: publisher.trim(),
          year: year.trim(),
          url: url.trim(),
          accessDate: accessDate.trim(),
          notes: notes.trim()
        } : r)
      );
    } else {
      const newRef: ReferenceItem = {
        id: uuidv4(),
        type,
        author: author.trim(),
        title: title.trim(),
        publisher: publisher.trim(),
        year: year.trim(),
        url: url.trim(),
        accessDate: accessDate.trim(),
        notes: notes.trim()
      };
      onUpdateReferences([...references, newRef]);
    }
    resetForm();
  };

  const startEdit = (ref: ReferenceItem) => {
    setType(ref.type);
    setAuthor(ref.author);
    setTitle(ref.title);
    setPublisher(ref.publisher || '');
    setYear(ref.year || '');
    setUrl(ref.url || '');
    setAccessDate(ref.accessDate || '');
    setNotes(ref.notes || '');
    setEditingId(ref.id);
    setIsAdding(true);
  };

  const deleteRef = (id: string) => {
    onUpdateReferences(references.filter(r => r.id !== id));
  };

  const copyCitation = (ref: ReferenceItem) => {
    const citation = `(${ref.author.split(',')[0].split(' ')[0]}, ${ref.year || 'n.d.'})`;
    navigator.clipboard.writeText(citation);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = references.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.publisher && r.publisher.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-editorial-border shadow-xs">
        <div>
          <h2 className="text-xl font-serif italic font-bold text-editorial-text">References & Bibliography</h2>
          <p className="text-xs text-editorial-muted mt-0.5">
            Maintain structured citations across books, articles, reports, and digital archives.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search size={14} className="absolute left-3 top-2.5 text-editorial-muted" />
            <input
              type="text"
              placeholder="Search citations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-editorial-sidebar/30 border border-editorial-border rounded pl-8 pr-3 py-1.5 text-xs outline-none focus:border-editorial-accent"
            />
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="bg-editorial-text text-white hover:bg-black px-4 py-2 rounded font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Reference</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal / Card */}
      {isAdding && (
        <div className="bg-editorial-sidebar/40 border-2 border-editorial-accent/30 p-5 rounded-lg space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-editorial-divider pb-2">
            <h3 className="font-serif italic font-bold text-base text-editorial-text">
              {editingId ? 'Edit Citation' : 'New Reference Entry'}
            </h3>
            <button onClick={resetForm} className="text-xs text-editorial-muted hover:text-editorial-text">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                Source Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-white border border-editorial-border rounded p-2 text-xs outline-none"
              >
                <option value="book">Book</option>
                <option value="article">Journal Article</option>
                <option value="report">Policy / Institutional Report</option>
                <option value="website">Website / Digital Archive</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-text block mb-1">
                Author(s) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Salim Ali or Sundaram, A."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-white border border-editorial-border rounded p-2 text-xs outline-none focus:border-editorial-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-text block mb-1">
              Title of Work <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Book of Indian Birds"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-editorial-border rounded p-2 text-xs outline-none focus:border-editorial-accent font-serif italic"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                Publisher / Journal
              </label>
              <input
                type="text"
                placeholder="e.g. Oxford University Press"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="w-full bg-white border border-editorial-border rounded p-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                Publication Year
              </label>
              <input
                type="text"
                placeholder="e.g. 2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-white border border-editorial-border rounded p-2 text-xs outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
                Access Date / Edition
              </label>
              <input
                type="text"
                placeholder="e.g. Retr. Sep 2026"
                value={accessDate}
                onChange={(e) => setAccessDate(e.target.value)}
                className="w-full bg-white border border-editorial-border rounded p-2 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
              URL / DOI Link (optional)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white border border-editorial-border rounded p-2 text-xs outline-none font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-editorial-muted block mb-1">
              Internal Annotation / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Used for Chapter 2 migratory flight velocity stats"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-editorial-border rounded p-2 text-xs outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={resetForm}
              className="px-3 py-1.5 text-xs text-editorial-muted hover:text-editorial-text"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!author.trim() || !title.trim()}
              className="px-4 py-1.5 bg-editorial-accent text-white hover:bg-editorial-text disabled:opacity-50 rounded text-xs font-bold uppercase tracking-wider shadow-xs"
            >
              {editingId ? 'Update Entry' : 'Save Reference'}
            </button>
          </div>
        </div>
      )}

      {/* References List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-editorial-border border-dashed rounded-lg p-10 text-center">
          <Quote size={28} className="mx-auto text-editorial-muted/50 mb-2" />
          <h4 className="font-serif italic font-bold text-sm text-editorial-text">No references found</h4>
          <p className="text-xs text-editorial-muted mt-1 max-w-sm mx-auto">
            Build a comprehensive bibliography to ground your book in authentic scholarship and historical sources.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ref, idx) => (
            <div
              key={ref.id}
              className="bg-white border border-editorial-border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-editorial-text/40 transition-colors shadow-2xs group"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-editorial-sidebar text-editorial-muted">
                    {ref.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-editorial-muted">
                    ({ref.year || 'n.d.'})
                  </span>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-editorial-accent hover:underline flex items-center gap-0.5 text-[10px]"
                      title="Visit link"
                    >
                      <ExternalLink size={10} />
                      <span>Link</span>
                    </a>
                  )}
                </div>

                <div className="font-serif text-sm">
                  <span className="font-bold text-editorial-text">{ref.author}. </span>
                  <span className="italic text-editorial-text">"{ref.title}." </span>
                  {ref.publisher && <span className="text-editorial-muted">{ref.publisher}.</span>}
                </div>

                {ref.notes && (
                  <p className="text-[11px] text-editorial-muted italic">
                    Note: {ref.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => copyCitation(ref)}
                  className="px-2.5 py-1 bg-editorial-sidebar/60 hover:bg-editorial-sidebar border border-editorial-border rounded text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-text flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy in-text citation format"
                >
                  {copiedId === ref.id ? (
                    <>
                      <Check size={11} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Cite</span>
                    </>
                  )}
                </button>

                {onInsertReference && (
                  <button
                    onClick={() => onInsertReference(`(${ref.author.split(' ')[0]}, ${ref.year || 'n.d.'})`)}
                    className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-editorial-border rounded text-[10px] font-bold uppercase tracking-wider text-editorial-accent transition-colors"
                  >
                    Insert
                  </button>
                )}

                <button
                  onClick={() => startEdit(ref)}
                  className="p-1.5 hover:text-editorial-text text-editorial-muted rounded transition-colors"
                  title="Edit Citation"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => deleteRef(ref.id)}
                  className="p-1.5 hover:text-red-600 text-editorial-muted rounded transition-colors"
                  title="Delete Citation"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
