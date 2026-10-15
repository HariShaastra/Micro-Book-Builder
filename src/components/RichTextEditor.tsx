/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Strikethrough,
  Code,
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3, 
  Undo, 
  Redo, 
  Table as TableIcon, 
  Box, 
  Link2, 
  Minus, 
  ChevronDown,
  Plus,
  Trash2,
  RemoveFormatting,
  Asterisk,
  Grid
} from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { PageBorderStyle } from '../types.ts';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  isFullscreen?: boolean;
  onOpenCiteLinkModal?: () => void;
  onImagePasted?: (image: { name: string; url: string; size: number }) => void;
  borderStyle?: PageBorderStyle;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  children, 
  title,
  disabled = false
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode; 
  title: string; 
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    type="button"
    className={cn(
      "p-1.5 sm:p-2 rounded-md transition-all cursor-pointer text-xs flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shrink-0",
      isActive 
        ? "bg-editorial-accent text-white shadow-xs font-bold" 
        : "text-editorial-muted hover:bg-white/80 hover:text-editorial-text"
    )}
  >
    {children}
  </button>
);

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Draft your manuscript here...', 
  isFullscreen, 
  onOpenCiteLinkModal,
  onImagePasted,
  borderStyle = 'none'
}: RichTextEditorProps) {
  const [showBoxMenu, setShowBoxMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [customRows, setCustomRows] = useState(3);
  const [customCols, setCustomCols] = useState(3);
  const [showCustomTableModal, setShowCustomTableModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg border border-editorial-border my-6 shadow-sm mx-auto block',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[550px] sm:min-h-[650px] text-lg lg:text-xl leading-relaxed font-serif px-2 sm:px-6 py-4',
      },
      handleDOMEvents: {
        paste: (view, event) => {
          const items = Array.from(event.clipboardData?.items || []);
          const imageItem = items.find(item => item.type.startsWith('image/'));
          if (imageItem) {
            event.preventDefault();
            const file = imageItem.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const src = reader.result as string;
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
                if (onImagePasted) {
                  onImagePasted({ name: file.name, url: src, size: file.size });
                }
              };
              reader.readAsDataURL(file);
            }
            return true;
          }
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  // Insert Word-like Table with editable cells
  const insertWordTable = (rows = 3, cols = 3) => {
    let tableHtml = '<table class="editorial-table"><thead><tr>';
    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th>Column Header ${c}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 1; r <= rows; r++) {
      tableHtml += '<tr>';
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td>Row ${r}, Col ${c}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p></p>';
    editor.chain().focus().insertContent(tableHtml).run();
    setShowTableMenu(false);
    setShowCustomTableModal(false);
  };

  // Insert Word-like Callout Box
  const insertCalloutBox = (type: 'info' | 'warning' | 'tip' | 'quote' | 'note' | 'takeaway') => {
    let icon = '💡';
    let label = 'Note';
    let contentPlaceholder = 'Enter your focused instruction, reference, or reflection here.';

    if (type === 'warning') { 
      icon = '⚠️'; 
      label = 'Caution'; 
      contentPlaceholder = 'Enter critical warning or disclaimer details.';
    }
    if (type === 'tip') { 
      icon = '✨'; 
      label = 'Pro-Tip'; 
      contentPlaceholder = 'Enter an actionable tip or reader recommendation.';
    }
    if (type === 'quote') { 
      icon = '“'; 
      label = 'Key Reflection'; 
      contentPlaceholder = 'Enter a poignant quote, proverb, or conceptual highlight.';
    }
    if (type === 'note') { 
      icon = '📌'; 
      label = 'Important Note'; 
      contentPlaceholder = 'Enter essential context or editorial commentary.';
    }
    if (type === 'takeaway') {
      icon = '✓';
      label = 'Key Takeaways';
      contentPlaceholder = 'Summary points or bulleted review items for this section.';
    }

    const boxHtml = `<div class="callout-box callout-${type === 'takeaway' ? 'tip' : type}"><p><strong>${icon} ${label}:</strong> ${contentPlaceholder}</p></div><p></p>`;
    editor.chain().focus().insertContent(boxHtml).run();
    setShowBoxMenu(false);
  };

  // Insert Scene Break / Asterism
  const insertSceneBreak = () => {
    const breakHtml = `<p style="text-align: center; letter-spacing: 0.5em; margin: 2rem 0; font-size: 1.25rem;">* * *</p><p></p>`;
    editor.chain().focus().insertContent(breakHtml).run();
  };

  return (
    <div className={cn(
      "flex flex-col bg-transparent transition-all duration-300 relative",
      isFullscreen ? "fixed inset-0 z-50 p-6 lg:p-14 bg-editorial-bg overflow-y-auto" : ""
    )}>
      {/* ========================================================================= */}
      {/* MICROSOFT WORD-LIKE EDITING TOOLBAR RIBBON */}
      {/* Dedicated fixed place above the manuscript sheet - zero freezing over text */}
      {/* ========================================================================= */}
      <div className="mb-4 bg-editorial-sidebar border border-editorial-border rounded-xl p-2 sm:p-2.5 flex flex-wrap items-center gap-1 shadow-xs select-none static z-10 w-full shrink-0">
        
        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive('paragraph') && !editor.isActive('heading')}
            title="Normal Paragraph Text"
          >
            <span className="font-serif font-bold text-xs px-1">P</span>
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1 (Main Section)"
          >
            <Heading1 size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2 (Sub-section)"
          >
            <Heading2 size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3 (Minor Topic)"
          >
            <Heading3 size={15} />
          </MenuButton>
        </div>

        <div className="w-px h-5 bg-editorial-divider mx-1" />

        {/* Text Formats: Bold, Italic, Strikethrough, Code */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Monospace Code"
          >
            <Code size={15} />
          </MenuButton>
        </div>

        <div className="w-px h-5 bg-editorial-divider mx-1" />

        {/* Lists & Dividers */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bulleted List"
          >
            <List size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote size={15} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
          >
            <Minus size={15} />
          </MenuButton>
          <MenuButton 
            onClick={insertSceneBreak}
            title="Scene Break Asterism (* * *)"
          >
            <Asterisk size={15} />
          </MenuButton>
        </div>

        <div className="w-px h-5 bg-editorial-divider mx-1" />

        {/* Word-like Tables Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowTableMenu(!showTableMenu);
              setShowBoxMenu(false);
            }}
            className="px-2.5 py-1.5 rounded hover:bg-white text-editorial-text text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer border border-transparent"
            title="Insert Word-like Table"
          >
            <TableIcon size={14} />
            <span className="hidden sm:inline">Table</span>
            <ChevronDown size={11} />
          </button>

          {showTableMenu && (
            <div className="absolute left-0 mt-1 w-56 bg-white border border-editorial-border rounded-lg shadow-xl p-2 z-50 space-y-1 text-xs font-sans">
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-editorial-muted border-b border-editorial-divider">
                Word-like Table Presets
              </div>
              <button
                type="button"
                onClick={() => insertWordTable(2, 2)}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-text flex items-center justify-between"
              >
                <span>2 × 2 Simple Grid</span>
                <span className="text-[10px] font-mono text-editorial-muted">4 cells</span>
              </button>
              <button
                type="button"
                onClick={() => insertWordTable(3, 3)}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-text flex items-center justify-between"
              >
                <span>3 × 3 Standard Table</span>
                <span className="text-[10px] font-mono text-editorial-muted">9 cells</span>
              </button>
              <button
                type="button"
                onClick={() => insertWordTable(4, 3)}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-text flex items-center justify-between"
              >
                <span>4 × 3 Comparison Table</span>
                <span className="text-[10px] font-mono text-editorial-muted">12 cells</span>
              </button>
              <button
                type="button"
                onClick={() => insertWordTable(5, 4)}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-text flex items-center justify-between"
              >
                <span>5 × 4 Research Matrix</span>
                <span className="text-[10px] font-mono text-editorial-muted">20 cells</span>
              </button>

              <div className="pt-1 border-t border-editorial-divider">
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomTableModal(true);
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-sidebar text-editorial-accent font-bold flex items-center gap-1.5"
                >
                  <Grid size={13} />
                  <span>Custom Rows & Cols...</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Word-like Callout Boxes Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowBoxMenu(!showBoxMenu);
              setShowTableMenu(false);
            }}
            className="px-2.5 py-1.5 rounded hover:bg-white text-editorial-text text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
            title="Insert Word-like Box / Callout"
          >
            <Box size={14} />
            <span className="hidden sm:inline">Boxes</span>
            <ChevronDown size={11} />
          </button>

          {showBoxMenu && (
            <div className="absolute left-0 mt-1 w-56 bg-white border border-editorial-border rounded-lg shadow-xl p-2 z-50 space-y-1 text-xs font-sans">
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-editorial-muted border-b border-editorial-divider">
                Word-Style Callout Boxes
              </div>
              <button
                type="button"
                onClick={() => insertCalloutBox('info')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-blue-50 text-blue-900 flex items-center gap-2"
              >
                <span>💡</span>
                <span>Info Callout Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('tip')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-50 text-emerald-900 flex items-center gap-2"
              >
                <span>✨</span>
                <span>Tip / Insight Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('warning')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-50 text-amber-900 flex items-center gap-2"
              >
                <span>⚠️</span>
                <span>Caution / Alert Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('quote')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-50 text-editorial-accent flex items-center gap-2"
              >
                <span>“</span>
                <span>Reflection Quote Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('note')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-neutral-100 text-editorial-text flex items-center gap-2"
              >
                <span>📌</span>
                <span>Framed Note Box</span>
              </button>
              <button
                type="button"
                onClick={() => insertCalloutBox('takeaway')}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-50 text-emerald-900 flex items-center gap-2"
              >
                <span>✓</span>
                <span>Key Takeaways Box</span>
              </button>
            </div>
          )}
        </div>

        {/* Zoho-style Cite & Link Works Tool Button */}
        {onOpenCiteLinkModal && (
          <button
            type="button"
            onClick={onOpenCiteLinkModal}
            className="px-2.5 py-1.5 bg-white border border-editorial-border rounded hover:border-editorial-accent text-editorial-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Cite works or link companion manuscripts (Zoho Style)"
          >
            <Link2 size={13} />
            <span className="hidden sm:inline">Cite & Link</span>
          </button>
        )}

        <div className="flex-1" />

        {/* Clear formatting */}
        <MenuButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear Formatting"
        >
          <RemoveFormatting size={14} />
        </MenuButton>

        {/* Undo & Redo */}
        <div className="flex items-center gap-0.5">
          <MenuButton 
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={14} />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={14} />
          </MenuButton>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUSTOM TABLE MODAL */}
      {/* ========================================================================= */}
      {showCustomTableModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-editorial-border rounded-xl p-5 w-full max-w-sm space-y-4 shadow-xl select-none">
            <h4 className="font-serif italic font-bold text-base text-editorial-text">
              Insert Custom Table
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-editorial-muted font-mono mb-1">Rows:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={customRows}
                  onChange={(e) => setCustomRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border border-editorial-border rounded p-2 text-editorial-text outline-none"
                />
              </div>
              <div>
                <label className="block text-editorial-muted font-mono mb-1">Columns:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={customCols}
                  onChange={(e) => setCustomCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border border-editorial-border rounded p-2 text-editorial-text outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomTableModal(false)}
                className="px-3 py-1.5 rounded text-xs text-editorial-muted hover:text-editorial-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => insertWordTable(customRows, customCols)}
                className="px-4 py-1.5 bg-editorial-accent text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-editorial-text"
              >
                Insert Grid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PURE WHITE WRITING SHEET */}
      {/* Zero section guide text inside the white paper - completely pristine */}
      {/* Styled with architectural page border model */}
      {/* ========================================================================= */}
      <div className={cn(
        "flex-1 relative bg-white rounded-xl p-6 sm:p-10 shadow-xs transition-all",
        borderStyle === 'classic-double' ? 'page-border-classic-double' :
        borderStyle === 'oxford' ? 'page-border-oxford' :
        borderStyle === 'ornate-corners' ? 'page-border-ornate-corners' :
        borderStyle === 'vintage-filigree' ? 'page-border-vintage-filigree' :
        borderStyle === 'modern-accent' ? 'page-border-modern-accent' :
        borderStyle === 'manuscript-frame' ? 'page-border-manuscript-frame' :
        borderStyle === 'none' ? 'page-border-none' :
        'page-border-classic-single',
        isFullscreen ? "max-w-3xl mx-auto w-full py-16" : ""
      )}>
        <EditorContent editor={editor} />
      </div>

      {/* Bottom Character / Word Metric */}
      {!isFullscreen && (
        <div className="flex px-4 py-2 border-t border-editorial-divider justify-between text-[11px] text-editorial-muted font-mono">
          <span>Manuscript Stationery</span>
          <span>
            {editor.getText().length} Characters • {editor.getText().split(/\s+/).filter(Boolean).length} Words
          </span>
        </div>
      )}
    </div>
  );
}
