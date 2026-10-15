/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ContentBlock, 
  BlockType 
} from '../types.ts';
import { 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Trash2, 
  Plus, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  Image as ImageIcon, 
  Table as TableIcon, 
  List, 
  ListOrdered, 
  Minus, 
  AlertCircle, 
  FileText, 
  CornerDownRight, 
  Upload 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  onChangeBlocks: (blocks: ContentBlock[]) => void;
}

export default function ContentBlockEditor({
  blocks,
  onChangeBlocks
}: ContentBlockEditorProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const addBlock = (type: BlockType, afterIndex?: number) => {
    const newBlock: ContentBlock = {
      id: uuidv4(),
      type,
      content: type === 'heading' ? 'Section Heading' :
               type === 'quote' ? 'Enter a significant observation or quote here...' :
               type === 'callout' ? 'Important note or reflection for the reader.' :
               type === 'divider' ? '---' :
               type === 'page_break' ? '--- Page Break ---' :
               type === 'bullet_list' ? '• Point one\n• Point two\n• Point three' :
               type === 'table' ? JSON.stringify([['Header 1', 'Header 2'], ['Data 1', 'Data 2']]) :
               'Draft your paragraph narrative here...',
      meta: {
        headingLevel: type === 'heading' ? 2 : undefined,
        calloutType: type === 'callout' ? 'info' : undefined,
        caption: '',
        altText: '',
        tableRows: type === 'table' ? [['Column A', 'Column B'], ['Row 1', 'Value 1'], ['Row 2', 'Value 2']] : undefined
      }
    };

    if (afterIndex !== undefined) {
      const copy = [...blocks];
      copy.splice(afterIndex + 1, 0, newBlock);
      onChangeBlocks(copy);
    } else {
      onChangeBlocks([...blocks, newBlock]);
    }
    setEditingBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    onChangeBlocks(
      blocks.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const copy = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onChangeBlocks(copy);
  };

  const duplicateBlock = (block: ContentBlock, index: number) => {
    const duplicate: ContentBlock = {
      ...block,
      id: uuidv4()
    };
    const copy = [...blocks];
    copy.splice(index + 1, 0, duplicate);
    onChangeBlocks(copy);
  };

  const deleteBlock = (id: string) => {
    onChangeBlocks(blocks.filter(b => b.id !== id));
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      const b = blocks.find(x => x.id === id);
      if (b) {
        updateBlock(id, {
          meta: { ...b.meta, imageUrl: url, caption: file.name }
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto py-4">
      {/* Top Add Block Toolbar */}
      <div className="bg-editorial-sidebar/60 border border-editorial-border p-3 rounded-lg flex flex-wrap items-center gap-1.5 shadow-xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-muted mr-2">
          + Add Block:
        </span>
        <button
          onClick={() => addBlock('paragraph')}
          className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-editorial-border rounded text-xs text-editorial-text font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <FileText size={13} />
          <span>Paragraph</span>
        </button>
        <button
          onClick={() => addBlock('heading')}
          className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-editorial-border rounded text-xs text-editorial-text font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <Heading2 size={13} />
          <span>Heading</span>
        </button>
        <button
          onClick={() => addBlock('quote')}
          className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-editorial-border rounded text-xs text-editorial-text font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <Quote size={13} />
          <span>Quote</span>
        </button>
        <button
          onClick={() => addBlock('callout')}
          className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-editorial-border rounded text-xs text-editorial-text font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <AlertCircle size={13} />
          <span>Callout</span>
        </button>
        <button
          onClick={() => addBlock('image')}
          className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-editorial-border rounded text-xs text-editorial-text font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <ImageIcon size={13} />
          <span>Image</span>
        </button>
        <button
          onClick={() => addBlock('table')}
          className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-editorial-border rounded text-xs text-editorial-text font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <TableIcon size={13} />
          <span>Table</span>
        </button>
        <button
          onClick={() => addBlock('bullet_list')}
          className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-editorial-border rounded text-xs text-editorial-text font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <List size={13} />
          <span>List</span>
        </button>
        <button
          onClick={() => addBlock('divider')}
          className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-editorial-border rounded text-xs text-editorial-text font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <Minus size={13} />
          <span>Divider</span>
        </button>
      </div>

      {/* Block List */}
      {blocks.length === 0 ? (
        <div className="bg-white border border-editorial-border border-dashed rounded-lg p-10 text-center">
          <p className="text-sm font-serif italic text-editorial-muted mb-3">
            No content blocks in this fragment yet. Click a button above to add paragraphs, quotes, or tables.
          </p>
          <button
            onClick={() => addBlock('paragraph')}
            className="px-4 py-2 bg-editorial-text text-white rounded font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors"
          >
            + Add First Paragraph
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className={`bg-white border rounded-lg p-4 transition-all group ${
                editingBlockId === block.id
                  ? 'border-editorial-accent ring-1 ring-editorial-accent/30 shadow-sm'
                  : 'border-editorial-border hover:border-editorial-text/40'
              }`}
            >
              {/* Block Header & Action Controls */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-editorial-divider text-xs text-editorial-muted">
                <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-editorial-accent flex items-center gap-1">
                  <span>#{index + 1}</span>
                  <span className="capitalize">{block.type}</span>
                </span>

                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:text-editorial-text disabled:opacity-30 rounded cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 hover:text-editorial-text disabled:opacity-30 rounded cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown size={15} />
                  </button>
                  <button
                    onClick={() => duplicateBlock(block, index)}
                    className="p-1 hover:text-editorial-text rounded cursor-pointer"
                    title="Duplicate Block"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="p-1 hover:text-red-600 rounded cursor-pointer"
                    title="Delete Block"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Block Content Renderers by Type */}
              {block.type === 'heading' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-editorial-muted">Level:</span>
                    {[1, 2, 3].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => updateBlock(block.id, { meta: { ...block.meta, headingLevel: lvl as any } })}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          block.meta?.headingLevel === lvl ? 'bg-editorial-text text-white' : 'bg-editorial-sidebar text-editorial-text'
                        }`}
                      >
                        H{lvl}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    className="w-full bg-transparent border-b border-editorial-border py-1 text-xl font-serif font-bold text-editorial-text outline-none focus:border-editorial-accent"
                  />
                </div>
              )}

              {block.type === 'paragraph' && (
                <textarea
                  rows={3}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder="Draft your paragraph..."
                  className="w-full bg-transparent text-sm font-serif leading-relaxed text-editorial-text outline-none resize-y"
                />
              )}

              {block.type === 'quote' && (
                <div className="border-l-4 border-editorial-accent pl-4 py-1 italic font-serif text-sm">
                  <textarea
                    rows={2}
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    className="w-full bg-transparent outline-none italic resize-none text-editorial-text"
                  />
                  <input
                    type="text"
                    placeholder="Attribution / Speaker (optional)"
                    value={block.meta?.caption || ''}
                    onChange={(e) => updateBlock(block.id, { meta: { ...block.meta, caption: e.target.value } })}
                    className="text-xs text-editorial-muted mt-1 bg-transparent outline-none w-full font-sans not-italic"
                  />
                </div>
              )}

              {block.type === 'callout' && (
                <div className="bg-editorial-sidebar/40 border border-editorial-divider p-3 rounded-md space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-editorial-accent">Category:</span>
                    {(['info', 'tip', 'warning', 'quote'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => updateBlock(block.id, { meta: { ...block.meta, calloutType: cat } })}
                        className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                          block.meta?.calloutType === cat ? 'bg-editorial-accent text-white' : 'bg-white text-editorial-muted'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    className="w-full bg-transparent text-xs font-serif leading-relaxed text-editorial-text outline-none resize-none"
                  />
                </div>
              )}

              {block.type === 'bullet_list' && (
                <textarea
                  rows={3}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder="• Item 1&#10;• Item 2"
                  className="w-full bg-transparent text-xs font-serif leading-relaxed text-editorial-text outline-none resize-y font-mono"
                />
              )}

              {block.type === 'image' && (
                <div className="space-y-2">
                  {block.meta?.imageUrl ? (
                    <div className="rounded overflow-hidden border border-editorial-border max-w-sm">
                      <img src={block.meta.imageUrl} alt={block.meta.altText || 'Figure'} className="w-full h-auto object-cover" />
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-editorial-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-editorial-accent">
                      <Upload size={20} className="text-editorial-accent mb-1" />
                      <span className="text-xs font-bold uppercase tracking-wider text-editorial-muted">Upload Image</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(block.id, e)} className="hidden" />
                    </label>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Caption..."
                      value={block.meta?.caption || ''}
                      onChange={(e) => updateBlock(block.id, { meta: { ...block.meta, caption: e.target.value } })}
                      className="border border-editorial-border rounded p-1.5 bg-white text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Alt text for accessibility..."
                      value={block.meta?.altText || ''}
                      onChange={(e) => updateBlock(block.id, { meta: { ...block.meta, altText: e.target.value } })}
                      className="border border-editorial-border rounded p-1.5 bg-white text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {block.type === 'table' && (
                <div className="space-y-2 overflow-x-auto">
                  <table className="w-full border-collapse border border-editorial-border text-xs">
                    <tbody>
                      {(block.meta?.tableRows || [['Col 1', 'Col 2'], ['Row 1', 'Data 1']]).map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx === 0 ? 'bg-editorial-sidebar font-bold' : ''}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="border border-editorial-border p-2">
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) => {
                                  const rows = [...(block.meta?.tableRows || [])];
                                  rows[rIdx][cIdx] = e.target.value;
                                  updateBlock(block.id, { meta: { ...block.meta, tableRows: rows } });
                                }}
                                className="w-full bg-transparent outline-none text-xs"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const rows = [...(block.meta?.tableRows || [])];
                        const colCount = rows[0]?.length || 2;
                        rows.push(new Array(colCount).fill(''));
                        updateBlock(block.id, { meta: { ...block.meta, tableRows: rows } });
                      }}
                      className="text-[10px] uppercase font-bold text-editorial-accent hover:underline"
                    >
                      + Add Row
                    </button>
                    <button
                      onClick={() => {
                        const rows = [...(block.meta?.tableRows || [])].map(r => [...r, '']);
                        updateBlock(block.id, { meta: { ...block.meta, tableRows: rows } });
                      }}
                      className="text-[10px] uppercase font-bold text-editorial-accent hover:underline ml-3"
                    >
                      + Add Column
                    </button>
                  </div>
                </div>
              )}

              {block.type === 'divider' && (
                <div className="py-2 text-center text-editorial-muted text-xs font-mono">
                  ─── ❖ ───
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
